import { asyncMiddleware } from "~/async-middleware";
import { courseService } from "./service";
import { idParamsSchema, withValidation } from "~/validation";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { createErrorWithMessage } from "~/error";

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
            throw createErrorWithMessage(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "forgot to use authMiddleware"
            );
            return;
        }

        let id = req.params.courseId || req.params.id;

        if (await courseService.userInCourse(id, req.user)) {
            next();
        } else {
            throw createErrorWithMessage(
                StatusCodes.FORBIDDEN,
                "Currently logged in user cannot access course!"
            );
        }
    })
);
