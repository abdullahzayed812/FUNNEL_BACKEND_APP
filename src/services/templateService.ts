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

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.templateModel.listOriginal(projectId, userId, userRole);
  }

  public async listCustomizedTemplates(projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.templateModel.listCustomized(projectId, userId, userRole);
  }

  public async createTemplate(template: Template, projectId: string, userId: string, userRole: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }

    return await this.templateModel.create(template, projectId, userId, userRole);
  }

  public async updateTemplate(projectId: string, templateId: string, status: boolean, userId: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }
    if (!templateId) {
      throw new AppError(ERRORS.IMAGE_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.get(projectId);
    const templateExists = await this.templateModel.get(projectId, templateId, userId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }
    if (!templateExists) {
      throw new AppError(ERRORS.IMAGE_NOT_FOUND, 400);
    }

    return await this.templateModel.update(templateId, status);
  }

  public async deleteTemplate(projectId: string, templateId: string, userId: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT, 400);
    }
    if (!templateId) {
      throw new AppError(ERRORS.IMAGE_ID_NOT_SENT, 400);
    }

    const projectExists = await this.projectModel.get(projectId);
    const templateExists = await this.templateModel.get(projectId, templateId, userId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND, 400);
    }
    if (!templateExists) {
      throw new AppError(ERRORS.IMAGE_NOT_FOUND, 400);
    }

    return await this.templateModel.delete(templateId);
  }
}
