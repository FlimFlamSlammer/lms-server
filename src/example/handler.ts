import { withValidation } from "../validation";
import { getExampleQuerySchema } from "./validation";
import { exampleService } from "./service";
import { z } from "zod";

export const getExampleHandler = withValidation(
	{
		paramsSchema: getExampleQuerySchema,
	},
	(req, res, next) => {
		try {
			const { id } = req.query as z.infer<typeof getExampleQuerySchema>;
			const data = exampleService.list();
			res.json({
				success: true,
				data,
			});
		} catch (error) {
			next?.(error);
		}
	}
);
