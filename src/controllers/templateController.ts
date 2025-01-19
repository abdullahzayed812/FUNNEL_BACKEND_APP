import { ResponseHandler } from "../helpers/responseHandler";
import { TemplateModel } from "../models/templateModel";
import { ExpressHandler } from "../types/apis";

export class TemplateController {
  constructor(private templateModel: TemplateModel) {}

  listDefaultTemplates: ExpressHandler = async (req, res) => {
    const { userId, role: userRole, projectType } = res.locals;

    try {
      let defaultTemplates;
      if (userRole === "Admin") {
        defaultTemplates = await this.templateModel.listDefault(userId);
      } else {
        if (projectType === "Default") {
          defaultTemplates = await this.templateModel.listBranded(userId);
        } else {
          defaultTemplates = await this.templateModel.listDefault(userId);
        }
      }

      ResponseHandler.handleSuccess(res, { templates: defaultTemplates });
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  listCustomizedTemplates: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const { userId, role: userRole } = res.locals;

    try {
      let customizedTemplates;
      if (userRole === "Admin") {
        customizedTemplates = await this.templateModel.listBranded(userId);
      } else {
        customizedTemplates = await this.templateModel.listCustomized(projectId, userId);
      }

      ResponseHandler.handleSuccess(res, { customizedTemplates });
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  createTemplate: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const { template } = req.body;
    const { userId, role } = res.locals;

    try {
      const isCreated = await this.templateModel.create(template, projectId, userId, role);

      ResponseHandler.handleSuccess(res, isCreated);
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  createBulkTemplates: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const { templates } = req.body; // Array of templates
    const { userId, role: userRole } = res.locals;

    try {
      const result = await this.templateModel.createBulkTemplates(templates, projectId, userId, userRole);
      ResponseHandler.handleSuccess(res, result);
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  updateTemplateSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId, status } = req.body;
      const { userId } = res.locals;

      const userTemplate = await this.templateModel.checkUserTemplate(templateId, userId);
      if (userTemplate?.id) {
        const result = await this.templateModel.update(templateId, status, userId);
        return ResponseHandler.handleSuccess(res, result, 200);
      }

      const result = await this.templateModel.addUserTemplate(templateId, userId, status);
      return ResponseHandler.handleSuccess(res, result, 200);
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  deleteTemplate: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const { templateId } = req.body;
    const { userId } = res.locals;

    try {
      const templateExists = await this.templateModel.getByUserId(userId, projectId);

      if (!templateExists?.id) {
        return ResponseHandler.handleError(res, "Template not found.", 400);
      }

      const result = await this.templateModel.delete(templateId);

      ResponseHandler.handleSuccess(res, result);
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };
}
