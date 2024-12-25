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
          i.id AS id,
          i.file_path AS url,
          i.image_type AS imageType,
          i.is_selected AS isSelected,
          i.project_id AS projectId,
          i.user_id  AS userId
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

      const [result] = await connection.query(sqlQuery, [
        image.id,
        image.filePath,
        image.imageType,
        image.isSelected,
        image.projectId,
        image.userId,
      ]);

      return { id: image.id, url: image.filePath, type: image.imageType };
    } finally {
      connection.release();
    }
  }
}
