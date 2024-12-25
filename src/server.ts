import express, { RequestHandler } from "express";
import cors from "cors";
import { requestLoggerMiddleware } from "./middleware/requestLoggerMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import { corsOptions } from "./configs/corsOptions";
import { credentialsMiddleware } from "./middleware/credentialsMiddleware";
import { UserController } from "./controllers/userController";
import { DBConfig } from "./configs/db";
import { UserService } from "./services/userService";
import { UserModel } from "./models/userModel";
import { ENDPOINT_CONFIGS, Endpoints } from "./configs/endpoints";
import { ExpressHandler } from "./types/apis";
import { AuthMiddleware } from "./middleware/authMiddleware";
import expressAsyncHandler from "express-async-handler";
import { ProjectModel } from "./models/projectModel";
import { ProjectService } from "./services/projectService";
import { ProjectController } from "./controllers/projectController";
import { UploadFileController } from "./controllers/uploadFileController";
import path from "node:path";
import { ImageModel } from "./models/imageModel";
import { TemplateModel } from "./models/templateModel";
import { BrandingModel } from "./models/brandingModel";
import { ImageService } from "./services/imageService";
import { ImageController } from "./controllers/imageController";
import { TemplateService } from "./services/templateService";
import { TemplateController } from "./controllers/templateController";
import { BrandingService } from "./services/brandingService";
import { BrandingController } from "./controllers/brandingController";
import { UploadFileService } from "./services/uploadFileService";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export async function createServer(logRequests: boolean = true) {
  const app = express();

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(credentialsMiddleware);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  if (logRequests) {
    app.use(requestLoggerMiddleware);
  }

  const db = DBConfig.getInstance();
  const pool = db.getPool();

  const userModel = new UserModel(pool);
  const userService = new UserService(userModel);
  const userController = new UserController(userService);

  const projectModel = new ProjectModel(pool);
  const projectService = new ProjectService(projectModel, userModel);
  const projectController = new ProjectController(projectService);

  const imageModel = new ImageModel(pool);
  const imageService = new ImageService(imageModel, projectModel);
  const imageController = new ImageController(imageService);

  const templateModel = new TemplateModel(pool);
  const templateService = new TemplateService(templateModel, projectModel);
  const templateController = new TemplateController(templateService);

  const brandingModel = new BrandingModel(pool);
  const brandingService = new BrandingService(brandingModel, projectModel);
  const brandingController = new BrandingController(brandingService);

  const uploadFileService = new UploadFileService(imageModel);
  const uploadImageController = new UploadFileController(uploadFileService);

  const authMiddleware = new AuthMiddleware(userModel);

  // Map endpoints to controllers
  const CONTROLLERS: { [key in Endpoints]: ExpressHandler } = {
    [Endpoints.healthz]: (_, res) => res.send({ status: "ok!" }),

    [Endpoints.signIn]: userController.signInController,
    [Endpoints.signUp]: userController.signUpController,
    [Endpoints.listProjects]: projectController.listProjectsController,
    [Endpoints.listImages]: imageController.listImagesController,
    [Endpoints.listTemplates]: templateController.listTemplatesController,
    [Endpoints.getBranding]: brandingController.getBrandingController,
    [Endpoints.uploadImage]: uploadImageController.uploadFileController,
  };

  Object.keys(Endpoints).forEach((entry) => {
    const config = ENDPOINT_CONFIGS[entry as Endpoints];
    const handler = CONTROLLERS[entry as Endpoints];

    config.auth
      ? app[config.method](config.url, authMiddleware.jwtParse, authMiddleware.enforceJwt, expressAsyncHandler(handler))
      : app[config.method](config.url, authMiddleware.jwtParse, expressAsyncHandler(handler));
  });

  app.use(errorHandlerMiddleware);

  // start server, https in production, otherwise http.
  const { ENV } = process.env;

  if (!ENV) {
    throw "Environment not defined, make sure to pass in env vars or have a .env file at root.";
  }

  return app;
}
