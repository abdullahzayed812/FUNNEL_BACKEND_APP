import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { ExpressHandler } from "../types/apis";
import { AppError } from "../configs/error";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public signUpController: ExpressHandler = async (req, res) => {
    try {
      const { email, username, password } = req.body;

      const { user, accessToken } = await this.userService.signUp(email, username, password);

      res.status(201).send({ user, accessToken });
    } catch (error: any) {
      if (error instanceof AppError) {
        // Specific error handling (e.g., validation, authentication issues)
        res.status(error.statusCode).send({ error: error.message });
      } else {
        // Unknown errors (server issues)
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };

  public signInController: ExpressHandler = async (req, res) => {
    try {
      const { login, password } = req.body;

      const { user, accessToken } = await this.userService.signIn(login, password);

      res.status(200).send({ user, accessToken });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}
