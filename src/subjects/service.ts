import { createFieldError } from "src/error";
import { prismaInstance } from "~/prisma-client";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { CreateSubjectDTO, UpdateSubjectDTO } from "./types";
import { ListParams } from "~/types";
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

    const subjects = await prisma.subject.findMany({
      ...(mode === "pagination"
        ? {
            take: size,
            skip: (page - 1) * size,
          }
        : {}),
      where,
    });

    const total = await prisma.subject.count({ where });

    return { data: subjects, total };
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
