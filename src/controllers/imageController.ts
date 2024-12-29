import { randomUUID } from "crypto";
import { ERRORS } from "../configs/error";
import { upload } from "../helpers/uploadFile";
import { ImageModel } from "../models/imageModel";
import { ExpressHandler } from "../types/apis";
import { Image } from "../types/entities";

export class ImageController {
  private imageModel: ImageModel;

  constructor(imageModel: ImageModel) {
    this.imageModel = imageModel;
  }

  listImages: ExpressHandler = async (req, res) => {
    try {
      const { projectId } = req.params;

      const images = await this.imageModel.list(projectId, res.locals.userId, res.locals.userRole);

      res.status(200).send({ images });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

  updateImageSelection: ExpressHandler = async (req, res) => {
    try {
      const { imageId, status } = req.body;

      const result = await this.imageModel.update(imageId, status);

      res.send(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

  deleteImage: ExpressHandler = async (req, res) => {
    try {
      const { imageId } = req.body;

      const result = await this.imageModel.delete(imageId);

      res.send(200).send(result);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

  public uploadImage: ExpressHandler = async (req, res, next) => {
    const { projectId } = req.params;
    const userId = res.locals.userId;
    const userRole = res.locals.role;

    upload.single("image")(req, res, async (err) => {
      if (err) {
        return next(err);
      }

      const file = req.file;

      if (!file) {
        res.status(400).send(ERRORS.NO_FILE_UPLOADED);
      }

      const image: Image = {
        id: randomUUID(),
        filePath: `http://localhost:3000/uploads/${file?.filename}`,
        imageType: userRole === "Admin" ? "Default" : "Customized",
        isSelected: false,
        projectId,
        userId,
      };

      try {
        await this.imageModel.create(image);
      } catch (error: any) {
        res.status(400).send({ error: error.message });
      }

      res.status(201).json({ image });
    });
  };
}
