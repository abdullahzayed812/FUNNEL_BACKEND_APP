import { Pool } from "pg";
import { Branding } from "../types/entities";
import { BaseModel } from "./baseModel";

export class BrandingModel extends BaseModel {
  constructor(pool: Pool) {
    super(pool);
  }

  public async getUserBranding(userId: string, projectId: string): Promise<Branding | undefined> {
    const sqlQuery = `
      SELECT 
        id,
        type,
        primary_color AS "primaryColor",
        secondary_color AS "secondaryColor",
        additional_color AS "additionalColor",
        primary_font AS "primaryFont",
        secondary_font AS "secondaryFont"
      FROM branding 
      WHERE user_id = $1 AND project_id = $2 AND type = 'Customized'
      LIMIT 1;
    `;

    const branding = await this.executeQuery<Branding>(sqlQuery, [userId, projectId]);
    return branding?.[0];
  }

  public async getProjectBranding(projectId: string): Promise<Branding | undefined> {
    const sqlQuery = `
      SELECT 
        id,
        primary_color AS "primaryColor",
        secondary_color AS "secondaryColor",
        additional_color AS "additionalColor",
        primary_font AS "primaryFont",
        secondary_font AS "secondaryFont",
        type
      FROM branding
      WHERE project_id = $1 AND type = 'Default'
      LIMIT 1;
    `;

    const branding = await this.executeQuery<Branding>(sqlQuery, [projectId]);
    return branding?.[0];
  }

  public async create(branding: Branding, projectId: string, userId: string): Promise<any> {
    const sqlQuery = `
      INSERT INTO branding (
        id, type, primary_color, secondary_color, additional_color, 
        primary_font, secondary_font, project_id, user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    return await this.executeQuery(sqlQuery, [
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
  }

  public async updateDefaultBranding(branding: Branding): Promise<any> {
    const sqlQuery = `
      UPDATE branding
      SET
        primary_color = COALESCE(NULLIF($1, NULL), primary_color),
        secondary_color = COALESCE(NULLIF($2, NULL), secondary_color),
        additional_color = COALESCE(NULLIF($3, NULL), additional_color),
        primary_font = COALESCE(NULLIF($4, NULL), primary_font),
        secondary_font = COALESCE(NULLIF($5, NULL), secondary_font)
      WHERE id = $6 AND type = 'Default'
    `;

    return await this.executeQuery(sqlQuery, [
      branding.primaryColor ?? null,
      branding.secondaryColor ?? null,
      branding.additionalColor ?? null,
      branding.primaryFont ?? null,
      branding.secondaryFont ?? null,
      branding.id,
    ]);
  }

  public async updateUserBranding(branding: Branding): Promise<any> {
    const sqlQuery = `
      UPDATE branding
      SET 
        primary_color = COALESCE(NULLIF($1, NULL), primary_color),
        secondary_color = COALESCE(NULLIF($2, NULL), secondary_color),
        additional_color = COALESCE(NULLIF($3, NULL), additional_color),
        primary_font = COALESCE(NULLIF($4, NULL), primary_font),
        secondary_font = COALESCE(NULLIF($5, NULL), secondary_font)
      WHERE id = $6 AND type = 'Customized'
    `;

    return await this.executeQuery(sqlQuery, [
      branding.primaryColor ?? null,
      branding.secondaryColor ?? null,
      branding.additionalColor ?? null,
      branding.primaryFont ?? null,
      branding.secondaryFont ?? null,
      branding.id,
    ]);
  }
}
