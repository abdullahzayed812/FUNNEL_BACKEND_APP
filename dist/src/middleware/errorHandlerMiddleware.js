export const errorHandlerMiddleware = (err, req, res, next) => {
    console.log("Uncaught exception: ", err);
    res.status(500).send("Oops, an unexpected error occurred, please try again.");
};
