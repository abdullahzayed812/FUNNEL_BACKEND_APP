import { Pool } from "mysql2/promise";
import { Image, Template } from "../types/entities";
import { BaseModel } from "./baseModel";
import { TemplateModel } from "./templateModel";

export class GeneratedVisualsModel extends BaseModel {
  constructor(protected pool: Pool, private templateModel: TemplateModel) {
    super(pool);
  }

  public async getSelectedImages(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        id,
        file_path AS url,
        image_type AS imageType,
        is_selected AS isSelected
      FROM images i
      INNER JOIN user_images ui ON i.id = ui.image_id
      WHERE ui.user_id = ? AND i.project_id = ? AND ui.is_selected = TRUE
    `;

    const images = await this.executeQuery<Image>(sqlQuery, [userId, projectId]);

    return images;
  }

  public async getSelectedVideos(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        id,
        file_path AS url,
        video_type AS type,
        is_selected AS isSelected
      FROM videos v
      INNER JOIN user_videos ui ON v.id = ui.video_id
      WHERE ui.user_id = ? AND v.project_id = ? AND ui.is_selected = TRUE
    `;

    const images = await this.executeQuery<Image>(sqlQuery, [userId, projectId]);

    return images;
  }

  // Get selected templates for a specific project and user, including headline, punchline, and CTA texts
  public async getSelectedTemplates(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg,
        t.default_primary,
        t.default_secondary_color AS defaultSecondaryColor,
        t.created_at
      FROM templates t
      INNER JOIN user_templates ut ON t.id = ut.template_id
      WHERE ut.user_id = ?
      AND t.project_id = ? AND ut.is_selected = TRUE
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    return this.templateModel.combineTemplatesWithTexts(templates);
  }
}
