import { Pool } from "mysql2/promise";

export class BrandingModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getBranding(projectId: string, userId: string, userRole: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
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

      const [branding] = await connection.query(sqlQuery, [projectId, userId]);

      return branding;
    } finally {
      connection.release();
    }
  }
}
