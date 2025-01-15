import { Handler } from "express";

export const asyncMiddleware =
    (middleware: Handler): Handler =>
    async (req, res, next) => {
        try {
            await middleware(req, res, next);
        } catch (error) {
            next(error);
        }
    };
