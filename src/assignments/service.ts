import { prismaInstance as prisma } from "~/prisma-client";
import { Assignment, AssignmentListParams } from "~/subjects/assignments/types";
import { User } from "~/users/types";

class AssignmentService {
    constructor() {}

    async getAll(
        {
            page,
            search,
            size,
            mode,
            status,
            active,
            done,
            started,
        }: AssignmentListParams,
        user: User
    ) {
        const where: any = {
            status: status !== "all" ? status : undefined,
            title: search
                ? {
                      contains: search, // name LIKE `%${search}%`
                  }
                : undefined,
        };

        if (user.role == "student") {
            where.subject = {
                classes: {
                    some: {
                        students: {
                            some: {
                                id: user.id,
                            },
                        },
                    },
                },
            };
        } else if (user.role == "teacher") {
            where.subject = {
                teachers: {
                    some: {
                        id: user.id,
                    },
                },
            };
        }

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
}

export const assignmentService = new AssignmentService();
