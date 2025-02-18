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
} from "./types";
import { nanoid } from "nanoid";
import { subjectService } from "../service";
import { User } from "~/users/types";

class AssignmentService {
    constructor() {}

    async validateAssignment(
        subjectId: string,
        id: string
    ): Promise<Assignment> {
        await subjectService.validateSubject(subjectId);
        const assignment = (await prisma.assignment.findFirst({
            where: {
                subjectId,
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
        subjectId: string,
        id: string,
        data: UpdateAssignmentDTO
    ): Promise<Assignment> {
        await this.validateAssignment(subjectId, id);

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
        subjectId: string,
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
        await subjectService.validateSubject(subjectId);

        const where: any = {
            subjectId,
            status: status !== "all" ? status : undefined,
            title: search
                ? {
                      contains: search, // name LIKE `%${search}%`
                  }
                : undefined,
        };

        if (active == "true") {
            where.startTime = {
                lte: new Date().toISOString(),
            };
            where.endTime = {
                gt: new Date().toISOString(),
            };
        } else if (active == "false") {
            where.OR = [
                {
                    startTime: {
                        gt: new Date().toISOString(),
                    },
                },
                {
                    endTime: {
                        lte: new Date().toISOString(),
                    },
                },
            ];
        }

        if (started == "true") {
            where.startTime = {
                lte: new Date().toISOString(),
            };
        } else if (started == "false") {
            where.startTime = {
                gt: new Date().toISOString(),
            };
        }

        if (done == "true") {
            where.assignmentToStudent = {
                some: {},
            };
        } else if (done == "false") {
            where.assignmentToStudent = {
                none: {},
            };
        }

        console.log(new Date().toISOString());

        const assignments = (await prisma.assignment.findMany({
            ...(mode === "pagination"
                ? {
                      take: size,
                      skip: (page - 1) * size,
                  }
                : {}),
            where,
        })) as Assignment[];

        const total = await prisma.assignment.count({ where });

        return { data: assignments, total };
    }

    async getById(
        subjectId: string,
        id: string,
        studentId: string | null = null
    ): Promise<Assignment | null> {
        const assignment = (await prisma.assignment.findFirst({
            where: {
                id,
                subjectId,
            },
        })) as Assignment | null;

        if (assignment) {
            assignment.submissions = await this.getSubmissions(
                subjectId,
                id,
                studentId
            );
        }

        return assignment;
    }

    async started(subjectId: string, id: string): Promise<Boolean> {
        const assignment = await this.validateAssignment(subjectId, id);

        const curDate = new Date();

        return curDate >= assignment.startTime && assignment.status == "posted";
    }

    async canSubmit(subjectId: string, id: string): Promise<Boolean> {
        const assignment = await this.validateAssignment(subjectId, id);

        const curDate = new Date();

        return (
            (await this.started(subjectId, id)) && curDate < assignment.endTime
        );
    }

    async getSubmissions(
        subjectId: string,
        id: string,
        studentId: string | null
    ) {
        await this.validateAssignment(subjectId, id);

        return (await prisma.submission.findMany({
            where: {
                assignmentId: id,
                studentId: studentId ? studentId : undefined,
            },
        })) as AssignmentToStudent[];
    }

    async submit(
        subjectId: string,
        id: string,
        data: SubmitAssignmentDTO
    ): Promise<Assignment> {
        await this.validateAssignment(subjectId, id);
        if (!(await this.canSubmit(subjectId, id))) {
            throw createErrorWithMessage(
                StatusCodes.FORBIDDEN,
                "Assignment hasn't started yet!"
            );
        }

        const submission = await this.getSubmissions(
            subjectId,
            id,
            data.studentId
        );

        if (submission.length) {
            throw createErrorWithMessage(
                StatusCodes.BAD_REQUEST,
                "Cannot resubmit assignments!"
            );
        }

        return (await prisma.assignment.update({
            where: {
                subjectId,
                id,
            },
            data: {
                submissions: {
                    create: [data],
                },
            },
        })) as Assignment;
    }
}

export const assignmentService = new AssignmentService();
