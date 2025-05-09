import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from "../types/entities";
import { BaseModel } from "./baseModel";

export class UserModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const sqlQuery = "SELECT id, username, email, created_at as createdAt FROM users WHERE email = ?";

    const users = await this.executeQuery<User>(sqlQuery, [email]);

    if (users?.length > 0) {
      return users[0];
    }

    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const sqlQuery = "SELECT id, username, email, created_at as createdAt FROM users WHERE username = ?";

    const users = await this.executeQuery<User>(sqlQuery, [username]);

    if (users?.length > 0) {
      return users[0];
    }

    return undefined;
  }

  public async getUserById(id: string): Promise<User | undefined> {
    const sqlQuery = "SELECT id, username, email, role, created_at as createdAt FROM users WHERE id = ?";

    const users = await this.executeQuery<User>(sqlQuery, [id]);

    if (users?.length > 0) {
      return users[0];
    }

    return undefined;
  }

  public async listUsers() {
    const sqlQuery = "SELECT id, username, email FROM users";

    const users = await this.executeQuery<User>(sqlQuery);

    if (users?.length > 0) {
      return users;
    }

    return [];
  }

  public async listForwarded(projectId: string) {
    const sqlQuery = `
      SELECT u.id, u.username, u.email
      FROM users u
      INNER JOIN user_projects up ON u.id = up.user_id
      WHERE up.project_id = ?;    
    `;

    const users = await this.executeQuery<User>(sqlQuery, [projectId]);

    if (users?.length > 0) {
      return users;
    }

    return [];
  }
}
