import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import {
	CreateClassDTO,
	Class,
	UpdateClassDTO,
	MutateStudentsDTO,
	MutateSubjectsDTO,
} from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
const prisma = prismaInstance;

class ClassService {
	constructor() {}

	private async validateClass(id: string) {
		const $class = await this.getById(id);
		if (!$class) {
			throw createErrorWithMessage(StatusCodes.NOT_FOUND, "Class not found!");
		}
	}

	create(data: CreateClassDTO) {
		return prisma.class.create({
			data: {
				id: nanoid(),
				status: "active",
				...data,
			},
		});
	}

	async update(id: string, data: UpdateClassDTO) {
		this.validateClass(id);

		await prisma.class.update({
			where: {
				id,
			},
			data: data,
		});
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

		return { data: classes, total };
	}

	async getById(id: string) {
		return (await prisma.class.findFirst({
			where: {
				id,
			},
			include: {
				students: true,
				subjects: true,
			},
		})) as Class | null;
	}

	async addStudents(id: string, data: MutateStudentsDTO) {
		this.validateClass(id);

		// check for invalid student ids
		const existingStudents = await prisma.student.findMany({
			where: {
				id: { in: data.studentIds },
			},
		});

		const existingStudentIds = existingStudents.map((student) => student.id);

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

	async addSubjects(id: string, data: MutateSubjectsDTO) {
		this.validateClass(id);

		const existingSubjects = await prisma.subject.findMany({
			where: {
				id: { in: data.subjectIds },
			},
		});

		const existingSubjectIds = await existingSubjects.map(
			($class) => $class.id
		);

		data.subjectIds.sort();
		existingSubjectIds.sort();

		const missingIds = new Array<String>();
		let index = 0;
		data.subjectIds.forEach((requestedId) => {
			if (requestedId != existingSubjectIds[index]) {
				missingIds.push(requestedId);
			} else index++;
		});

		// add the relations
		await prisma.class.update({
			where: { id },
			data: {
				subjects: {
					connect: existingSubjectIds.map((subjectId) => {
						return { id: subjectId };
					}),
				},
			},
		});

		// return missing ids
		return {
			totalMissing: missingIds.length,
			missingSubjects: missingIds,
		};
	}

	async removeSubjects(id: string, data: MutateSubjectsDTO) {
		this.validateClass(id);

		await prisma.class.update({
			where: { id },
			data: {
				subjects: {
					disconnect: data.subjectIds.map((subjectId) => {
						return { id: subjectId };
					}),
				},
			},
		});
	}
}

export const classService = new ClassService();
