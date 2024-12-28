import { upload } from "../helpers/uploadFile";
import { UploadFileService } from "../services/uploadFileService";
import { ExpressHandler } from "../types/apis";

export class UploadFileController {
  private uploadFileService: UploadFileService;

  constructor(uploadFileService: UploadFileService) {
    this.uploadFileService = uploadFileService;
  }

  // There is an error here, when uploading image it takes the user id ed5559fe-ae2d-4a09-beb2-70d1cbc60e63 for abdo@mail.com
  public uploadFileController: ExpressHandler = async (req, res, next) => {
    const { id } = req.params;
    const userId = res.locals.userId;
    const userRole = res.locals.role;

    upload.single("image")(req, res, async (err) => {
      const image = await this.uploadFileService.uploadFile(err, id, userId, userRole, req.file, next);
      return res.status(200).json({ image });
    });
  };
}
