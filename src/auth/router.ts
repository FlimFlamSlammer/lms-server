import express from "express";
import { getUserHandler, loginHandler, logoutHandler } from "./handler";
import { authMiddleware } from "./middleware";
import { SetupRouter } from "~/router";

export const setupAuthRouter: SetupRouter = (router) => {
	const authRouter = express.Router();

	authRouter.post("/login", loginHandler);
	authRouter.post("/logout", logoutHandler);
	authRouter.get("/me", authMiddleware(), getUserHandler);

	router.use("/auth", authRouter);
};
