import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import { CreateSubjectDTO, Subject, UpdateSubjectDTO } from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
const prisma = prismaInstance;

class SubjectService {
	constructor() {}

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
		})) as Subject | null;
	}
}

export const subjectService = new SubjectService();
