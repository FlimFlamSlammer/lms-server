import express from "express";
import {
	activateClassHandler,
	addStudentsHandler,
	addSubjectsHandler,
	createClassHandler,
	deactivateClassHandler,
	getClassHandler,
	getClassesHandler,
	removeStudentsHandler,
	removeSubjectsHandler,
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

	classesRouter.patch("/:id/add-students", addStudentsHandler);
	classesRouter.patch("/:id/remove-students", removeStudentsHandler);

	classesRouter.patch("/:id/add-subjects", addSubjectsHandler);
	classesRouter.patch("/:id/remove-subjects", removeSubjectsHandler);

	router.use("/classes", classesRouter);
};
