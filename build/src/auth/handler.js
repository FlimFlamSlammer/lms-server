"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginHandler = void 0;
exports.logoutHandler = logoutHandler;
exports.getUserHandler = getUserHandler;
const http_status_codes_1 = require("http-status-codes");
const validation_1 = require("../validation");
const zod_1 = require("zod");
const service_1 = require("./service");
const loginBodySchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
exports.loginHandler = (0, validation_1.withValidation)({
    bodySchema: loginBodySchema,
}, (req, res, next) => {
    try {
        const data = req.body;
        const authToken = service_1.authService.login(data.email, data.password);
        res.cookie("authToken", authToken);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Logged in successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
function logoutHandler(req, res, next) {
    res.clearCookie("authToken");
    res.status(http_status_codes_1.StatusCodes.OK).json({
        message: "Logged out successfully.",
    });
}
function getUserHandler(req, res, next) {
    res.status(http_status_codes_1.StatusCodes.OK).json({
        data: req.body.user,
    });
}
