import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { authService } from "./service";
import { createErrorWithMessage } from "~/error";

export function authMiddleware(
  roles: ("student" | "teacher" | "admin" | "superadmin")[] = []
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.cookies.authToken;
      const user = await authService.verifyAuthToken(authToken);

      if (
        roles &&
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
    } catch (error) {
      next(error);
    }
  };
}
