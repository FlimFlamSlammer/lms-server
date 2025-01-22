import express from "express";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import {
    cancelAssignment,
    createAssignment,
    draftAssignment,
    getAssignment,
    getAssignments,
    postAssignment,
    updateAssignment,
} from "./handler";

export const setupAssignmentsRouter: SetupRouter = (router) => {
    const assignmentsRouter = express.Router({
        mergeParams: true,
    });

    router.use("/:subjectId/assignments", assignmentsRouter);

    assignmentsRouter.get("/:id", authMiddleware(), getAssignment);
    assignmentsRouter.get("/", authMiddleware(), getAssignments);

    assignmentsRouter.use(authMiddleware(["teacher", "admin", "superadmin"]));

    assignmentsRouter.post("/", createAssignment);

    assignmentsRouter.put("/:id", updateAssignment);

    assignmentsRouter.patch("/:id/draft", draftAssignment);
    assignmentsRouter.patch("/:id/post", postAssignment);
    assignmentsRouter.patch("/:id/cancel", cancelAssignment);
};
