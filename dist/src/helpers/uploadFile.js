import multer from "multer";
import path from "path";
import fs from "fs";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "..", "uploads");
        // Check if the uploads directory exists; if not, create it
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
// Initialize multer with the storage configuration
export const upload = multer({ storage });
