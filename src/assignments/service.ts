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

        console.log(now);

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
