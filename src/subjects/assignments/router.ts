import express from "express";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import {
    cancelAssignmentHandler,
    createAssignmentHandler,
    draftAssignmentHandler,
    getAssignmentHandler,
    getAssignmentsHandler,
    postAssignmentHandler,
    submitAssignmentHandler,
    updateAssignmentHandler,
} from "./handler";

export const setupAssignmentsRouter: SetupRouter = (router) => {
    const assignmentsRouter = express.Router({
        mergeParams: true,
    });

    assignmentsRouter.get("/:id", authMiddleware(), getAssignmentHandler);
    assignmentsRouter.get("/", authMiddleware(), getAssignmentsHandler);

    assignmentsRouter.use(authMiddleware(["teacher", "admin", "superadmin"]));

    assignmentsRouter.post("/", createAssignmentHandler);
    assignmentsRouter.post(
        "/:id",
        authMiddleware(["student"]),
        submitAssignmentHandler
    );

    assignmentsRouter.put("/:id", updateAssignmentHandler);

    assignmentsRouter.patch("/:id/draft", draftAssignmentHandler);
    assignmentsRouter.patch("/:id/post", postAssignmentHandler);
    assignmentsRouter.patch("/:id/cancel", cancelAssignmentHandler);

    router.use("/:subjectId/assignments", assignmentsRouter);
};
