import { BaseModel } from "./baseModel";
export class UserModel extends BaseModel {
    pool;
    constructor(pool) {
        super(pool);
        this.pool = pool;
    }
    async createUser(user) {
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
    async getUserByEmail(email) {
        const sqlQuery = "SELECT id, username, email, created_at as createdAt FROM users WHERE email = ?";
        const users = await this.executeQuery(sqlQuery, [email]);
        if (users?.length > 0) {
            return users[0];
        }
        return undefined;
    }
    async getUserByUsername(username) {
        const sqlQuery = "SELECT id, username, email, created_at as createdAt FROM users WHERE username = ?";
        const users = await this.executeQuery(sqlQuery, [username]);
        if (users?.length > 0) {
            return users[0];
        }
        return undefined;
    }
    async getUserById(id) {
        const sqlQuery = "SELECT id, username, email, role, created_at as createdAt FROM users WHERE id = ?";
        const users = await this.executeQuery(sqlQuery, [id]);
        if (users?.length > 0) {
            return users[0];
        }
        return undefined;
    }
    async listUsers() {
        const sqlQuery = "SELECT id, username, email FROM users";
        const users = await this.executeQuery(sqlQuery);
        if (users?.length > 0) {
            return users;
        }
        return [];
    }
    async listForwarded(projectId) {
        const sqlQuery = `
      SELECT u.id, u.username, u.email
      FROM users u
      INNER JOIN user_projects up ON u.id = up.user_id
      WHERE up.project_id = ?;    
    `;
        const users = await this.executeQuery(sqlQuery, [projectId]);
        if (users?.length > 0) {
            return users;
        }
        return [];
    }
}
