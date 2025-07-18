import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import {
    CreateCourseDTO,
    MutateClassesDTO,
    MutateTeachersDTO,
    Course,
    UpdateCourseDTO,
} from "./types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
import { Teacher, User } from "~/users/types";
import { ListParams } from "~/types";
import { Class } from "~/classes/types";
import { listQuery } from "~/list-query";
const prisma = prismaInstance;

class CourseService {
    constructor() {}

    async userInCourse(id: string, user: User) {
        let where = {};
        if (user.role == "student") {
            where = {
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
        }
        if (user.role == "teacher") {
            where = {
                teachers: {
                    some: {
                        id: user.id,
                    },
                },
            };
        }

        const course = await prisma.course.findFirst({
            where: {
                id,
                ...where,
            },
        });

        return course != null;
    }

    async validateCourse(id: string) {
        const course = await this.getById(id);
        if (!course) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Course not found!"
            );
        }
        return course;
    }

    create(data: CreateCourseDTO) {
        return prisma.course.create({
            data: {
                id: nanoid(),
                status: "active",
                ...data,
            },
        });
    }

    async update(id: string, data: UpdateCourseDTO) {
        this.validateCourse(id);

        return (await prisma.course.update({
            where: {
                id,
            },
            data: {
                ...data,
            },
        })) as Course;
    }

    async getAll(query: ListParams, user: User | null = null) {
        const where: Record<string, any> = {};

        if (user?.role == "teacher") {
            where.teachers = {
                some: {
                    id: user.id,
                },
            };
        } else if (user?.role == "student") {
            where.classes = {
                some: {
                    students: {
                        some: {
                            id: user.id,
                        },
                    },
                },
            };
        }

        return await listQuery<Course[]>({
            query,
            where,
            searchKey: "name",
            model: "Course",
        });
    }

    async getById(id: string) {
        return (await prisma.course.findFirst({
            where: {
                id,
            },
            include: {
                teachers: {
                    include: {
                        user: true,
                    },
                },
                classes: true,
            },
        })) as Course | null;
    }

    async getTeachers(id: string, query: ListParams) {
        return await listQuery<User[]>({
            query,
            where: {
                role: "teacher",
                teacher: {
                    courses: {
                        some: {
                            id,
                        },
                    },
                },
            },
            model: "User",
            searchKey: "name",
        });
    }

    async addTeachers(id: string, data: MutateTeachersDTO) {
        this.validateCourse(id);

        // check for invalid student ids
        const existingTeachers = await prisma.teacher.findMany({
            where: {
                id: { in: data.teacherIds },
            },
        });

        const existingTeacherIds = await existingTeachers.map(
            (teacher) => teacher.id
        );

        data.teacherIds.sort();
        existingTeacherIds.sort();

        const missingIds = new Array<String>();
        let index = 0;
        data.teacherIds.forEach((requestedId) => {
            if (requestedId != existingTeacherIds[index]) {
                missingIds.push(requestedId);
            } else index++;
        });

        // add the relations
        await prisma.course.update({
            where: { id },
            data: {
                teachers: {
                    connect: existingTeacherIds.map((teacherId) => {
                        return { id: teacherId };
                    }),
                },
            },
        });

        // return missing ids
        return {
            totalMissing: missingIds.length,
            missingTeachers: missingIds,
        };
    }

    async removeTeachers(id: string, data: MutateTeachersDTO) {
        this.validateCourse(id);

        await prisma.course.update({
            where: { id },
            data: {
                teachers: {
                    disconnect: data.teacherIds.map((teacherId) => {
                        return { id: teacherId };
                    }),
                },
            },
        });
    }

    async getClassesNotInCourse(id: string) {
        return (await prisma.class.findMany({
            where: {
                courses: {
                    none: {
                        id,
                    },
                },
                status: "active",
            },
        })) as Class[];
    }

    async getTeachersNotInCourse(id: string) {
        return (await prisma.teacher.findMany({
            where: {
                courses: {
                    none: {
                        id,
                    },
                },
                user: {
                    status: "active",
                },
            },
            include: {
                user: true,
            },
        })) as Teacher[];
    }

    async getClasses(id: string, query: ListParams) {
        return await listQuery<Class[]>({
            query,
            where: {
                courses: {
                    some: {
                        id,
                    },
                },
            },
            model: "Class",
            searchKey: "name",
        });
    }

    async addClasses(id: string, data: MutateClassesDTO) {
        this.validateCourse(id);

        const existingClasses = await prisma.class.findMany({
            where: {
                id: { in: data.classIds },
            },
        });

        const existingClassIds = await existingClasses.map(
            ($class) => $class.id
        );

        data.classIds.sort();
        existingClassIds.sort();

        const missingIds = new Array<String>();
        let index = 0;
        data.classIds.forEach((requestedId) => {
            if (requestedId != existingClassIds[index]) {
                missingIds.push(requestedId);
            } else index++;
        });

        // add the relations
        await prisma.course.update({
            where: { id },
            data: {
                classes: {
                    connect: existingClassIds.map((classId) => {
                        return { id: classId };
                    }),
                },
            },
        });

        // return missing ids
        return {
            totalMissing: missingIds.length,
            missingClasses: missingIds,
        };
    }

    async removeClasses(id: string, data: MutateClassesDTO) {
        this.validateCourse(id);

        await prisma.course.update({
            where: { id },
            data: {
                classes: {
                    disconnect: data.classIds.map((classId) => {
                        return { id: classId };
                    }),
                },
            },
        });
    }
}

export const courseService = new CourseService();
