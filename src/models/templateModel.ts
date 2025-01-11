import { Pool } from "mysql2/promise";
import { Template } from "../types/entities";
import { BaseModel } from "./baseModel";
import { randomUUID } from "crypto";

export class TemplateModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

  public async listDefault(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg AS frameSvg,
        t.default_primary AS defaultPrimaryColor,
        t.default_secondary_color AS defaultSecondaryColor,
        t.created_at AS createdAt,
        CASE
          WHEN ut.user_id = ? THEN ut.is_selected
          ELSE NULL
        END AS isSelected,
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
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.type = 'Default'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    if (templates?.length === 0) {
      return [];
    }

    return templates;
  }

  public async listBranded(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg AS frameSvg,
        t.default_primary AS defaultPrimaryColor,
        t.default_secondary_color AS defaultSecondaryColor,
        t.created_at AS createdAt,
        CASE
          WHEN ut.user_id = ? THEN ut.is_selected
          ELSE NULL
        END AS isSelected,
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
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.type = 'Branded'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    if (templates?.length === 0) {
      return [];
    }

    return templates;
  }

  public async listCustomized(projectId: string, userId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg AS frameSvg,
        t.default_primary AS defaultPrimary,
        t.default_secondary_color AS defaultSecondary,
        t.created_at AS createdAt,
        ut.is_selected AS isSelected,
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
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      LEFT JOIN project_templates ptm ON t.id = ptm.template_id
      WHERE ut.user_id = ? 
        AND ptm.project_id = ? 
        AND t.type = 'Customized'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [projectId, userId, projectId]);

    if (templates?.length === 0) {
      return [];
    }

    return templates;
  }

  public async create(template: Template, projectId: string, userId: string, userRole: string) {
    const sqlQueryInsertTemplate = `
      INSERT INTO templates 
        (id, name, type, frame_svg, default_primary, default_secondary_color, user_id)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?)
    `;

    const sqlQueryInsertTemplateText = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
          border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, 
          template_id, text) 
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const createdTemplate = await this.executeQuery(sqlQueryInsertTemplate, [
      template.id,
      template.name,
      userRole === "Admin" ? "Branded" : "Customized",
      template.frameSvg,
      template.defaultPrimary,
      template.defaultSecondary,
      userId,
    ]);

    const { headline, punchline, cta } = template.templateTexts;
    const texts = [headline, punchline, cta];

    const insertPromises = texts.map(
      async (text) =>
        await this.executeQuery(sqlQueryInsertTemplateText, [
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
          template.id,
          text.text,
        ])
    );

    await Promise.all(insertPromises);

    const sqlQueryInsertProjectTemplate = `
      INSERT INTO project_templates (id, template_id, project_id)
      VALUES (?, ?, ?)
    `;

    const id = randomUUID();

    await this.executeQuery(sqlQueryInsertProjectTemplate, [id, template.id, projectId]);

    return createdTemplate;
  }

  public async getById(templateId: string) {
    const sqlQuery = `
      SELECT * FROM templates WHERE id = ?
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [templateId]);

    return templates[0];
  }

  public async getByUserId(userId: string) {
    const sqlQuery = `
      SELECT id FROM templates WHERE user_id = ?
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId]);

    return templates[0];
  }

  public async checkUserTemplate(templateId: string, userId: string) {
    const sqlQuery = `
    SELECT template_id AS id FROM user_templates WHERE template_id = ? AND user_id = ?
  `;

    const images = await this.executeQuery<{ id: string }>(sqlQuery, [templateId, userId]);

    return images[0];
  }

  public async update(templateId: string, status: boolean) {
    const sqlQueryUpdateUserTemplate = `
      UPDATE user_templates
      SET is_selected = ? 
      WHERE template_id = ?
    `;
    const result = await this.executeQuery(sqlQueryUpdateUserTemplate, [status, templateId]);

    return result;
  }

  public async delete(templateId: string) {
    const sqlQuery = `
      DELETE FROM templates
      WHERE id = ? AND type = 'Customized'
    `;

    const sqlQueryDeleteUserTemplate = `
      DELETE FROM user_templates
      WHERE template_id = ?
    `;

    const result1 = await this.executeQuery(sqlQuery, [templateId]);
    const result2 = await this.executeQuery(sqlQueryDeleteUserTemplate, [templateId]);

    return { result1, result2 };
  }

  public async addUserTemplate(templateId: string, userId: string, status: boolean) {
    const sqlQuery = `
      INSERT INTO user_templates 
        (user_id, template_id, is_selected)
      VALUES
        (?, ?, ?) 
    `;

    const result = await this.executeQuery(sqlQuery, [userId, templateId, status]);

    return result;
  }
}
