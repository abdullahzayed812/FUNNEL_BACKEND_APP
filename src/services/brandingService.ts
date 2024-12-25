import { AppError, ERRORS } from "../configs/error";
import { BrandingModel } from "../models/brandingModel";
import { ProjectModel } from "../models/projectModel";

export class BrandingService {
  private brandingModel: BrandingModel;
  private projectModel: ProjectModel;

  constructor(brandingModel: BrandingModel, projectModel: ProjectModel) {
    this.brandingModel = brandingModel;
    this.projectModel = projectModel;
  }

  public async getBranding(projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.getProjectById(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.brandingModel.getBranding(projectId, userId, userId);
  }
}
