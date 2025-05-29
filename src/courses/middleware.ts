import { asyncMiddleware } from "~/async-middleware";
import { courseService } from "./service";
import { idParamsSchema, withValidation } from "~/validation";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const courseAuthMiddlewareSchema = z.object({
    id: z.string().optional(),
    courseId: z.string().optional(),
});

export const courseAccessMiddleware = withValidation(
    {
        paramsSchema: courseAuthMiddlewareSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        if (!req.user) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "forgot to use auth middleware",
            });
            return;
        }

        let id = req.params.courseId || req.params.id;

        if (await courseService.userInCourse(id, req.user)) {
            next();
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Currently logged in user cannot access this course.",
            });
        }
    })
);
