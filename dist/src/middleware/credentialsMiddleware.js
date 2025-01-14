import { allowedOrigins } from "../configs/corsOptions";
export const credentialsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", "true");
    }
    next();
};
