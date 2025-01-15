import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

abstract class CustomError extends Error {
    status: StatusCodes;

    constructor(status: StatusCodes) {
        super("");
        this.status = status;
    }

    abstract toJSON(): Record<string, any>;
}

class ErrorWithMessage extends CustomError {
    constructor(status: StatusCodes, message: string) {
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

type Fields = Record<string, string>;

/*

{
  email: "Wrong email format",
  password: "Not strong enough"
}

*/
// The error is used when the error of the system is caused by the incoming data from request body.
class FieldError extends CustomError {
    fields: Fields;

    constructor(fields: Fields) {
        super(StatusCodes.BAD_REQUEST);
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

export const createInternalServerError = () => {
    return new ErrorWithMessage(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Internal Server Error (Something wrong happened)"
    );
};

export const createErrorWithMessage = (
    status: StatusCodes,
    message: string
) => {
    return new ErrorWithMessage(status, message);
};

export const createFieldError = (fields: Fields) => {
    return new FieldError(fields);
};

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if (error instanceof CustomError) {
        res.status(error.status).json(error.toJSON());
        return;
    }

    // Untuk error yang instancenya bukan yang CustomError (contoh Error instance dari JS)
    const defaultError = createErrorWithMessage(
        StatusCodes.INTERNAL_SERVER_ERROR,
        error.message
    );

    res.status(defaultError.status).json(defaultError.toJSON());
};
