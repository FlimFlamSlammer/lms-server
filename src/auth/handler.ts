import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { authService } from "./service";
import { NextFunction, Request, Response } from "express";
import { withValidation } from "~/validation";
import { UserRoles } from "~/users/types";
import { Student, Teacher } from "@prisma/client";
import { userService } from "~/users/service";

const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const loginHandler = withValidation(
	{
		bodySchema: loginBodySchema,
	},
	async (req, res, next) => {
		try {
			const data = req.body as z.infer<typeof loginBodySchema>;
			const authToken = await authService.login(data.email, data.password);

			res.cookie("authToken", authToken, {
				maxAge: 2 * 24 * 60 * 60 * 1000,
			});

			res.status(StatusCodes.OK).json({
				message: "Logged in successfully.",
				data: authToken,
			});
		} catch (error) {
			next(error);
		}
	}
);

export const logoutHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.clearCookie("authToken");
	res.status(StatusCodes.OK).json({
		message: "Logged out successfully.",
	});
};

export const getUserHandler = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		res.status(StatusCodes.OK).json({
			data: req.body.user,
		});
	} catch (error) {
		next(error);
	}
};
