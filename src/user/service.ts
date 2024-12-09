import { createFieldError } from "src/error";
import { prismaInstance } from "../prisma-client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const prisma = prismaInstance;

export type UserRole = "student" | "teacher" | "admin" | "superadmin";

type CreateUserDTO = {
	name: string;
	email: string;
	phoneNumber?: string;
	password: string;
	role: UserRole;
	profileImage?: string;
};

type CreateStudentDTO = {
	birthDate: Date;
	nis: string;
	description?: string;
	fatherName?: string;
	motherName?: string;
	guardianName?: string;
	contactPhoneNumber: string;
};

type CreateTeacherDTO = {
	expertise?: string;
	bachelorsDegree?: string;
	masterDegree?: string;
	doctorateDegree?: string;
	description?: string;
	nig: string;
};

class UserService {
	constructor() {}

	getByEmail(email: string) {
		return prisma.user.findFirst({
			where: {
				email,
			},
		});
	}

	getById(id: string) {
		return prisma.user.findFirst({
			where: {
				id,
			},
		});
	}

	getAll() {
		return prisma.user.findMany();
	}

	async create(
		userData: CreateUserDTO,
		roleData: CreateStudentDTO | CreateTeacherDTO | null
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

		if (userData.role == "student") {
			if (!(roleData && "nis" in roleData)) {
				throw createFieldError({
					roleData: "Invalid role data!",
				});
			}

			prisma.student.create({
				data: {
					id,
					...roleData,
				},
			});
		} else if (userData.role == "teacher") {
			if (!(roleData && "nig" in roleData)) {
				throw createFieldError({
					roleData: "Invalid role data!",
				});
			}

			prisma.teacher.create({
				data: {
					id,
					...roleData,
				},
			});
		}

		userData.password = bcrypt.hashSync(userData.password);

		prisma.user.create({
			data: {
				id,
				status: "active",
				...userData,
			},
		});
	}
}

export const userService = new UserService();
