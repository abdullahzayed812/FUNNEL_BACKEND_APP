import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename); // Decode the URL for cross-platform compatibility

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve(__dirname, "..", "uploads");

    const uploadDir = dir.slice(3);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const filetypesImages = /jpeg|jpg|png|gif/;
  const filetypesVideos = /mp4|mkv|avi|mov|flv|wmv/;

  // Check if file is an image or video
  if (
    file.fieldname === "images" &&
    filetypesImages.test(path.extname(file.originalname).toLowerCase()) &&
    filetypesImages.test(file.mimetype)
  ) {
    return cb(null, true); // Accept image files
  } else if (
    file.fieldname === "videos" &&
    filetypesVideos.test(path.extname(file.originalname).toLowerCase()) &&
    filetypesVideos.test(file.mimetype)
  ) {
    return cb(null, true); // Accept video files
  } else {
    return cb(new Error("Only image and video files are allowed!"), false); // Reject invalid files
  }
};

export const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "images", maxCount: 5 }, // Max 5 image files
  { name: "videos", maxCount: 5 }, // Max 5 video files
]);
