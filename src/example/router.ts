import express from "express";
import { getExampleHandler } from "./handler";
import { SetupRouter } from "../router";

export const setupExampleRouter: SetupRouter = (router) => {
	const exampleRouter = express.Router();

	exampleRouter.get("/:id", getExampleHandler);

	router.use("/example", exampleRouter);
};
