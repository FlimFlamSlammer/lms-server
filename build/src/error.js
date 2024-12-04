"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.createFieldError = exports.createErrorWithMessage = exports.createInternalServerError = void 0;
const http_status_codes_1 = require("http-status-codes");
class CustomError extends Error {
    status;
    constructor(status) {
        super("");
        this.status = status;
    }
}
class ErrorWithMessage extends CustomError {
    constructor(status, message) {
        super(status);
        this.message = message;
    }
    toJSON() {
        return {
            status: this.status,
            error: {
                message: this.message,
            },
        };
    }
}
/*

{
  email: "Wrong email format",
  password: "Not strong enough"
}

*/
// The error is used when the error of the system is caused by the incoming data from request body.
class FieldError extends CustomError {
    fields;
    constructor(fields) {
        super(http_status_codes_1.StatusCodes.BAD_REQUEST);
        this.fields = fields;
    }
    toJSON() {
        return {
            status: this.status,
            error: {
                fields: this.fields,
            },
        };
    }
}
const createInternalServerError = () => {
    return new ErrorWithMessage(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error (Something wrong happened)");
};
exports.createInternalServerError = createInternalServerError;
const createErrorWithMessage = (status, message) => {
    return new ErrorWithMessage(status, message);
};
exports.createErrorWithMessage = createErrorWithMessage;
const createFieldError = (fields) => {
    return new FieldError(fields);
};
exports.createFieldError = createFieldError;
const errorMiddleware = (error, req, res, next) => {
    console.error(error);
    if (error instanceof CustomError) {
        res.status(error.status).json(error.toJSON());
        return;
    }
    // Untuk error yang instancenya bukan yang CustomError (contoh Error instance dari JS)
    const defaultError = (0, exports.createErrorWithMessage)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    res.status(defaultError.status).json(defaultError.toJSON());
};
exports.errorMiddleware = errorMiddleware;
