import { Pool } from "mysql2/promise";
import { AppError } from "../configs/error";

export class BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    const connection = await this.pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      return result as T[];
    } catch (error: any) {
      throw new AppError(error.message);
    } finally {
      connection.release();
    }
  }
}
