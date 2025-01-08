import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import { CreateSubjectDTO, Subject, UpdateSubjectDTO } from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
const prisma = prismaInstance;

class SubjectService {
	constructor() {}

	private async freeUpdate(id: string, data: object) {
		const subject = await this.getById(id);
		if (!subject) {
			throw createErrorWithMessage(StatusCodes.NOT_FOUND, "Subject not found!");
		}

		return await prisma.subject.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		});
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
		return (await this.freeUpdate(id, data)) as Subject;
	}

	// take: how many records of data that will be taken.
	// skip: how many data to skip.

	async getAll({ page, search, size, mode, status }: ListParams) {
		const where = {
			status: status !== "all" ? status : undefined,
			name: search
				? {
						contains: search, // name LIKE `%${search}%`
				  }
				: undefined,
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
			},
		})) as Subject | null;
	}

	async addTeachers(id: string, teacherIds: string[]) {
		// check for invalid student ids
		const existingTeachers = await prisma.teacher.findMany({
			where: {
				id: { in: teacherIds },
			},
		});

		const existingTeacherIds = await existingTeachers.map(
			(teacher) => teacher.id
		);

		teacherIds.sort();
		existingTeacherIds.sort();

		const missingIds = new Array<String>();
		let index = 0;
		teacherIds.forEach((requestedId) => {
			if (requestedId != existingTeacherIds[index]) {
				missingIds.push(requestedId);
			} else index++;
		});

		// add the relations
		await this.freeUpdate(id, {
			teachers: {
				connect: existingTeacherIds.map((teacherId) => {
					return { id: teacherId };
				}),
			},
		});

		// return missing ids
		return {
			totalMissing: missingIds.length,
			missingStudents: missingIds,
		};
	}

	async removeTeachers(id: string, teacherIds: string[]) {
		await this.freeUpdate(id, {
			students: {
				disconnect: teacherIds.map((teacherId) => {
					return { id: teacherId };
				}),
			},
		});
	}
}

export const subjectService = new SubjectService();
