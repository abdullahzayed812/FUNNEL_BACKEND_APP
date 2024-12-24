import { Pool } from "mysql2/promise";

export class ProjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async listProjects(userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQueryProjectsData = `
        SELECT 
          p.id AS project_id,
          p.name AS project_name,
          p.description AS project_description,
          p.website AS project_website
        FROM users u
        LEFT JOIN projects p ON p.user_id = u.id
        WHERE u.id = ?
      `;
      const [projects] = await connection.query(sqlQueryProjectsData, [userId]);

      return projects;
    } finally {
      connection.release();
    }
  }

  public async getProjectData(projectId: string, userId: string, userRole: string) {
    const connection = await this.pool.getConnection();

    try {
      let sqlQueryImage = `
        SELECT 
          i.id AS image_id,
          i.file_path,
          i.image_type,
          i.is_selected,
          i.project_id,
          i.user_id
        FROM images i
        INNER JOIN projects p ON i.project_id = p.id
        INNER JOIN users u ON i.user_id = u.id
        WHERE i.project_id = ?
          AND i.user_id = ?
      `;

      // AND (i.image_type = 'Default' OR ? = 'Agency')
      let sqlQueryTemplates = `
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

      let sqlQueryBranding = `
        SELECT 
         b.id,
         b.primary_color,
         b.secondary_color,
         b.additional_color,
         b.primary_font,
         b.secondary_font,
         b.created_at,
         b.updated_at,
         b.project_id,
         b.user_id
        FROM branding b
        INNER JOIN projects p ON b.project_id = p.id
        INNER JOIN users u ON b.user_id = u.id
        WHERE b.project_id = ?
          AND b.user_id = ?
      `;

      if (userRole === "Agency") {
        sqlQueryImage += " AND i.image_type = 'Default'";
        sqlQueryTemplates += " AND t.is_selected = 'Default'";
        sqlQueryBranding += " AND b.primary_font = 'Default'"; // Assuming branding's 'primary_font' is used to signify "Default"
      }

      const [images] = await connection.query(sqlQueryImage, [projectId, userId]);
      const [templates] = await connection.query(sqlQueryTemplates, [projectId, userId]);
      const [branding] = await connection.query(sqlQueryBranding, [projectId, userId]);

      return { images, templates, branding };
    } finally {
      connection.release();
    }
  }

  public async getProjectById(projectId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `SELECT p.name FROM projects p WHERE p.id = ?`;

      const [result] = await connection.query(sqlQuery, [projectId]);
      return result;
    } finally {
      connection.release();
    }
  }
}
