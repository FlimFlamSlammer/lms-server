import { StatusCodes } from "http-status-codes";
import { createErrorWithMessage } from "~/error";
import { prismaInstance } from "~/prisma-client";
import {
    Assignment,
    AssignmentListParams,
    CreateAssignmentDTO,
    UpdateAssignmentDTO,
} from "./types";
import { ListParams } from "~/types";
import { nanoid } from "nanoid";
import { subjectService } from "../service";
import { boolean, date } from "zod";

const prisma = prismaInstance;

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
            },
        })) as Assignment;
    }

    async getAll(
        subjectId: string,
        { page, search, size, mode, status, active }: AssignmentListParams
    ) {
        subjectService.validateSubject(subjectId);

        const where = {
            subjectId,
            status: status !== "all" ? status : undefined,
            title: search
                ? {
                      contains: search, // name LIKE `%${search}%`
                  }
                : undefined,
            startTime: active
                ? {
                      lte: new Date().toISOString(),
                  }
                : undefined,
            endTime: active
                ? {
                      gt: new Date().toISOString(),
                  }
                : undefined,
        };
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

    async getById(subjectId: string, id: string): Promise<Assignment | null> {
        return (await prisma.assignment.findFirst({
            where: {
                id,
                subjectId,
            },
            include: {
                assignmentToStudent: true,
            },
        })) as Assignment | null;
    }

    async started(subjectId: string, id: string): Promise<Boolean> {
        const assignment = await this.validateAssignment(subjectId, id);

        const curDate = new Date();

        return curDate >= assignment.startTime && curDate <= assignment.endTime;
    }
}

export const assignmentService = new AssignmentService();
