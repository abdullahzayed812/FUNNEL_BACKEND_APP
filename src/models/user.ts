import { Pool, RowDataPacket } from "mysql2/promise";
import { User } from "../types/entities";

// UserModel receives the database pool via dependency injection
export class UserModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  // Create a new user in the database
  async createUser(user: User): User {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(
        "INSERT INTO users (id, email, username, password, firstName, lastName) VALUES (?, ?, ?, ?, ?, ?)",
        [user.id, user.email, user.username, user.password]
      );

      return { id: result.insertId, ...user };
    } finally {
      connection.release();
    }
  }

  // Get a user by their email or username
  async getUserByEmailOrUsername(login: string) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query("SELECT * FROM users WHERE email = ? OR username = ?", [login, login]);
      return rows[0]; // return the first match
    } finally {
      connection.release();
    }
  }

  // Get a user by their ID
  async getUserById(id: string) {
    const connection = await this.pool.getConnection();
    try {
      const [rows] = await connection.query("SELECT * FROM users WHERE id = ?", [id]);
      return rows[0];
    } finally {
      connection.release();
    }
  }

  // Update user details
  async updateUser(id: string, userData: Partial<User>) {
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
