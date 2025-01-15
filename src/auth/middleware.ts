import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "./service";
import { UserRole } from "~/users/types";
import { createErrorWithMessage } from "~/error";
import { asyncMiddleware } from "~/async-middleware";

export const authMiddleware = (roles: UserRole[] = []) => {
	return asyncMiddleware(
		async (req: Request, res: Response, next: NextFunction) => {
			const authToken = req.cookies.authToken;
			const user = await authService.verifyAuthToken(authToken);

			if (
				roles.length &&
				!roles.find((role) => {
					return role == user.role;
				})
			) {
				throw createErrorWithMessage(
					StatusCodes.FORBIDDEN,
					"User does not have permission."
				);
			}

			req.body.user = user;
			next();
		}
	);
};
