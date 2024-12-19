import express from "express";
import {
	getUserHandler,
	getUsersHandler,
	createUserHandler,
	updateUserHandler,
	activateUserHandler,
	deactivateUserHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import { UserRoles } from "./types";

export const setupUsersRouter: SetupRouter = (router) => {
	const usersRouter = express.Router();

	usersRouter.post(
		"/",
		authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
		createUserHandler
	);
	usersRouter.put(
		"/:id",
		authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
		updateUserHandler
	);

	usersRouter.patch(
		"/:id/activate",
		authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
		activateUserHandler
	);
	usersRouter.patch(
		"/:id/deactivate",
		authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
		deactivateUserHandler
	);

	usersRouter.get(
		"/:id",
		authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
		getUserHandler
	);
	usersRouter.get(
		"/",
		authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
		getUsersHandler
	);

	router.use("/users", usersRouter);
};
