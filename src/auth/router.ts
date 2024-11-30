import express from "express";
import { loginHandler } from "./handler";
import { SetupRouter } from "src/router";

export const setupAuthRouter: SetupRouter = (router) => {
	const authRouter = express.Router();

	authRouter.post("/login", loginHandler);

	router.use("/auth", authRouter);
};
