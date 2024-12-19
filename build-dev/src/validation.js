"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    idParamsSchema: function() {
        return idParamsSchema;
    },
    listQuerySchema: function() {
        return listQuerySchema;
    },
    withValidation: function() {
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
var idParamsSchema = _zod.z.object({
    id: _zod.z.string()
});
var listQuerySchema = _zod.z.object({
    page: _zod.z.coerce.number().int().min(1).optional().default(1),
    size: _zod.z.coerce.number().int().min(1).optional().default(10),
    mode: _zod.z.enum([
        "all",
        "pagination"
    ]).optional().default("pagination"),
    search: _zod.z.string().optional(),
    status: _zod.z.enum([
        "active",
        "inactive",
        "all"
    ]).optional().default("all")
});
