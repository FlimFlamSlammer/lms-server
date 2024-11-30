import { userService } from "src/user/service";
import { prismaInstance } from "../prisma-client";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createErrorWithMessage, createFieldError } from "src/error";
import { StatusCodes } from "http-status-codes";
import { create } from "domain";
import { User } from "@prisma/client";

const JWT_SECRET = "secret12321";
const AUTH_TOKEN_EXPIRES_IN = "2d";

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
			JWT_SECRET,
			{
				expiresIn: AUTH_TOKEN_EXPIRES_IN,
			}
		);

		return authToken;
	}

	async verifyAuthToken(authToken: string): Promise<User> {
		if (!authToken) {
			throw createErrorWithMessage(
				StatusCodes.UNAUTHORIZED,
				"Auth token invalid!"
			);
		}

		try {
			const userId = (jwt.verify(authToken, JWT_SECRET) as JwtPayload).id;
			const user = await userService.getById(userId);

			if (!user) {
				throw createErrorWithMessage(
					StatusCodes.NOT_FOUND,
					"User does not exist."
				);
			}

			return user;
		} catch {
			throw createErrorWithMessage(
				StatusCodes.UNAUTHORIZED,
				"Auth token invalid!"
			);
		}
	}
}

export const authService = new AuthService();
