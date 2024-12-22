import { Pool } from "mysql2/promise";

export class ProjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async listAllProjects(userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `SELECT 
            u.id AS user_id,
            u.username,
            u.email,
            p.id AS project_id,
            p.name AS project_name,
            p.description AS project_description,
            p.website AS project_website,
            t.id AS template_id,
            t.name AS template_name,
            t.template_type,
            t.frame_svg,
            t.default_primary,
            t.default_secondary_color,
            t.is_selected AS template_is_selected,
            tt.id AS template_text_id,
            tt.name AS template_text_name,
            tt.text_content AS template_text_content,
            tt.font_size,
            tt.font_family,
            tt.font_weight,
            tt.text_decoration,
            tt.font_style,
            tt.border_radius,
            tt.border_width,
            tt.border_style,
            tt.border_color,
            tt.container_color,
            tt.text_color,
            tt.language,
            tt.x_coordinate,
            tt.y_coordinate,
            tt.color AS template_text_color,
            i.id AS image_id,
            i.file_path AS image_file_path,
            i.image_type AS image_type,
            i.is_selected AS image_is_selected,
            v.id AS video_id,
            v.file_path AS video_file_path,
            v.video_type AS video_type,
            v.is_selected AS video_is_selected,
            b.id AS branding_id,
            b.primary_color,
            b.secondary_color,
            b.additional_color,
            b.primary_font,
            b.secondary_font,
            b.created_at AS branding_created_at,
            b.updated_at AS branding_updated_at
        FROM users u
        -- Join projects that belong to the user
        LEFT JOIN projects p ON p.id IN (SELECT project_id FROM branding WHERE user_id = u.id)
        -- Join templates related to both the user and the project
        LEFT JOIN templates t ON t.user_id = u.id AND t.project_id = p.id
        -- Join template_text related to each template
        LEFT JOIN template_text tt ON tt.template_id = t.id
        -- Join images related to both the user and the project
        LEFT JOIN images i ON i.user_id = u.id AND i.project_id = p.id
        -- Join videos related to both the user and the project
        LEFT JOIN videos v ON v.user_id = u.id AND v.project_id = p.id
        -- Join branding related to the user and project
        LEFT JOIN branding b ON b.user_id = u.id AND b.project_id = p.id
        WHERE u.id = ?;
      `;

      const [result] = await connection.query(sqlQuery, [userId]);
      return result;
    } finally {
      connection.release();
    }
  }
}
