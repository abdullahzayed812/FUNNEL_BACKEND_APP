import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { ExpressHandler } from "../types/apis";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    if (!userService) {
      console.error("UserService is undefined during controller initialization.");
    }

    this.userService = userService;
  }

  // Sign up user
  signUpController: ExpressHandler = async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const { user, accessToken } = await this.userService.signUp(email, username, password);
      res.status(201).send({ user, accessToken });
    } catch (error: any) {
      res.status(403).send({ error: error.message });
    }
  };

  // Sign in user
  signInController: ExpressHandler = async (req, res) => {
    try {
      const { login, password } = req.body;
      const { user, accessToken } = await this.userService.signIn(login, password);
      res.status(200).send({ user, accessToken });
    } catch (error: any) {
      res.status(400).send({ error: error.message }); // 400
    }
  };

  // // Get user by ID
  // async getUserController(req: Request, res: Response) {
  //   try {
  //     const userId = req.params.id;
  //     const user = await this.userService.getUserById(userId);
  //     res.status(200).send(user);
  //   } catch (error: any) {
  //     res.status(error.statusCode).send({ error: error.message }); // 404
  //   }
  // }

  // // Update user details
  // async updateUserController(req: Request, res: Response) {
  //   try {
  //     const userId = req.params.id;
  //     const { username, firstName, lastName } = req.body;
  //     await this.userService.updateUser(userId, username, firstName, lastName);
  //     res.status(200).send({ message: "User updated successfully" });
  //   } catch (error: any) {
  //     res.status(error.statusCode).send({ error: error.message }); // 400
  //   }
  // }
}
