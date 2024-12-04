"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleService = void 0;
const prisma_client_1 = require("../prisma-client");
const prisma = prisma_client_1.prismaInstance;
class ExampleService {
    constructor() { }
    list() {
        return [];
    }
}
exports.exampleService = new ExampleService();
