import { TemplateModel } from "../models/templateModel";
import { ExpressHandler } from "../types/apis";
import { Template } from "../types/entities";

export class TemplateController {
  private templateModel: TemplateModel;

  constructor(templateModel: TemplateModel) {
    this.templateModel = templateModel;
  }

  private handleError(res: any, error: any, statusCode: number = 500): void {
    console.log(error);
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
      const { userId, role: userRole } = res.locals;

      let customizedTemplates;
      if (userRole === "Admin") {
        customizedTemplates = await this.templateModel.listBranded(projectId, userId);
      } else {
        customizedTemplates = await this.templateModel.listCustomized(projectId, userId);
      }

      this.handleSuccess(res, { customizedTemplates });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  createTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { template } = req.body;
      const { userId, role } = res.locals;

      const isCreated = await this.templateModel.create(template, projectId, userId, role);

      this.handleSuccess(res, isCreated);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  updateTemplateSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId, status } = req.body;
      const { userId } = res.locals;

      const userTemplate = await this.templateModel.checkUserTemplate(templateId, userId);
      if (userTemplate?.id) {
        const result = await this.templateModel.update(templateId, status);
        return this.handleSuccess(res, result, 200);
      }

      const result = await this.templateModel.addUserTemplate(templateId, userId, status);
      return this.handleSuccess(res, result, 200);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  deleteTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId } = req.body;
      const { userId } = res.locals;

      const templateExists = await this.templateModel.getByUserId(userId);

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
