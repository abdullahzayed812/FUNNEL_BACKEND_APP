import { ExpressHandler } from "../types/apis";
import { GeneratedVisualsModel } from "../models/generatedVisualsModle";

export class GeneratedVisualsController {
  private generatedVisualsModel: GeneratedVisualsModel;

  constructor(generatedVisualsModel: GeneratedVisualsModel) {
    this.generatedVisualsModel = generatedVisualsModel;
  }

  private handleError(res: any, error: any, statusCode: number = 500): void {
    console.error(error);

    res.status(statusCode).send({ error: "Internal Server Error" });
  }

  private handleSuccess(res: any, data: any, statusCode: number = 200): void {
    res.status(statusCode).send(data);
  }

  public getGeneratedVisuals: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = res.locals.userId;

      const images = await this.generatedVisualsModel.getSelectedImages(userId, projectId);
      const templates = await this.generatedVisualsModel.getSelectedTemplates(userId, projectId);

      this.handleSuccess(res, { generatedContent: { templates, images } });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };
}
