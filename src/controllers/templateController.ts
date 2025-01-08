import { AppError, ERRORS } from "../configs/error";
import { TemplateModel } from "../models/templateModel";
import { ExpressHandler } from "../types/apis";

export class TemplateController {
  private templateModel: TemplateModel;

  constructor(templateModel: TemplateModel) {
    this.templateModel = templateModel;
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

  listDefaultTemplates: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;

    try {
      const templates = await this.templateModel.listDefault(res.locals.userId, projectId);

      this.handleSuccess(res, { templates });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  listCustomizedTemplates: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;

      const customizedTemplates = await this.templateModel.listCustomized(projectId, res.locals.userId);

      this.handleSuccess(res, { customizedTemplates });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  createTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { template } = req.body;

      const isCreated = await this.templateModel.create(template, projectId, res.locals.userId, res.locals.role);

      this.handleSuccess(res, isCreated);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  updateTemplateSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId, status } = req.body;

      const templateExistsForUser = await this.templateModel.getFromUserTemplates(
        projectId,
        templateId,
        res.locals.userId
      );
      const templateExistsInTemplates = await this.templateModel.getFromTemplates(templateId);

      if (templateExistsForUser?.id) {
        const result = await this.templateModel.update(templateId, status);
        this.handleSuccess(res, result);
      } else if (templateExistsInTemplates?.id) {
        const result = await this.templateModel.insertUserTemplate(res.locals.userId, templateId, projectId, status);
        this.handleSuccess(res, result);
      } else {
        this.handleError(res, { error: "Template not found." });
      }
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  deleteTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId } = req.body;

      const templateExists = await this.templateModel.getFromUserTemplates(projectId, templateId, res.locals.userId);

      if (!templateExists?.id) {
        this.handleError(res, { error: "Template not found." }, 400);
      }

      const result = await this.templateModel.delete(templateId);

      this.handleSuccess(res, result);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };
}
