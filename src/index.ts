import express from "express";
import { errorMiddleware } from "./error";
import cookieParser from "cookie-parser";
import { setupAuthRouter } from "./auth/router";
import { setupUsersRouter } from "./users/router";
import { setupSubjectsRouter } from "./subjects/router";
import { setupClassesRouter } from "./classes/router";
import path from "path";
import fs from "fs";
import cors from "cors";
import { setupUploadRouter } from "./file/router";
import { setupAssignmentsRouter } from "./assignments/router";

const app = express();
const PORT = process.env.PORT || 5000;

const UPLOAD_PATH = path.resolve("data");

if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH);
}
app.use(
    cors({
        credentials: true,
        origin: process.env.APP_URL || "",
    })
);
app.use(express.json());
app.use(cookieParser());
const baseRouter = express.Router();

setupAuthRouter(baseRouter);
setupUsersRouter(baseRouter);
setupClassesRouter(baseRouter);
setupSubjectsRouter(baseRouter);
setupUploadRouter(baseRouter);
setupAssignmentsRouter(baseRouter);

app.use("/api/v1", baseRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
