import express from "express";
import {
  createSubjectHandler,
  getSubjectHandler,
  getSubjectsHandler,
  updateSubjectHandler,
} from "./handler";
import { SetupRouter } from "~/router";
import { authMiddleware } from "~/auth/middleware";
import { UserRoles } from "~/users/types";

export const setupSubjectsRouter: SetupRouter = (router) => {
  const subjectsRouter = express.Router();

  subjectsRouter.post(
    "/",
    authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
    createSubjectHandler
  );
  subjectsRouter.put(
    "/:id",
    authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
    updateSubjectHandler
  );

  subjectsRouter.get(
    "/:id",
    authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
    getSubjectHandler
  );
  subjectsRouter.get(
    "/",
    authMiddleware([UserRoles.ADMIN, UserRoles.SUPERADMIN]),
    getSubjectsHandler
  );

  router.use("/subjects", subjectsRouter);
};
