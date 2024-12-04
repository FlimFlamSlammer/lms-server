"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const error_1 = require("./error");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = require("./auth/router");
const app = (0, express_1.default)();
const PORT = 5000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const baseRouter = express_1.default.Router();
(0, router_1.setupAuthRouter)(baseRouter);
app.use("/api/v1", baseRouter);
app.use(error_1.errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
