import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import { CreateSubjectDTO, UpdateSubjectDTO } from "./types";
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

	update(id: string, data: UpdateSubjectDTO) {
		return prisma.subject.update({
			where: {
				id,
			},
			data: {
				...data,
			},
		});
	}

	getAll() {
		return prisma.subject.findMany();
	}

	getById(id: string) {
		return prisma.subject.findFirst({
			where: {
				id,
			},
		});
	}
}

export const subjectService = new SubjectService();
