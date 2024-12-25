import { upload } from "../helpers/uploadFile";
import { UploadFileService } from "../services/uploadFileService";
import { ExpressHandler } from "../types/apis";

export class UploadFileController {
  private uploadFileService: UploadFileService;

  constructor(uploadFileService: UploadFileService) {
    this.uploadFileService = uploadFileService;
  }

  public uploadFileController: ExpressHandler = async (req, res, next) => {
    const { id } = req.params;

    upload.single("image")(req, res, async (err) => {
      const image = await this.uploadFileService.uploadFile(
        err,
        id,
        res.locals.userId,
        res.locals.userRole,
        req.file,
        next
      );

      return res.status(200).json({ image }); // Return the image URL
    });
  };
}
