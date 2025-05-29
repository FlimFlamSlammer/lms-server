import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import {
    CreateClassDTO,
    Class,
    UpdateClassDTO,
    MutateStudentsDTO,
    MutateCoursesDTO,
} from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
import { Student } from "@prisma/client";
import { User } from "~/users/types";
const prisma = prismaInstance;

class ClassService {
    constructor() {}

    async validateClass(id: string) {
        const $class = await this.getById(id);
        if (!$class) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Class not found!"
            );
        }
    }

    async create(data: CreateClassDTO): Promise<Class> {
        return (await prisma.class.create({
            data: {
                id: nanoid(),
                status: "active",
                ...data,
            },
        })) as Class;
    }

    async update(id: string, data: UpdateClassDTO): Promise<Class> {
        this.validateClass(id);

        return (await prisma.class.update({
            where: {
                id,
            },
            data: data,
        })) as Class;
    }

    async getAll({ page, search, size, mode, status }: ListParams) {
        const where = {
            status: status !== "all" ? status : undefined,
            name: search
                ? {
                      contains: search,
                  }
                : undefined,
        };

        const classes = (await prisma.class.findMany({
            ...(mode === "pagination"
                ? {
                      take: size,
                      skip: (page - 1) * size,
                  }
                : {}),
            where,
        })) as Class[];

        const total = await prisma.class.count({ where });

        return { classes, total };
    }

    async getById(id: string) {
        return (await prisma.class.findFirst({
            where: {
                id,
            },
            include: {
                students: {
                    include: {
                        user: true,
                    },
                },
                courses: true,
            },
        })) as Class | null;
    }

    async getStudentsNotInClass(id: string) {
        return (await prisma.user.findMany({
            where: {
                role: "student",
                student: {
                    classes: {
                        none: {
                            id,
                        },
                    },
                },
            },
            include: {
                student: true,
            },
        })) as User[];
    }

    async getStudents(id: string) {
        return (await prisma.user.findMany({
            where: {
                role: "student",
                student: {
                    classes: {
                        some: {
                            id,
                        },
                    },
                },
            },
            include: {
                student: true,
            },
        })) as User[];
    }

    async addStudents(id: string, data: MutateStudentsDTO) {
        this.validateClass(id);

        // check for invalid student ids
        const existingStudents = await prisma.student.findMany({
            where: {
                id: { in: data.studentIds },
            },
        });

        const existingStudentIds = existingStudents.map(
            (student) => student.id
        );

        data.studentIds.sort();
        existingStudentIds.sort();

        const missingIds = new Array<String>();
        let index = 0;
        data.studentIds.forEach((requestedId) => {
            if (requestedId != existingStudentIds[index]) {
                missingIds.push(requestedId);
            } else index++;
        });

        await prisma.class.update({
            where: {
                id,
            },
            data: {
                students: {
                    connect: existingStudentIds.map((sid) => {
                        return { id: sid };
                    }),
                },
            },
        });

        // return missing ids
        return {
            totalMissing: missingIds.length,
            missingStudents: missingIds,
        };
    }

    async removeStudents(id: string, data: MutateStudentsDTO) {
        this.validateClass(id);

        await prisma.class.update({
            where: {
                id,
            },
            data: {
                students: {
                    disconnect: data.studentIds.map((sid) => {
                        return { id: sid };
                    }),
                },
            },
        });
    }

    async addCourses(id: string, data: MutateCoursesDTO) {
        this.validateClass(id);

        const existingCourses = await prisma.course.findMany({
            where: {
                id: { in: data.courseIds },
            },
        });

        const existingCourseIds = await existingCourses.map(
            ($class) => $class.id
        );

        data.courseIds.sort();
        existingCourseIds.sort();

        const missingIds = new Array<String>();
        let index = 0;
        data.courseIds.forEach((requestedId) => {
            if (requestedId != existingCourseIds[index]) {
                missingIds.push(requestedId);
            } else index++;
        });

        // add the relations
        await prisma.class.update({
            where: { id },
            data: {
                courses: {
                    connect: existingCourseIds.map((courseId) => {
                        return { id: courseId };
                    }),
                },
            },
        });

        // return missing ids
        return {
            totalMissing: missingIds.length,
            missingCourses: missingIds,
        };
    }

    async removeCourses(id: string, data: MutateCoursesDTO) {
        this.validateClass(id);

        await prisma.class.update({
            where: { id },
            data: {
                courses: {
                    disconnect: data.courseIds.map((courseId) => {
                        return { id: courseId };
                    }),
                },
            },
        });
    }
}

export const classService = new ClassService();
