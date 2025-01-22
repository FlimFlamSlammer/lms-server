import express from "express";
import { createFieldError, errorMiddleware } from "./error";
import cookieParser from "cookie-parser";
import { setupAuthRouter } from "./auth/router";
import { setupUsersRouter } from "./users/router";
import { setupSubjectsRouter } from "./subjects/router";
import { setupClassesRouter } from "./classes/router";
import { authMiddleware } from "./auth/middleware";
import { uploadFile } from "./multer";
import { MulterError } from "multer";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const baseRouter = express.Router();

setupAuthRouter(baseRouter);
setupUsersRouter(baseRouter);
setupClassesRouter(baseRouter);
setupSubjectsRouter(baseRouter);

baseRouter.post(
    "/file/upload",
    authMiddleware(["admin", "student", "superadmin", "teacher"]),
    (req, res, next) => {
        uploadFile(req, res, (error) => {
            const { field } = req.body;

            if (error instanceof MulterError) {
                return next(
                    createFieldError({
                        [field]: "Maximum file size is 10MB.",
                    })
                );
            }

            if (error && error.message === "File is not supported!") {
                return next(
                    createFieldError({
                        [field]: error.message,
                    })
                );
            }

            res.json({
                file: req.file,
            });
        });
    }
);

baseRouter.get("/file/:filename", authMiddleware(), (req, res, next) => {
    // retrive it.
});

app.use("/api/v1", baseRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
