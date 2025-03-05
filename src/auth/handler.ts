import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { authService } from "./service";
import { NextFunction, Request, Response } from "express";
import { withValidation } from "~/validation";
import { asyncMiddleware } from "~/async-middleware";

const loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const loginHandler = withValidation(
    {
        bodySchema: loginBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof loginBodySchema>;
        const { token, user } = await authService.login(
            data.email,
            data.password
        );

        res.status(StatusCodes.OK).json({
            message: "Logged in successfully.",
            data: {
                token,
                user,
            },
        });
    })
);

export const logoutHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(StatusCodes.OK).json({
        message: "Logged out successfully.",
    });
};

export const getUserHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.status(StatusCodes.OK).json({
        data: req.user,
    });
};
