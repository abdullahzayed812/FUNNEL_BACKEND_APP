import { OkPacket, Pool, PoolConnection } from "mysql2/promise";
import { Branding, Template, TemplateText } from "../types/entities";
import { BaseModel } from "./baseModel";
import { randomUUID } from "crypto";
import { AppError } from "../configs/error";
import { parseSVG } from "../helpers/svg/parseSVG";
import { collectSvgSegmentsIdsContainsPrimaryProp } from "../helpers/svg/collectShapesIds";
import { updateShapeColorById } from "../helpers/svg/updateShapeColorById";
import { serializeSVG } from "../helpers/svg/serializeSVG";

export class TemplateModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
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

  private async getUserTemplates(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
      t.id,
      t.name,
      t.type,
      t.frame_svg AS frameSvg,
      t.default_primary AS defaultPrimary,
      t.default_secondary_color AS defaultSecondary,
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
      WHERE user_id = ?
        AND project_id = ?
        AND t.type != 'Default'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    return templates;
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

  public async updateTemplatesWithBranding(userId: string, projectId: string, branding: Branding, userRole: string) {
    try {
      const templates = await this.getUserTemplates(userId, projectId);

      const { primaryColor, secondaryColor, additionalColor } = branding;

      if (templates?.length > 0) {
        await this.updateExistingTemplates(userId, templates, primaryColor, secondaryColor, additionalColor);
        return { message: "Templates updated successfully." };
      } else {
        if (userRole === "Admin") {
          await this.createBrandedTemplates(userId, projectId, branding);
          return { message: "Customized templates created successfully." };
        }
        await this.createCustomizedTemplates(userId, projectId, branding);
        return { message: "Customized templates created successfully." };
      }
    } catch (error: any) {
      console.error("Error updating templates with branding:", error.message);
      throw new AppError(error.message);
    }
  }

  private async updateExistingTemplates(
    userId: string,
    templates: Template[],
    primaryColor: string,
    secondaryColor: string,
    additionalColor: string
  ) {
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const updatedTemplates: string[][] = [];
      const updatedTextFields: string[][] = [];

      // Process each template for updating frame SVG and text fields
      for (const template of templates) {
        // Update SVG colors and text fields
        const updatedFrameSvg = this.updateSvgColors(template.frameSvg, primaryColor, secondaryColor);
        updatedTemplates.push([updatedFrameSvg, userId, template.id]);

        // Process text fields and prepare update data
        this.updateTemplateTextFields(
          template.templateTexts,
          primaryColor,
          secondaryColor,
          additionalColor,
          updatedTextFields
        );
      }

      // Execute bulk updates for templates and text fields
      await this.bulkUpdateTemplates(updatedTemplates, connection);
      await this.bulkUpdateTemplateText(updatedTextFields, connection);

      // Commit the transaction
      await connection.commit();
      console.log("Bulk templates and text fields updated successfully.");
    } catch (error: any) {
      // Rollback on error
      await connection.rollback();
      console.error("Error during bulk update:", error.message);
      throw new AppError("Bulk update failed");
    } finally {
      connection.release();
    }
  }

  private updateSvgColors(frameSvg: string, primaryColor: string, secondaryColor: string): string {
    let svgElements = parseSVG(frameSvg);

    // Collect shape IDs based on branding
    const primaryIds = collectSvgSegmentsIdsContainsPrimaryProp(svgElements, "hasPrimary");
    const secondaryIds = collectSvgSegmentsIdsContainsPrimaryProp(svgElements, "hasSecondary");

    // Update SVG colors with branding
    if (primaryColor) {
      primaryIds?.forEach((id) => {
        svgElements = updateShapeColorById(svgElements, id, true, primaryColor);
      });
    }

    if (secondaryColor) {
      secondaryIds?.forEach((id) => {
        svgElements = updateShapeColorById(svgElements, id, true, secondaryColor);
      });
    }

    return serializeSVG(svgElements);
  }

  private updateTemplateTextFields(
    templateTexts: Record<string, any>,
    primaryColor: string,
    secondaryColor: string,
    additionalColor: string,
    updatedTextFields: string[][]
  ) {
    Object.entries(templateTexts).forEach(([textType, textProps]) => {
      const updatedText = { ...textProps };

      // Update text color based on branding type
      const textBrandingType = updatedText.textColorBrandingType;
      const defaultTextColor = updatedText.color;

      const containerBrandingType = updatedText.containerColorBrandingType;
      const defaultContainerColor = updatedText.containerColor;

      updatedText.color = this.getTextColorBasedOnBranding(
        textBrandingType,
        defaultTextColor,
        primaryColor,
        secondaryColor,
        additionalColor
      );
      updatedText.containerColor = this.getTextColorBasedOnBranding(
        containerBrandingType,
        defaultContainerColor,
        primaryColor,
        secondaryColor,
        additionalColor
      );

      // Add updated text field for bulk update
      updatedTextFields.push([updatedText.color, updatedText.containerColor, updatedText.id]);
    });
  }

  private getTextColorBasedOnBranding(
    brandingType: "primary" | "secondary" | "additional",
    defaultColor: string,
    primaryColor: string,
    secondaryColor: string,
    additionalColor: string
  ): string {
    switch (brandingType) {
      case "primary":
        return primaryColor;
      case "secondary":
        return secondaryColor;
      case "additional":
        return additionalColor;
      default:
        return defaultColor;
    }
  }

  private async bulkUpdateTemplates(updatedTemplates: string[][], connection: any) {
    const query = `
    UPDATE templates
    SET frame_svg = ?
    WHERE user_id = ? AND id = ?
  `;
    for (const updatedTemplate of updatedTemplates) {
      await connection.query(query, updatedTemplate);
    }
  }

  private async bulkUpdateTemplateText(updatedTextFields: string[][], connection: any) {
    const query = `
    UPDATE template_text
    SET color = ?, container_color = ?
    WHERE id = ?
  `;
    for (const updatedTextField of updatedTextFields) {
      await connection.query(query, updatedTextField);
    }
  }

  private async createCustomizedTemplates(userId: string, projectId: string, branding: Branding) {
    const defaultTemplates = await this.listDefault(userId);

    if (defaultTemplates?.length === 0) {
      console.log("No default templates found to create customized templates.");
      return;
    }

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const customizedTemplates = this.prepareTemplates(defaultTemplates, userId, projectId, branding, "Customized");
      const customizedTemplatesIds = customizedTemplates.map((t) => t[0]);

      const insertTemplateQuery = `
        INSERT INTO templates 
          (id, name, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const customizedTemplate of customizedTemplates) {
        await connection.query(insertTemplateQuery, customizedTemplate);
      }

      await this.createTemplateTexts(connection, defaultTemplates, branding, customizedTemplatesIds);

      await connection.commit();
      console.log("Customized templates created successfully.");
    } catch (error: any) {
      // Rollback on error
      await connection.rollback();
      console.error("Error during customized templates creation:", error.message);
      throw new AppError("Failed to create customized templates");
    } finally {
      connection.release();
    }
  }
  private prepareTemplates(
    defaultTemplates: Template[],
    userId: string,
    projectId: string,
    branding: Branding,
    type: "Customized" | "Branded"
  ) {
    const { primaryColor, secondaryColor } = branding;

    return defaultTemplates.map((defaultTemplate) => {
      const updatedFrameSvg = this.updateSvgColors(defaultTemplate.frameSvg, primaryColor, secondaryColor);
      const { name, defaultPrimary, defaultSecondary } = defaultTemplate;

      return [randomUUID(), name, type, updatedFrameSvg, defaultPrimary, defaultSecondary, projectId, userId];
    });
  }

  private async createBrandedTemplates(userId: string, projectId: string, branding: Branding) {
    const defaultTemplates = await this.listDefault(userId);

    if (defaultTemplates?.length === 0) {
      console.log("No default templates found to create branded templates.");
      return;
    }

    const connection = await this.pool.getConnection();
    await connection.beginTransaction();

    try {
      const brandedTemplates = this.prepareTemplates(defaultTemplates, userId, projectId, branding, "Branded");
      const brandedTemplatesIds = brandedTemplates.map((b) => b[0]);

      console.log(brandedTemplatesIds);

      const insertTemplateQuery = `
        INSERT INTO templates 
          (id, name, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const brandedTemplate of brandedTemplates) {
        await connection.query(insertTemplateQuery, brandedTemplate);
      }

      await this.createTemplateTexts(connection, defaultTemplates, branding, brandedTemplatesIds);

      await connection.commit();
      console.log("Branded templates and text properties created successfully.");
    } catch (error: any) {
      // Rollback on error
      await connection.rollback();
      console.error("Error during branded templates creation:", error.message);
      throw new AppError("Failed to create branded templates");
    } finally {
      connection.release();
    }
  }

  private async createTemplateTexts(
    connection: PoolConnection,
    templates: Template[],
    branding: Branding,
    insertedTemplatesIds: string[]
  ) {
    const { primaryColor, secondaryColor, additionalColor } = branding;

    const insertTemplateTextQuery = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
          border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, 
          template_id, text, text_color_branding_type, container_color_branding_type)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const templateTextsValues: any[] = [];

    const textTypes: ("headline" | "punchline" | "cta")[] = ["headline", "punchline", "cta"];

    templates.forEach((template: Template, index: number) => {
      const templateId = insertedTemplatesIds[index];
      console.log(templateId);

      textTypes.forEach((textType) => {
        const text = template.templateTexts[textType];

        if (text) {
          templateTextsValues.push([
            randomUUID(),
            textType,
            text.fontSize,
            text.fontFamily,
            text.fontWeight,
            text.textDecorationLine,
            text.fontStyle,
            text.borderRadius,
            text.borderWidth,
            text.borderStyle,
            text.borderColor,
            this.getTextColorBasedOnBranding(
              text.containerColorBrandingType!,
              text.containerColor,
              primaryColor,
              secondaryColor,
              additionalColor
            ),
            text.language,
            text.translateX,
            text.translateY,
            this.getTextColorBasedOnBranding(
              text.textColorBrandingType!,
              text.color,
              primaryColor,
              secondaryColor,
              additionalColor
            ),
            templateId,
            text.text,
            text.textColorBrandingType,
            text.containerColorBrandingType,
          ]);
        }
      });
    });

    if (templateTextsValues.length > 0) {
      for (const templateText of templateTextsValues) {
        await connection.query(insertTemplateTextQuery, templateText);
      }
    }
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
