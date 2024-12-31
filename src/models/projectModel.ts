import { Pool } from "mysql2/promise";
import { Project } from "../types/entities";
import { AppError } from "../configs/error"; // Assuming AppError is in utils
import { ERRORS } from "../configs/error";

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

  public async list(userId: string) {
    const sqlQueryProjectsData = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.website
      FROM users u
      INNER JOIN user_projects up ON up.user_id = u.id
      INNER JOIN projects p ON p.id = up.project_id
      WHERE u.id = ?`;

    const result = await this.executeQuery<Partial<Project>>(sqlQueryProjectsData, [userId]);

    if (result.length === 0) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 404); // Not found error
    }

    return result;
  }

  public async get(projectId: string): Promise<Partial<Project>> {
    const sqlQuery = `SELECT p.id FROM projects p WHERE p.id = ?`;
    const result = await this.executeQuery<Partial<Project>>(sqlQuery, [projectId]);

    console.log({ result, projectId });
    if (result.length === 0) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 404); // Not found error
    }

    return result[0]; // Assuming projectId is unique
  }

  public async forward(projectId: string, usersIds: string[]) {
    if (!projectId || typeof projectId !== "string") {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400); // Bad request error
    }

    const exists = await this.projectExists(projectId);
    if (!exists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 404); // Not found error
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
}
