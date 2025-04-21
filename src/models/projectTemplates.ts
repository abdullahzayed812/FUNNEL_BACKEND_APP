import { Pool, PoolClient } from "pg";
import { BaseModel } from "./baseModel";
import { Project, Template } from "../types/entities";
import { toCamelCase } from "../helpers/conversion";

export class ProjectTemplatesModel extends BaseModel {
  constructor(protected pool: Pool) {
    super(pool);
  }

  public async createProjectTemplate(projectId: string, templateId: string): Promise<void> {
    const sqlQuery = `
      INSERT INTO project_templates (project_id, template_id)
      VALUES ($1, $2)
    `;

    await this.executeQuery(sqlQuery, [projectId, templateId]);
  }

  public async getTemplatesByProjectId(projectId: string): Promise<Template[]> {
    const sqlQuery = `
      SELECT t.* FROM templates t
      INNER JOIN project_templates pt ON t.id = pt.template_id
      WHERE pt.project_id = $1
    `;

    const templates = await this.executeQuery<Template>(sqlQuery, [projectId]);
    return templates.map((template) => toCamelCase(template));
  }

  public async getProjectsByTemplateId(templateId: string): Promise<Project[]> {
    const sqlQuery = `
      SELECT p.* FROM projects p
      INNER JOIN project_templates pt ON p.id = pt.project_id
      WHERE pt.template_id = $1
    `;

    const projects = await this.executeQuery<Project>(sqlQuery, [templateId]);
    return projects.map((project) => toCamelCase(project));
  }

  public async deleteProjectTemplate(projectId: string, templateId: string): Promise<void> {
    const sqlQuery = `
      DELETE FROM project_templates 
      WHERE project_id = $1 AND template_id = $2
    `;

    await this.executeQuery(sqlQuery, [projectId, templateId]);
  }

  public async createProjectTemplatesBulk(
    connection: PoolClient,
    projectId: string,
    templateIds: string[]
  ): Promise<void> {
    const sqlQuery = `
      INSERT INTO project_templates (project_id, template_id)
      VALUES ($1, $2)
    `;

    const bulkInsertValues: any[] = templateIds.map((templateId) => [projectId, templateId]);

    if (bulkInsertValues.length > 0) {
      for (const value of bulkInsertValues) {
        await connection.query(sqlQuery, value);
      }
    }
  }
}
