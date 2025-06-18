import { StatusCodes } from "http-status-codes";
import { createErrorWithMessage } from "~/error";
import { prismaInstance as prisma } from "~/prisma-client";
import {
    Assignment,
    AssignmentListParams,
    AssignmentToStudent,
    CreateAssignmentDTO,
    SubmitAssignmentDTO,
    UpdateAssignmentDTO,
    UpdateSubmissionDTO,
} from "./types";
import { nanoid } from "nanoid";
import { courseService } from "../service";
import { User } from "~/users/types";
import { Submission } from "@prisma/client";
import { listQuery } from "~/list-query";
import { ListParams } from "~/types";

class AssignmentService {
    constructor() {}

    async validateAssignment(
        courseId: string,
        id: string
    ): Promise<Assignment> {
        await courseService.validateCourse(courseId);
        const assignment = (await prisma.assignment.findFirst({
            where: {
                courseId,
                id,
            },
        })) as Assignment;
        if (!assignment) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Assignment not found!"
            );
        }
        return assignment;
    }

    async create(data: CreateAssignmentDTO): Promise<Assignment> {
        return (await prisma.assignment.create({
            data: {
                id: nanoid(),
                status: "draft",
                ...data,
                submissions: undefined,
            },
        })) as Assignment;
    }

    async update(
        courseId: string,
        id: string,
        data: UpdateAssignmentDTO
    ): Promise<Assignment> {
        await this.validateAssignment(courseId, id);

        return (await prisma.assignment.update({
            where: {
                id,
            },
            data: {
                ...data,
                submissions: undefined,
            },
        })) as Assignment;
    }

    async getAll(
        courseId: string,
        {
            page,
            search,
            size,
            mode,
            status,
            active,
            done,
            started,
        }: AssignmentListParams
    ) {
        await courseService.validateCourse(courseId);

        const where: Record<string, any> = {
            courseId,
        };

        const now = new Date();

        if (active == "true") {
            where.startTime = {
                lte: now,
            };
            where.endTime = {
                gt: now,
            };
        } else if (active == "false") {
            where.OR = [
                {
                    startTime: {
                        gt: now,
                    },
                },
                {
                    endTime: {
                        lte: now,
                    },
                },
            ];
        }

        if (started == "true") {
            where.startTime = {
                lte: now,
            };
        } else if (started == "false") {
            where.startTime = {
                gt: now,
            };
        }

        if (done == "true") {
            where.submissions = {
                some: {},
            };
        } else if (done == "false") {
            where.submissions = {
                none: {},
            };
        }

        return await listQuery<Assignment[]>({
            query: { page, size, mode, status, search },
            where,
            model: "Assignment",
            searchKey: "title",
        });
    }

    async getById(courseId: string, id: string): Promise<Assignment | null> {
        const assignment = (await prisma.assignment.findFirst({
            where: {
                id,
                courseId,
            },
        })) as Assignment | null;

        return assignment;
    }

    async started(courseId: string, id: string): Promise<Boolean> {
        const assignment = await this.validateAssignment(courseId, id);

        const curDate = new Date();

        return curDate >= assignment.startTime && assignment.status == "posted";
    }

    async canSubmit(courseId: string, id: string): Promise<Boolean> {
        const assignment = await this.validateAssignment(courseId, id);

        const curDate = new Date();

        return (
            (await this.started(courseId, id)) && curDate < assignment.endTime
        );
    }

    async getSubmissions(courseId: string, id: string, params: ListParams) {
        await this.validateAssignment(courseId, id);

        return await listQuery({
            query: params,
            model: "Submission",
            where: {
                assignmentId: id,
            },
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }

    async getStudentSubmissions(
        courseId: string,
        id: string,
        studentId: string
    ) {
        await this.validateAssignment(courseId, id);

        return (await prisma.submission.findMany({
            where: {
                assignmentId: id,
                studentId: studentId,
            },
        })) as AssignmentToStudent[];
    }

    async submit(
        courseId: string,
        id: string,
        data: SubmitAssignmentDTO
    ): Promise<Submission> {
        await this.validateAssignment(courseId, id);
        if (!(await this.canSubmit(courseId, id))) {
            throw createErrorWithMessage(
                StatusCodes.FORBIDDEN,
                "Assignment hasn't started, or is locked!"
            );
        }

        const submission = await this.getStudentSubmissions(
            courseId,
            id,
            data.studentId
        );

        if (submission.length) {
            throw createErrorWithMessage(
                StatusCodes.BAD_REQUEST,
                "Cannot resubmit assignments!"
            );
        }

        return await prisma.submission.create({
            data: {
                assignmentId: id,
                ...data,
            },
        });
    }

    async grade(
        courseId: string,
        id: string,
        studentId: string,
        data: UpdateSubmissionDTO
    ): Promise<Submission> {
        await this.validateAssignment(courseId, id);
        if (!(await this.canSubmit(courseId, id))) {
            throw createErrorWithMessage(
                StatusCodes.FORBIDDEN,
                "Assignment hasn't started yet!"
            );
        }

        const submission = await this.getStudentSubmissions(
            courseId,
            id,
            studentId
        );

        if (!submission.length) {
            throw createErrorWithMessage(
                StatusCodes.BAD_REQUEST,
                "Submission does not exist!"
            );
        }

        return await prisma.submission.update({
            where: {
                studentId_assignmentId: {
                    studentId,
                    assignmentId: id,
                },
                gradedAt: new Date(),
            },
            data,
        });
    }
}

export const assignmentService = new AssignmentService();
