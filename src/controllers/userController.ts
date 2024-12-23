import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { ExpressHandler } from "../types/apis";

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
      res.status(403).send({ error: error.message });
    }
  };

  public signInController: ExpressHandler = async (req, res) => {
    try {
      const { login, password } = req.body;

      const { user, accessToken } = await this.userService.signIn(login, password);

      res.status(200).send({ user, accessToken });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };
}
