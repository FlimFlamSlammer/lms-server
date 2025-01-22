import { listQuerySchema, withValidation } from "~/validation";
import z from "zod";
import { validStatuses } from "~/types";
import { subjectService } from "./service";
import { StatusCodes } from "http-status-codes";
import { idParamsSchema } from "~/validation";
import { asyncMiddleware } from "~/async-middleware";

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
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof createSubjectBodySchema>;
        await subjectService.create(data);

        res.status(StatusCodes.OK).json({
            message: "Subject created successfully.",
        });
    })
);

const updateSubjectBodySchema = subjectSchema;

export const updateSubjectHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: updateSubjectBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof updateSubjectBodySchema>;
        const id = req.params.id;
        await subjectService.update(id, data);

        res.status(StatusCodes.OK).json({
            message: "Subject updated successfully.",
        });
    })
);

export const getSubjectsQuerySchema = listQuerySchema.extend({
    teacherId: z.string().optional().default("all"),
});

export const getSubjectsHandler = withValidation(
    {
        querySchema: getSubjectsQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<
            typeof getSubjectsQuerySchema
        >;

        const { data, total } = await subjectService.getAll(query);
        res.status(StatusCodes.OK).json({
            data,
            total,
        });
    })
);

export const getSubjectHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = await subjectService.getById(id);

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const activateSubjectHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await subjectService.update(id, { status: "active" });

        res.status(StatusCodes.OK).json({
            message: "Subject activated successfully!",
        });
    })
);

export const deactivateSubjectHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await subjectService.update(id, { status: "inactive" });

        res.status(StatusCodes.OK).json({
            message: "Subject deactivated successfully!",
        });
    })
);

const mutateTeachersBodySchema = z.object({
    teacherIds: z.array(z.string()),
});

export const addTeachersHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateTeachersBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateTeachersBodySchema>;

        const missingTeachers = await subjectService.addTeachers(id, {
            teacherIds: data.teacherIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Teachers added successfully!",
            missingTeachers:
                missingTeachers.totalMissing > 0 ? missingTeachers : undefined,
        });
    })
);

export const removeTeachersHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateTeachersBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateTeachersBodySchema>;

        await subjectService.removeTeachers(id, {
            teacherIds: data.teacherIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Teachers removed successfully!",
        });
    })
);

const mutateClassesBodySchema = z.object({
    classIds: z.array(z.string()),
});

export const addClassesHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateClassesBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateClassesBodySchema>;

        const missingClasses = await subjectService.addClasses(id, {
            classIds: data.classIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Classes added successfully!",
            missingClasses:
                missingClasses.totalMissing > 0 ? missingClasses : undefined,
        });
    })
);

export const removeClassesHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: mutateClassesBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = req.body as z.infer<typeof mutateClassesBodySchema>;

        await subjectService.removeClasses(id, { classIds: data.classIds });

        res.status(StatusCodes.OK).json({
            message: "Classes removed successfully!",
        });
    })
);
