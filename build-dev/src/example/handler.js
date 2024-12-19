"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getExampleHandler", {
    enumerable: true,
    get: function() {
        return getExampleHandler;
    }
});
var _validation = require("../validation");
var _validation1 = require("./validation");
var _service = require("./service");
var getExampleHandler = (0, _validation.withValidation)({
    paramsSchema: _validation1.getExampleQuerySchema
}, function(req, res, next) {
    try {
        var id = req.query.id;
        var data = _service.exampleService.list();
        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        next === null || next === void 0 ? void 0 : next(error);
    }
});
