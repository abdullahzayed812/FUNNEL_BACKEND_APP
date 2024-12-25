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
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    const projectExists = await this.projectModel.getProjectById(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.imageModel.listImages(projectId, userId, userId);
  }
}
