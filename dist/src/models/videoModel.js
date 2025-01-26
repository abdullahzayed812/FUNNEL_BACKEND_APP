import { BaseModel } from "./baseModel";
export class VideoModel extends BaseModel {
    pool;
    constructor(pool) {
        super(pool);
        this.pool = pool;
    }
    async list(projectId, userId) {
        const sqlQuery = `
      SELECT
        v.id AS id,
        v.file_path AS url,
        v.video_type AS type,
        CASE
          WHEN ui.user_id = ? THEN ui.is_selected
          ELSE FALSE
        END AS isSelected
      FROM videos v
      LEFT JOIN user_videos ui ON v.id = ui.video_id
      WHERE v.project_id = ?
        AND (v.video_type = 'Default' OR (v.video_type = 'Customized' AND v.user_id = ?))
    `;
        return await this.executeQuery(sqlQuery, [userId, projectId, userId]);
    }
    async create(video, userId, projectId) {
        const sqlQuery = `
      INSERT INTO videos (id, file_path, video_type, project_id, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;
        return await this.executeQuery(sqlQuery, [video.id, video.filePath, video.imageType, projectId, userId]);
    }
    async update(videoId, status) {
        const sqlQuery = `
      UPDATE user_videos ui
      SET is_selected = ?
      WHERE ui.video_id = ?
    `;
        return await this.executeQuery(sqlQuery, [status, videoId]);
    }
    async delete(videoId) {
        const sqlQueryDeleteFromVideos = `
      DELETE FROM videos WHERE id = ? AND video_type = 'Customized'
    `;
        return await this.executeQuery(sqlQueryDeleteFromVideos, [videoId]);
    }
    async getById(videoId) {
        const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        video_type AS type
      FROM videos WHERE id = ?
    `;
        const videos = await this.executeQuery(sqlQuery, [videoId]);
        return videos[0];
    }
    async getByUserId(videoId, userId) {
        const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        video_type AS type
      FROM videos WHERE id = ? AND user_id = ?
    `;
        const videos = await this.executeQuery(sqlQuery, [videoId, userId]);
        return videos[0];
    }
    async checkUserVideo(videoId, userId) {
        const sqlQuery = `
      SELECT video_id AS id FROM user_videos WHERE video_id = ? AND user_id = ?
    `;
        const videos = await this.executeQuery(sqlQuery, [videoId, userId]);
        return videos[0];
    }
    async addUserVideo(videoId, userId, status) {
        const sqlQuery = `
      INSERT INTO user_videos (user_id, video_id, is_selected)
      VALUES (?,?,?)
    `;
        return await this.executeQuery(sqlQuery, [userId, videoId, status]);
    }
}
