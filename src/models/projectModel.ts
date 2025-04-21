import { Pool } from "pg";
import { Project } from "../types/entities";
import { AppError } from "../configs/error";
import { ERRORS } from "../configs/error";
import { randomUUID } from "node:crypto";
import { BaseModel } from "./baseModel";

export class ProjectModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

  private async projectExists(projectId: string): Promise<boolean> {
    if (!projectId || typeof projectId !== "string") {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }

    const result = await this.executeQuery("SELECT id FROM projects WHERE id = $1", [projectId]);
    return result.length > 0;
  }

  public async list(userId: string, userRole: string) {
    const sqlQueryUserProjects = `
      SELECT * FROM projects WHERE user_id = $1
    `;
    const sqlQueryDefaultProjects = `
      SELECT * FROM projects WHERE type = 'Default'
    `;

    const userProjects = await this.executeQuery<Project>(sqlQueryUserProjects, [userId]);
    const defaultProjects = await this.executeQuery<Project>(sqlQueryDefaultProjects);

    if (userRole === "Admin") {
      return defaultProjects;
    }

    return [...userProjects, ...defaultProjects];
  }

  public async get(projectId: string): Promise<Project> {
    const sqlQuery = `
      SELECT id, type FROM projects WHERE id = $1
    `;
    const result = await this.executeQuery<Project>(sqlQuery, [projectId]);

    return result[0];
  }

  public async forward(projectId: string, usersIds: string[]) {
    if (!projectId || typeof projectId !== "string") {
      return new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }

    const exists = await this.projectExists(projectId);
    if (!exists) {
      return new AppError(ERRORS.PROJECT_NOT_FOUND, 404);
    }

    const sqlQuery = `
      INSERT INTO user_projects (project_id, user_id)
      VALUES ${usersIds.map((_, i) => `($1, $${i + 2})`).join(", ")}
    `;

    return this.executeQuery(sqlQuery, [projectId, ...usersIds]);
  }

  public async create(project: Project, userId: string, userRole: string) {
    const { name, description, website } = project;

    const sqlQueryInsertProject = `
      INSERT INTO projects (id, name, description, website, user_id, type)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    return await this.executeQuery(sqlQueryInsertProject, [
      randomUUID(),
      name,
      description,
      website,
      userId,
      userRole === "Admin" ? "Default" : "Customized",
    ]);
  }
}
