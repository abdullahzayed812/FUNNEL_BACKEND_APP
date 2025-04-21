import { Pool, QueryResultRow } from "pg";
import { AppError } from "../configs/error";

export class BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected async executeQuery<T extends QueryResultRow>(query: string, params: any[] = []): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<T>(query, params);
      return result.rows;
    } catch (error: any) {
      throw new AppError(error.message);
    } finally {
      client.release();
    }
  }
}
