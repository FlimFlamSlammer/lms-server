"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "withValidation", {
    enumerable: true,
    get: function() {
        return withValidation;
    }
});
var _zod = require("zod");
var _error = require("./error");
var _httpstatuscodes = require("http-status-codes");
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
var withValidation = function(schemas, handler) {
    var bodySchema = schemas.bodySchema, paramsSchema = schemas.paramsSchema, querySchema = schemas.querySchema;
    return function(req, res, next) {
        try {
            // validation happens
            if (bodySchema !== undefined) {
                req.body = bodySchema.parse(req.body);
            }
            if (querySchema !== undefined) {
                req.query = querySchema.parse(req.query);
            }
            if (paramsSchema !== undefined) {
                req.params = paramsSchema.parse(req.params);
            }
            handler(req, res, next);
        } catch (error) {
            if (_instanceof(error, _zod.z.ZodError)) {
                // const fields = error.errors.reduce(
                // 	(acc, { path, message }) => ({
                // 		...acc,
                // 		[path.join(".")]: message,
                // 	}),
                // 	{}
                // );
                // const response = {
                // 	status: 400,
                // 	error: fields,
                // };
                // throw createFieldError(fields);
                next(error);
            }
            throw (0, _error.createErrorWithMessage)(_httpstatuscodes.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    };
};
