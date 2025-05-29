import { prismaInstance as prisma } from "~/prisma-client";
import { Assignment, AssignmentListParams } from "~/courses/assignments/types";
import { User } from "~/users/types";
import { listQuery } from "~/list-query";

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
        const where: Record<string, any> = {};

        if (user.role == "student") {
            where.course = {
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
            where.course = {
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

        return listQuery<Assignment[]>({
            query: { page, mode, status, size, search },
            where,
            model: "Assignment",
            searchKey: "title",
        });
    }
}

export const assignmentService = new AssignmentService();
