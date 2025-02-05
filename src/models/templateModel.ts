import { Pool } from "mysql2/promise";
import { Branding, Template, TemplateText } from "../types/entities";
import { BaseModel } from "./baseModel";
import { randomUUID } from "crypto";
import { AppError } from "../configs/error";
import { parseSVG } from "../helpers/svg/parseSVG";
import { collectSvgSegmentsIdsContainsPrimaryProp } from "../helpers/svg/collectShapesIds";
import { updateShapeColorById } from "../helpers/svg/updateShapeColorById";
import { serializeSVG } from "../helpers/svg/serializeSVG";
import { TemplateTextModel } from "./templateTextModel";
import { toCamelCase } from "../helpers/conversion";
import { TemplateLogoModel } from "./templateLogoModel";

export class TemplateModel extends BaseModel {
  constructor(
    protected pool: Pool,
    private templateTextModel: TemplateTextModel,
    private templateLogoModel: TemplateLogoModel
  ) {
    super(pool);
  }

  public async listDefault(userId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.tag,
        t.frame_svg,
        t.default_primary,
        t.default_secondary_color AS defaultSecondary,
        t.created_at,
        CASE
          WHEN ut.user_id = ? THEN ut.is_selected
          ELSE NULL
        END AS isSelected
      FROM templates t
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.type = 'Default'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId]);

    if (templates?.length === 0) {
      return [];
    }

    return this.combineTemplatesWithTextsAndLogos(templates);
  }

  public async listBranded(userId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg,
        t.default_primary,
        t.default_secondary_color AS defaultSecondary,
        t.created_at,
        CASE
          WHEN ut.user_id = ? THEN ut.is_selected
          ELSE NULL
        END AS isSelected
      FROM templates t
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.type = 'Branded'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId]);

    if (templates?.length === 0) {
      return [];
    }

    return this.combineTemplatesWithTextsAndLogos(templates);
  }

  public async listCustomized(projectId: string, userId: string) {
    const sqlQuery = `
      SELECT 
        t.id,
        t.name,
        t.type,
        t.frame_svg,
        t.default_primary,
        t.default_secondary_color AS defaultSecondary,
        t.created_at,
        CASE
          WHEN ut.user_id = ? THEN ut.is_selected
          ELSE NULL
        END AS isSelected
      FROM templates t
      LEFT JOIN user_templates ut ON t.id = ut.template_id
      WHERE t.user_id = ? 
        AND t.project_id = ? 
        AND t.type = 'Customized'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, userId, projectId]);

    if (templates?.length === 0) {
      return [];
    }

    return this.combineTemplatesWithTextsAndLogos(templates);
  }

  public async create(template: Template, projectId: string, userId: string, userRole: string) {
    const sqlQueryInsertTemplate = `
      INSERT INTO templates 
        (id, name, type, tag, frame_svg, default_primary, default_secondary_color, project_id, user_id)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const createdTemplate = await this.executeQuery(sqlQueryInsertTemplate, [
      template.id,
      template.name,
      userRole === "Admin" ? "Branded" : "Customized",
      template.tag,
      template.frameSvg,
      template.defaultPrimary,
      template.defaultSecondary,
      projectId,
      userId,
    ]);

    await this.templateTextModel.createTemplateText(template);
    await this.templateLogoModel.create(template.templateLogos, template.id);

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

  public async combineTemplatesWithTextsAndLogos(templates: Template[]) {
    const templatesIds = templates.map((t) => t.id);

    const allTemplatesTexts = await this.templateTextModel.getTemplateTexts(templatesIds);
    const allTemplatesLogos = await this.templateLogoModel.get(templatesIds);

    const templatesWithTextsAndLogos = templates.map((template) => {
      const templateTextsList = allTemplatesTexts[template.id];
      const templateLogos = allTemplatesLogos[template.id];
      const templateTexts: { [index: string]: TemplateText } = {};

      templateTextsList?.forEach((text) => {
        templateTexts[text.type] = text;
      });

      return { ...template, templateTexts, templateLogos };
    });

    return templatesWithTextsAndLogos.map(toCamelCase);
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

      for (const template of templates) {
        const updatedFrameSvg = this.updateSvgColors(template.frameSvg, primaryColor, secondaryColor);
        updatedTemplates.push([updatedFrameSvg, userId, template.id]);

        this.templateTextModel.updateTemplateTextFields(
          template.templateTexts,
          primaryColor,
          secondaryColor,
          additionalColor,
          updatedTextFields
        );
      }

      await this.bulkUpdateTemplates(updatedTemplates, connection);
      await this.templateTextModel.bulkUpdateTemplateText(updatedTextFields, connection);

      await connection.commit();
      console.log("Bulk templates and text fields updated successfully.");
    } catch (error: any) {
      await connection.rollback();
      console.error("Error during bulk update:", error.message);
      throw new AppError("Bulk update failed");
    } finally {
      connection.release();
    }
  }

  private updateSvgColors(frameSvg: string, primaryColor: string, secondaryColor: string): string {
    let svgElements = parseSVG(frameSvg);

    const primaryIds = collectSvgSegmentsIdsContainsPrimaryProp(svgElements, "hasPrimary");
    const secondaryIds = collectSvgSegmentsIdsContainsPrimaryProp(svgElements, "hasSecondary");

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
          (id, name, tag, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const customizedTemplate of customizedTemplates) {
        await connection.query(insertTemplateQuery, customizedTemplate);
      }

      await this.templateTextModel.createTemplateTexts(connection, defaultTemplates, branding, customizedTemplatesIds);

      const templatesLogos = defaultTemplates.map((dt: Template) => dt.templateLogos);
      await this.templateLogoModel.createTemplateLogos(connection, templatesLogos, customizedTemplatesIds);

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
      const { name, tag, defaultPrimary, defaultSecondary } = defaultTemplate;

      return [randomUUID(), name, tag, type, updatedFrameSvg, defaultPrimary, defaultSecondary, projectId, userId];
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

      // console.log(brandedTemplatesIds);

      const insertTemplateQuery = `
        INSERT INTO templates 
          (id, name, tag, type, frame_svg, default_primary, default_secondary_color, project_id, user_id)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      for (const brandedTemplate of brandedTemplates) {
        await connection.query(insertTemplateQuery, brandedTemplate);
      }

      await this.templateTextModel.createTemplateTexts(connection, defaultTemplates, branding, brandedTemplatesIds);

      const templatesLogos = defaultTemplates.map((dt: Template) => dt.templateLogos);
      await this.templateLogoModel.createTemplateLogos(connection, templatesLogos, brandedTemplatesIds);

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

  private async getUserTemplates(userId: string, projectId: string) {
    const sqlQuery = `
      SELECT 
      t.id,
      t.name,
      t.type,
      t.frame_svg,
      t.default_primary,
      t.default_secondary_color AS defaultSecondary,
      t.created_at
      FROM templates t
      WHERE user_id = ?
        AND project_id = ?
        AND t.type != 'Default'
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [userId, projectId]);

    return this.combineTemplatesWithTextsAndLogos(templates);
  }
}
