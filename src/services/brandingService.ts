import { AppError, ERRORS } from "../configs/error";
import { BrandingModel } from "../models/brandingModel";
import { ProjectModel } from "../models/projectModel";
import { Branding } from "../types/entities";

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

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.brandingModel.get(projectId, userId, userId);
  }

  public async updateBranding(branding: Branding, projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    if (Object.entries(branding).some(([key, value]) => !value)) {
      throw new AppError("No Data Received", 400);
    }

    return await this.brandingModel.update(branding, projectId, userId, userId);
  }
}
