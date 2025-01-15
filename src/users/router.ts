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

export const setupUsersRouter: SetupRouter = (router) => {
    const usersRouter = express.Router();

    usersRouter.use(authMiddleware(["admin", "superadmin"]));

    usersRouter.post("/", createUserHandler);
    usersRouter.put("/:id", updateUserHandler);

    usersRouter.patch("/:id/activate", activateUserHandler);
    usersRouter.patch("/:id/deactivate", deactivateUserHandler);

    usersRouter.get("/:id", getUserHandler);
    usersRouter.get("/", getUsersHandler);

    router.use("/users", usersRouter);
};
