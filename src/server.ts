import express from "express";
import cors from "cors";
import { requestLoggerMiddleware } from "./middleware/requestLoggerMiddleware";
import { errorHandlerMiddleware } from "./middleware/errorHandlerMiddleware";
import { corsOptions } from "./configs/corsOptions";
import { credentialsMiddleware } from "./middleware/credentialsMiddleware";
import { UserController } from "./controllers/userController";
import { DBConfig } from "./configs/db";
import { UserModel } from "./models/userModel";
import { ENDPOINT_CONFIGS, Endpoints } from "./configs/endpoints";
import { ExpressHandler } from "./types/apis";
import { AuthMiddleware } from "./middleware/authMiddleware";
import expressAsyncHandler from "express-async-handler";
import { ProjectModel } from "./models/projectModel";
import { ProjectController } from "./controllers/projectController";
import path from "node:path";
import { ImageModel } from "./models/imageModel";
import { TemplateModel } from "./models/templateModel";
import { BrandingModel } from "./models/brandingModel";
import { ImageController } from "./controllers/imageController";
import { TemplateController } from "./controllers/templateController";
import { BrandingController } from "./controllers/brandingController";
import { GeneratedVisualsModel } from "./models/generatedVisualsModle";
import { GeneratedVisualsController } from "./controllers/generatedVisualsController";
import { VideoModel } from "./models/videoModel";
import { VideoController } from "./controllers/videoController";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(decodeURIComponent(__filename)); // Decode the URL for cross-platform compatibility

export async function createServer(logRequests: boolean = true) {
  const app = express();

  const staticAssetPath = path.join(__dirname, "uploads").slice(1);

  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(credentialsMiddleware);
  app.use("/uploads", express.static(staticAssetPath));

  if (logRequests) {
    app.use(requestLoggerMiddleware);
  }

  const db = DBConfig.getInstance();
  const pool = db.getPool();

  const userModel = new UserModel(pool);
  const userController = new UserController(userModel);

  const projectModel = new ProjectModel(pool);
  const projectController = new ProjectController(projectModel);

  const imageModel = new ImageModel(pool);
  const imageController = new ImageController(imageModel);

  const videoModel = new VideoModel(pool);
  const videoController = new VideoController(videoModel);

  const templateModel = new TemplateModel(pool);
  const templateController = new TemplateController(templateModel);

  const brandingModel = new BrandingModel(pool);
  const brandingController = new BrandingController(brandingModel, templateModel);

  const authMiddleware = new AuthMiddleware(userModel, projectModel, imageModel);

  const generatedVisualsModel = new GeneratedVisualsModel(pool);
  const generatedVisualsController = new GeneratedVisualsController(generatedVisualsModel);

  // Map endpoints to controllers
  const CONTROLLERS: { [key in Endpoints]: ExpressHandler } = {
    [Endpoints.healthz]: (_, res) => res.send({ status: "ok!" }),

    [Endpoints.signIn]: userController.signIn,
    [Endpoints.signUp]: userController.signUp,
    [Endpoints.listUsers]: userController.listUsers,
    [Endpoints.listForwardedUsers]: userController.listForwardedUsers,
    [Endpoints.listProjects]: projectController.listProjects,
    [Endpoints.forwardProject]: projectController.forwardProject,
    [Endpoints.createProject]: projectController.createProject,
    [Endpoints.getBranding]: brandingController.getBranding,
    [Endpoints.updateBranding]: brandingController.updateBranding,
    [Endpoints.listImages]: imageController.listImages,
    [Endpoints.uploadImage]: imageController.uploadImage,
    [Endpoints.updateImageSelectionStatus]: imageController.updateImageSelection,
    [Endpoints.deleteImage]: imageController.deleteImage,
    [Endpoints.listVideos]: videoController.listVideos,
    [Endpoints.uploadVideo]: videoController.uploadVideo,
    [Endpoints.updateVideoSelectionStatus]: videoController.updateVideoSelection,
    [Endpoints.deleteVideo]: videoController.deleteVideo,
    [Endpoints.listDefaultTemplates]: templateController.listDefaultTemplates,
    [Endpoints.createTemplate]: templateController.createTemplate,
    [Endpoints.createBulkTemplates]: templateController.createBulkTemplates,
    [Endpoints.listCustomizedTemplates]: templateController.listCustomizedTemplates,
    [Endpoints.updateTemplateSelectionStatus]: templateController.updateTemplateSelection,
    [Endpoints.deleteTemplate]: templateController.deleteTemplate,
    [Endpoints.getGeneratedVisuals]: generatedVisualsController.getGeneratedVisuals,
  };

  Object.keys(Endpoints).forEach((entry) => {
    const { auth, method, url, requireProjectId, requireImageId } = ENDPOINT_CONFIGS[entry as Endpoints];
    const controller = CONTROLLERS[entry as Endpoints];

    const middlewares = [authMiddleware.jwtParse];

    if (auth) {
      middlewares.push(authMiddleware.enforceJwt);
    }
    if (requireProjectId) {
      middlewares.push(authMiddleware.checkProjectId);
    }
    if (requireImageId) {
      middlewares.push(authMiddleware.checkImageId);
    }

    app[method](url, ...middlewares, expressAsyncHandler(controller));
  });

  app.use(errorHandlerMiddleware);

  const { ENV } = process.env;

  if (!ENV) {
    throw "Environment not defined, make sure to pass in env vars or have a .env file at root.";
  }

  return app;
}
