import { AppError, ERRORS } from "../configs/error";
import { ImageModel } from "../models/imageModel";
import { ProjectModel } from "../models/projectModel";

export class ImageService {
  private imageModel: ImageModel;
  private projectModel: ProjectModel;

  constructor(imageModel: ImageModel, projectModel: ProjectModel) {
    this.imageModel = imageModel;
    this.projectModel = projectModel;
  }

  public async listImages(projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.imageModel.list(projectId, userId, userId);
  }

  public async updateImage(projectId: string, imageId: string, status: boolean, userId: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }
    if (!imageId) {
      throw new AppError(ERRORS.IMAGE_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.get(projectId);
    const imageExists = await this.imageModel.get(projectId, imageId, userId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }
    if (!imageExists) {
      throw new AppError(ERRORS.IMAGE_NOT_FOUND, 400);
    }

    return await this.imageModel.update(imageId, status);
  }

  public async deleteImage(projectId: string, imageId: string, userId: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }
    if (!imageId) {
      throw new AppError(ERRORS.IMAGE_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.get(projectId);
    const imageExists = await this.imageModel.get(projectId, imageId, userId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }
    if (!imageExists) {
      throw new AppError(ERRORS.IMAGE_NOT_FOUND, 400);
    }

    return await this.imageModel.delete(imageId);
  }
}
