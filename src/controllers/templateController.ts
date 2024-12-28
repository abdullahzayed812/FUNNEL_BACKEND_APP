import { AppError } from "../configs/error";
import { TemplateService } from "../services/templateService";
import { ExpressHandler } from "../types/apis";

export class TemplateController {
  private templateService: TemplateService;

  constructor(templateService: TemplateService) {
    this.templateService = templateService;
  }

  listTemplatesController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const templates = await this.templateService.listTemplates(id, res.locals.userId, res.locals.role);

      res.status(200).send({ templates });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };

  listCustomizedTemplatesController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const customizedTemplates = await this.templateService.listCustomizedTemplates(
        id,
        res.locals.userId,
        res.locals.role
      );

      res.status(200).send({ customizedTemplates });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };

  createTemplateController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { template } = req.body;

      console.log(template);

      const isCreated = await this.templateService.createTemplate(template, id, res.locals.userId, res.locals.role);

      res.status(201).send(isCreated);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error: " + error });
      }
    }
  };
}
