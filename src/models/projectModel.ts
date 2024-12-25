import { Pool } from "mysql2/promise";

export class ProjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async listProjects(userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQueryProjectsData = `
        SELECT 
          p.id AS project_id,
          p.name AS project_name,
          p.description AS project_description,
          p.website AS project_website
        FROM users u
        LEFT JOIN projects p ON p.user_id = u.id
        WHERE u.id = ?
      `;
      const [projects] = await connection.query(sqlQueryProjectsData, [userId]);

      return projects;
    } finally {
      connection.release();
    }
  }

  public async getProjectById(projectId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `SELECT p.name FROM projects p WHERE p.id = ?`;

      const [result] = await connection.query(sqlQuery, [projectId]);
      return result;
    } finally {
      connection.release();
    }
  }
}
