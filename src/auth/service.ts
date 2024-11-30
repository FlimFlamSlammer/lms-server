import { userService } from "src/user/service";
import { prismaInstance } from "../prisma-client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createErrorWithMessage, createFieldError } from "src/error";
import { StatusCodes } from "http-status-codes";

const JWT_SECRET = "secret12321";

const prisma = prismaInstance;

class AuthService {
	constructor() {}

	async login(email: string, password: string) {
		const user = await userService.getByEmail(email);

		if (!user) {
			throw createFieldError({
				email: "Email not registered!",
			});
		}

		if (!bcrypt.compareSync(password, user.password)) {
			throw createFieldError({
				email: "Incorrect credentials!",
				password: "Incorrect credentials!",
			});
		}

		const authToken = jwt.sign(
			{
				id: user.id,
			},
			JWT_SECRET
		);

		return authToken;
	}
}

export const authService = new AuthService();
