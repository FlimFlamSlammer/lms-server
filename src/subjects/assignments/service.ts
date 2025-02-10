import { StatusCodes } from "http-status-codes";
import { createErrorWithMessage } from "~/error";
import { prismaInstance as prisma } from "~/prisma-client";
import {
    Assignment,
    AssignmentListParams,
    CreateAssignmentDTO,
    SubmitAssignmentDTO,
    UpdateAssignmentDTO,
} from "./types";
import { ListParams } from "~/types";
import { nanoid } from "nanoid";
import { subjectService } from "../service";
import { boolean, date } from "zod";

class AssignmentService {
    constructor() {}

    async validateAssignment(
        subjectId: string,
        id: string
    ): Promise<Assignment> {
        subjectService.validateSubject(subjectId);
        const assignment = await this.getById(subjectId, id);
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
                students: undefined,
            },
        })) as Assignment;
    }

    async update(
        subjectId: string,
        id: string,
        data: UpdateAssignmentDTO
    ): Promise<Assignment> {
        this.validateAssignment(subjectId, id);

        return (await prisma.assignment.update({
            where: {
                id,
            },
            data: {
                ...data,
                students: undefined,
            },
        })) as Assignment;
    }

    async getAll(
        subjectId: string,
        { page, search, size, mode, status, active, done }: AssignmentListParams
    ) {
        subjectService.validateSubject(subjectId);

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
        return (await prisma.assignment.findFirst({
            where: {
                id,
                subjectId,
                students: studentId
                    ? {
                          some: {
                              studentId,
                          },
                      }
                    : undefined,
            },
            include: {
                students: true,
            },
        })) as Assignment | null;
    }

    async started(subjectId: string, id: string): Promise<Boolean> {
        const assignment = await this.validateAssignment(subjectId, id);

        const curDate = new Date();

        return curDate >= assignment.startTime && curDate < assignment.endTime;
    }

    async submit(
        subjectId: string,
        id: string,
        data: SubmitAssignmentDTO
    ): Promise<Assignment> {
        await this.validateAssignment(subjectId, id);

        if (!this.started(subjectId, id)) {
            throw createErrorWithMessage(
                StatusCodes.FORBIDDEN,
                "Assignment hasn't started yet!"
            );
        }

        const submission = await prisma.assignment.findFirst({
            where: {
                subjectId,
                id,
                students: {
                    some: {
                        studentId: data.studentId,
                    },
                },
            },
        });

        if (submission) {
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
                students: {
                    create: [data],
                },
            },
        })) as Assignment;
    }
}

export const assignmentService = new AssignmentService();
