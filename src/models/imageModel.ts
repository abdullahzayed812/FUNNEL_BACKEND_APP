import { Pool, QueryResult } from "mysql2/promise";
import { Image } from "../types/entities";
import { AppError } from "../configs/error";
import { BaseModel } from "./baseModel";

export class ImageModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
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

    try {
      const images = await this.executeQuery(sqlQuery, [projectId, userId]);

      return images;
    } catch (error: any) {
      return new AppError(error);
    }
  }

  public async create(image: Image) {
    const sqlQuery = `
      INSERT INTO images (id, file_path, image_type, is_selected, project_id, user_id)
      VALUES (?, ?, ?, ?, ?, ?)`;

    const [result] = await this.executeQuery<QueryResult>(sqlQuery, [
      image.id,
      image.filePath,
      image.imageType,
      image.isSelected,
      image.projectId,
      image.userId,
    ]);

    return { id: image.id, url: image.filePath, type: image.imageType };
  }

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
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        image_type AS imageType,
        is_selected AS isSelected
      FROM images WHERE id = ?
    `;
    const result = await this.executeQuery<Image>(sqlQuery, [imageId]);

    if (result.length > 0) {
      const image = result[0];
      return image as Image;
    }

    return undefined;
  }
}
