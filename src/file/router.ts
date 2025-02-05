import express from "express";
import { authMiddleware } from "~/auth/middleware";
import { uploadFile } from "~/multer";
import { SetupRouter } from "~/router";
import { getFileHandler, uploadHandler } from "./handler";

export const setupUploadRouter: SetupRouter = (router) => {
    const uploadRouter = express.Router();

    uploadRouter.use(
        authMiddleware(["student", "teacher", "admin", "superadmin"])
    );
    uploadRouter.post("/upload", uploadFile.single("file"), uploadHandler);
    uploadRouter.get("/:fileName", getFileHandler);

    router.use("/file", uploadRouter);
};
