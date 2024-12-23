import { upload } from "../helpers/uploadFile";
import { ExpressHandler } from "../types/apis";

export class UploadFileController {
  public uploadFile: ExpressHandler = async (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return next(err);
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" }); // Return error if no file
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      return res.status(200).json({ imageUrl }); // Return the image URL
    });
  };
}
