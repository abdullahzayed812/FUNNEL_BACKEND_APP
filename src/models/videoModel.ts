import { Pool } from "mysql2/promise";
import { Video } from "../types/entities";
import { BaseModel } from "./baseModel";

export class VideoModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

  public async list(projectId: string, userId: string) {
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

    return await this.executeQuery<Video>(sqlQuery, [userId, projectId, userId]);
  }

  public async create(video: Video, userId: string, projectId: string) {
    const sqlQuery = `
      INSERT INTO videos (id, file_path, video_type, project_id, user_id)
      VALUES (?, ?, ?, ?, ?)
    `;

    return await this.executeQuery(sqlQuery, [video.id, video.filePath, video.imageType, projectId, userId]);
  }

  public async update(videoId: string, status: boolean) {
    const sqlQuery = `
      UPDATE user_videos ui
      SET is_selected = ?
      WHERE ui.video_id = ?
    `;

    return await this.executeQuery(sqlQuery, [status, videoId]);
  }

  public async delete(videoId: string) {
    const sqlQueryDeleteFromVideos = `
      DELETE FROM videos WHERE id = ? AND video_type = 'Customized'
    `;

    return await this.executeQuery(sqlQueryDeleteFromVideos, [videoId]);
  }

  public async getById(videoId: string): Promise<Video | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        video_type AS type
      FROM videos WHERE id = ?
    `;
    const videos = await this.executeQuery<Video>(sqlQuery, [videoId]);

    return videos[0];
  }

  public async getByUserId(videoId: string, userId: string): Promise<Video | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        video_type AS type
      FROM videos WHERE id = ? AND user_id = ?
    `;
    const videos = await this.executeQuery<Video>(sqlQuery, [videoId, userId]);

    return videos[0];
  }

  public async checkUserVideo(videoId: string, userId: string) {
    const sqlQuery = `
      SELECT video_id AS id FROM user_videos WHERE video_id = ? AND user_id = ?
    `;

    const videos = await this.executeQuery<{ id: string }>(sqlQuery, [videoId, userId]);

    return videos[0];
  }

  public async addUserVideo(videoId: string, userId: string, status: boolean) {
    const sqlQuery = `
      INSERT INTO user_videos (user_id, video_id, is_selected)
      VALUES (?,?,?)
    `;

    return await this.executeQuery(sqlQuery, [userId, videoId, status]);
  }
}
