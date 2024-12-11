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

export const setupUsersRouter: SetupRouter = (router) => {
	const usersRouter = express.Router();

	usersRouter.post("/", createUserHandler);
	usersRouter.put("/:id", updateUserHandler);

	usersRouter.patch("/:id/activate", activateUserHandler);
	usersRouter.patch("/:id/deactivate", deactivateUserHandler);

	usersRouter.get("/:id", getUserHandler);
	usersRouter.get("/", getUsersHandler);

	router.use("/users", usersRouter);
};
