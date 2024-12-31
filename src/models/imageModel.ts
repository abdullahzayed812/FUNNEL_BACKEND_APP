import { Pool, RowDataPacket } from "mysql2/promise";
import { Image } from "../types/entities";

export class ImageModel {
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

  public async list(projectId: string, userId: string) {
    const sqlQuery = `
      SELECT 
        i.id AS id,
        i.file_path AS url,
        i.image_type AS imageType,
        i.is_selected AS isSelected,
        i.project_id AS projectId,
        i.user_id  AS userId
      FROM images i
      INNER JOIN projects p ON i.project_id = p.id
      INNER JOIN users u ON i.user_id = u.id
      WHERE i.project_id = ? AND i.user_id = ?`;

    const images = await this.executeQuery(sqlQuery, [projectId, userId]);

    return images;
  }

  public async create(image: Image) {
    const sqlQuery = `
      INSERT INTO images (id, file_path, image_type, is_selected, project_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await this.executeQuery(sqlQuery, [
      image.id,
      image.filePath,
      image.imageType,
      image.isSelected,
      image.projectId,
      image.userId,
    ]);

    return { id: image.id, url: image.filePath, type: image.imageType };
  }

  // public async get(projectId: string, imageId: string, userId: string) {
  //   const sqlQuery = `
  //     SELECT id FROM images WHERE id = ? AND project_id = ? AND user_id = ? AND image_type = 'Default'`;

  //   const result = await this.executeQuery<Image>(sqlQuery, [imageId, projectId, userId]);

  //   return result.length > 0 ? result[0] : null; // Return null if no result found
  // }

  public async update(imageId: string, status: boolean) {
    const sqlQuery = `
      UPDATE images SET is_selected = ? WHERE id = ?`;

    const [result] = await this.executeQuery(sqlQuery, [status, imageId]);

    return result;
  }

  public async delete(imageId: string) {
    const sqlQuery = `
      DELETE FROM images WHERE id = ? AND image_type = 'Default'`;

    const [result] = await this.executeQuery(sqlQuery, [imageId]);

    return result;
  }

  async get(imageId: string): Promise<Image | undefined> {
    const sqlQuery = "SELECT * FROM images WHERE id = ?";
    const result = await this.executeQuery<Image>(sqlQuery, [imageId]);

    if (result.length > 0) {
      const image = result[0];
      return { ...image, filePath: image.filePath } as Image;
    }

    return undefined;
  }
}
