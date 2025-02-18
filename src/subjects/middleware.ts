import { asyncMiddleware } from "~/async-middleware";
import { subjectService } from "./service";
import { idParamsSchema, withValidation } from "~/validation";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const subjectAuthMiddlewareSchema = z.object({
    id: z.string().optional(),
    subjectId: z.string().optional(),
});

export const subjectAuthMiddleware = withValidation(
    {
        paramsSchema: subjectAuthMiddlewareSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        if (!req.user) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "forgot to use auth middleware",
            });
            return;
        }

        let id = req.params.subjectId || req.params.id;

        if (await subjectService.userInSubject(id, req.user)) {
            next();
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Currently logged in user cannot access this subject.",
            });
        }
    })
);
