import { Pool, PoolClient } from "pg"; // Import the pg library
import { BaseModel } from "./baseModel";
import { Branding, Template, TemplateText } from "../types/entities";
import { toCamelCase } from "../helpers/conversion";
import { randomUUID } from "crypto";

export class TemplateTextModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
  }

  public async getTemplateTexts(templateIds: string[]) {
    if (templateIds.length === 0) return {};

    const placeholders = templateIds.map((_, index) => `$${index + 1}`).join(","); // Use $1, $2, etc.

    const sqlQuery = `
      SELECT * FROM template_text 
      WHERE template_id IN (${placeholders})
    `;

    const result = await this.executeQuery<TemplateText>(sqlQuery, templateIds);

    const groupedTexts: { [key: string]: TemplateText[] } = {};

    result.map(toCamelCase).forEach((text) => {
      const templateId = text.templateId;

      if (!groupedTexts[templateId]) {
        groupedTexts[templateId] = [];
      }
      groupedTexts[templateId].push(toCamelCase(text));
    });

    return groupedTexts;
  }

  public async createTemplateText(template: Template) {
    const sqlQueryInsertTemplateText = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, border_radius, border_width, 
          border_style, border_color, container_color, language, x_coordinate, y_coordinate, color, 
          template_id, text, text_color_branding_type, container_color_branding_type)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `;

    const insertPromises = Object.keys(template.templateTexts).map(async (textType) => {
      const text = template.templateTexts[textType];

      return this.executeQuery(sqlQueryInsertTemplateText, [
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
        text.xCoordinate,
        text.yCoordinate,
        text.color,
        template.id,
        text.text,
        text.textColorBrandingType,
        text.containerColorBrandingType,
      ]);
    });

    await Promise.all(insertPromises);
  }

  public async bulkUpdateTemplateText(updatedTextFields: string[][], client: PoolClient) {
    const query = `
    UPDATE template_text
    SET color = $1, container_color = $2
    WHERE id = $3
  `;

    for (const updatedTextField of updatedTextFields) {
      await client.query(query, updatedTextField);
    }
  }

  public updateTemplateTextFields(
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

  public async createTemplateTexts(
    client: PoolClient, // Use PoolClient for transaction queries
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
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
    `;

    const templateTextsValues: any[] = [];

    templates?.forEach((template: Template, index: number) => {
      const templateId = insertedTemplatesIds[index];

      Object.keys(template.templateTexts).forEach((textType) => {
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
            text.xCoordinate,
            text.yCoordinate,
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
        await client.query(insertTemplateTextQuery, templateText); // Use PoolClient's query method for transaction
      }
    }
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
}
