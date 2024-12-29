import { NextFunction } from "express";
import { AppError, ERRORS } from "../configs/error";
import { ImageModel } from "../models/imageModel";
import { Image } from "../types/entities";
import { randomUUID } from "crypto";

export class UploadFileService {
  private imageModel: ImageModel;

  constructor(imageModel: ImageModel) {
    this.imageModel = imageModel;
  }

  public async uploadFile(
    error: any,
    projectId: string,
    userId: string,
    userRole: string,
    file: Express.Multer.File | undefined,
    next: NextFunction
  ) {
    if (error) {
      return next(error);
    }

    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    if (!file) {
      throw new AppError(ERRORS.NO_FILE_UPLOADED, 400);
    }

    try {
    } catch (error: any) {
      throw new AppError(error.message, error.statusCode);
    }

    const image: Image = {
      id: randomUUID(),
      filePath: `http://localhost:3000/uploads/${file.filename}`,
      imageType: userRole === "Admin" ? "Default" : "Customized",
      isSelected: false,
      projectId,
      userId,
    };

    return await this.imageModel.create(image);
  }
}
