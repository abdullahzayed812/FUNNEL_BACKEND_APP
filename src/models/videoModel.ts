import { Pool } from "pg"; // Import PostgreSQL Pool
import { Video } from "../types/entities"; // Your Video entity
import { BaseModel } from "./baseModel"; // Assuming BaseModel contains shared logic

export class VideoModel extends BaseModel {
  protected pool: Pool;

  constructor(pool: Pool) {
    super(pool);
    this.pool = pool;
  }

  // List videos for a project and user
  public async list(projectId: string, userId: string) {
    const sqlQuery = `
      SELECT
        v.id AS id,
        v.file_path AS url,
        v.video_type AS type,
        CASE
          WHEN ui.user_id = $1 THEN ui.is_selected
          ELSE FALSE
        END AS isSelected
      FROM videos v
      LEFT JOIN user_videos ui ON v.id = ui.video_id
      WHERE v.project_id = $2
        AND (v.video_type = 'Default' OR (v.video_type = 'Customized' AND v.user_id = $3))
    `;

    const result = await this.executeQuery(sqlQuery, [userId, projectId, userId]);
    return result; // Return rows from PostgreSQL result
  }

  // Create a new video
  public async create(video: Video, userId: string, projectId: string) {
    const sqlQuery = `
      INSERT INTO videos (id, file_path, video_type, project_id, user_id)
      VALUES ($1, $2, $3, $4, $5)
    `;

    return await this.executeQuery(sqlQuery, [video.id, video.filePath, video.videoType, projectId, userId]);
  }

  // Update the selection status of a video for a user
  public async update(videoId: string, status: boolean) {
    const sqlQuery = `
      UPDATE user_videos ui
      SET is_selected = $1
      WHERE ui.video_id = $2
    `;

    return await this.executeQuery(sqlQuery, [status, videoId]);
  }

  // Delete a customized video
  public async delete(videoId: string) {
    const sqlQueryDeleteFromVideos = `
      DELETE FROM videos WHERE id = $1 AND video_type = 'Customized'
    `;

    return await this.executeQuery(sqlQueryDeleteFromVideos, [videoId]);
  }

  // Get video by ID
  public async getById(videoId: string): Promise<Video | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        video_type AS type
      FROM videos WHERE id = $1
    `;

    const result = await this.executeQuery<Video>(sqlQuery, [videoId]);
    return result[0]; // Return first row if exists
  }

  // Get video by ID and User ID
  public async getByUserId(videoId: string, userId: string): Promise<Video | undefined> {
    const sqlQuery = `
      SELECT
        id,
        file_path AS filePath,
        video_type AS type
      FROM videos WHERE id = $1 AND user_id = $2
    `;

    const result = await this.executeQuery<Video>(sqlQuery, [videoId, userId]);
    return result[0]; // Return first row if exists
  }

  // Check if a video exists for a user
  public async checkUserVideo(videoId: string, userId: string) {
    const sqlQuery = `
      SELECT video_id AS id FROM user_videos WHERE video_id = $1 AND user_id = $2
    `;

    const result = await this.executeQuery<{ id: string }>(sqlQuery, [videoId, userId]);
    return result[0]; // Return the first row if exists
  }

  // Add a video for a user
  public async addUserVideo(videoId: string, userId: string, status: boolean) {
    const sqlQuery = `
      INSERT INTO user_videos (user_id, video_id, is_selected)
      VALUES ($1, $2, $3)
    `;

    return await this.executeQuery(sqlQuery, [userId, videoId, status]);
  }
}
