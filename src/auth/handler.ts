import { StatusCodes } from "http-status-codes";
import { userService } from "src/user/service";
import { withValidation } from "src/validation";
import { z } from "zod";
import { authService } from "./service";

const loginBodySchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export const loginHandler = withValidation(
	{
		bodySchema: loginBodySchema,
	},
	(req, res, next) => {
		try {
			const data = req.body as z.infer<typeof loginBodySchema>;
			const authToken = authService.login(data.email, data.password);

			res.cookie("authToken", authToken);

			res.status(StatusCodes.OK).json({
				message: "Logged in successfully.",
			});
		} catch (error) {
			next(error);
		}
	}
);
