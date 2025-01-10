import { Pool } from "mysql2/promise";
import { Branding } from "../types/entities";
import { BaseModel } from "./baseModel";

export class BrandingModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

  public async getUserBranding(userId: string, projectId: string): Promise<Branding | undefined> {
    const sqlQuery = `
      SELECT 
        id,
        type,
        primary_color AS primaryColor,
        secondary_color AS secondaryColor,
        additional_color AS additionalColor,
        primary_font AS primaryFont,
        secondary_font AS secondaryFont
      FROM branding 
      WHERE user_id = ? AND project_id = ? AND type = 'Customized'
      LIMIT 1;
    `;

    const branding = await this.executeQuery<Branding>(sqlQuery, [userId, projectId]);

    return branding?.length > 0 ? branding[0] : undefined;
  }

  public async getProjectBranding(projectId: string): Promise<Branding | undefined> {
    const sqlQuery = `
      SELECT 
        id,
        primary_color AS primaryColor,
        secondary_color AS secondaryColor,
        additional_color AS additionalColor,
        primary_font AS primaryFont,
        secondary_font AS secondaryFont,
        type
      FROM branding
      WHERE project_id = ? AND type = 'Default'
      LIMIT 1;
    `;

    const branding = await this.executeQuery<Branding>(sqlQuery, [projectId]);

    return branding?.length > 0 ? branding[0] : undefined;
  }

  public async create(branding: Branding, projectId: string, userId: string): Promise<any> {
    const sqlQuery = `
      INSERT INTO branding (id, type, primary_color, secondary_color, additional_color, primary_font, secondary_font, project_id, user_Id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await this.executeQuery(sqlQuery, [
      branding.id,
      branding.type,
      branding.primaryColor,
      branding.secondaryColor,
      branding.additionalColor,
      branding.primaryFont,
      branding.secondaryFont,
      projectId,
      userId,
    ]);

    return result;
  }

  public async updateDefaultBranding(branding: Branding): Promise<any> {
    const sqlQuery = `
      UPDATE branding
      SET
        primary_color = COALESCE(NULLIF(?, NULL), primary_color),
        secondary_color = COALESCE(NULLIF(?, NULL), secondary_color),
        additional_color = COALESCE(NULLIF(?, NULL), additional_color),
        primary_font = COALESCE(NULLIF(?, NULL), primary_font),
        secondary_font = COALESCE(NULLIF(?, NULL), secondary_font)
      WHERE id = ? AND type = 'Default'
    `;

    const result = await this.executeQuery(sqlQuery, [
      branding.primaryColor ?? null,
      branding.secondaryColor ?? null,
      branding.additionalColor ?? null,
      branding.primaryFont ?? null,
      branding.secondaryFont ?? null,
      branding.id,
    ]);

    return result;
  }

  public async updateUserBranding(branding: Branding): Promise<any> {
    const sqlQuery = `
      UPDATE branding
      SET 
        primary_color = COALESCE(NULLIF(?, NULL), primary_color),
        secondary_color = COALESCE(NULLIF(?, NULL), secondary_color),
        additional_color = COALESCE(NULLIF(?, NULL), additional_color),
        primary_font = COALESCE(NULLIF(?, NULL), primary_font),
        secondary_font = COALESCE(NULLIF(?, NULL), secondary_font)
      WHERE id = ? AND type = 'Customized'
    `;

    const result = await this.pool.query(sqlQuery, [
      branding.primaryColor ?? null,
      branding.secondaryColor ?? null,
      branding.additionalColor ?? null,
      branding.primaryFont ?? null,
      branding.secondaryFont ?? null,
      branding.id,
    ]);

    return result;
  }
}
