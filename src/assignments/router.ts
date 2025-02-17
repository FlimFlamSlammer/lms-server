import express from "express";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import { getAssignmentsHandler } from "./handler";

export const setupAssignmentsRouter: SetupRouter = (router) => {
    const assignmentsRouter = express.Router();

    assignmentsRouter.get("/", authMiddleware(), getAssignmentsHandler);

    router.use("/assignments", assignmentsRouter);
};
