import { AppError } from "../configs/error";
import { ImageService } from "../services/imageService";
import { ExpressHandler } from "../types/apis";

export class ImageController {
  private imageService: ImageService;

  constructor(imageService: ImageService) {
    this.imageService = imageService;
  }

  listImagesController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const images = await this.imageService.listImages(id, res.locals.userId, res.locals.userRole);

      res.status(200).send({ images });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}
