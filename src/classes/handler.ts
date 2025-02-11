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

        const { data, total } = await classService.getAll(query);
        res.status(StatusCodes.OK).json({
            data,
            total,
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

const mutateSubjectsBodySchema = z.object({
    subjectIds: z.array(z.string()),
});

export const addSubjectsHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateSubjectsBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateSubjectsBodySchema>;

        const missingSubjects = await classService.addSubjects(id, {
            subjectIds: data.subjectIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Subjects added successfully!",
            missingSubjects:
                missingSubjects.totalMissing > 0 ? missingSubjects : undefined,
        });
    })
);

export const removeSubjectsHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateSubjectsBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateSubjectsBodySchema>;

        await classService.removeSubjects(id, { subjectIds: data.subjectIds });

        res.status(StatusCodes.OK).json({
            message: "Subjects removed successfully!",
        });
    })
);
