import express from "express";
import {
	activateClassHandler,
	createClassHandler,
	deactivateClassHandler,
	getClassHandler,
	getClassesHandler,
	updateClassHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";

export const setupClassesRouter: SetupRouter = (router) => {
	const classesRouter = express.Router();

	classesRouter.use(authMiddleware(["admin", "superadmin"]));

	classesRouter.post("/", createClassHandler);
	classesRouter.put("/:id", updateClassHandler);

	classesRouter.get("/:id", getClassHandler);
	classesRouter.get("/", getClassesHandler);

	classesRouter.patch("/:id/activate", activateClassHandler);
	classesRouter.patch("/:id/deactivate", deactivateClassHandler);

	router.use("/classes", classesRouter);
};
