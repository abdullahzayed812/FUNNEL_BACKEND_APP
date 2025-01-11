import { ExpressHandler } from "../types/apis";
import { ERRORS } from "../configs/error";
import { User } from "../types/entities";
import { formatDate } from "../helpers/dateFormat";
import { signJwt } from "../helpers/authentication";
import { getSalt } from "../helpers/env";
import crypto from "crypto";
import { UserModel } from "../models/userModel";
import { ResponseHandler } from "../helpers/responseHandler";

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  private hashPassword(password: string) {
    return crypto.pbkdf2Sync(password, getSalt(), 100, 64, "sha512").toString("hex");
  }

  public signUp: ExpressHandler = async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return ResponseHandler.handleError(res, ERRORS.USER_DATA_REQUIRED, 400);
      }

      const usernameExists = await this.userModel.getUserByUsername(username);
      const userEmailExits = await this.userModel.getUserByEmail(email);

      if (usernameExists) {
        return ResponseHandler.handleError(res, ERRORS.DUPLICATE_USERNAME, 404);
      }
      if (userEmailExits) {
        return ResponseHandler.handleError(res, ERRORS.DUPLICATE_EMAIL, 404);
      }

      const user: User = {
        id: crypto.randomUUID(),
        email,
        username,
        role: "Agency",
        password: password,
        createdAt: formatDate(),
      };

      await this.userModel.createUser(user);

      const jwt = signJwt({ userId: user.id, role: user.role });

      return ResponseHandler.handleSuccess(
        res,
        {
          accessToken: jwt,
          user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
        },
        201
      );
    } catch (error: any) {
      return ResponseHandler.handleError(res, error.message);
    }
  };

  public signIn: ExpressHandler = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return ResponseHandler.handleError(res, ERRORS.USER_DATA_REQUIRED, 400);
      }

      const userExists = await this.userModel.getUserByEmail(email);

      if (!userExists?.id) {
        return ResponseHandler.handleError(res, ERRORS.USER_NOT_FOUND, 403);
      }

      // if (userExists?.password !== this.hashPassword(password)) {
      //   res.status(403).send(ERRORS.INCORRECT_PASSWORD);
      // }

      const jwt = signJwt({ userId: userExists!.id, role: userExists!.role });

      return res.status(200).send({
        user: {
          id: userExists?.id,
          email: userExists?.email,
          username: userExists?.username,
          createdAt: userExists?.createdAt,
        },
        accessToken: jwt,
      });
    } catch (error: any) {
      return ResponseHandler.handleError(res, error.message);
    }
  };

  public listUsers: ExpressHandler = async (req, res) => {
    const userRole = res.locals.role;

    try {
      if (userRole === "Admin") {
        const users = await this.userModel.listUsers();

        return ResponseHandler.handleSuccess(res, { users }, 200);
      }
    } catch (error: any) {
      return ResponseHandler.handleError(res, error.message);
    }
  };

  public listForwardedUsers: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const userRole = res.locals.role;

    try {
      if (userRole === "Admin") {
        const users = await this.userModel.listForwarded(projectId);

        return ResponseHandler.handleSuccess(res, { users }, 200);
      }
    } catch (error: any) {
      return ResponseHandler.handleError(res, error.message);
    }
  };
}
