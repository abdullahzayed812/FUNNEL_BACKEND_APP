import { Pool } from "mysql2/promise";
import { Template, TemplateText } from "../types/entities";
import { BaseModel } from "./baseModel";
import { randomUUID } from "crypto";
import { AppError } from "../configs/error";

export class TemplateModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

  public async listDefault(userId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg AS frameSvg,
        t.default_primary AS defaultPrimary,
        t.default_secondary_color AS defaultSecondary,
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
            'language', ht.language,
            'textColorBrandingType', ht.text_color_branding_type,
            'containerColorBrandingType', ht.container_color_branding_type
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
            'language', pt.language,
            'textColorBrandingType', pt.text_color_branding_type,
            'containerColorBrandingType', pt.container_color_branding_type
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
            'language', ct.language,
            'textColorBrandingType', ct.text_color_branding_type,
            'containerColorBrandingType', ct.container_color_branding_type
          )
        ) AS templateTexts
      FROM templates t
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.type = 'Default'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId]);

    if (templates?.length === 0) {
      return [];
    }

    return templates;
  }

  public async listBranded(userId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg AS frameSvg,
        t.default_primary AS defaultPrimary,
        t.default_secondary_color AS defaultSecondary,
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
            'language', ht.language,
            'textColorBrandingType', ht.text_color_branding_type,
            'containerColorBrandingType', ht.container_color_branding_type
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
            'language', pt.language,
            'textColorBrandingType', pt.text_color_branding_type,
            'containerColorBrandingType', pt.container_color_branding_type
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
            'language', ct.language,
            'textColorBrandingType', ct.text_color_branding_type,
            'containerColorBrandingType', ct.container_color_branding_type
          )
        ) AS templateTexts
      FROM templates t
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.type = 'Branded'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId]);

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
                'language', ht.language,
                'textColorBrandingType', ht.text_color_branding_type,
                'containerColorBrandingType', ht.container_color_branding_type
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
                'language', pt.language,
                'textColorBrandingType', pt.text_color_branding_type,
                'containerColorBrandingType', pt.container_color_branding_type
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
                'language', ct.language,
                'textColorBrandingType', ct.text_color_branding_type,
                'containerColorBrandingType', ct.container_color_branding_type
            )
        ) AS templateTexts
      FROM templates t
      LEFT JOIN template_text ht ON t.id = ht.template_id AND ht.type = 'headline'
      LEFT JOIN template_text pt ON t.id = pt.template_id AND pt.type = 'punchline'
      LEFT JOIN template_text ct ON t.id = ct.template_id AND ct.type = 'cta'
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.user_id = ? 
        AND t.project_id = ? 
        AND t.type = 'Customized'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, userId, projectId]);

    if (templates?.length === 0) {
      return [];
    }

    return templates;
  }

  public async create(template: Template, projectId: string, userId: string, userRole: string) {
    const sqlQueryInsertTemplate = `
      INSERT INTO templates 
        (id, name, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const sqlQueryInsertTemplateText = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
          border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, 
          template_id, text, text_color_branding_type, container_color_branding_type)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const createdTemplate = await this.executeQuery(sqlQueryInsertTemplate, [
      template.id,
      template.name,
      userRole === "Admin" ? "Branded" : "Customized",
      template.frameSvg,
      template.defaultPrimary,
      template.defaultSecondary,
      projectId,
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
          text.textColorBrandingType,
          text.containerColorBrandingType,
        ])
    );

    await Promise.all(insertPromises);

    return createdTemplate;
  }

  public async getById(templateId: string) {
    const sqlQuery = `
      SELECT * FROM templates WHERE id = ?
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [templateId]);

    return templates[0];
  }

  public async getByUserId(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT id FROM templates WHERE user_id = ? AND project_id = ?
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    return templates[0];
  }

  public async checkUserTemplate(templateId: string, userId: string) {
    const sqlQuery = `
    SELECT template_id AS id FROM user_templates WHERE template_id = ? AND user_id = ?
  `;

    const images = await this.executeQuery<{ id: string }>(sqlQuery, [templateId, userId]);

    return images[0];
  }

  public async update(templateId: string, status: boolean, userId: string) {
    const sqlQueryUpdateUserTemplate = `
      UPDATE user_templates
      SET is_selected = ? 
      WHERE template_id = ?
      AND user_id = ?
    `;
    const result = await this.executeQuery(sqlQueryUpdateUserTemplate, [status, templateId, userId]);

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

  public async createBulkTemplates(templates: Template[], projectId: string, userId: string, userRole: string) {
    const transaction = await this.pool.getConnection();

    try {
      await transaction.beginTransaction();

      if (userRole === "Admin") {
        await this.deleteBrandedTemplates(transaction, projectId);

        await this.createBulkBrandedTemplates(transaction, templates, projectId, userId);

        await transaction.commit();
        return { message: "Bulk templates created successfully." };
      }

      await this.deleteCustomizedTemplates(transaction, projectId, userId);

      await this.createBulkCustomizedTemplates(transaction, templates, projectId, userId);

      await transaction.commit();
      return { message: "Bulk templates created successfully." };
    } catch (error: any) {
      await transaction.rollback();
      throw new AppError(`Error creating bulk templates: ${error.message}`);
    } finally {
      transaction.release();
    }
  }

  private async createBulkBrandedTemplates(transaction: any, templates: Template[], projectId: string, userId: string) {
    const sqlQueryInsertTemplate = `
      INSERT INTO templates 
        (id, name, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertPromises = templates?.map((template) => {
      return transaction.query(sqlQueryInsertTemplate, [
        template.id,
        template.name,
        "Branded",
        template.frameSvg,
        template.defaultPrimary,
        template.defaultSecondary,
        projectId,
        userId,
      ]);
    });

    await Promise.all(insertPromises);
    // await this.batchInsert(transaction, insertPromises, 10);

    // Insert associated template texts (headline, punchline, cta)
    const sqlQueryInsertTemplateText = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
          border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, 
          template_id, text , text_color_branding_type, container_color_branding_type) 
      VALUES 
          ?
    `;

    const templateTextsValues: any[] = [];

    templates.forEach((template) => {
      const texts = [
        { ...template.templateTexts.headline, type: "headline" },
        { ...template.templateTexts.punchline, type: "punchline" },
        { ...template.templateTexts.cta, type: "cta" },
      ];

      texts.forEach((text) => {
        templateTextsValues.push([
          randomUUID(),
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
          text.textColorBrandingType,
          text.containerColorBrandingType,
        ]);
      });
    });

    // Execute the bulk insert for template texts using a single query
    if (templateTextsValues.length > 0) {
      await transaction.query(sqlQueryInsertTemplateText, [templateTextsValues]);
    }
  }

  private async createBulkCustomizedTemplates(
    transaction: any,
    templates: Template[],
    projectId: string,
    userId: string
  ) {
    const sqlQueryInsertTemplate = `
      INSERT INTO templates 
        (id, name, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertPromises = templates?.map((template) => {
      return transaction.query(sqlQueryInsertTemplate, [
        template.id,
        template.name,
        "Customized",
        template.frameSvg,
        template.defaultPrimary,
        template.defaultSecondary,
        projectId,
        userId,
      ]);
    });

    await Promise.all(insertPromises);
    // await this.batchInsert(transaction, insertPromises, 10);

    // Insert associated template texts (headline, punchline, cta)
    const sqlQueryInsertTemplateText = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
          border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, 
          template_id, text , text_color_branding_type, container_color_branding_type) 
      VALUES 
        ?
    `;

    const templateTextsValues: any[] = [];

    templates.forEach((template) => {
      const texts = [
        { ...template.templateTexts.headline, type: "headline" },
        { ...template.templateTexts.punchline, type: "punchline" },
        { ...template.templateTexts.cta, type: "cta" },
      ];

      texts.forEach((text) => {
        templateTextsValues.push([
          randomUUID(),
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
          text.textColorBrandingType,
          text.containerColorBrandingType,
        ]);
      });
    });

    // Execute the bulk insert for template texts using a single query
    if (templateTextsValues.length > 0) {
      await transaction.query(sqlQueryInsertTemplateText, [templateTextsValues]);
    }
  }

  private async deleteBrandedTemplates(transaction: any, projectId: string) {
    const sqlQuery = `
      DELETE FROM templates
      WHERE project_id = ? AND type = 'Branded'
    `;
    await transaction.query(sqlQuery, [projectId]);
  }

  private async deleteCustomizedTemplates(transaction: any, projectId: string, userId: string) {
    const sqlQuery = `
      DELETE FROM templates
      WHERE project_id = ? AND user_id = ? AND type = 'Customized'
    `;
    await transaction.query(sqlQuery, [projectId, userId]);
  }

  private async batchInsert(transaction: any, promises: any[], batchSize: number) {
    for (let i = 0; i < promises?.length; i += batchSize) {
      const batch = promises.slice(i, i + batchSize);
      await Promise.all(batch?.map((promise) => promise));
    }
  }
}
