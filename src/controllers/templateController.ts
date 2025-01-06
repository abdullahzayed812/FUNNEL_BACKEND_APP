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
      res.status(statusCode).send({ error: error.message });
    } else {
      res.status(statusCode).send({ error: "Internal Server Error" });
    }
  }

  private handleSuccess(res: any, data: any, statusCode: number = 200): void {
    res.status(statusCode).send(data);
  }

  listDefaultTemplates: ExpressHandler = async (req, res) => {
    try {
      const templates = await this.templateModel.listDefault();

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

      const isCreated = await this.templateModel.create(template, projectId, res.locals.userId);

      this.handleSuccess(res, isCreated);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  updateTemplateSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId, status } = req.body;

      const templateExists = await this.templateModel.get(projectId, templateId, res.locals.userId);

      if (!templateExists) {
        this.handleError(res, { error: "Template id is required." }, 400);
      }

      const result = await this.templateModel.update(templateId, status);

      this.handleSuccess(res, result);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  deleteTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId } = req.body;

      const templateExists = await this.templateModel.get(projectId, templateId, res.locals.userId);

      if (!templateExists) {
        this.handleError(res, { error: "Template id is required." }, 400);
      }

      const result = await this.templateModel.delete(templateId);

      this.handleSuccess(res, result);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };
}
