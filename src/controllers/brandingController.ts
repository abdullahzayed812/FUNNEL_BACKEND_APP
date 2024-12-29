import { BrandingModel } from "../models/brandingModel";
import { ExpressHandler } from "../types/apis";

export class BrandingController {
  private brandingModel: BrandingModel;

  constructor(brandingModel: BrandingModel) {
    this.brandingModel = brandingModel;
  }

  getBranding: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const branding = await this.brandingModel.get(id, res.locals.userId, res.locals.role);

      res.status(200).send({ branding });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

  updateBranding: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { branding } = req.body;

      if (Object.entries(branding).some(([key, value]) => !value)) {
        res.status(400).send({ error: "No data received." });
      }

      const updateResult = await this.brandingModel.update(branding, projectId, res.locals.userId, res.locals.role);

      res.status(200).send(updateResult);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };
}
