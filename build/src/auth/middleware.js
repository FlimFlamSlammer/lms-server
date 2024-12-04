"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const error_1 = require("../error");
const http_status_codes_1 = require("http-status-codes");
const service_1 = require("./service");
function authMiddleware(roles = []) {
    return async (req, res, next) => {
        try {
            const authToken = req.cookies.authToken;
            const user = await service_1.authService.verifyAuthToken(authToken);
            if (roles &&
                !roles.find((role) => {
                    return role == user.role;
                })) {
                throw (0, error_1.createErrorWithMessage)(http_status_codes_1.StatusCodes.FORBIDDEN, "User does not have permission.");
            }
            req.body.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
