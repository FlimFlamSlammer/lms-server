"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "prismaInstance", {
    enumerable: true,
    get: function() {
        return prismaInstance;
    }
});
var _client = require("@prisma/client");
var prismaInstance = new _client.PrismaClient();
