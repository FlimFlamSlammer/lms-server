import { NextFunction, Request, Response } from "express";
import { createErrorWithMessage } from "src/error";
import { StatusCodes } from "http-status-codes";
import { authService } from "./service";

export function authMiddleware(
	role: "student" | "teacher" | "admin" | "superadmin"
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const authToken = req.cookies.authToken;
			const user = await authService.verifyAuthToken(authToken);

			if (user.role != role) {
				throw createErrorWithMessage(
					StatusCodes.FORBIDDEN,
					"User does not have permission."
				);
			}

			req.body.user = user;
			next();
		} catch (error) {
			next(error);
		}
	};
}
