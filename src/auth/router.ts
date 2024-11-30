import express from "express";
import { getUserHandler, loginHandler, logoutHandler } from "./handler";
import { SetupRouter } from "src/router";
import { authMiddleware } from "./middleware";

export const setupAuthRouter: SetupRouter = (router) => {
	const authRouter = express.Router();

	authRouter.post("/login", loginHandler);
	authRouter.post("/logout", logoutHandler);
	authRouter.get("/user", authMiddleware(), getUserHandler);

	router.use("/auth", authRouter);
};
