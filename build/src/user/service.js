"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_client_1 = require("../prisma-client");
const prisma = prisma_client_1.prismaInstance;
class UserService {
    constructor() { }
    getByEmail(email) {
        return prisma.user.findFirst({
            where: {
                email,
            },
        });
    }
    getById(id) {
        return prisma.user.findFirst({
            where: {
                id,
            },
        });
    }
}
exports.userService = new UserService();
