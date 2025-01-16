import { ExpressHandler } from "../types/apis";
import { GeneratedVisualsModel } from "../models/generatedVisualsModle";
import { ResponseHandler } from "../helpers/responseHandler";

export class GeneratedVisualsController {
  private generatedVisualsModel: GeneratedVisualsModel;

  constructor(generatedVisualsModel: GeneratedVisualsModel) {
    this.generatedVisualsModel = generatedVisualsModel;
  }

  public getGeneratedVisuals: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = res.locals.userId;

      const images = await this.generatedVisualsModel.getSelectedImages(userId, projectId);
      const videos = await this.generatedVisualsModel.getSelectedVideos(userId, projectId);
      const templates = await this.generatedVisualsModel.getSelectedTemplates(userId, projectId);

      ResponseHandler.handleSuccess(res, { generatedContent: { templates, images, videos } });
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };
}
