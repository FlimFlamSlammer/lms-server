import express from "express";
import { errorMiddleware } from "./error";
import cookieParser from "cookie-parser";
import { setupExampleRouter } from "./example/router";

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

const baseRouter = express.Router();

setupExampleRouter(baseRouter);

app.use("/api/v1", baseRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
