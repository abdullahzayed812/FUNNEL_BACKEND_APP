import { ExpressHandler, JwtPayload } from "../types/apis";
import { VerifyErrors } from "jsonwebtoken";
import { verifyJwt } from "../utils/auth";
import { ERRORS } from "../utils/errors";
import { UserModel } from "../models/user";
import jwt from "jsonwebtoken";

export class AuthMiddleware {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
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

    if (!user) {
      return res.status(401).send({ error: ERRORS.USER_NOT_FOUND });
    }

    res.locals.userId = user.id;
    res.locals.role = user.role;

    return next();
  };

  public enforceJwt: ExpressHandler<any, any> = async (_, res, next) => {
    if (!res.locals.userId || !res.locals.role) {
      return res.sendStatus(401); // Unauthorized
    }

    return next();
  };
}
