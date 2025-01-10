import { ExpressHandler, JwtPayload } from "../types/apis";
import { VerifyErrors } from "jsonwebtoken";
import { verifyJwt } from "../helpers/authentication";
import { ERRORS } from "../configs/error";
import { UserModel } from "../models/userModel";
import jwt from "jsonwebtoken";
import { ProjectModel } from "../models/projectModel";
import { ImageModel } from "../models/imageModel";

export class AuthMiddleware {
  private userModel: UserModel;
  private projectModel: ProjectModel;
  private imageModel: ImageModel;

  constructor(userModel: UserModel, projectModel: ProjectModel, imageModel: ImageModel) {
    this.userModel = userModel;
    this.projectModel = projectModel;
    this.imageModel = imageModel;
  }

  public jwtParse: ExpressHandler = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return next();
    }

    let jwtPayload: JwtPayload;

    try {
      jwtPayload = verifyJwt(token);
    } catch (error) {
      const verifyError = error as VerifyErrors;
      const { TokenExpiredError } = jwt;

      if (verifyError instanceof TokenExpiredError) {
        return res.status(401).send({ error: ERRORS.TOKEN_EXPIRED });
      }

      return res.status(401).send({ error: ERRORS.BAD_TOKEN });
    }

    const user = await this.userModel.getUserById(jwtPayload.userId);

    if (!user?.id) {
      return res.status(401).send({ error: ERRORS.USER_NOT_FOUND });
    }

    res.locals.userId = user?.id;
    res.locals.role = user?.role;

    return next();
  };

  public enforceJwt: ExpressHandler<any, any> = async (_, res, next) => {
    if (!res.locals.userId || !res.locals.role) {
      return res.sendStatus(401); // Unauthorized
    }

    return next();
  };

  public checkProjectId: ExpressHandler = async (req, res, next) => {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).send({ error: ERRORS.PROJECT_ID_NOT_SENT });
    }

    const projectExists = await this.projectModel.get(projectId);

    if (!projectExists?.id) {
      return res.status(400).send({ error: ERRORS.PROJECT_NOT_FOUND });
    }

    next();
  };

  public checkImageId: ExpressHandler = async (req, res, next) => {
    const { imageId } = req.body;

    if (!imageId) {
      return res.status(400).send({ error: ERRORS.IMAGE_ID_NOT_SENT });
    }

    const imageExists = await this.imageModel.getById(imageId);

    if (!imageExists?.id) {
      return res.status(400).send({ error: ERRORS.IMAGE_NOT_FOUND });
    }

    next();
  };
}
