import { listQuerySchema, withValidation } from "~/validation";
import z from "zod";
import { validStatuses } from "~/types";
import { courseService } from "./service";
import { StatusCodes } from "http-status-codes";
import { idParamsSchema } from "~/validation";
import { asyncMiddleware } from "~/async-middleware";

const courseSchema = z.object({
    name: z.string(),
    grade: z.number(),
    startYear: z.number(),
    endYear: z.number(),
    status: z.enum(validStatuses),
});
const createCourseBodySchema = courseSchema.omit({ status: true });

export const createCourseHandler = withValidation(
    {
        bodySchema: createCourseBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof createCourseBodySchema>;
        const created = await courseService.create(data);

        res.status(StatusCodes.OK).json({
            data: created,
            message: "Course created successfully.",
        });
    })
);

const updateCourseBodySchema = courseSchema;

export const updateCourseHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: updateCourseBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof updateCourseBodySchema>;
        const id = req.params.id;
        await courseService.update(id, data);

        res.status(StatusCodes.OK).json({
            message: "Course updated successfully.",
        });
    })
);

export const getCoursesHandler = withValidation(
    {
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const data = await courseService.getAll(query, req.user);
        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getCourseHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const data = await courseService.getById(id);

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const activateCourseHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await courseService.update(id, { status: "active" });

        res.status(StatusCodes.OK).json({
            message: "Course activated successfully!",
        });
    })
);

export const deactivateCourseHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await courseService.update(id, { status: "inactive" });

        res.status(StatusCodes.OK).json({
            message: "Course deactivated successfully!",
        });
    })
);

export const getTeachersNotInCourseHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const teachers = await courseService.getTeachersNotInCourse(
            req.params.id
        );
        res.status(StatusCodes.ACCEPTED).json({
            data: teachers,
        });
    })
);

export const getTeachersHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;
        const data = await courseService.getTeachers(req.params.id, query);

        res.status(StatusCodes.ACCEPTED).json(data);
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

        const missingTeachers = await courseService.addTeachers(id, {
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

        await courseService.removeTeachers(id, {
            teacherIds: data.teacherIds,
        });

        res.status(StatusCodes.OK).json({
            message: "Teachers removed successfully!",
        });
    })
);

export const getClassesNotInCourseHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const classes = await courseService.getClassesNotInCourse(
            req.params.id
        );
        res.status(StatusCodes.ACCEPTED).json({
            data: classes,
        });
    })
);

export const getClassesHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;
        const data = await courseService.getClasses(req.params.id, query);

        res.status(StatusCodes.ACCEPTED).json(data);
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

        const missingClasses = await courseService.addClasses(id, {
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

        await courseService.removeClasses(id, { classIds: data.classIds });

        res.status(StatusCodes.OK).json({
            message: "Classes removed successfully!",
        });
    })
);
