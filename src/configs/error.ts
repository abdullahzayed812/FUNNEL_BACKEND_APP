export enum ERRORS {
  TOKEN_EXPIRED = "Token expired.",
  BAD_TOKEN = "Bad token.",

  USER_NOT_FOUND = "User not found.",
  INVALID_USER_DATA = "Invalid user data.",
  INCORRECT_PASSWORD = "Incorrect password.",
  USER_DATA_REQUIRED = "Email, user name and password are required.",
  USER_ID_NOT_SENT = "You should send user id.",
  DUPLICATE_EMAIL = "An account with this email already exists.",
  DUPLICATE_USERNAME = "An account with this username already exists.",

  ACCESS_NOT_ALLOWED = "Access is not allowed.",

  PROJECT_ID_NOT_SENT = "You should send project id.",
  PROJECT_NOT_FOUND = "Project not found.",
}

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    // Capture stack trace (works in V8 engine)
    Error.captureStackTrace(this, this.constructor);
  }
}
