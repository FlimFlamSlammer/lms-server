import { listQuerySchema, withValidation } from "~/validation";
import z from "zod";
import { validStatuses } from "~/types";
import { classService } from "./service";
import { StatusCodes } from "http-status-codes";
import { idParamsSchema } from "~/validation";
import { asyncMiddleware } from "~/async-middleware";

const classSchema = z.object({
    name: z.string(),
    status: z.enum(validStatuses),
});

const createClassBodySchema = classSchema.omit({ status: true });

export const createClassHandler = withValidation(
    {
        bodySchema: createClassBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof createClassBodySchema>;
        const created = await classService.create(data);

        res.status(StatusCodes.OK).json({
            data: created,
            message: "Class created successfully.",
        });
    })
);

const updateClassBodySchema = classSchema;

export const updateClassHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: updateClassBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof updateClassBodySchema>;
        const id = req.params.id;
        await classService.update(id, data);

        res.status(StatusCodes.OK).json({
            message: "Class updated successfully.",
        });
    })
);

export const getClassesHandler = withValidation(
    {
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const data = await classService.getAll(query);
        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getClassHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = await classService.getById(id);

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const activateClassHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await classService.update(id, { status: "active" });

        res.status(StatusCodes.OK).json({
            message: "Class activated successfully!",
        });
    })
);

export const deactivateClassHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await classService.update(id, { status: "inactive" });

        res.status(StatusCodes.OK).json({
            message: "Class deactivated successfully!",
        });
    })
);

export const getStudentsNotInClassHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        const data = await classService.getStudentsNotInClass(id);
        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getStudentsHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const students = await classService.getStudents(id, query);

        res.status(StatusCodes.ACCEPTED).json({
            data: students,
        });
    })
);

const mutateStudentsBodySchema = z.object({
    studentIds: z.array(z.string()),
});

export const addStudentsHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateStudentsBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateStudentsBodySchema>;

        const missingStudents = await classService.addStudents(id, {
            studentIds: data.studentIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Students added successfully!",
            missingStudents:
                missingStudents.totalMissing > 0 ? missingStudents : undefined,
        });
    })
);

export const removeStudentsHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateStudentsBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateStudentsBodySchema>;

        await classService.removeStudents(id, {
            studentIds: data.studentIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Students removed successfully!",
        });
    })
);

const mutateCoursesBodySchema = z.object({
    courseIds: z.array(z.string()),
});

export const addCoursesHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateCoursesBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateCoursesBodySchema>;

        const missingCourses = await classService.addCourses(id, {
            courseIds: data.courseIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Courses added successfully!",
            missingCourses:
                missingCourses.totalMissing > 0 ? missingCourses : undefined,
        });
    })
);

export const removeCoursesHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateCoursesBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateCoursesBodySchema>;

        await classService.removeCourses(id, { courseIds: data.courseIds });

        res.status(StatusCodes.OK).json({
            message: "Courses removed successfully!",
        });
    })
);
