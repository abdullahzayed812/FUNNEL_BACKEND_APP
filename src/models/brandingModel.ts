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
        b.id,
        b.primary_color AS primaryColor,
        b.secondary_color AS secondaryColor,
        b.additional_color AS additionalColor,
        b.primary_font AS primaryFont,
        b.secondary_font AS secondaryFont,
        b.type
      FROM branding b
      INNER JOIN user_branding ub ON b.id = ub.branding_id
      WHERE ub.user_id = ? AND b.project_id = ? AND b.type = 'Customized'
      LIMIT 1;
    `;

    const branding = await this.executeQuery<Branding>(sqlQuery, [userId, projectId]);

    return branding?.length > 0 ? branding[0] : undefined;
  }

  public async getDefaultBranding(projectId: string): Promise<Branding | undefined> {
    const sqlQuery = `
      SELECT 
        b.id,
        b.primary_color AS primaryColor,
        b.secondary_color AS secondaryColor,
        b.additional_color AS additionalColor,
        b.primary_font AS primaryFont,
        b.secondary_font AS secondaryFont,
        b.type
      FROM branding b
      WHERE b.project_id = ? AND b.type = 'Default'
      LIMIT 1;
    `;

    const branding = await this.executeQuery<Branding>(sqlQuery, [projectId]);

    return branding?.length > 0 ? branding[0] : undefined;
  }

  public async createDefaultBranding(branding: Branding, projectId: string): Promise<any> {
    const sqlQuery = `
      INSERT INTO branding (id, primary_color, secondary_color, additional_color, primary_font, secondary_font, project_id, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await this.executeQuery(sqlQuery, [
      branding.id,
      branding.primaryColor,
      branding.secondaryColor,
      branding.additionalColor,
      branding.primaryFont,
      branding.secondaryFont,
      projectId,
      "Default",
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

  public async createUserBranding(branding: Branding, userId: string, projectId: string): Promise<any> {
    const sqlQuery = `
      INSERT INTO branding (id, primary_color, secondary_color, additional_color, primary_font, secondary_font, project_id, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await this.pool.query(sqlQuery, [
      branding.id,
      branding.primaryColor,
      branding.secondaryColor,
      branding.additionalColor,
      branding.primaryFont,
      branding.secondaryFont,
      projectId,
      "Customized",
    ]);

    const userBrandingQuery = `
      INSERT INTO user_branding (user_id, branding_id)
      VALUES (?, ?)
    `;
    await this.executeQuery(userBrandingQuery, [userId, branding.id]);

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
