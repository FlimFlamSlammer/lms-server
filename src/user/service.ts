import { prismaInstance } from "../prisma-client";

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
}

export const userService = new UserService();
