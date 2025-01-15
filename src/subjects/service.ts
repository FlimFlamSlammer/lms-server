import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import {
    CreateSubjectDTO,
    GetAllSubjectListParams,
    MutateClassesDTO,
    MutateTeachersDTO,
    Subject,
    UpdateSubjectDTO,
} from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
const prisma = prismaInstance;

class SubjectService {
    constructor() {}

    private async validateSubject(id: string) {
        const subject = await this.getById(id);
        if (!subject) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "Subject not found!"
            );
        }
    }

    create(data: CreateSubjectDTO) {
        return prisma.subject.create({
            data: {
                id: nanoid(),
                status: "active",
                ...data,
            },
        });
    }

    async update(id: string, data: UpdateSubjectDTO) {
        this.validateSubject(id);

        return (await prisma.subject.update({
            where: {
                id,
            },
            data: {
                ...data,
            },
        })) as Subject;
    }

    // take: how many records of data that will be taken.
    // skip: how many data to skip.

    async getAll({
        page,
        search,
        size,
        mode,
        status,
        teacherId,
    }: GetAllSubjectListParams) {
        const where = {
            status: status !== "all" ? status : undefined,
            name: search
                ? {
                      contains: search, // name LIKE `%${search}%`
                  }
                : undefined,
            teacherId: teacherId !== "all" ? teacherId : undefined,
        };

        const subjects = (await prisma.subject.findMany({
            ...(mode === "pagination"
                ? {
                      take: size,
                      skip: (page - 1) * size,
                  }
                : {}),
            where,
        })) as Subject[];

        const total = await prisma.subject.count({ where });

        return { data: subjects, total };
    }

    async getById(id: string) {
        return (await prisma.subject.findFirst({
            where: {
                id,
            },
            include: {
                teachers: true,
                classes: true,
            },
        })) as Subject | null;
    }

    async addTeachers(id: string, data: MutateTeachersDTO) {
        this.validateSubject(id);

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
        await prisma.subject.update({
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
        this.validateSubject(id);

        await prisma.subject.update({
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

    async addClasses(id: string, data: MutateClassesDTO) {
        this.validateSubject(id);

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
        await prisma.subject.update({
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
        this.validateSubject(id);

        await prisma.subject.update({
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

export const subjectService = new SubjectService();
