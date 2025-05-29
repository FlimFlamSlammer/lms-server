import express from "express";
import {
    activateClassHandler,
    addStudentsHandler,
    addCoursesHandler,
    createClassHandler,
    deactivateClassHandler,
    getClassHandler,
    getClassesHandler,
    getStudentsNotInClassHandler,
    removeStudentsHandler,
    removeCoursesHandler,
    updateClassHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";

export const setupClassesRouter: SetupRouter = (router) => {
    const classesRouter = express.Router();

    classesRouter.get(
        "/:id",
        authMiddleware(["student", "teacher", "admin", "superadmin"]),
        getClassHandler
    );
    classesRouter.get(
        "/",
        authMiddleware(["student", "teacher", "admin", "superadmin"]),
        getClassesHandler
    );

    classesRouter.use(authMiddleware(["admin", "superadmin"]));

    classesRouter.post("/", createClassHandler);
    classesRouter.put("/:id", updateClassHandler);

    classesRouter.patch("/:id/activate", activateClassHandler);
    classesRouter.patch("/:id/deactivate", deactivateClassHandler);

    classesRouter.patch("/:id/add-students", addStudentsHandler);
    classesRouter.patch("/:id/remove-students", removeStudentsHandler);
    classesRouter.get(
        "/:id/students-not-in-class",
        getStudentsNotInClassHandler
    );

    classesRouter.patch("/:id/add-courses", addCoursesHandler);
    classesRouter.patch("/:id/remove-courses", removeCoursesHandler);

    router.use("/classes", classesRouter);
};
