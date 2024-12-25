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

      const templates = await this.templateService.listTemplates(id, res.locals.userId, res.locals.userRole);

      res.status(200).send({ templates });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}
