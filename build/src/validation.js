"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withValidation = void 0;
const zod_1 = require("zod");
const error_1 = require("./error");
const http_status_codes_1 = require("http-status-codes");
const withValidation = (schemas, handler) => {
    const { bodySchema, paramsSchema, querySchema } = schemas;
    return (req, res, next) => {
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
        }
        catch (error) {
            if (error instanceof zod_1.z.ZodError) {
                const fields = error.errors.reduce((acc, { path, message }) => ({
                    ...acc,
                    [path.join(".")]: message,
                }), {});
                const response = {
                    status: 400,
                    error: fields,
                };
                throw (0, error_1.createFieldError)(fields);
            }
            throw (0, error_1.createErrorWithMessage)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    };
};
exports.withValidation = withValidation;
