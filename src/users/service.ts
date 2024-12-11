import { createFieldError } from "src/error";
import { prismaInstance } from "~/prisma-client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import {
	User as PrismaUser,
	Student as PrismaStudent,
	Teacher as PrismaTeacher,
} from "@prisma/client";
import { OptionalNullable } from "~/utils";

const prisma = prismaInstance;

export const validUserRoles = [
	"student",
	"teacher",
	"admin",
	"superadmin",
] as const;
export type UserRole = (typeof validUserRoles)[number];

export const validStatuses = ["active", "inactive"] as const;

export type User = OptionalNullable<PrismaUser> & {
	role: UserRole;
};
export type Student = OptionalNullable<PrismaStudent>;
export type Teacher = OptionalNullable<PrismaTeacher>;

type CreateUserDTO = Omit<User, "status" | "id">;
type CreateStudentDTO = Omit<Student, "id">;
type CreateTeacherDTO = Omit<Teacher, "id">;

type UpdateUserDTO = Partial<Omit<User, "role" | "id">>;
type UpdateStudentDTO = Partial<CreateStudentDTO>;
type UpdateTeacherDTO = Partial<CreateTeacherDTO>;

class UserService {
	constructor() {}

	getByEmail(email: string) {
		return prisma.user.findFirst({
			where: {
				email,
			},
		}) as Promise<User>;
	}

	getById(id: string) {
		return prisma.user.findFirst({
			where: {
				id,
			},
		}) as Promise<User>;
	}

	getAll() {
		return prisma.user.findMany() as Promise<User[]>;
	}

	async create(
		userData: CreateUserDTO,
		roleData: CreateStudentDTO | CreateTeacherDTO | null = null
	) {
		if (
			await prisma.user.findFirst({
				where: {
					email: userData.email,
				},
			})
		) {
			throw createFieldError({
				email: "Email is already registered!",
			});
		}

		const id = nanoid();
		const operations: Promise<any>[] = [];

		if (userData.role == "student") {
			if (!(roleData && "nis" in roleData)) {
				throw createFieldError({
					roleData: "Invalid role data!",
				});
			}

			operations.push(
				prisma.student.create({
					data: {
						id,
						...roleData,
					},
				})
			);
		} else if (userData.role == "teacher") {
			if (!(roleData && "nig" in roleData)) {
				throw createFieldError({
					roleData: "Invalid role data!",
				});
			}

			operations.push(
				prisma.teacher.create({
					data: {
						id,
						...roleData,
					},
				})
			);
		}

		userData.password = bcrypt.hashSync(userData.password);

		operations.push(
			prisma.user.create({
				data: {
					id,
					status: "active",
					...userData,
				},
			})
		);

		await Promise.all(operations);
	}

	async update(
		id: string,
		userData: UpdateUserDTO,
		roleData: UpdateStudentDTO | UpdateTeacherDTO | null = null
	) {
		if (userData.password) {
			userData.password = bcrypt.hashSync(userData.password);
		}

		const operations: Promise<any>[] = [];

		operations.push(
			prisma.user.update({
				where: {
					id,
				},
				data: userData,
			})
		);

		if (!roleData) {
			await Promise.all(operations);
			return;
		}

		const user = await this.getById(id);

		if (user.role == "teacher") {
			operations.push(
				prisma.teacher.update({
					where: {
						id,
					},
					data: {
						...roleData,
					},
				})
			);
		} else if (user.role == "student") {
			operations.push(
				prisma.student.update({
					where: {
						id,
					},
					data: {
						...roleData,
					},
				})
			);
		}

		await Promise.all(operations);
	}
}

export const userService = new UserService();
