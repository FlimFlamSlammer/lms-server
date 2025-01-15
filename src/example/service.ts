import { prismaInstance } from "~/prisma-client";

const prisma = prismaInstance;

class ExampleService {
    constructor() {}

    list() {
        return [];
    }
}

export const exampleService = new ExampleService();
