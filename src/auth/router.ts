import express from "express";
import {
    getUserHandler,
    loginHandler,
    logoutHandler,
    updatePasswordHandler,
} from "./handler";
import { authMiddleware } from "./middleware";
import { SetupRouter } from "~/router";

export const setupAuthRouter: SetupRouter = (router) => {
    const authRouter = express.Router();

    authRouter.post("/login", loginHandler);
    authRouter.post("/logout", logoutHandler);
    authRouter.get("/me", authMiddleware(), getUserHandler);
    authRouter.put("/update-password", authMiddleware(), updatePasswordHandler);

    router.use("/auth", authRouter);
};
