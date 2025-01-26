import { AppError } from "../configs/error";
export class ResponseHandler {
    static handleError(res, error, statusCode = 500) {
        console.log(error);
        if (error instanceof AppError) {
            res.status(statusCode).send(error);
        }
        res.status(statusCode).send({ error: "Internal Server Error: " + error });
    }
    static handleSuccess(res, data, statusCode = 200) {
        res.status(statusCode).send(data);
    }
}
