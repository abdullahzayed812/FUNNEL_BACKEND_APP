import { AppError } from "../configs/error";
export class BaseModel {
    pool;
    constructor(pool) {
        this.pool = pool;
    }
    async executeQuery(query, params = []) {
        const connection = await this.pool.getConnection();
        try {
            const [result] = await connection.query(query, params);
            return result;
        }
        catch (error) {
            throw new AppError(error.message);
        }
        finally {
            connection.release();
        }
    }
}
