import express from "express";
import { getExampleHandler } from "./handler";
export var setupExampleRouter = function(router) {
    var exampleRouter = express.Router();
    exampleRouter.get("/:id", getExampleHandler);
    router.use("/example", exampleRouter);
};
