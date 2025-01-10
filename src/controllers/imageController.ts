import { randomUUID } from "crypto";
import { ERRORS } from "../configs/error";
import { upload } from "../helpers/uploadFile";
import { ImageModel } from "../models/imageModel";
import { ExpressHandler } from "../types/apis";
import { Image } from "../types/entities";
import path from "node:path";
import fs from "node:fs/promises";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export class ImageController {
  private imageModel: ImageModel;

  constructor(imageModel: ImageModel) {
    this.imageModel = imageModel;
  }

  private handleError(res: any, error: any, statusCode: number = 500): void {
    if (error instanceof Error) {
      return res.status(statusCode).send({ error: error.message });
    } else {
      return res.status(statusCode).send({ error: "Internal Server Error" });
    }
  }

  private handleSuccess(res: any, data: any, statusCode: number = 200): void {
    return res.status(statusCode).send(data);
  }

  public listImages: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;

      const images = await this.imageModel.list(projectId, res.locals.userId);

      this.handleSuccess(res, { images });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  public updateImageSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { imageId, status } = req.body;
      const userId = res.locals.userId;

      const userImage = await this.imageModel.checkUserImage(imageId, userId);
      if (userImage?.id) {
        const result = await this.imageModel.update(imageId, status);
        return this.handleSuccess(res, result, 200);
      }

      const result = await this.imageModel.addUserImage(imageId, userId, status);
      return this.handleSuccess(res, result, 200);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  deleteImage: ExpressHandler = async (req, res) => {
    try {
      const { imageId } = req.body;
      const { projectId } = req.params;
      const { userId } = res.locals;

      const userImage = await this.imageModel.getByUserId(imageId, userId);

      if (!userImage?.id) {
        return this.handleError(res, { error: "Image not found" }, 404);
      }

      const filePath = path.join(__dirname, "..", userImage.filePath);

      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error("Error deleting file:", err);
        return res.status(500).send({ error: "Error deleting file from server" });
      }

      try {
        const result = await this.imageModel.delete(imageId);
        this.handleSuccess(res, result, 200);
      } catch (error: any) {
        this.handleError(res, error);
      }
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  public uploadImage: ExpressHandler = async (req, res, next) => {
    const { projectId } = req.params;

    const userRole = res.locals.role;
    const userId = res.locals.userId;

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      const file = req.file;

      if (!file) {
        return res.status(400).send(ERRORS.NO_FILE_UPLOADED);
      }

      const image: Image = {
        id: randomUUID(),
        filePath: path.join("uploads", file?.filename),
        imageType: userRole === "Admin" ? "Default" : "Customized",
      };

      try {
        const result = await this.imageModel.create(image, userId, projectId);
        this.handleSuccess(res, result, 201);
      } catch (error: any) {
        this.handleError(res, error);
      }
    });
  };
}
