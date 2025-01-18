import { Pool } from "mysql2/promise";
import { BaseModel } from "./baseModel";

export class TemplateTextModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
  }

  public async update(templateId: string, templateProps: {}) {
    const sqlQuery = ``;
  }
}
