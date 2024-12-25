import { Pool } from "mysql2/promise";

export class TemplateModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async listTemplates(projectId: string, userId: string, userRole: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
       SELECT 
          t.id AS template_id,
          t.name AS template_name,
          t.frame_svg,
          t.default_primary,
          t.default_secondary_color,
          t.is_selected,
          t.created_at,
          t.project_id,
          t.user_id,
          tt.id AS template_text_id,
          tt.name AS template_text_name,
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
          tt.color AS template_text_color
        FROM templates t
        INNER JOIN projects p ON t.project_id = p.id
        INNER JOIN users u ON t.user_id = u.id
        LEFT JOIN template_text tt ON t.id = tt.template_id
        WHERE t.project_id = ?
          AND t.user_id = ?
      `;

      const [template] = await connection.query(sqlQuery, [projectId, userId]);

      return template;
    } finally {
      connection.release();
    }
  }
}
