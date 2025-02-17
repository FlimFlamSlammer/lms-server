import { z } from "zod";
import { asyncMiddleware } from "~/async-middleware";
import { getAssignmentsQuerySchema } from "~/subjects/assignments/validation";
import { withValidation } from "~/validation";
import { assignmentService } from "./service";
import { StatusCodes } from "http-status-codes";

export const getAssignmentsHandler = withValidation(
    {
        querySchema: getAssignmentsQuerySchema,
    },
    asyncMiddleware(async (req, res) => {
        const query = req.query as unknown as z.infer<
            typeof getAssignmentsQuerySchema
        >;

        if (req.user?.role == "student") {
            query.status = "posted";
            query.started = "true";
        }

        const { data, total } = await assignmentService.getAll(query);

        res.status(StatusCodes.OK).json({
            data,
            total,
        });
    })
);
