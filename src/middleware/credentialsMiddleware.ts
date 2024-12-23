import { allowedOrigins } from "../configs/corsOptions";
import { ExpressHandler } from "../types/apis";

export const credentialsMiddleware: ExpressHandler<any, any> = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin as string)) {
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
};
