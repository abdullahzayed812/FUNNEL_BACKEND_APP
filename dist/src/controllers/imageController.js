import { randomUUID } from "crypto";
import { ERRORS } from "../configs/error";
import { upload } from "../helpers/uploadFile";
import path from "node:path";
import fs from "node:fs/promises";
import { ResponseHandler } from "../helpers/responseHandler";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(decodeURIComponent(__filename)); // Decode the URL for cross-platform compatibility
export class ImageController {
    imageModel;
    constructor(imageModel) {
        this.imageModel = imageModel;
    }
    listImages = async (req, res) => {
        try {
            const { projectId } = req.params;
            const images = await this.imageModel.list(projectId, res.locals.userId);
            ResponseHandler.handleSuccess(res, { images });
        }
        catch (error) {
            ResponseHandler.handleError(res, error.message);
        }
    };
    updateImageSelection = async (req, res) => {
        try {
            const { projectId } = req.params;
            const { imageId, status } = req.body;
            const userId = res.locals.userId;
            const userImage = await this.imageModel.checkUserImage(imageId, userId);
            if (userImage?.id) {
                const result = await this.imageModel.update(imageId, status);
                return ResponseHandler.handleSuccess(res, result, 200);
            }
            const result = await this.imageModel.addUserImage(imageId, userId, status);
            return ResponseHandler.handleSuccess(res, result, 200);
        }
        catch (error) {
            ResponseHandler.handleError(res, error.message);
        }
    };
    deleteImage = async (req, res) => {
        try {
            const { imageId } = req.body;
            const { userId } = res.locals;
            const userImage = await this.imageModel.getByUserId(imageId, userId);
            if (!userImage?.id) {
                return ResponseHandler.handleError(res, "Image not found", 404);
            }
            const filePath = path.join(__dirname.slice(1), "..", userImage.filePath);
            try {
                await fs.unlink(filePath);
            }
            catch (err) {
                console.error("Error deleting file:", err);
                return res.status(500).send({ error: "Error deleting file from server" });
            }
            try {
                const result = await this.imageModel.delete(imageId);
                ResponseHandler.handleSuccess(res, result, 200);
            }
            catch (error) {
                ResponseHandler.handleError(res, error.message);
            }
        }
        catch (error) {
            ResponseHandler.handleError(res, error.message);
        }
    };
    uploadImage = async (req, res, next) => {
        const { projectId } = req.params;
        const userRole = res.locals.role;
        const userId = res.locals.userId;
        upload(req, res, async (err) => {
            if (err) {
                return next(err);
            }
            const files = req.files?.images; // Access the 'images' field
            if (!files || files.length === 0) {
                return ResponseHandler.handleError(res, ERRORS.NO_FILE_UPLOADED, 400);
            }
            try {
                const imageRecords = await Promise.all(files?.map(async (file) => {
                    const image = {
                        id: randomUUID(),
                        filePath: file.filename,
                        imageType: userRole === "Admin" ? "Default" : "Customized",
                    };
                    return this.imageModel.create(image, userId, projectId);
                }));
                ResponseHandler.handleSuccess(res, imageRecords, 201);
            }
            catch (error) {
                ResponseHandler.handleError(res, error.message);
            }
        });
    };
}
