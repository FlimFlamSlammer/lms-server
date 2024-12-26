import { prismaInstance } from "~/prisma-client";
import { nanoid } from "nanoid";
import { CreateClassDTO, Class, UpdateClassDTO } from "./types";
import { ListParams } from "~/types";
import { createErrorWithMessage } from "~/error";
import { StatusCodes } from "http-status-codes";
const prisma = prismaInstance;

class ClassService {
	constructor() {}

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
}

export const classService = new ClassService();
