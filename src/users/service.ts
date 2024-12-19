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
  UserRoles,
} from "./types";
import { StatusCodes } from "http-status-codes";

const prisma = prismaInstance;

const addRoleData = async (user: User) => {
  const userCopy = user;
  if (user.role == UserRoles.STUDENT) {
    userCopy.roleData = (await prisma.student.findFirst({
      where: {
        id: user.id,
      },
    })) as Student;
  }
  if (user.role == UserRoles.TEACHER) {
    userCopy.roleData = (await prisma.teacher.findFirst({
      where: {
        id: user.id,
      },
    })) as Teacher;
  }
  return userCopy;
};

class UserService {
  constructor() {}

  private async getUserDetails(user: User) {
    if (user.role == UserRoles.STUDENT) {
      return (await prisma.student.findFirst({
        where: {
          id: user.id,
        },
      })) as Student;
    }
    if (user.role == UserRoles.TEACHER) {
      return (await prisma.teacher.findFirst({
        where: {
          id: user.id,
        },
      })) as Teacher;
    }
  }

  async getByEmail(email: string) {
    let user = (await prisma.user.findFirst({
      where: {
        email,
      },
    })) as User;

    if (!user) {
      throw createErrorWithMessage(StatusCodes.NOT_FOUND, "Email not found");
    }

    const details = await this.getUserDetails(user);

    return details
      ? {
          ...user,
          details,
        }
      : user;
  }

  async getById(id: string) {
    let user = (await prisma.user.findFirst({
      where: {
        id,
      },
    })) as User;

    if (!user) {
      throw createErrorWithMessage(StatusCodes.NOT_FOUND, "ID not found");
    }

    const details = await this.getUserDetails(user);

    return details
      ? {
          ...user,
          details,
        }
      : user;
  }

  async getAll() {
    const users = (await prisma.user.findMany()) as User[];

    return users;
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

      if (userData.role == UserRoles.STUDENT) {
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
      } else if (userData.role == UserRoles.TEACHER) {
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

      const user = await this.getById(id);

      if (user.role == UserRoles.TEACHER) {
        await tx.teacher.update({
          where: {
            id,
          },
          data: {
            ...roleData,
          },
        });
      } else if (user.role == UserRoles.STUDENT) {
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
