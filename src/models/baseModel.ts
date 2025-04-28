import { Pool, QueryResultRow } from "pg";

export class BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  protected async executeQuery<T extends QueryResultRow>(query: string, params: any[] = []): Promise<T[]> {
    const client = await this.pool.connect();
    // console.log(client);
    try {
      const result = await client.query<T>(query, params);
      return result.rows;
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      client.release();
    }
  }
}
