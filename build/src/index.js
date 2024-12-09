import express from "express";
import { errorMiddleware } from "./error";
import cookieParser from "cookie-parser";
import { setupAuthRouter } from "./auth/router";
var app = express();
var PORT = 5000;
app.use(express.json());
app.use(cookieParser());
var baseRouter = express.Router();
setupAuthRouter(baseRouter);
app.use("/api/v1", baseRouter);
app.use(errorMiddleware);
app.listen(PORT, function() {
    console.log("Server is running on http://localhost:".concat(PORT));
});
