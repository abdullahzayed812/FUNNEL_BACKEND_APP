import { Pool } from "pg";
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
        i.id,
        i.file_path AS url,
        i.image_type AS "imageType",
        ui.is_selected AS "isSelected"
      FROM images i
      INNER JOIN user_images ui ON i.id = ui.image_id
      WHERE ui.user_id = $1 AND i.project_id = $2 AND ui.is_selected = TRUE
    `;

    const images = await this.executeQuery<Image>(sqlQuery, [userId, projectId]);

    return images;
  }

  public async getSelectedVideos(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        v.id,
        v.file_path AS url,
        v.video_type AS type,
        uv.is_selected AS "isSelected"
      FROM videos v
      INNER JOIN user_videos uv ON v.id = uv.video_id
      WHERE uv.user_id = $1 AND v.project_id = $2 AND uv.is_selected = TRUE
    `;

    const videos = await this.executeQuery<Image>(sqlQuery, [userId, projectId]);

    return videos;
  }

  public async getSelectedTemplates(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg,
        t.default_primary,
        t.default_secondary_color AS "defaultSecondaryColor",
        t.created_at
      FROM templates t
      INNER JOIN user_templates ut ON t.id = ut.template_id
      WHERE ut.user_id = $1
        AND t.project_id = $2
        AND ut.is_selected = TRUE
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    return this.templateModel.combineTemplatesWithTextsAndLogos(templates);
  }
}
