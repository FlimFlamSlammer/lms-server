import express from "express";
import { getUserHandler, loginHandler, logoutHandler } from "./handler";
import { authMiddleware } from "./middleware";
export var setupAuthRouter = function(router) {
    var authRouter = express.Router();
    authRouter.post("/login", loginHandler);
    authRouter.post("/logout", logoutHandler);
    authRouter.get("/user", authMiddleware(), getUserHandler);
    router.use("/auth", authRouter);
};
