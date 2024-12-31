import { Pool } from "mysql2/promise";
import { Template, TemplateText } from "../types/entities";

export class TemplateModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Reusable query execution method
  private async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      return result as T[];
    } finally {
      connection.release();
    }
  }

  // Get default templates for a specific project and user
  public async listDefault(projectId: string, userId: string) {
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
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      WHERE t.project_id = ? AND t.user_id = ? AND t.type = 'Default'`;

    return await this.executeQuery(sqlQuery, [projectId, userId]);
  }

  // Get customized templates for a specific project and user
  public async listCustomized(projectId: string, userId: string) {
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
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      WHERE t.project_id = ? AND t.user_id = ? AND t.type = 'Customized'`;

    return await this.executeQuery(sqlQuery, [projectId, userId]);
  }

  // Create a new template with its texts (headline, punchline, cta)
  public async create(template: Template, projectId: string, userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQueryInsertTemplate = `
        INSERT INTO templates 
          (id, name, type, frame_svg, default_primary, default_secondary_color, is_selected, project_id, user_id) 
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const sqlQueryInsertTemplateText = `
        INSERT INTO template_text 
          (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
           border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, project_id, 
           template_id, text) 
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Insert Template
      const [createdTemplate] = await connection.query(sqlQueryInsertTemplate, [
        template.id,
        template.name,
        "Customized",
        template.frameSvg,
        template.defaultPrimary,
        template.defaultSecondary,
        template.isSelected,
        projectId,
        userId,
      ]);

      // Insert Template Texts (Headline, Punchline, CTA)
      const { headline, punchline, cta } = template.templateTexts;
      const texts = [headline, punchline, cta];

      const insertPromises = texts.map((text) =>
        connection.query(sqlQueryInsertTemplateText, [
          text.id,
          text.type,
          text.fontSize,
          text.fontFamily,
          text.fontWeight,
          text.textDecorationLine,
          text.fontStyle,
          text.borderRadius,
          text.borderWidth,
          text.borderStyle,
          text.borderColor,
          text.containerColor,
          text.language,
          text.translateX,
          text.translateY,
          text.color,
          projectId,
          template.id,
          text.text,
        ])
      );

      await Promise.all(insertPromises); // Wait for all insertions to complete

      return createdTemplate;
    } finally {
      connection.release();
    }
  }

  // Get a template by its ID for a given project and user
  public async get(projectId: string, templateId: string, userId: string) {
    const sqlQuery = `
      SELECT id 
      FROM templates 
      WHERE id = ? AND project_id = ? AND user_id = ? AND type = 'Default'`;

    const result = await this.executeQuery(sqlQuery, [templateId, projectId, userId]);

    return result;
  }

  // Update the selection status of a template
  public async update(templateId: string, status: boolean) {
    const sqlQuery = `
      UPDATE templates 
      SET is_selected = ? 
      WHERE id = ?`;

    const result = await this.executeQuery(sqlQuery, [status, templateId]);

    return result;
  }

  // Delete a template by its ID
  public async delete(templateId: string) {
    const sqlQuery = `
      DELETE FROM templates 
      WHERE id = ? AND type = 'Default'`;

    const result = await this.executeQuery(sqlQuery, [templateId]);

    return result;
  }
}
