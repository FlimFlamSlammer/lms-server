import { asyncMiddleware } from "~/async-middleware";
import { subjectService } from "./service";
import { idParamsSchema, withValidation } from "~/validation";
import { StatusCodes } from "http-status-codes";

export const subjectAuthMiddleware = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        if (!req.user) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "forgot to use auth middleware",
            });
            return;
        }

        if (await subjectService.userInSubject(req.body.id, req.user)) {
            next();
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Currently logged in user cannot access this subject.",
            });
        }
    })
);
