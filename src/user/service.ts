import { prismaInstance } from "~/prisma-client";

const prisma = prismaInstance;

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
}

export const userService = new UserService();
