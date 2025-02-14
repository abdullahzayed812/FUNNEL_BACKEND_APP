import { Pool } from "mysql2/promise";
import { BaseModel } from "./baseModel";
import { TemplateLogo } from "../types/entities";
import { toCamelCase } from "../helpers/conversion";
import { AppError } from "../configs/error";
import path from "node:path";
import fs from "node:fs";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(decodeURIComponent(__filename));

export class TemplateLogoModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
  }

  public async get(templatesIds: string[]) {
    if (templatesIds.length === 0) return {};

    const placeholders = templatesIds.map(() => "?").join(",");

    const sqlQuery = `
      SELECT * FROM template_logos 
      WHERE template_id IN (${placeholders})
    `;

    const templatesLogos = await this.executeQuery(sqlQuery, templatesIds);

    const groupedLogos: { [key: string]: TemplateLogo[] } = {};

    templatesLogos.map(toCamelCase).forEach((logo) => {
      const templateId = logo.templateId;

      if (!groupedLogos[templateId]) {
        groupedLogos[templateId] = [];
      }
      groupedLogos[templateId].push(toCamelCase(logo));
    });

    return groupedLogos;
  }

  public async create(templateLogos: TemplateLogo[], templateId: string) {
    const imageDir = path.join(__dirname, "..", "uploads");

    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    const sqlQuery = `
      INSERT INTO template_logos (id, logo_data, x_coordinate, y_coordinate, template_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const insertedPromises = templateLogos.map(async (templateLogo) => {
      const { id, logoData, xCoordinate, yCoordinate } = templateLogo;

      const base64Data = logoData.replace(/^data:image\/\w+;base64,/, "");
      const filename = `image_${Date.now()}.png`;
      const filePath = path.join(imageDir, filename);

      try {
        await fs.promises.writeFile(filePath, base64Data, "base64");

        await this.executeQuery(sqlQuery, [id, filename, xCoordinate, yCoordinate, templateId]);
      } catch (error) {
        console.error("Error while saving the image:", error);
        throw new Error("Failed to save image.");
      }
    });

    await Promise.all(insertedPromises);
    console.log("Template logos created successfully.");
  }

  public async createTemplateLogos(connection: any, templatesLogos: TemplateLogo[][], templatesIds: string[]) {
    const imageDir = path.join(__dirname, "..", "uploads");

    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir);
    }

    const sqlQuery = `
      INSERT INTO template_logos (id, logo_data, x_coordinate, y_coordinate, template_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values: any[] = [];

    const insertedPromises = templatesLogos.map(async (logos, index) => {
      const templateId = templatesIds[index];

      for (const logo of logos) {
        const { id, logoData, xCoordinate, yCoordinate } = logo;

        const base64Data = logoData.replace(/^data:image\/\w+;base64,/, "");
        const filename = `image_${Date.now()}.png`;
        const filePath = path.join(imageDir, filename);

        try {
          await fs.promises.writeFile(filePath, base64Data, "base64");

          const fileUrl = `/uploads/${filename}`;

          values.push([id, fileUrl, xCoordinate, yCoordinate, templateId]);
        } catch (error) {
          console.error("Error while saving the image:", error);
          throw new Error("Failed to save image.");
        }
      }
    });

    await Promise.all(insertedPromises);

    try {
      await connection.query(sqlQuery, [values]);
      console.log("Template logos created successfully.");
    } catch (error: any) {
      console.error("Error during template logos creation:", error.message);
      throw new AppError("Failed to create template logos");
    }
  }
}
