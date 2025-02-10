import { z } from "zod";
import { validAssignmentStatuses } from "./types";
import {
    idParamsSchema,
    listQuerySchema,
    withValidation,
    stringDateTimeSchema,
} from "~/validation";
import { asyncMiddleware } from "~/async-middleware";
import { assignmentService } from "./service";
import { StatusCodes } from "http-status-codes";
import { User } from "~/users/types";
import { createErrorWithMessage } from "~/error";
import { prismaInstance as prisma } from "~/prisma-client";
import { validBoolStrings } from "~/types";
import { fileExists } from "~/file/handler";

const subjectIdParamsSchema = z.object({ subjectId: z.string() });

const assignmentIdParamsSchema = z.intersection(
    idParamsSchema,
    subjectIdParamsSchema
);

const mutateAssignmentSchema = z.object({
    title: z.string().min(1),
    attachmentPath: z.string().optional(),
    startTime: stringDateTimeSchema,
    endTime: stringDateTimeSchema,
    maxGrade: z.number().min(1),
});

export const createAssignment = withValidation(
    {
        paramsSchema: subjectIdParamsSchema,
        bodySchema: mutateAssignmentSchema,
    },
    asyncMiddleware(async (req, res) => {
        const data = req.body as z.infer<typeof mutateAssignmentSchema>;
        const user = req.user as User;

        await assignmentService.create({
            subjectId: req.params.subjectId,
            teacherId: user.id,
            ...data,
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment created successfully!",
        });
    })
);

export const updateAssignment = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
        bodySchema: mutateAssignmentSchema,
    },
    asyncMiddleware(async (req, res) => {
        const data = req.body as z.infer<typeof mutateAssignmentSchema>;
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        await assignmentService.update(params.subjectId, params.id, data);

        res.status(StatusCodes.OK).json({
            message: "Assignment updated successfully!",
        });
    })
);

const getAssignmentsQuerySchema = z.intersection(
    listQuerySchema.omit({ status: true }),
    z.object({
        status: z
            .enum([...validAssignmentStatuses, "all"] as const)
            .optional()
            .default("all"),
        active: z
            .enum([...validBoolStrings, "all"] as const)
            .optional()
            .default("all"),
        done: z
            .enum([...validBoolStrings, "all"] as const)
            .optional()
            .default("all"),
    })
);

export const getAssignments = withValidation(
    {
        paramsSchema: subjectIdParamsSchema,
        querySchema: getAssignmentsQuerySchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof subjectIdParamsSchema>;
        const query = req.query as unknown as z.infer<
            typeof getAssignmentsQuerySchema
        >;

        const user = req.user as User;
        if (user.role == "student") {
            query.status = "posted";
            query.active = "true";
        }

        const { data, total } = await assignmentService.getAll(
            params.subjectId,
            query
        );

        res.status(StatusCodes.OK).json({
            data,
            total,
        });
    })
);

export const getAssignment = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        const data = await assignmentService.getById(
            params.subjectId,
            params.id
        );

        const user = req.user;
        if (user && data && user.role == "student") {
            if (
                !assignmentService.started(params.subjectId, params.id) ||
                data.status != "posted"
            ) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: "Assignment not found!",
                });
            }

            // check if the subject has a class that the student is enrolled in
            const studentInSubject = prisma.subject.findFirst({
                where: {
                    id: params.subjectId,
                    classes: {
                        some: {
                            students: {
                                some: {
                                    id: user.id,
                                },
                            },
                        },
                    },
                },
            });

            if (!studentInSubject) {
                res.status(StatusCodes.NOT_FOUND).json({
                    message: "Assignment not found!",
                });
            }
        }

        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const postAssignment = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        const assignment = await assignmentService.getById(
            params.subjectId,
            params.id
        );

        if (assignment && assignment.status == "canceled") {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Unable to post assignment because it's canceled!"
            );
        }

        await assignmentService.update(params.subjectId, params.id, {
            status: "posted",
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment posted successfully!",
        });
    })
);

export const draftAssignment = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        const assignment = await assignmentService.getById(
            params.subjectId,
            params.id
        );

        if (assignment && assignment.status == "canceled") {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Unable to draft assignment because it's canceled!"
            );
        }

        if (await assignmentService.started(params.subjectId, params.id)) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Unable to draft assignment because it has already started!"
            );
        }

        await assignmentService.update(params.subjectId, params.id, {
            status: "draft",
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment drafted successfully!",
        });
    })
);

export const cancelAssignment = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
    },
    asyncMiddleware(async (req, res) => {
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;
        await assignmentService.update(params.subjectId, params.id, {
            status: "canceled",
        });

        res.status(StatusCodes.OK).json({
            message: "Assignment canceled successfully!",
        });
    })
);

const submitAssignmentBodySchema = z.object({
    attachmentPath: z.string(),
});

export const submitAssignment = withValidation(
    {
        paramsSchema: assignmentIdParamsSchema,
        bodySchema: submitAssignmentBodySchema,
    },
    asyncMiddleware((req, res) => {
        if (!req.user) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "forgot to use auth middleware",
            });
            return;
        }

        const filePath = req.body.attachmentPath;
        const params = req.params as z.infer<typeof assignmentIdParamsSchema>;

        if (!filePath || !fileExists(filePath)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Attachment file not found!",
            });
            return;
        }

        assignmentService.submit(params.subjectId, params.id, {
            attachmentPath: filePath,
            studentId: req.user.id,
        });
    })
);
