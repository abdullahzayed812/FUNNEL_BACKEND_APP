import { BrandingModel } from "../models/brandingModel";
import { ExpressHandler } from "../types/apis";

export class BrandingController {
  private brandingModel: BrandingModel;

  constructor(brandingModel: BrandingModel) {
    this.brandingModel = brandingModel;
  }

  private handleError(res: any, error: any, statusCode: number = 400): void {
    console.error(error);
    res.status(statusCode).send({ error: error.message || "An unexpected error occurred" });
  }

  private handleSuccess(res: any, data: any, statusCode: number = 200): void {
    res.status(statusCode).send(data);
  }

  private validateBranding(branding: any): boolean {
    return Object.entries(branding).every(([key, value]) => value !== undefined && value !== null && value !== "");
  }

  public getBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = res.locals.userId;

      const branding = await this.brandingModel.get(projectId, userId);
      this.handleSuccess(res, { branding });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  public updateBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { branding } = req.body;

      if (!this.validateBranding(branding)) {
        return res.status(400).send({ error: "No valid data received." });
      }

      const updateResult = await this.brandingModel.update(branding, projectId, res.locals.userId);
      this.handleSuccess(res, updateResult);
    } catch (error: any) {
      this.handleError(res, error);
    }
  };
}
