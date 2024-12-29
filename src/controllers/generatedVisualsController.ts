import { AppError } from "../configs/error";
import { ExpressHandler } from "../types/apis";
import { GeneratedVisualsModel } from "../models/generatedVisualsModle";

export class GeneratedVisualsController {
  private generatedVisualsModel: GeneratedVisualsModel;

  constructor(generatedVisualsModel: GeneratedVisualsModel) {
    this.generatedVisualsModel = generatedVisualsModel;
  }

  getGeneratedVisuals: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;

      const images = await this.generatedVisualsModel.getSelectedImages(projectId, res.locals.userId);
      const templates = await this.generatedVisualsModel.getSelectedTemplates(projectId, res.locals.userId);

      res.status(200).send({ generatedContent: { templates, images } });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error: " + error });
      }
    }
  };
}
