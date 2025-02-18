import express from "express";
import {
    activateSubjectHandler,
    addClassesHandler,
    addTeachersHandler,
    createSubjectHandler,
    deactivateSubjectHandler,
    getSubjectHandler,
    getSubjectsHandler,
    removeClassesHandler,
    removeTeachersHandler,
    updateSubjectHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import { setupAssignmentsRouter } from "./assignments/router";
import { subjectAuthMiddleware } from "./middleware";

export const setupSubjectsRouter: SetupRouter = (router) => {
    const subjectsRouter = express.Router();

    subjectsRouter.use(authMiddleware(), subjectAuthMiddleware);

    setupAssignmentsRouter(subjectsRouter);

    subjectsRouter.use(authMiddleware(["admin", "superadmin"]));

    subjectsRouter.post("/", createSubjectHandler);
    subjectsRouter.put("/:id", updateSubjectHandler);

    subjectsRouter.get("/:id", getSubjectHandler);
    subjectsRouter.get("/", getSubjectsHandler);

    subjectsRouter.patch("/:id/activate", activateSubjectHandler);
    subjectsRouter.patch("/:id/deactivate", deactivateSubjectHandler);

    subjectsRouter.patch("/:id/add-teachers", addTeachersHandler);
    subjectsRouter.patch("/:id/remove-teachers", removeTeachersHandler);

    subjectsRouter.patch("/:id/add-classes", addClassesHandler);
    subjectsRouter.patch("/:id/remove-classes", removeClassesHandler);

    router.use("/subjects", subjectsRouter);
};
