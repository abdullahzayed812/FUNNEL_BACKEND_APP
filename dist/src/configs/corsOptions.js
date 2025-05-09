export const allowedOrigins = ["https://www.yoursite.com", "http://127.0.0.1:5500", "http://localhost:8081"];
export const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200,
};
