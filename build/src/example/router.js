"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupExampleRouter = void 0;
const express_1 = __importDefault(require("express"));
const handler_1 = require("./handler");
const setupExampleRouter = (router) => {
    const exampleRouter = express_1.default.Router();
    exampleRouter.get("/:id", handler_1.getExampleHandler);
    router.use("/example", exampleRouter);
};
exports.setupExampleRouter = setupExampleRouter;
