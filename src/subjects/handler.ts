import { withValidation } from "~/validation";
import z from "zod";
import { validStatuses } from "./types";
import { subjectService } from "./service";
import { StatusCodes } from "http-status-codes";
import { idParamsSchema } from "~/types";
import { Request, NextFunction, Response } from "express";
import { Stats } from "fs";

const subjectSchema = z.object({
	name: z.string(),
	grade: z.number(),
	startYear: z.number(),
	endYear: z.number(),
	status: z.enum(validStatuses),
});
const createSubjectBodySchema = subjectSchema.omit({ status: true });

export const createSubjectHandler = withValidation(
	{
		bodySchema: createSubjectBodySchema,
	},
	async (req, res, next) => {
		try {
			const data = req.body as z.infer<typeof createSubjectBodySchema>;
			await subjectService.create(data);

			res.status(StatusCodes.OK).json({
				message: "Subject created successfully.",
			});
		} catch (error) {
			next(error);
		}
	}
);

const updateSubjectBodySchema = subjectSchema;

export const updateSubjectHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
		bodySchema: updateSubjectBodySchema,
	},
	async (req, res, next) => {
		try {
			const data = req.body as z.infer<typeof updateSubjectBodySchema>;
			const id = req.params.id;
			await subjectService.update(id, data);

			res.status(StatusCodes.OK).json({
				message: "Subject updated successfully.",
			});
		} catch (error) {
			next(error);
		}
	}
);

export const getSubjectsHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const subjects = await subjectService.getAll();
		res.status(StatusCodes.OK).json({
			data: subjects,
		});
	} catch (error) {
		next(error);
	}
};

export const getSubjectHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
	},
	async (req, res, next) => {
		try {
			const id = req.params.id;
			const subject = await subjectService.getById(id);

			res.status(StatusCodes.OK).json({
				data: subject,
			});
		} catch (error) {
			next(error);
		}
	}
);
