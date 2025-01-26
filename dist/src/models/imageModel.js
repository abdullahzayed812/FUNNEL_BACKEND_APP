import { BaseModel } from "./baseModel";
export class ImageModel extends BaseModel {
    pool;
    constructor(pool) {
        super(pool);
        this.pool = pool;
    }
    async list(projectId, userId) {
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
        return await this.executeQuery(sqlQuery, [userId, projectId, userId]);
    }
    async create(image, userId, projectId) {
        const sqlQuery = `
      INSERT INTO images (id, file_path, image_type, project_id, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
        return await this.executeQuery(sqlQuery, [image.id, image.filePath, image.imageType, projectId, userId]);
    }
    async update(imageId, status) {
        const sqlQuery = `
      UPDATE user_images ui
      SET is_selected = ?
      WHERE ui.image_id = ?
    `;
        return await this.executeQuery(sqlQuery, [status, imageId]);
    }
    async delete(imageId) {
        const sqlQueryDeleteFromImages = `
      DELETE FROM images WHERE id = ? AND image_type = 'Customized'
    `;
        return await this.executeQuery(sqlQueryDeleteFromImages, [imageId]);
    }
    async getById(imageId) {
        const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        image_type AS imageType
      FROM images WHERE id = ?
    `;
        const images = await this.executeQuery(sqlQuery, [imageId]);
        return images[0];
    }
    async getByUserId(imageId, userId) {
        const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        image_type AS imageType
      FROM images WHERE id = ? AND user_id = ?
    `;
        const images = await this.executeQuery(sqlQuery, [imageId, userId]);
        return images[0];
    }
    async checkUserImage(imageId, userId) {
        const sqlQuery = `
      SELECT image_id AS id FROM user_images WHERE image_id = ? AND user_id = ?
    `;
        const images = await this.executeQuery(sqlQuery, [imageId, userId]);
        return images[0];
    }
    async addUserImage(imageId, userId, status) {
        const sqlQuery = `
      INSERT INTO user_images (user_id, image_id, is_selected)
      VALUES (?,?,?)
    `;
        return await this.executeQuery(sqlQuery, [userId, imageId, status]);
    }
}
