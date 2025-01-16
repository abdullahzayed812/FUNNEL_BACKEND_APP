import { randomUUID } from "crypto";
import { ERRORS } from "../configs/error";
import { upload } from "../helpers/uploadFile";
import { ExpressHandler } from "../types/apis";
import { Image } from "../types/entities";
import path from "node:path";
import fs from "node:fs/promises";
import { ResponseHandler } from "../helpers/responseHandler";
import { VideoModel } from "../models/videoModel";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(decodeURIComponent(__filename)); // Decode the URL for cross-platform compatibility

export class VideoController {
  private videoModel: VideoModel;

  constructor(videoModel: VideoModel) {
    this.videoModel = videoModel;
  }

  public listVideos: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;

      const videos = await this.videoModel.list(projectId, res.locals.userId);

      ResponseHandler.handleSuccess(res, { videos });
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  public updateVideoSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { videoId, status } = req.body;
      const userId = res.locals.userId;

      const userVideo = await this.videoModel.checkUserVideo(videoId, userId);
      if (userVideo?.id) {
        const result = await this.videoModel.update(videoId, status);
        return ResponseHandler.handleSuccess(res, result, 200);
      }

      const result = await this.videoModel.addUserVideo(videoId, userId, status);
      return ResponseHandler.handleSuccess(res, result, 200);
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  deleteVideo: ExpressHandler = async (req, res) => {
    try {
      const { imageId: videoId } = req.body;
      const { userId } = res.locals;

      const userVideo = await this.videoModel.getByUserId(videoId, userId);

      if (!userVideo?.id) {
        return ResponseHandler.handleError(res, "Video not found", 404);
      }

      const filePath = path.join(__dirname.slice(1), "..", userVideo.filePath);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting file:", err);
        return res.status(500).send({ error: "Error deleting file from server" });
      }

      try {
        const result = await this.videoModel.delete(videoId);
        ResponseHandler.handleSuccess(res, result, 200);
      } catch (error: any) {
        ResponseHandler.handleError(res, error.message);
      }
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  public uploadVideo: ExpressHandler = async (req, res, next) => {
    const { projectId } = req.params;

    const userRole = res.locals.role;
    const userId = res.locals.userId;

    upload(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      const files = (req.files as { videos: Express.Multer.File[] })?.videos; // Access the 'videos' field

      if (!files || files.length === 0) {
        return ResponseHandler.handleError(res, ERRORS.NO_FILE_UPLOADED, 400);
      }

      try {
        const videoRecords = await Promise.all(
          files?.map(async (file: any) => {
            const video: Image = {
              id: randomUUID(),
              filePath: file.filename,
              imageType: userRole === "Admin" ? "Default" : "Customized",
            };
            return this.videoModel.create(video, userId, projectId);
          })
        );

        ResponseHandler.handleSuccess(res, videoRecords, 201);
      } catch (error: any) {
        ResponseHandler.handleError(res, error.message);
      }
    });
  };
}
