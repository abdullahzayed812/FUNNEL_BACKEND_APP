import { randomUUID } from "crypto";
import { ResponseHandler } from "../helpers/responseHandler";
export class BrandingController {
    brandingModel;
    constructor(brandingModel) {
        this.brandingModel = brandingModel;
    }
    getBranding = async (req, res) => {
        try {
            const { projectId } = req.params;
            const { userId } = res.locals;
            const userBranding = await this.brandingModel.getUserBranding(userId, projectId);
            if (userBranding?.id) {
                return ResponseHandler.handleSuccess(res, { branding: userBranding });
            }
            const defaultBranding = await this.brandingModel.getProjectBranding(projectId);
            return ResponseHandler.handleSuccess(res, { branding: defaultBranding });
        }
        catch (error) {
            return ResponseHandler.handleError(res, error.message);
        }
    };
    updateBranding = async (req, res) => {
        try {
            const { projectId } = req.params;
            const { branding } = req.body;
            const userId = res.locals.userId;
            const userRole = res.locals.role;
            if (userRole === "Admin") {
                const defaultBranding = await this.brandingModel.getProjectBranding(projectId);
                if (defaultBranding?.id) {
                    const updateResult = await this.brandingModel.updateDefaultBranding(branding);
                    return ResponseHandler.handleSuccess(res, updateResult);
                }
                else {
                    const newBranding = {
                        ...branding,
                        type: "Default",
                        id: randomUUID(),
                    };
                    const result = await this.brandingModel.create(newBranding, projectId, userId);
                    return ResponseHandler.handleSuccess(res, result);
                }
            }
            else {
                const userBranding = await this.brandingModel.getUserBranding(userId, projectId);
                if (userBranding?.id) {
                    const updateResult = await this.brandingModel.updateUserBranding(branding);
                    return ResponseHandler.handleSuccess(res, updateResult);
                }
                else {
                    const newBranding = {
                        ...branding,
                        type: "Customized",
                        id: randomUUID(),
                    };
                    const result = await this.brandingModel.create(newBranding, projectId, userId);
                    return ResponseHandler.handleSuccess(res, result);
                }
            }
        }
        catch (error) {
            ResponseHandler.handleError(res, error.message);
        }
    };
}
