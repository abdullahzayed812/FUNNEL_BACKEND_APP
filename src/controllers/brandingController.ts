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

  private validateBranding(branding: any): boolean {
    return Object.entries(branding).every(([key, value]) => value !== undefined && value !== null && value !== "");
  }

  public getBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = res.locals.userId;

      const userBranding = await this.brandingModel.getUserBranding(userId, projectId);
      const defaultBranding = await this.brandingModel.getDefaultBranding(projectId);

      if (userBranding?.id) {
        return this.handleSuccess(res, { branding: userBranding });
      } else if (defaultBranding?.id) {
        return this.handleSuccess(res, { branding: defaultBranding });
      }

      return this.handleSuccess(res, { branding: {} });
    } catch (error: any) {
      return this.handleError(res, error);
    }
  };

  public updateBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { branding } = req.body;
      const userId = res.locals.userId;

      if (!this.validateBranding(branding)) {
        return this.handleError(res, { error: "No valid data received." }, 400);
      }

      // Admin Logic: Update or Create Default Branding
      if (res.locals.role === "Admin") {
        const defaultBranding = await this.brandingModel.getDefaultBranding(projectId);

        if (defaultBranding?.id) {
          // Admin can update the default branding
          const updateResult = await this.brandingModel.updateDefaultBranding(branding);
          return this.handleSuccess(res, updateResult);
        } else {
          // Admin can create a new default branding
          const newBranding: Branding = {
            ...branding,
            id: randomUUID(),
          };

          const result = await this.brandingModel.createDefaultBranding(newBranding, projectId);
          return this.handleSuccess(res, result);
        }
      } else {
        // Agency Logic: Update their own branding (but not overwrite default branding)
        const userBranding = await this.brandingModel.getUserBranding(res.locals.userId, projectId);

        if (userBranding?.id) {
          const updateResult = await this.brandingModel.updateUserBranding(branding);
          return this.handleSuccess(res, updateResult);
        } else {
          // Agency does not have branding, allow them to create it
          const newBranding: Branding = {
            ...branding,
            id: randomUUID(),
          };
          const result = await this.brandingModel.createUserBranding(newBranding, userId, projectId);
          return this.handleSuccess(res, result);
        }
      }
    } catch (error: any) {
      this.handleError(res, error);
    }
  };
}
