import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from "../types/entities";

// UserModel receives the database pool via dependency injection
export class UserModel {
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

  // Create a new user in the database
  public async createUser(user: User) {
    const sqlQuery = `
    INSERT INTO users (id, email, role, username, password, created_at) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    const result = await this.executeQuery(sqlQuery, [
      user.id,
      user.email,
      user.role,
      user.username,
      user.password,
      user.createdAt,
    ]);

    return result;
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
    const sqlQuery = `
      SELECT * FROM users WHERE username = ? OR email = ?
    `;

    const users = await this.executeQuery<RowDataPacket>(sqlQuery, [usernameOrEmail, usernameOrEmail]);

    if (users.length > 0) {
      const user = users[0];

      return { ...user, createdAt: user.created_at } as User;
    }

    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const sqlQuery = "SELECT * FROM users WHERE email = ?";

    const users = await this.executeQuery<RowDataPacket>(sqlQuery, [email]);

    if (users.length > 0) {
      const user = users[0];

      return { ...user, createdAt: user.created_at } as User;
    }

    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const sqlQuery = "SELECT * FROM users WHERE username = ?";

    const users = await this.executeQuery<RowDataPacket>(sqlQuery, [username]);

    if (users.length > 0) {
      const user = users[0];

      return { ...user, createdAt: user.created_at } as User;
    }

    return undefined;
  }

  public async getUserById(id: string): Promise<User | undefined> {
    const sqlQuery = "SELECT * FROM users WHERE id = ?";

    const users = await this.executeQuery<RowDataPacket>(sqlQuery, [id]);

    if (users.length > 0) {
      const user = users[0];

      return { ...user, createdAt: user.created_at } as User;
    }

    return undefined;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<boolean> {
    const sqlQuery = "UPDATE users SET username = ?, email = ? WHERE id = ?";

    const result = await this.executeQuery<{ affectedRows: number }>(sqlQuery, [userData.username, userData.email]);

    return result[0].affectedRows > 0;
  }

  public async listUsers() {
    const sqlQuery = "SELECT id, username, email FROM users";

    const users = await this.executeQuery<RowDataPacket>(sqlQuery);

    if (users.length > 0) {
      return users;
    }

    return undefined;
  }

  public async listForwarded(projectId: string) {
    const sqlQuery = `
      SELECT u.id, u.username, u.email
      FROM users u
      INNER JOIN user_projects up ON u.id = up.user_id
      WHERE up.project_id = ?;    
    `;

    const users = await this.executeQuery<RowDataPacket>(sqlQuery, [projectId]);

    if (users.length > 0) {
      return users;
    }

    return undefined;
  }
}
