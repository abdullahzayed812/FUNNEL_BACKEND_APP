import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  // Sign up user
  async signUpController(req: Request, res: Response) {
    try {
      const { email, username, password, firstName, lastName } = req.body;
      const user = await this.userService.signUp(email, username, password, firstName, lastName);
      res.status(201).send({ user });
    } catch (error: any) {
      res.status(error.statusCode).send({ error: error.message });
    }
  }

  // Sign in user
  async signInController(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const { user, accessToken } = await this.userService.signIn(login, password);
      res.status(200).send({ user, accessToken });
    } catch (error: any) {
      res.status(error.statusCode).send({ error: error.message }); // 400
    }
  }

  // Get user by ID
  async getUserController(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      res.status(200).send(user);
    } catch (error: any) {
      res.status(error.statusCode).send({ error: error.message }); // 404
    }
  }

  // Update user details
  async updateUserController(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { username, firstName, lastName } = req.body;
      await this.userService.updateUser(userId, username, firstName, lastName);
      res.status(200).send({ message: "User updated successfully" });
    } catch (error: any) {
      res.status(error.statusCode).send({ error: error.message }); // 400
    }
  }
}
