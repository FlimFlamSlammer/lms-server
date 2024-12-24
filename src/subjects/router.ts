import express from "express";
import {
	activateSubjectHandler,
	createSubjectHandler,
	deactivateSubjectHandler,
	getSubjectHandler,
	getSubjectsHandler,
	updateSubjectHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";

export const setupSubjectsRouter: SetupRouter = (router) => {
	const subjectsRouter = express.Router();

	subjectsRouter.use(authMiddleware(["admin", "superadmin"]));

	subjectsRouter.post("/", createSubjectHandler);
	subjectsRouter.put("/:id", updateSubjectHandler);

	subjectsRouter.get("/:id", getSubjectHandler);
	subjectsRouter.get("/", getSubjectsHandler);

	subjectsRouter.patch("/:id/activate", activateSubjectHandler);
	subjectsRouter.patch("/:id/deactivate", deactivateSubjectHandler);

	router.use("/subjects", subjectsRouter);
};
