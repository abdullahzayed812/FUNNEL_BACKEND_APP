import { BaseModel } from "./baseModel";
export class GeneratedVisualsModel extends BaseModel {
    pool;
    constructor(pool) {
        super(pool);
        this.pool = pool;
    }
    async getSelectedImages(userId, projectId) {
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
        const images = await this.executeQuery(sqlQuery, [userId, projectId]);
        return images;
    }
    async getSelectedVideos(userId, projectId) {
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
        const images = await this.executeQuery(sqlQuery, [userId, projectId]);
        return images;
    }
    // Get selected templates for a specific project and user, including headline, punchline, and CTA texts
    async getSelectedTemplates(userId, projectId) {
        const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg AS frameSvg,
        t.default_primary AS defaultPrimaryColor,
        t.default_secondary_color AS defaultSecondaryColor,
        t.created_at AS createdAt,
        JSON_OBJECT(
          'headline', JSON_OBJECT(
            'text', ht.text,
            'color', ht.color,
            'containerColor', ht.container_color,
            'fontSize', ht.font_size,
            'fontWeight', ht.font_weight,
            'fontFamily', ht.font_family,
            'fontStyle', ht.font_style,
            'textDecoration', ht.text_decoration,
            'borderRadius', ht.border_radius,
            'borderWidth', ht.border_width,
            'borderStyle', ht.border_style,
            'borderColor', ht.border_color,
            'translateX', ht.x_coordinate,
            'translateY', ht.y_coordinate,
            'language', ht.language
          ),
          'punchline', JSON_OBJECT(
            'text', pt.text,
            'color', pt.color,
            'containerColor', pt.container_color,
            'fontSize', pt.font_size,
            'fontWeight', pt.font_weight,
            'fontFamily', pt.font_family,
            'fontStyle', pt.font_style,
            'textDecoration', pt.text_decoration,
            'borderRadius', pt.border_radius,
            'borderWidth', pt.border_width,
            'borderStyle', pt.border_style,
            'borderColor', pt.border_color,
            'translateX', pt.x_coordinate,
            'translateY', pt.y_coordinate,
            'language', pt.language
          ),
          'cta', JSON_OBJECT(
            'text', ct.text,
            'color', ct.color,
            'containerColor', ct.container_color,
            'fontSize', ct.font_size,
            'fontWeight', ct.font_weight,
            'fontFamily', ct.font_family,
            'fontStyle', ct.font_style,
            'textDecoration', ct.text_decoration,
            'borderRadius', ct.border_radius,
            'borderWidth', ct.border_width,
            'borderStyle', ct.border_style,
            'borderColor', ct.border_color,
            'translateX', ct.x_coordinate,
            'translateY', ct.y_coordinate,
            'language', ct.language
          )
        ) AS templateTexts
      FROM templates t
      INNER JOIN user_templates ut ON t.id = ut.template_id
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      WHERE ut.user_id = ?
      AND t.project_id = ? AND ut.is_selected = TRUE
    `;
        const templates = await this.executeQuery(sqlQuery, [userId, projectId]);
        return templates;
    }
}
