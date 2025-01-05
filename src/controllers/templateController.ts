import { AppError, ERRORS } from "../configs/error";
import { TemplateModel } from "../models/templateModel";
import { ExpressHandler } from "../types/apis";

export class TemplateController {
  private templateModel: TemplateModel;

  constructor(templateModel: TemplateModel) {
    this.templateModel = templateModel;
  }

  listDefaultTemplates: ExpressHandler = async (req, res) => {
    try {
      const templates = await this.templateModel.listDefault();

      res.status(200).send({ templates });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error: " + error.message });
      }
    }
  };

  listCustomizedTemplates: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;

      const customizedTemplates = await this.templateModel.listCustomized(projectId, res.locals.userId);

      res.status(200).send({ customizedTemplates });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error: " + error.message });
      }
    }
  };

  createTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { template } = req.body;

      const isCreated = await this.templateModel.create(template, projectId, res.locals.userId);

      res.status(201).send(isCreated);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error: " + error.message });
      }
    }
  };

  updateTemplateSelection: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId, status } = req.body;

      const templateExists = await this.templateModel.get(projectId, templateId, res.locals.userId);

      if (!templateExists) {
        res.status(400).send({ error: "Template id is required." });
      }

      const result = await this.templateModel.update(templateId, status);

      res.send(200).send(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };

  deleteTemplate: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { templateId } = req.body;

      const templateExists = await this.templateModel.get(projectId, templateId, res.locals.userId);

      if (!templateExists) {
        res.status(400).send("Template id is required.");
      }

      const result = await this.templateModel.delete(templateId);

      res.send(200).send(result);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error: " + error.message });
      }
    }
  };
}
