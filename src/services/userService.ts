import crypto from "crypto";
import { UserModel } from "../models/userModel";
import { User } from "../types/entities";
import { signJwt } from "../utils/auth";
import { getSalt } from "../utils/env";
import { AppError, ERRORS } from "../utils/errors";
import { formatDate } from "../utils/date";

export class UserService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  // Sign up logic
  async signUp(email: string, username: string, password: string) {
    if (!email || !username || !password) {
      throw new AppError(ERRORS.USER_DATA_REQUIRED, 400);
    }

    const usernameExists = await this.userModel.getUserByUsername(username);
    const userEmailExits = await this.userModel.getUserByEmail(email);

    if (usernameExists) {
      throw new AppError(ERRORS.DUPLICATE_USERNAME, 403);
    }
    if (userEmailExits) {
      throw new AppError(ERRORS.DUPLICATE_EMAIL, 403);
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

    return {
      accessToken: jwt,
      user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
    };
  }

  // Sign in logic
  async signIn(login: string, password: string) {
    if (!login || !password) {
      throw new AppError(ERRORS.INVALID_USER_DATA, 400);
    }

    const userExists = (await this.userModel.getUserByEmail(login)) || (await this.userModel.getUserByUsername(login));

    if (!userExists) {
      throw new AppError(ERRORS.USER_NOT_FOUND, 400);
    }

    if (userExists.password !== this.hashPassword(password)) {
      throw new AppError(ERRORS.INCORRECT_PASSWORD, 403);
    }

    const jwt = signJwt({ userId: userExists.id, role: userExists.role });

    return {
      user: {
        id: userExists.id,
        email: userExists.email,
        username: userExists.username,
        createdAt: userExists.createdAt,
      },
      accessToken: jwt,
    };
  }

  private hashPassword(password: string) {
    return crypto.pbkdf2Sync(password, getSalt(), 100, 64, "sha512").toString("hex");
  }
}
