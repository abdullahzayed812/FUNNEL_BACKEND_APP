import { Pool } from "mysql2/promise";
import { Image } from "../types/entities";

export class ImageModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async listImages(projectId: string, userId: string, userRole: string) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
        SELECT 
          i.id AS image_id,
          i.file_path,
          i.image_type,
          i.is_selected,
          i.project_id,
          i.user_id
        FROM images i
        INNER JOIN projects p ON i.project_id = p.id
        INNER JOIN users u ON i.user_id = u.id
        WHERE i.project_id = ?
          AND i.user_id = ?
      `;

      const [images] = await connection.query(sqlQuery, [projectId, userId]);

      return images;
    } finally {
      connection.release();
    }
  }

  public async createImage(image: Image) {
    const connection = await this.pool.getConnection();

    try {
      const sqlQuery = `
        INSERT INTO 
          images (id, file_path, image_type, is_selected, project_id, user_id)
          VALUES (?, ?, ?, ?, ?, ?)
      `;

      const result = await connection.query(sqlQuery, [
        image.id,
        image.filePath,
        image.imageType,
        image.isSelected,
        image.projectId,
        image.userId,
      ]);

      return result;
    } finally {
      connection.release();
    }
  }
}
