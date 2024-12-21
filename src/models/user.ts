import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from "../types/entities";

// UserModel receives the database pool via dependency injection
export class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Create a new user in the database
  async createUser(user: User) {
    const connection = await this.pool.getConnection();
    try {
      const sqlQuery = "INSERT INTO users (id, email,  role, username, password, created_at) VALUES (?, ?, ?, ?, ?, ?)";
      const [result] = await connection.query(sqlQuery, [
        user.id,
        user.email,
        user.role,
        user.username,
        user.password,
        user.createdAt,
      ]);
      return result;
    } finally {
      connection.release();
    }
  }

  async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
    const connection = await this.pool.getConnection();

    try {
      // Query to check both username and email
      const sqlQuery = "SELECT * FROM users WHERE username = ? OR email = ?";
      const [rows] = await connection.query(sqlQuery, [usernameOrEmail, usernameOrEmail]);

      // Ensure `rows` is an array and it has at least one result
      if (Array.isArray(rows) && rows.length > 0) {
        const user = rows[0] as RowDataPacket;
        return { ...user, createdAt: user.created_at } as User;
      } else {
        return undefined; // Return undefined if no user was found
      }
    } finally {
      connection.release();
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = "SELECT * FROM users WHERE email = ?";
      const [result] = await connection.query(sqlQuery, [email]);

      if (Array.isArray(result) && result.length > 0) {
        const user = result[0] as RowDataPacket;
        return { ...user, createdAt: user.created_at } as User;
      }

      return undefined;
    } finally {
      connection.release();
    }
  }

  // Get a user by their email or username
  async getUserByUsername(username: string) {
    const connection = await this.pool.getConnection();
    try {
      const sqlQuery = "SELECT * FROM users WHERE username = ?";
      const [result] = await connection.query(sqlQuery, [username]);

      if (Array.isArray(result) && result.length > 0) {
        const user = result[0] as RowDataPacket;
        return { ...user, createdAt: user.created_at } as User;
      }

      return undefined;
    } finally {
      connection.release();
    }
  }

  // Get a user by their ID
  async getUserById(id: string): Promise<User | undefined> {
    const connection = await this.pool.getConnection();
    try {
      const sqlQuery = "SELECT * FROM users WHERE id = ?";
      const [result] = await connection.query(sqlQuery, [id]);

      if (Array.isArray(result) && result.length > 0) {
        const user = result[0] as RowDataPacket;
        return { ...user, createdAt: user.created_at } as User;
      }

      return undefined;
    } finally {
      connection.release();
    }
  }

  // Update user details
  async updateUser(id: string, userData: Partial<User>): Promise<boolean> {
    const connection = await this.pool.getConnection();
    try {
      const updateQuery = "UPDATE users SET username = ?, firstName = ?, lastName = ? WHERE id = ?";
      await connection.query(updateQuery, [userData.username, id]);
      return true;
    } finally {
      connection.release();
    }
  }
}
