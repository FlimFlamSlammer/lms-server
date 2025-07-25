import { string, z } from "zod";
import { idParamsSchema, listQuerySchema, withValidation } from "~/validation";
import { asyncMiddleware } from "~/async-middleware";
import { assignmentService } from "./service";
import { StatusCodes } from "http-status-codes";
import { User } from "~/users/types";
import { createErrorWithMessage } from "~/error";
import { prismaInstance as prisma } from "~/prisma-client";
import { fileExists } from "~/file/handler";
import { getAssignmentsQuerySchema } from "./validation";

const courseIdParamsSchema = z.object({ courseId: z.string() });

const assignmentIdParamsSchema = z.intersection(
    idParamsSchema,
    courseIdParamsSchema
);

const mutateAssignmentSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    maxGrade: z.number().min(1),
});

export const createAssignmentHandler = withValidation(
    {
        paramsSchema: courseIdParamsSchema,
        bodySchema: mutateAssignmentSchema,
    },
    asyncMiddleware(async (req, res) => {
        const data = req.body as z.infer<typeof mutateAssignmentSchema>;
        const user = req.user as User;

        const created = await assignmentService.create({
            courseId: req.params.courseId,
            teacherId: user.id,
            ...data,
        });

        res.status(StatusCodes.OK).json({
            data: created,
            message: "Assignment created successfully!",
        });
    })
);

export const updateAssignmentHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
        bodySchema: mutateAssignmentSchema,
    },
    asyncMiddleware(async (req, res) => {
        const data = req.body as z.infer<typeof mutateAssignmentSchema>;
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        await assignmentService.update(params.courseId, params.id, data);

        res.status(StatusCodes.OK).json({
            message: "Assignment updated successfully!",
        });
    })
);

export const getAssignmentsHandler = withValidation(
    {
        paramsSchema: courseIdParamsSchema,
        querySchema: getAssignmentsQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const params = req.params as z.infer<typeof courseIdParamsSchema>;
        const query = req.query as unknown as z.infer<
            typeof getAssignmentsQuerySchema
        >;

        if (req.user?.role == "student") {
            query.status = "posted";
            query.started = "true";
        }

        const data = await assignmentService.getAll(params.courseId, query);

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getAssignmentHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        const data = await assignmentService.getById(
            params.courseId,
            params.id
        );

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const postAssignmentHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        const assignment = await assignmentService.getById(
            params.courseId,
            params.id
        );

        if (assignment && assignment.status == "canceled") {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Unable to post assignment because it's canceled!"
            );
        }

        await assignmentService.update(params.courseId, params.id, {
            status: "posted",
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment posted successfully!",
        });
    })
);

export const draftAssignmentHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        const assignment = await assignmentService.getById(
            params.courseId,
            params.id
        );

        if (assignment && assignment.status == "canceled") {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Unable to draft assignment because it's canceled!"
            );
        }

        if (await assignmentService.started(params.courseId, params.id)) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Unable to draft assignment because it has already started!"
            );
        }

        await assignmentService.update(params.courseId, params.id, {
            status: "draft",
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment drafted successfully!",
        });
    })
);

export const cancelAssignmentHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        await assignmentService.update(params.courseId, params.id, {
            status: "canceled",
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment canceled successfully!",
        });
    })
);

export const getSubmissionsHandler = withValidation(
    {
        querySchema: listQuerySchema,
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const data = await assignmentService.getSubmissions(
            params.courseId,
            params.id,
            query
        );

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getMySubmissionsHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        const user = req.user;

        const data = await assignmentService.getStudentSubmissions(
            params.courseId,
            params.id,
            user.id
        );

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

const submitAssignmentBodySchema = z.object({
    attachmentPath: z.string(),
});

export const submitAssignmentHandler = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
        bodySchema: submitAssignmentBodySchema,
    },
    asyncMiddleware(async (req, res) => {
        const filePath = req.body.attachmentPath;
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        if (!filePath || !fileExists(filePath)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Attachment file not found!",
            });
            return;
        }

        await assignmentService.submit(params.courseId, params.id, {
            attachmentPath: filePath,
            studentId: req.user.id,
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment submitted successfully!",
        });
    })
);

const gradeAssignmentBodySchema = z.object({
    grade: z.coerce.number(),
});

const gradeAssignmentParamsSchema = z.intersection(
    assignmentIdParamsSchema,
    z.object({
        studentId: z.string(),
    })
);

export const gradeAssignmentHandler = withValidation(
    {
        paramsSchema: gradeAssignmentParamsSchema,
        bodySchema: gradeAssignmentBodySchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<
            typeof gradeAssignmentParamsSchema
        >;
        console.log(req.body);
        await assignmentService.grade(
            params.courseId,
            params.id,
            params.studentId,
            req.body
        );

        res.status(StatusCodes.OK).json({
            message: "Assignment graded successfully!",
        });
    })
);
