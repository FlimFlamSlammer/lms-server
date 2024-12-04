"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const handler_1 = require("./handler");
const middleware_1 = require("./middleware");
const setupAuthRouter = (router) => {
    const authRouter = express_1.default.Router();
    authRouter.post("/login", handler_1.loginHandler);
    authRouter.post("/logout", handler_1.logoutHandler);
    authRouter.get("/user", (0, middleware_1.authMiddleware)(), handler_1.getUserHandler);
    router.use("/auth", authRouter);
};
exports.setupAuthRouter = setupAuthRouter;
