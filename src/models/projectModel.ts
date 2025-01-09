import { Pool } from "mysql2/promise";
import { Project } from "../types/entities";
import { AppError } from "../configs/error"; // Assuming AppError is in utils
import { ERRORS } from "../configs/error";
import { randomUUID } from "node:crypto";

export class ProjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  private async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      return result as T[];
    } finally {
      connection.release();
    }
  }

  private async projectExists(projectId: string): Promise<boolean> {
    if (!projectId || typeof projectId !== "string") {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400); // Bad request error
    }

    const result = await this.executeQuery("SELECT id FROM projects WHERE id = ?", [projectId]);
    return result.length > 0;
  }

  public async list(userId: string, userRole: string) {
    const sqlQueryUserProjects = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.website
        p.type
      FROM projects p
      INNER JOIN user_projects up ON up.project_id = p.id
      INNER JOIN users u ON u.id = up.user_id
      WHERE u.id = ?
    `;

    const sqlQueryDefaultProjects = `
      SELECT id, name, description, website FROM projects WHERE type = 'Default'
    `;

    const userProjects = await this.executeQuery<Project>(sqlQueryUserProjects, [userId]);
    let defaultProjects: Project[] = [];

    if (userRole !== "Admin") {
      defaultProjects = await this.executeQuery<Project>(sqlQueryDefaultProjects);
    }

    return [...userProjects, ...defaultProjects];
  }

  public async get(projectId: string): Promise<Project> {
    const sqlQuery = `SELECT id FROM projects WHERE id = ?`;
    const result = await this.executeQuery<Project>(sqlQuery, [projectId]);

    return result[0]; // Assuming projectId is unique
  }

  public async forward(projectId: string, usersIds: string[]) {
    if (!projectId || typeof projectId !== "string") {
      return new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400); // Bad request error
    }

    const exists = await this.projectExists(projectId);
    if (!exists) {
      return new AppError(ERRORS.PROJECT_NOT_FOUND, 404); // Not found error
    }

    const sqlQuery = `
      INSERT INTO user_projects (project_id, user_id)
      VALUES ?`;

    const values = usersIds.map((userId) => [projectId, userId]);

    const connection = await this.pool.getConnection();
    try {
      await connection.query(sqlQuery, [values]);
    } finally {
      connection.release();
    }
  }

  public async create(project: Project, userId: string, userRole: string) {
    const { name, description, website } = project;

    const newProject: Project = {
      id: randomUUID(),
      name,
      description,
      website,
      type: userRole === "Admin" ? "Default" : "Customized",
    };

    const sqlQueryInsertProject = `
      INSERT INTO projects (id, name, description, website, type)
      VALUES (?,?,?,?,?)
    `;

    const sqlQueryInsertUserProjects = `
      INSERT INTO user_projects (project_id, user_id)
      VALUES (?,?)
    `;

    try {
      const isProjectCreated = await this.executeQuery(sqlQueryInsertProject, [
        newProject.id,
        newProject.name,
        newProject.description,
        newProject.website,
        newProject.type,
      ]);

      const isUserProjectsCreated = await this.executeQuery(sqlQueryInsertUserProjects, [newProject.id, userId]);

      return { isProjectCreated, isUserProjectsCreated };
    } catch (error: any) {
      return new AppError(error);
    }
  }
}
