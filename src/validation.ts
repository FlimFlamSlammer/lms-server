import { Handler } from "express";
import { z } from "zod";
import { createErrorWithMessage } from "./error";
import { StatusCodes } from "http-status-codes";
import { validStatuses } from "./types";

type ValidationSchemas = {
    bodySchema?: z.Schema;
    querySchema?: z.Schema;
    paramsSchema?: z.Schema;
};

export const withValidation = (
    schemas: ValidationSchemas,
    handler: Handler
): Handler => {
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
        } catch (error) {
            if (error instanceof z.ZodError) {
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

            throw createErrorWithMessage(
                StatusCodes.INTERNAL_SERVER_ERROR,
                (error as Error).message
            );
        }
    };
};

export const idParamsSchema = z.object({
    id: z.string(),
});

export const listQuerySchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    size: z.coerce.number().int().min(1).optional().default(10),
    mode: z.enum(["all", "pagination"]).optional().default("pagination"),
    search: z.string().optional(),
    status: z
        .enum([...validStatuses, "all"] as const)
        .optional()
        .default("all"),
});

export const stringDateSchema = z
    .string()
    .date()
    .transform((str) => new Date(str));

export const stringDateTimeSchema = z
    .string()
    .datetime()
    .transform((str) => new Date(str));
