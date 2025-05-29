import express from "express";
import {
    activateCourseHandler,
    addClassesHandler,
    addTeachersHandler,
    createCourseHandler,
    deactivateCourseHandler,
    getClassesNotInCourseHandler,
    getCourseHandler,
    getCoursesHandler,
    getTeachersNotInCourseHandler,
    removeClassesHandler,
    removeTeachersHandler,
    updateCourseHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import { setupAssignmentsRouter } from "./assignments/router";
import { courseAccessMiddleware } from "./middleware";

export const setupCoursesRouter: SetupRouter = (router) => {
    const coursesRouter = express.Router();

    setupAssignmentsRouter(coursesRouter);

    coursesRouter.use(
        authMiddleware(["student", "teacher", "admin", "superadmin"])
    );

    coursesRouter.get("/:id", courseAccessMiddleware, getCourseHandler);
    coursesRouter.get("/", getCoursesHandler);

    coursesRouter.use(authMiddleware(["admin", "superadmin"]));

    coursesRouter.get(
        "/:id/classes-not-in-course",
        getClassesNotInCourseHandler
    );
    coursesRouter.get(
        "/:id/teachers-not-in-course",
        getTeachersNotInCourseHandler
    );

    coursesRouter.post("/", createCourseHandler);
    coursesRouter.put("/:id", updateCourseHandler);

    coursesRouter.patch("/:id/activate", activateCourseHandler);
    coursesRouter.patch("/:id/deactivate", deactivateCourseHandler);

    coursesRouter.patch("/:id/add-teachers", addTeachersHandler);
    coursesRouter.patch("/:id/remove-teachers", removeTeachersHandler);

    coursesRouter.patch("/:id/add-classes", addClassesHandler);
    coursesRouter.patch("/:id/remove-classes", removeClassesHandler);

    router.use("/courses", coursesRouter);
};
