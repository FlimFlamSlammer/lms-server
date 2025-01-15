import { createErrorWithMessage, createFieldError } from "src/error";
import { prismaInstance } from "~/prisma-client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import {
    CreateStudentDTO,
    CreateTeacherDTO,
    CreateUserDTO,
    Student,
    Teacher,
    UpdateStudentDTO,
    UpdateTeacherDTO,
    UpdateUserDTO,
    User,
} from "./types";
import { StatusCodes } from "http-status-codes";
import { ListParams } from "~/types";

const prisma = prismaInstance;

class UserService {
    constructor() {}

    private async getUserDetails(user: User) {
        if (user.role == "student") {
            return (await prisma.student.findFirst({
                where: {
                    id: user.id,
                },
            })) as Student;
        }
        if (user.role == "teacher") {
            return (await prisma.teacher.findFirst({
                where: {
                    id: user.id,
                },
            })) as Teacher;
        }
        return null;
    }

    async getByEmail(email: string) {
        let user = (await prisma.user.findFirst({
            where: {
                email,
            },
        })) as User;

        if (user) {
            const details = await this.getUserDetails(user);
            if (details) {
                return {
                    ...user,
                    details,
                };
            } else {
                return user;
            }
        }
        return null;
    }

    async getById(id: string) {
        let user = (await prisma.user.findFirst({
            where: {
                id,
            },
        })) as User;

        if (user) {
            const details = await this.getUserDetails(user);
            if (details) {
                return {
                    ...user,
                    details,
                };
            } else {
                return user;
            }
        }
        return null;
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

        const users = (await prisma.user.findMany({
            ...(mode === "pagination"
                ? {
                      take: size,
                      skip: (page - 1) * size,
                  }
                : {}),
            where,
        })) as User[];

        const total = await prisma.user.count({ where });

        return { users, total };
    }

    async create(
        userData: CreateUserDTO,
        roleData: CreateStudentDTO | CreateTeacherDTO | null = null
    ) {
        if (await this.getByEmail(userData.email)) {
            throw createFieldError({
                email: "Email is already registered!",
            });
        }

        const id = nanoid();

        await prisma.$transaction(async (tx) => {
            await tx.user.create({
                data: {
                    id,
                    status: "active",
                    ...userData,
                },
            });

            if (userData.role == "student") {
                if (!(roleData && "nis" in roleData)) {
                    throw createFieldError({
                        roleData: "Invalid role data!",
                    });
                }

                await tx.student.create({
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

                await tx.teacher.create({
                    data: {
                        id,
                        ...roleData,
                    },
                });
            }
        });
    }

    async update(
        id: string,
        userData: UpdateUserDTO,
        roleData: UpdateStudentDTO | UpdateTeacherDTO | null = null
    ) {
        const user = await this.getById(id);
        if (!user) {
            throw createErrorWithMessage(
                StatusCodes.NOT_FOUND,
                "User not found!"
            );
        }

        if (userData.password) {
            userData.password = bcrypt.hashSync(userData.password);
        }

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id,
                },
                data: userData,
            });

            if (!roleData) return;

            if (user.role == "teacher") {
                await tx.teacher.update({
                    where: {
                        id,
                    },
                    data: {
                        ...roleData,
                    },
                });
            } else if (user.role == "student") {
                await tx.student.update({
                    where: {
                        id,
                    },
                    data: {
                        ...roleData,
                    },
                });
            }
        });
    }
}

export const userService = new UserService();
