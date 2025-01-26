import { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";
import { BaseModel } from "./baseModel";
import { TemplateText, TemplateTextType } from "../types/entities";

export class TemplateTextModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
  }

  // Generates JSON query for template text retrieval
  public getTemplateTextJsonQuery(type: TemplateTextType): string {
    return `JSON_OBJECT(
      'id', id,
      'text', text,
      'color', color,
      'containerColor', container_color,
      'fontSize', font_size,
      'fontWeight', font_weight,
      'fontFamily', font_family,
      'fontStyle', font_style,
      'textDecoration', text_decoration,
      'borderRadius', border_radius,
      'borderWidth', border_width,
      'borderStyle', border_style,
      'borderColor', border_color,
      'translateX', x_coordinate,
      'translateY', y_coordinate,
      'language', language,
      'textColorBrandingType', text_color_branding_type,
      'containerColorBrandingType', container_color_branding_type
    )`;
  }

  public async createTemplateTexts(
    templateId: string,
    templateTexts: Record<TemplateTextType, TemplateText>
  ): Promise<void> {
    const sqlQueryInsertTemplateText = `
      INSERT INTO template_text 
        (id, type, font_size, font_family, font_weight, text_decoration, font_style, 
        border_radius, border_width, border_style, border_color, container_color, 
        language, x_coordinate, y_coordinate, color, template_id, text, 
        text_color_branding_type, container_color_branding_type)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const textTypes: TemplateTextType[] = ["headline", "punchline", "cta"];
    const insertPromises = textTypes
      .filter((type) => templateTexts[type])
      .map((type) => {
        const text = templateTexts[type];
        return this.executeQuery(sqlQueryInsertTemplateText, [
          text.id || randomUUID(),
          type,
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
          templateId,
          text.text,
          text.textColorBrandingType,
          text.containerColorBrandingType,
        ]);
      });

    await Promise.all(insertPromises);
  }

  public getTextColorBasedOnBranding(
    brandingType: "primary" | "secondary" | "additional" | undefined,
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
