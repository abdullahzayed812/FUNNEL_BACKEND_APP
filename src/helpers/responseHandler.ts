import { Response } from "express";
import { AppError } from "../configs/error";

export class ResponseHandler {
  static handleError(res: Response, error: any, statusCode: number = 500): void {
    console.log(error);
    if (error instanceof AppError) {
      res.status(statusCode).send(error);
    }
    res.status(statusCode).send({ error: "Internal Server Error: " + error });
  }

  static handleSuccess(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).send(data);
  }
}
