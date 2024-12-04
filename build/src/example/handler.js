"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExampleHandler = void 0;
const validation_1 = require("../validation");
const validation_2 = require("./validation");
const service_1 = require("./service");
exports.getExampleHandler = (0, validation_1.withValidation)({
    paramsSchema: validation_2.getExampleQuerySchema,
}, (req, res, next) => {
    try {
        const { id } = req.query;
        const data = service_1.exampleService.list();
        res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        next?.(error);
    }
});
