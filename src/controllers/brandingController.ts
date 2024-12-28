import { AppError } from "../configs/error";
import { BrandingService } from "../services/brandingService";
import { ExpressHandler } from "../types/apis";

export class BrandingController {
  private brandingService: BrandingService;

  constructor(brandingService: BrandingService) {
    this.brandingService = brandingService;
  }

  getBrandingController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const branding = await this.brandingService.getBranding(id, res.locals.userId, res.locals.role);

      res.status(200).send({ branding });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };

  updateBrandingController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const { branding } = req.body;

      const updateResult = await this.brandingService.updateBranding(branding, id, res.locals.userId, res.locals.role);

      res.status(200).send(updateResult);
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}
