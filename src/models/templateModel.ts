import { Pool } from "mysql2/promise";
import { Template, TemplateText } from "../types/entities";

export class TemplateModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async listDefault(projectId: string, userId: string, userRole: string) {
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
          AND t.type = 'Default'
      `;

      const [template] = await connection.query(sqlQuery, [projectId, userId]);

      return template;
    } finally {
      connection.release();
    }
  }

  public async listCustomized(projectId: string, userId: string, userRole: string) {
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
          AND t.type = 'Customized'
      `;

      const [CustomizedTemplates] = await connection.query(sqlQuery, [projectId, userId]);

      return CustomizedTemplates;
    } finally {
      connection.release();
    }
  }

  public async create(template: Template, projectId: string, userId: string, userRole: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQueryInsertTemplate = `
        INSERT INTO templates
          (
            id, 
            name, 
            type,
            frame_svg,
            default_primary,
            default_secondary_color,
            is_selected,
            project_id,
            user_id
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const sqlQueryInsertTemplateText = `
        INSERT INTO template_text
          (
            id, 
            type, 
            font_size, 
            font_family, 
            font_weight, 
            text_decoration, 
            font_style, 
            border_radius, 
            border_width, 
            border_style, 
            border_color, 
            container_color, 
            language,
            x_coordinate,
            y_coordinate,
            color,
            project_id,
            template_id,
            text
          ) 
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

      const { headline, punchline, cta } = template.templateTexts;

      const [createdHeadline] = await connection.query(sqlQueryInsertTemplateText, [
        headline.id,
        headline.type,
        headline.fontSize,
        headline.fontFamily,
        headline.fontWeight,
        headline.textDecorationLine,
        headline.fontStyle,
        headline.borderRadius,
        headline.borderWidth,
        headline.borderStyle,
        headline.borderColor,
        headline.containerColor,
        headline.language,
        headline.translateX,
        headline.translateY,
        headline.color,
        projectId,
        template.id,
        headline.text,
      ]);

      const [createdPunchline] = await connection.query(sqlQueryInsertTemplateText, [
        punchline.id,
        punchline.type,
        punchline.fontSize,
        punchline.fontFamily,
        punchline.fontWeight,
        punchline.textDecorationLine,
        punchline.fontStyle,
        punchline.borderRadius,
        punchline.borderWidth,
        punchline.borderStyle,
        punchline.borderColor,
        punchline.containerColor,
        punchline.language,
        punchline.translateX,
        punchline.translateY,
        punchline.color,
        projectId,
        template.id,
        punchline.text,
      ]);

      const [createdCta] = await connection.query(sqlQueryInsertTemplateText, [
        cta.id,
        cta.type,
        cta.fontSize,
        cta.fontFamily,
        cta.fontWeight,
        cta.textDecorationLine,
        cta.fontStyle,
        cta.borderRadius,
        cta.borderWidth,
        cta.borderStyle,
        cta.borderColor,
        cta.containerColor,
        cta.language,
        cta.translateX,
        cta.translateY,
        cta.color,
        projectId,
        template.id,
        cta.text,
      ]);

      return { createdTemplate, createdHeadline, createdPunchline, createdCta };
    } finally {
      connection.release();
    }
  }

  public async get(projectId: string, templateId: string, userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
        SELECT id FROM templates WHERE id = ? AND project_id = ? and user_id = ? AND type = 'Default'
      `;

      const [result] = await connection.query(sqlQuery, [templateId, projectId, userId]);

      return result;
    } finally {
      connection.release();
    }
  }

  public async update(templateId: string, status: boolean) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
        UPDATE templates SET is_selected = ? WHERE id = ?
      `;

      const [result] = await connection.query(sqlQuery, [status, templateId]);

      return result;
    } finally {
      connection.release();
    }
  }

  public async delete(templateId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
        DELETE FROM templates WHERE id = ? AND type = 'Default'
       `;

      const [result] = await connection.query(sqlQuery, [templateId]);

      return result;
    } finally {
      connection.release();
    }
  }
}
