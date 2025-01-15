import { Pool } from "mysql2/promise";
import { Image } from "../types/entities";
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
        i.image_type AS type,
        CASE
          WHEN ui.user_id = ? THEN ui.is_selected
          ELSE FALSE
        END AS isSelected
      FROM images i
      LEFT JOIN user_images ui ON i.id = ui.image_id
      WHERE i.project_id = ?
        AND (i.image_type = 'Default' OR (i.image_type = 'Customized' AND i.user_id = ?))
    `;

    return await this.executeQuery<Image>(sqlQuery, [userId, projectId, userId]);
  }

  public async create(image: Image, userId: string, projectId: string) {
    const sqlQuery = `
      INSERT INTO images (id, file_path, image_type, project_id, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    return await this.executeQuery(sqlQuery, [image.id, image.filePath, image.imageType, projectId, userId]);
  }

  public async update(imageId: string, status: boolean) {
    const sqlQuery = `
      UPDATE user_images ui
      SET is_selected = ?
      WHERE ui.image_id = ?
    `;

    return await this.executeQuery(sqlQuery, [status, imageId]);
  }

  public async delete(imageId: string) {
    const sqlQueryDeleteFromImages = `
      DELETE FROM images WHERE id = ? AND image_type = 'Customized'
    `;

    return await this.executeQuery(sqlQueryDeleteFromImages, [imageId]);
  }

  public async getById(imageId: string): Promise<Image | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        image_type AS imageType
      FROM images WHERE id = ?
    `;
    const images = await this.executeQuery<Image>(sqlQuery, [imageId]);

    return images[0];
  }

  public async getByUserId(imageId: string, userId: string): Promise<Image | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        image_type AS imageType
      FROM images WHERE id = ? AND user_id = ?
    `;
    const images = await this.executeQuery<Image>(sqlQuery, [imageId, userId]);

    return images[0];
  }

  public async checkUserImage(imageId: string, userId: string) {
    const sqlQuery = `
      SELECT image_id AS id FROM user_images WHERE image_id = ? AND user_id = ?
    `;

    const images = await this.executeQuery<{ id: string }>(sqlQuery, [imageId, userId]);

    return images[0];
  }

  public async addUserImage(imageId: string, userId: string, status: boolean) {
    const sqlQuery = `
      INSERT INTO user_images (user_id, image_id, is_selected)
      VALUES (?,?,?)
    `;

    return await this.executeQuery(sqlQuery, [userId, imageId, status]);
  }
}
