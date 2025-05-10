import { z } from "zod";
import { listQuerySchema, withValidation } from "~/validation";
import { userService } from "./service";
import { StatusCodes } from "http-status-codes";
import { validUserRoles } from "./types";
import { validStatuses } from "~/types";
import { idParamsSchema } from "~/validation";
import { asyncMiddleware } from "~/async-middleware";

// base schemas
const phoneNumberSchema = z
    .string()
    .regex(
        /^(0|62|\+62)(8[1-35-9]\d{7,10}|2[124]\d{7,8}|619\d{8}|2(?:1(?:14|500)|2\d{3})\d{3}|61\d{5,8}|(?:2(?:[35][1-4]|6[0-8]|7[1-6]|8\d|9[1-8])|3(?:1|[25][1-8]|3[1-68]|4[1-3]|6[1-3568]|7[0-469]|8\d)|4(?:0[1-589]|1[01347-9]|2[0-36-8]|3[0-24-68]|43|5[1-378]|6[1-5]|7[134]|8[1245])|5(?:1[1-35-9]|2[25-8]|3[124-9]|4[1-3589]|5[1-46]|6[1-8])|6(?:[25]\d|3[1-69]|4[1-6])|7(?:02|[125][1-9]|[36]\d|4[1-8]|7[0-36-9])|9(?:0[12]|1[013-8]|2[0-479]|5[125-8]|6[23679]|7[159]|8[01346]))\d{5,8})/,
        { message: "Invalid phone number" }
    );

const baseUserDataSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    needsPasswordChange: z.boolean(),
    role: z.enum(validUserRoles, { message: "Required" }),
    status: z.enum(validStatuses),
    phoneNumber: phoneNumberSchema.optional(),
    profileImage: z.string().optional(),
});
const studentDataSchema = z.object({
    birthDate: z.coerce.date(),
    nis: z
        .string()
        .length(10, { message: "Invalid NISN" })
        .regex(/^[0-9]*$/, { message: "NISN may only contain numbers" }),
    description: z.string().optional(),
    fatherName: z.string().optional(),
    motherName: z.string().optional(),
    guardianName: z.string().optional(),
    contactPhoneNumber: phoneNumberSchema,
});
const teacherDataSchema = z.object({
    expertise: z.string().optional(),
    bachelorDegree: z.string().optional(),
    masterDegree: z.string().optional(),
    doctorateDegree: z.string().optional(),
    description: z.string().optional(),
    nig: z.string(),
});

const createUserDataSchema = baseUserDataSchema.omit({ status: true });
const createUserBodySchema = z
    .object({
        userData: createUserDataSchema,
        roleData: z.any(),
    })
    .superRefine((data, ctx) => {
        if (data.userData.role === "student") {
            const result = studentDataSchema.safeParse(data.roleData);
            console.log(result.error?.issues);
            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    issue.path = ["roleData", ...issue.path];
                    ctx.addIssue(issue);
                });
            }
        }
        if (data.userData.role === "teacher") {
            const result = teacherDataSchema.safeParse(data.roleData);
            if (!result.success) {
                result.error.issues.forEach((issue) => {
                    issue.path = ["roleData", ...issue.path];
                    ctx.addIssue(issue);
                });
            }
        }
    });

export const createUserHandler = withValidation(
    {
        bodySchema: createUserBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof createUserBodySchema>;

        const created = await userService.create(data.userData, data.roleData);
        res.status(StatusCodes.OK).json({
            data: created,
            message: "User created successfully.",
        });
    })
);

export const getUsersHandler = withValidation(
    {
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const data = await userService.getAll(query);
        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getStudentsHandler = withValidation(
    {
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const data = await userService.getAllStudents(query);
        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getTeachersHandler = withValidation(
    {
        querySchema: listQuerySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const query = req.query as unknown as z.infer<typeof listQuerySchema>;

        const data = await userService.getAllTeachers(query);
        res.status(StatusCodes.OK).json({
            data,
        });
    })
);

export const getUserHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;
        const user = await userService.getById(id);
        res.status(StatusCodes.OK).json({
            data: user,
        });
    })
);

const updateUserDataSchema = baseUserDataSchema.omit({ role: true });
const updateUserBodySchema = z.object({
    userData: updateUserDataSchema.partial(),
    roleData: z
        .union([studentDataSchema.partial(), teacherDataSchema.partial()])
        .optional(),
});
export const updateUserHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
        bodySchema: updateUserBodySchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const data = req.body as z.infer<typeof updateUserBodySchema>;
        const id = req.params.id;
        await userService.update(id, data.userData, data.roleData);
        res.status(StatusCodes.OK).json({
            message: "User updated successfully.",
        });
    })
);

export const activateUserHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await userService.update(id, {
            status: "active",
        });

        res.status(StatusCodes.OK).json({
            message: "User activated successfully!",
        });
    })
);

export const deactivateUserHandler = withValidation(
    {
        paramsSchema: idParamsSchema,
    },
    asyncMiddleware(async (req, res, next) => {
        const id = req.params.id;

        await userService.update(id, {
            status: "inactive",
        });

        res.status(StatusCodes.OK).json({
            message: "User deactivated successfully!",
        });
    })
);
