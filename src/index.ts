import express from "express";
import { errorMiddleware } from "./error";
import cookieParser from "cookie-parser";
import { setupAuthRouter } from "./auth/router";
import { setupUsersRouter } from "./users/router";
import { setupSubjectsRouter } from "./subjects/router";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const baseRouter = express.Router();

setupAuthRouter(baseRouter);
setupUsersRouter(baseRouter);
setupSubjectsRouter(baseRouter);

app.use("/api/v1", baseRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
