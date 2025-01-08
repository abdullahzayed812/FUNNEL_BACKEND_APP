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
    // const sqlQueryImages = `
    //   SELECT
    //     i.id AS id,
    //     i.file_path AS url,
    //     i.image_type AS imageType,
    //     CASE
    //       WHEN ui.user_id = ? AND ui.project_id = ? THEN ui.is_selected
    //       ELSE NULL
    //     END AS isSelected
    //   FROM images i
    //   LEFT JOIN user_images ui ON i.id = ui.image_id
    //   WHERE i.project_id = ?
    // `;

    const sqlQueryImages = `
      SELECT 
        i.id AS id,
        i.file_path AS url,
        i.image_type AS imageType,
        CASE
            WHEN ui.user_id = ? AND ui.project_id = ? THEN ui.is_selected
            ELSE NULL
        END AS isSelected
      FROM 
          images i
      LEFT JOIN 
          user_images ui ON i.id = ui.image_id AND ui.project_id = ?
      WHERE 
          i.project_id = ? AND (i.image_type = 'Default' OR (ui.user_id = ? AND ui.project_id = ?));
    `;

    const images = await this.executeQuery<Image>(sqlQueryImages, [
      userId,
      projectId,
      projectId,
      projectId,
      userId,
      projectId,
    ]);

    return images;
  }

  public async create(image: Image, userId: string, userRole: string, projectId: string) {
    const sqlQuery = `
      INSERT INTO images (id, file_path, image_type, project_id)
      VALUES (?, ?, ?, ?)`;

    const result = await this.executeQuery<{ affectedRows: number }>(sqlQuery, [
      image.id,
      image.filePath,
      image.imageType,
      projectId,
    ]);

    if (userRole !== "Admin") {
      await this.insertUserImage(image.id, userId, projectId, false);
    }

    return result;
  }

  public async update(imageId: string, status: boolean) {
    const sqlQuery = `
      UPDATE user_images
      SET is_selected = ? 
      WHERE image_id = ?
    `;

    const result = await this.executeQuery(sqlQuery, [status, imageId]);

    return result;
  }

  public async delete(imageId: string) {
    const sqlQueryDeleteFromImages = `
      DELETE FROM images WHERE id = ? AND image_type = 'Customized'
    `;

    const sqlQueryDeleteFromUserImages = `
      DELETE FROM user_images WHERE image_id = ?
    `;

    const result1 = await this.executeQuery(sqlQueryDeleteFromImages, [imageId]);
    const result2 = await this.executeQuery(sqlQueryDeleteFromUserImages, [imageId]);

    return { result1, result2 };
  }

  async getFromImages(imageId: string): Promise<Image | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        image_type AS imageType
      FROM images WHERE id = ?
    `;
    const images = await this.executeQuery<Image>(sqlQuery, [imageId]);

    if (images?.length > 0) {
      return images[0];
    }

    return undefined;
  }

  async getFromUserImages(imageId: string, userId: string, projectId: string) {
    const sqlQuery = `
      SELECT image_id AS id, file_path AS filePath
      FROM user_images ui
      INNER JOIN images i ON i.id = ui.image_id
      WHERE ui.image_id = ?
        AND ui.project_id = ?
        AND ui.user_id = ? 
    `;

    const images = await this.executeQuery<Image>(sqlQuery, [imageId, projectId, userId]);

    if (images?.length > 0) {
      return images[0];
    }

    return undefined;
  }

  public async insertUserImage(imageId: string, userId: string, projectId: string, status: boolean) {
    const sqlQuery = `
      INSERT INTO user_images (user_id, image_id, project_id, is_selected)
      VALUES (?,?,?,?)
    `;

    const result = await this.executeQuery(sqlQuery, [userId, imageId, projectId, status]);

    return result;
  }
}
