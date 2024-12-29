import { Pool } from "mysql2/promise";

export class ProjectModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async list(userId: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQueryProjectsData = `
        SELECT 
          p.id,
          p.name,
          p.description,
          p.website
        FROM users u
        INNER JOIN projects p ON p.user_id = u.id
        WHERE u.id = ?
      `;
      const [projects] = await connection.query(sqlQueryProjectsData, [userId]);

      return projects;
    } finally {
      connection.release();
    }
  }

  public async get(projectId: string) {
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
