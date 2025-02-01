import { Pool } from "mysql2/promise";
import { randomUUID } from "crypto";
import { BaseModel } from "./baseModel";
import { Template, TemplateText, TemplateTextType } from "../types/entities";
import { toCamelCase } from "../helpers/convertion";

export class TemplateTextModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
  }

  public async getTemplateTexts(templateIds: string[]) {
    if (templateIds.length === 0) return {}; // لا يوجد قوالب

    const placeholders = templateIds.map(() => "?").join(","); // إنشاء `?, ?, ?` ديناميكيًا
    const sqlQuery = `
      SELECT * FROM template_text 
      WHERE template_id IN (${placeholders})
    `;

    const templateTexts = await this.executeQuery<TemplateText>(sqlQuery, templateIds);

    // ✅ تجميع النصوص حسب `template_id`
    const groupedTexts: { [key: string]: TemplateText } = {};

    templateTexts.forEach((text) => {
      const templateId = text.templateId;

      if (!groupedTexts[templateId]) {
        groupedTexts[templateId] = [];
      }
      groupedTexts[templateId].push(toCamelCase(text));
    });

    return groupedTexts;
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
