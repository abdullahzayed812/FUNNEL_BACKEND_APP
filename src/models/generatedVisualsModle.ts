import { Pool } from "mysql2/promise";

export class GeneratedVisualsModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async getSelectedImages(projectId: string, userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQueryImages = `
                SELECT * from images 
                WHERE project_id = ? AND user_id = ? AND is_selected = ?
            `;

      const [images] = await connection.execute(sqlQueryImages, [projectId, userId, true]);

      return images;
    } finally {
      connection.release();
    }
  }

  public async getSelectedTemplates(projectId: string, userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
        SELECT 
            t.id,
            t.name,
            t.type,
            t.frame_svg AS frameSvg,
            t.default_primary AS defaultPrimaryColor,
            t.default_secondary_color AS defaultSecondaryColor,
            t.is_selected AS isSelected,
            t.created_at AS createdAt,
            t.project_id AS projectId,
            t.user_id AS userId,
        -- Constructing JSON for headline, punchline, and cta in one go
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
            INNER JOIN projects p ON t.project_id = p.id
            INNER JOIN users u ON t.user_id = u.id
            -- Joins for the three template_text types (headline, punchline, cta)
            LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
            LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
            LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
            WHERE t.project_id = ?
            AND t.user_id = ?
            AND is_selected = ?
        `;

      const [templates, fields] = await connection.query(sqlQuery, [projectId, userId, true]);

      return templates;
    } finally {
      connection.release();
    }
  }
}
