export var ERRORS;
(function (ERRORS) {
    ERRORS["TOKEN_EXPIRED"] = "Token expired.";
    ERRORS["BAD_TOKEN"] = "Bad token.";
    ERRORS["USER_NOT_FOUND"] = "User not found.";
    ERRORS["INVALID_USER_DATA"] = "Invalid user data.";
    ERRORS["INCORRECT_PASSWORD"] = "Incorrect password.";
    ERRORS["USER_DATA_REQUIRED"] = "Email, user name and password are required.";
    ERRORS["USER_ID_NOT_SENT"] = "You should send user id.";
    ERRORS["DUPLICATE_EMAIL"] = "An account with this email already exists.";
    ERRORS["DUPLICATE_USERNAME"] = "An account with this username already exists.";
    ERRORS["ACCESS_NOT_ALLOWED"] = "Access is not allowed.";
    ERRORS["PROJECT_ID_NOT_SENT"] = "You should send project id.";
    ERRORS["PROJECT_NOT_FOUND"] = "Project not found.";
    ERRORS["NO_PROJECTS_EXISTS"] = "No projects exists.";
    ERRORS["NO_FILE_UPLOADED"] = "No file uploaded.";
    ERRORS["IMAGE_ID_NOT_SENT"] = "You should send image id.";
    ERRORS["IMAGE_NOT_FOUND"] = "Image not found.";
    ERRORS["NO_TEMPLATES_FOUND"] = "No templates found.";
})(ERRORS || (ERRORS = {}));
export class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        // Capture stack trace (works in V8 engine)
        Error.captureStackTrace(this, this.constructor);
    }
}
