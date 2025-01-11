import { randomUUID } from "crypto";
import { BrandingModel } from "../models/brandingModel";
import { ExpressHandler } from "../types/apis";
import { Branding } from "../types/entities";
import { ResponseHandler } from "../helpers/responseHandler";

export class BrandingController {
  private brandingModel: BrandingModel;

  constructor(brandingModel: BrandingModel) {
    this.brandingModel = brandingModel;
  }

  public getBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userId } = res.locals;

      const userBranding = await this.brandingModel.getUserBranding(userId, projectId);
      if (userBranding?.id) {
        return ResponseHandler.handleSuccess(res, { branding: userBranding });
      }

      const defaultBranding = await this.brandingModel.getProjectBranding(projectId);
      return ResponseHandler.handleSuccess(res, { branding: defaultBranding });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error.message);
    }
  };

  public updateBranding: ExpressHandler = async (req, res) => {
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
        } else {
          const newBranding: Branding = {
            ...branding,
            type: "Default",
            id: randomUUID(),
          };

          const result = await this.brandingModel.create(newBranding, projectId, userId);
          return ResponseHandler.handleSuccess(res, result);
        }
      } else {
        const userBranding = await this.brandingModel.getUserBranding(userId, projectId);

        if (userBranding?.id) {
          const updateResult = await this.brandingModel.updateUserBranding(branding);
          return ResponseHandler.handleSuccess(res, updateResult);
        } else {
          const newBranding: Branding = {
            ...branding,
            type: "Customized",
            id: randomUUID(),
          };

          const result = await this.brandingModel.create(newBranding, projectId, userId);
          return ResponseHandler.handleSuccess(res, result);
        }
      }
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };
}
