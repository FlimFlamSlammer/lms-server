import { Handler } from "express";
import { z } from "zod";
import { createErrorWithMessage, createFieldError } from "./error";
import { StatusCodes } from "http-status-codes";

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
