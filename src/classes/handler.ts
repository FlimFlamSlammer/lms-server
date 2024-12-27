import { listQuerySchema, withValidation } from "~/validation";
import z from "zod";
import { validStatuses } from "~/types";
import { classService } from "./service";
import { StatusCodes } from "http-status-codes";
import { idParamsSchema } from "~/validation";

const classSchema = z.object({
	name: z.string(),
	status: z.enum(validStatuses),
});

const createClassBodySchema = classSchema.omit({ status: true });

export const createClassHandler = withValidation(
	{
		bodySchema: createClassBodySchema,
	},
	async (req, res, next) => {
		try {
			const data = req.body as z.infer<typeof createClassBodySchema>;
			await classService.create(data);

			res.status(StatusCodes.OK).json({
				message: "Class created successfully.",
			});
		} catch (error) {
			next(error);
		}
	}
);

const updateClassBodySchema = classSchema;

export const updateClassHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
		bodySchema: updateClassBodySchema,
	},
	async (req, res, next) => {
		try {
			const data = req.body as z.infer<typeof updateClassBodySchema>;
			const id = req.params.id;
			await classService.update(id, data);

			res.status(StatusCodes.OK).json({
				message: "Class updated successfully.",
			});
		} catch (error) {
			next(error);
		}
	}
);

export const getClassesHandler = withValidation(
	{
		querySchema: listQuerySchema,
	},
	async (req, res, next) => {
		try {
			const query = req.query as unknown as z.infer<typeof listQuerySchema>;

			const { data, total } = await classService.getAll(query);
			res.status(StatusCodes.OK).json({
				data,
				total,
			});
		} catch (error) {
			next(error);
		}
	}
);

export const getClassHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
	},
	async (req, res, next) => {
		try {
			const id = req.params.id;
			const $class = await classService.getById(id);

			res.status(StatusCodes.OK).json({
				data: $class,
			});
		} catch (error) {
			next(error);
		}
	}
);

export const activateClassHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
	},
	async (req, res, next) => {
		try {
			const id = req.params.id;

			await classService.update(id, { status: "active" });

			res.status(StatusCodes.OK).json({
				message: "Class activated successfully!",
			});
		} catch (error) {
			next(error);
		}
	}
);

export const deactivateClassHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
	},
	async (req, res, next) => {
		try {
			const id = req.params.id;

			await classService.update(id, { status: "inactive" });

			res.status(StatusCodes.OK).json({
				message: "Class deactivated successfully!",
			});
		} catch (error) {
			next(error);
		}
	}
);

const updateStudentsBodySchema = z.object({
	studentIds: z.array(z.string()),
});

export const addStudentsHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
		bodySchema: updateStudentsBodySchema,
	},
	async (req, res, next) => {
		try {
			const id = req.params.id;
			const data = req.body as z.infer<typeof updateStudentsBodySchema>;

			const missingStudents = await classService.addStudents(
				id,
				data.studentIds
			);

			res.status(StatusCodes.OK).json({
				message: "Students added successfully!",
				missingStudents:
					missingStudents.totalMissing > 0 ? missingStudents : undefined,
			});
		} catch (error) {
			next(error);
		}
	}
);

export const removeStudentsHandler = withValidation(
	{
		paramsSchema: idParamsSchema,
		bodySchema: updateStudentsBodySchema,
	},
	async (req, res, next) => {
		try {
			const id = req.params.id;
			const data = req.body as z.infer<typeof updateStudentsBodySchema>;

			await classService.removeStudents(id, data.studentIds);

			res.status(StatusCodes.OK).json({
				message: "Students removed successfully!",
			});
		} catch (error) {
			next(error);
		}
	}
);
