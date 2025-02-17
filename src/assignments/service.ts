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
} from "~/subjects/assignments/types";
import { nanoid } from "nanoid";

class AssignmentService {
    constructor() {}

    async getAll({
        page,
        search,
        size,
        mode,
        status,
        active,
        done,
    }: AssignmentListParams) {
        const where: any = {
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
}

export const assignmentService = new AssignmentService();
