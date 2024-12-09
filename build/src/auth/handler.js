import { StatusCodes } from "http-status-codes";
import { withValidation } from "../validation";
import { z } from "zod";
import { authService } from "./service";
var loginBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
});
export var loginHandler = withValidation({
    bodySchema: loginBodySchema
}, function(req, res, next) {
    try {
        var data = req.body;
        var authToken = authService.login(data.email, data.password);
        res.cookie("authToken", authToken);
        res.status(StatusCodes.OK).json({
            message: "Logged in successfully."
        });
    } catch (error) {
        next(error);
    }
});
export function logoutHandler(req, res, next) {
    res.clearCookie("authToken");
    res.status(StatusCodes.OK).json({
        message: "Logged out successfully."
    });
}
export function getUserHandler(req, res, next) {
    res.status(StatusCodes.OK).json({
        data: req.body.user
    });
}
