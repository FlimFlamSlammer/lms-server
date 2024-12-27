import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import { CreateClassDTO, Class, UpdateClassDTO } from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
const prisma = prismaInstance;

class ClassService {
	constructor() {}

	private async freeUpdate(id: string, data: object) {
		const $class = await this.getById(id);
		if (!$class) {
			throw createErrorWithMessage(StatusCodes.NOT_FOUND, "Class not found!");
		}

		return await prisma.class.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		});
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
		return (await this.freeUpdate(id, data)) as Class;
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
		})) as Class | null;
	}

	async addStudents(id: string, studentIds: string[]) {
		// check for invalid student ids
		const existingStudents = await prisma.student.findMany({
			where: {
				id: { in: studentIds },
			},
		});

		const existingStudentIds = await existingStudents.map(
			(student) => student.id
		);

		studentIds.sort();
		existingStudentIds.sort();

		const missingIds = new Array<String>();
		let index = 0;
		studentIds.forEach((requestedId) => {
			if (requestedId != existingStudentIds[index]) {
				missingIds.push(requestedId);
			} else index++;
		});

		// add the relations
		await this.freeUpdate(id, {
			students: {
				connect: existingStudentIds.map((studentId) => {
					id: studentId;
				}),
			},
		});

		// return missing ids
		return {
			totalMissing: missingIds.length,
			missingStudents: missingIds,
		};
	}

	async removeStudents(id: string, studentIds: string[]) {
		await this.freeUpdate(id, {
			students: {
				disconnect: studentIds.map((studentId) => {
					id: studentId;
				}),
			},
		});
	}
}

export const classService = new ClassService();
