import { randomUUID } from "crypto";
import { BrandingModel } from "../models/brandingModel";
import { ExpressHandler } from "../types/apis";
import { Branding } from "../types/entities";

export class BrandingController {
  private brandingModel: BrandingModel;

  constructor(brandingModel: BrandingModel) {
    this.brandingModel = brandingModel;
  }

  private handleError(res: any, error: any, statusCode: number = 400): void {
    console.error(error);
    return res.status(statusCode).send({ error: error.message || "An unexpected error occurred" });
  }

  private handleSuccess(res: any, data: any, statusCode: number = 200): void {
    return res.status(statusCode).send(data);
  }

  // private validateBranding(branding: any): boolean {
  //   return Object.entries(branding).every(([key, value]) => value !== undefined && value !== null && value !== "");
  // }

  public getBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { userId } = res.locals;

      const userBranding = await this.brandingModel.getUserBranding(userId, projectId);
      if (userBranding?.id) {
        return this.handleSuccess(res, { branding: userBranding });
      }

      const defaultBranding = await this.brandingModel.getProjectBranding(projectId);
      return this.handleSuccess(res, { branding: defaultBranding });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public updateBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { branding } = req.body;
      const userId = res.locals.userId;
      const userRole = res.locals.role;

      // if (!this.validateBranding(branding)) {
      //   return this.handleError(res, { error: "No valid data received." }, 400);
      // }

      if (userRole === "Admin") {
        const defaultBranding = await this.brandingModel.getProjectBranding(projectId);

        if (defaultBranding?.id) {
          const updateResult = await this.brandingModel.updateDefaultBranding(branding);
          return this.handleSuccess(res, updateResult);
        } else {
          const newBranding: Branding = {
            ...branding,
            type: "Default",
            id: randomUUID(),
          };

          const result = await this.brandingModel.create(newBranding, projectId, userId);
          return this.handleSuccess(res, result);
        }
      } else {
        const userBranding = await this.brandingModel.getUserBranding(userId, projectId);

        if (userBranding?.id) {
          const updateResult = await this.brandingModel.updateUserBranding(branding);
          return this.handleSuccess(res, updateResult);
        } else {
          const newBranding: Branding = {
            ...branding,
            type: "Customized",
            id: randomUUID(),
          };

          const result = await this.brandingModel.create(newBranding, projectId, userId);
          return this.handleSuccess(res, result);
        }
      }
    } catch (error: any) {
      this.handleError(res, error);
    }
  };
}
