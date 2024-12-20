import crypto from "crypto";
import { UserModel } from "../models/user";
import { User } from "../types/entities";
import { signJwt } from "../utils/auth";
import { getSalt } from "../utils/env";
import { AppError, ERRORS } from "../utils/errors";

export class UserService {
  private userModel: UserModel;

  constructor(userModel: UserModel) {
    this.userModel = userModel;
  }

  // Sign up logic
  async signUp(email: string, username: string, password: string, firstName: string, lastName: string) {
    if (!email || !username || !password || !firstName || !lastName) {
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
      password: this.hashPassword(password),
    };

    return await this.userModel.createUser(user);
  }

  // Sign in logic
  async signIn(login: string, password: string) {
    const user = await this.userModel.getUserByEmailOrUsername(login);

    if (!user || user.password !== this.hashPassword(password)) {
      throw new Error("Invalid login credentials");
    }

    const jwt = signJwt({ userId: user.id });

    return { user, accessToken: jwt };
  }

  // Get user by ID
  async getUserById(id: string) {
    const user = await this.userModel.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  // Update user details
  async updateUser(id: string, username: string, firstName: string, lastName: string) {
    const user = await this.userModel.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Update user details
    const updated = await this.userModel.updateUser(id, { username });
    return updated;
  }

  private hashPassword(password: string) {
    return crypto.pbkdf2Sync(password, getSalt(), 100, 64, "sha512").toString("hex");
  }
}
