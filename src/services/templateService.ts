import { AppError, ERRORS } from "../configs/error";
import { ProjectModel } from "../models/projectModel";
import { TemplateModel } from "../models/templateModel";
import { Template } from "../types/entities";

export class TemplateService {
  private templateModel: TemplateModel;
  private projectModel: ProjectModel;

  constructor(templateModel: TemplateModel, projectModel: ProjectModel) {
    this.templateModel = templateModel;
    this.projectModel = projectModel;
  }

  public async listTemplates(projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    const projectExists = await this.projectModel.getProjectById(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.templateModel.listOriginal(projectId, userId, userRole);
  }

  public async listCustomizedTemplates(projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    const projectExists = await this.projectModel.getProjectById(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.templateModel.listCustomized(projectId, userId, userRole);
  }

  public async createTemplate(template: Template, projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    const projectExists = await this.projectModel.getProjectById(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.templateModel.create(template, projectId, userId, userRole);
  }
}
