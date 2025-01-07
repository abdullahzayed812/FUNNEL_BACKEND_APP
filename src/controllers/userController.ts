import { ExpressHandler } from "../types/apis";
import { ERRORS } from "../configs/error";
import { User } from "../types/entities";
import { formatDate } from "../helpers/dateFormat";
import { signJwt } from "../helpers/authentication";
import { getSalt } from "../helpers/env";
import crypto from "crypto";
import { UserModel } from "../models/userModel";

export class UserController {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  public signUp: ExpressHandler = async (req, res) => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).send({ error: ERRORS.USER_DATA_REQUIRED });
      }

      const usernameExists = await this.userModel.getUserByUsername(username);
      const userEmailExits = await this.userModel.getUserByEmail(email);

      if (usernameExists) {
        return res.status(400).send({ error: ERRORS.DUPLICATE_USERNAME });
      }
      if (userEmailExits) {
        return res.status(400).send({ error: ERRORS.DUPLICATE_EMAIL });
      }

      const user: User = {
        id: crypto.randomUUID(),
        email,
        username,
        role: "Agency",
        password: this.hashPassword(password),
        createdAt: formatDate(),
      };

      await this.userModel.createUser(user);

      const jwt = signJwt({ userId: user.id, role: user.role });

      return res.status(201).send({
        accessToken: jwt,
        user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
      });
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  };

  public signIn: ExpressHandler = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).send({ error: ERRORS.USER_DATA_REQUIRED });
      }

      const userExists = await this.userModel.getUserByEmail(email);

      if (!userExists?.id) {
        res.status(403).send({ error: ERRORS.USER_NOT_FOUND });
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
      return res.status(400).send({ error: error.message });
    }
  };

  public listUsers: ExpressHandler = async (req, res) => {
    const userRole = res.locals.role;

    try {
      if (userRole === "Admin") {
        const users = await this.userModel.listUsers();

        return res.status(200).send({ users });
      }
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  };

  public listForwardedUsers: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const userRole = res.locals.role;

    try {
      if (userRole === "Admin") {
        const users = await this.userModel.listForwarded(projectId);

        return res.status(200).send({ users });
      }
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  };

  private hashPassword(password: string) {
    return crypto.pbkdf2Sync(password, getSalt(), 100, 64, "sha512").toString("hex");
  }
}
