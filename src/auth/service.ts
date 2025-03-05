import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { createErrorWithMessage, createFieldError } from "~/error";
import { userService } from "~/users/service";

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
            process.env.JWT_SECRET || "",
            {
                expiresIn: "2d",
            }
        );

        return authToken;
    }

    async verifyAuthToken(bearerAuthToken: string) {
        if (!bearerAuthToken) {
            throw createErrorWithMessage(
                StatusCodes.UNAUTHORIZED,
                "Auth token invalid!"
            );
        }

        const tokens = bearerAuthToken.split(" ");

        if (tokens.length !== 2) {
            throw createErrorWithMessage(
                StatusCodes.UNAUTHORIZED,
                "Auth token invalid!"
            );
        }

        const authToken = tokens[1];

        try {
            const userId = (
                jwt.verify(
                    authToken,
                    process.env.JWT_SECRET || ""
                ) as JwtPayload
            ).id;
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
