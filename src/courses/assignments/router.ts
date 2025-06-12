import express from "express";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import {
    cancelAssignmentHandler,
    createAssignmentHandler,
    draftAssignmentHandler,
    getAssignmentHandler,
    getAssignmentsHandler,
    getMySubmissionsHandler,
    getSubmissionsHandler,
    gradeAssignmentHandler,
    postAssignmentHandler,
    submitAssignmentHandler,
    updateAssignmentHandler,
} from "./handler";
import { courseAccessMiddleware } from "../middleware";

export const setupAssignmentsRouter: SetupRouter = (router) => {
    const assignmentsRouter = express.Router({
        mergeParams: true,
    });

    assignmentsRouter.use(authMiddleware(), courseAccessMiddleware);

    assignmentsRouter.get("/:id", getAssignmentHandler);
    assignmentsRouter.get("/", getAssignmentsHandler);

    assignmentsRouter.get(
        "/:id/my-submissions",
        authMiddleware(["student"]),
        getMySubmissionsHandler
    );

    assignmentsRouter.post(
        "/:id/submit",
        authMiddleware(["student"]),
        submitAssignmentHandler
    );

    assignmentsRouter.post(
        "/",
        authMiddleware(["teacher"]),
        createAssignmentHandler
    );

    assignmentsRouter.use(authMiddleware(["teacher", "admin", "superadmin"]));

    assignmentsRouter.get("/:id/submissions", getSubmissionsHandler);

    assignmentsRouter.put("/:id", updateAssignmentHandler);

    assignmentsRouter.patch(
        "/:id/submissions/:studentId/grade",
        gradeAssignmentHandler
    );
    assignmentsRouter.patch("/:id/draft", draftAssignmentHandler);
    assignmentsRouter.patch("/:id/post", postAssignmentHandler);
    assignmentsRouter.patch("/:id/cancel", cancelAssignmentHandler);

    router.use("/:courseId/assignments", assignmentsRouter);
};
