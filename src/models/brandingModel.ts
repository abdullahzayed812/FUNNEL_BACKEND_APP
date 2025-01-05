import { Pool } from "mysql2/promise";
import { Branding } from "../types/entities";

export class BrandingModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      return result as T[];
    } finally {
      connection.release();
    }
  }

  public async get(projectId: string, userId: string) {
    const sqlQuery = `
      SELECT 
        b.id,
        b.primary_color AS primaryColor,
        b.secondary_color AS secondaryColor,
        b.additional_color AS additionalColor,
        b.primary_font AS primaryFont,
        b.secondary_font AS secondaryFont,
        b.created_at,
        b.updated_at,
        b.project_id,
        b.user_id
      FROM branding b
      INNER JOIN projects p ON b.project_id = p.id
      INNER JOIN users u ON b.user_id = u.id
      WHERE b.project_id = ? AND b.user_id = ?`;

    const branding = await this.executeQuery(sqlQuery, [projectId, userId]);

    return branding.length > 0 ? branding[0] : {}; // Return null if no result
  }

  public async update(branding: Branding, projectId: string, userId: string) {
    const { primaryColor, secondaryColor, additionalColor, primaryFont, secondaryFont } = branding;

    const sqlQuery = `
      UPDATE branding
      SET 
        primary_color = COALESCE(?, primary_color), 
        secondary_color = COALESCE(?, secondary_color), 
        additional_color = COALESCE(?, additional_color), 
        primary_font = COALESCE(?, primary_font), 
        secondary_font = COALESCE(?, secondary_font)
      WHERE project_id = ? AND user_id = ?`;

    const bindValues = [
      primaryColor ?? null,
      secondaryColor ?? null,
      additionalColor ?? null,
      primaryFont ?? null,
      secondaryFont ?? null,
      projectId,
      userId,
    ];

    const result = await this.executeQuery(sqlQuery, bindValues);

    return result;
  }
}
