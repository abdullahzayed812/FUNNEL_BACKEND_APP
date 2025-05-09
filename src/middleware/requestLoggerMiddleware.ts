import { RequestHandler } from "express";

export const requestLoggerMiddleware: RequestHandler = (req, _, next) => {
  console.log(req.method, req.path, " - body: ", req.body);
  next();
};

// const logEvents = async (message: string, logName: string) => {
//   const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
//   const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`;

//   try {
//     if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
//       await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
//     }

//     await fsPromises.appendFile(path.join(__dirname, "..", "logs", logName), logItem);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const logger: ExpressHandler = (req, res, next) => {
//   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
//   console.log(`${req.method} ${req.path}`);
//   next();
// };

// module.exports = { logger, logEvents };
