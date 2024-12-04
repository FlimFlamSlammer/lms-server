"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const service_1 = require("../user/service");
const prisma_client_1 = require("../prisma-client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../error");
const http_status_codes_1 = require("http-status-codes");
const AUTH_TOKEN_EXPIRES_IN = "2d";
const prisma = prisma_client_1.prismaInstance;
class AuthService {
    constructor() { }
    async login(email, password) {
        const user = await service_1.userService.getByEmail(email);
        if (!user) {
            throw (0, error_1.createFieldError)({
                email: "Email not registered!",
            });
        }
        if (!bcryptjs_1.default.compareSync(password, user.password)) {
            throw (0, error_1.createFieldError)({
                email: "Incorrect credentials!",
                password: "Incorrect credentials!",
            });
        }
        const authToken = jsonwebtoken_1.default.sign({
            id: user.id,
        }, process.env.JWT_SECRET || "", {
            expiresIn: AUTH_TOKEN_EXPIRES_IN,
        });
        return authToken;
    }
    async verifyAuthToken(authToken) {
        if (!authToken) {
            throw (0, error_1.createErrorWithMessage)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Auth token invalid!");
        }
        try {
            const userId = jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET || "").id;
            const user = await service_1.userService.getById(userId);
            if (!user) {
                throw (0, error_1.createErrorWithMessage)(http_status_codes_1.StatusCodes.NOT_FOUND, "User does not exist.");
            }
            return user;
        }
        catch {
            throw (0, error_1.createErrorWithMessage)(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Auth token invalid!");
        }
    }
}
exports.authService = new AuthService();
