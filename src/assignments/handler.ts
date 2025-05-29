import { z } from "zod";
import { asyncMiddleware } from "~/async-middleware";
import { getAssignmentsQuerySchema } from "~/courses/assignments/validation";
import { withValidation } from "~/validation";
import { assignmentService } from "./service";
import { StatusCodes } from "http-status-codes";

export const getAssignmentsHandler = withValidation(
    {
        querySchema: getAssignmentsQuerySchema,
    },
    asyncMiddleware(async (req, res) => {
        if (!req.user) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "forgot to use auth middleware",
            });
            return;
        }

        const query = req.query as unknown as z.infer<
            typeof getAssignmentsQuerySchema
        >;

        if (req.user?.role == "student") {
            query.status = "posted";
            query.started = "true";
        }

        const { data, total } = await assignmentService.getAll(query, req.user);

        res.status(StatusCodes.OK).json({
            data,
            total,
        });
    })
);
