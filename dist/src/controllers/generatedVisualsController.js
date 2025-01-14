import { ResponseHandler } from "../helpers/responseHandler";
export class GeneratedVisualsController {
    generatedVisualsModel;
    constructor(generatedVisualsModel) {
        this.generatedVisualsModel = generatedVisualsModel;
    }
    getGeneratedVisuals = async (req, res) => {
        try {
            const { projectId } = req.params;
            const userId = res.locals.userId;
            const images = await this.generatedVisualsModel.getSelectedImages(userId, projectId);
            const templates = await this.generatedVisualsModel.getSelectedTemplates(userId, projectId);
            ResponseHandler.handleSuccess(res, { generatedContent: { templates, images } });
        }
        catch (error) {
            ResponseHandler.handleError(res, error.message);
        }
    };
}
