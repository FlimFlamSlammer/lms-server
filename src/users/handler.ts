import { z } from "zod";
import { withValidation } from "~/validation";
import { userService, validUserRoles, validStatuses } from "./service";
import { Request, NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { profile } from "console";

// base schemas
const baseUserDataSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(validUserRoles),
  status: z.enum(validStatuses),
  phoneNumber: z
    .string()
    .regex(
      /^(0|62|\+62)(8[1-35-9]\d{7,10}|2[124]\d{7,8}|619\d{8}|2(?:1(?:14|500)|2\d{3})\d{3}|61\d{5,8}|(?:2(?:[35][1-4]|6[0-8]|7[1-6]|8\d|9[1-8])|3(?:1|[25][1-8]|3[1-68]|4[1-3]|6[1-3568]|7[0-469]|8\d)|4(?:0[1-589]|1[01347-9]|2[0-36-8]|3[0-24-68]|43|5[1-378]|6[1-5]|7[134]|8[1245])|5(?:1[1-35-9]|2[25-8]|3[124-9]|4[1-3589]|5[1-46]|6[1-8])|6(?:[25]\d|3[1-69]|4[1-6])|7(?:02|[125][1-9]|[36]\d|4[1-8]|7[0-36-9])|9(?:0[12]|1[013-8]|2[0-479]|5[125-8]|6[23679]|7[159]|8[01346]))\d{5,8})/
    )
    .optional(),
  profileImage: z.string().optional(),
});
const studentDataSchema = z.object({
  birthDate: z.date(),
  nis: z.string(),
  description: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  guardianName: z.string().optional(),
  contactPhoneNumber: z.string(),
});
const teacherDataSchema = z.object({
  expertise: z.string().optional(),
  bachelorDegree: z.string().optional(),
  masterDegree: z.string().optional(),
  doctorateDegree: z.string().optional(),
  description: z.string().optional(),
  nig: z.string(),
});
const userIdSchema = z.string();

const createUserDataSchema = baseUserDataSchema.omit({ status: true });
const createUserBodySchema = z.object({
  userData: createUserDataSchema,
  roleData: z.union([studentDataSchema, teacherDataSchema]).optional(),
});

export const createUserHandler = withValidation(
  {
    bodySchema: createUserBodySchema,
  },
  async (req, res, next) => {
    try {
      const data = req.body as z.infer<typeof createUserBodySchema>;
      await userService.create(data.userData, data.roleData);
      res.status(StatusCodes.OK).json({
        message: "User created successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

export const getUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAll();
    res.status(StatusCodes.OK).json({
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserParamsSchema = z.object({
  id: userIdSchema,
});

export const getUserHandler = withValidation(
  {
    paramsSchema: getUserParamsSchema,
  },
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await userService.getById(id);
    } catch (error) {
      next(error);
    }
  }
);

const updateUserDataSchema = baseUserDataSchema.omit({ role: true });
const updateUserBodySchema = z.object({
  userData: updateUserDataSchema,
  roleData: z.union([studentDataSchema, teacherDataSchema]).optional(),
});
const updateUserParamsSchema = z.object({
  id: userIdSchema,
});

export const updateUserHandler = withValidation(
  {
    paramsSchema: updateUserParamsSchema,
    bodySchema: updateUserBodySchema,
  },
  async (req, res, next) => {
    try {
      const data = req.body as z.infer<typeof updateUserBodySchema>;
      const id = req.params.id;
      await userService.update(id, data.userData, data.roleData);
      res.status(StatusCodes.OK).json({
        message: "User created successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

const updateActiveSchema = z.object({
  id: userIdSchema,
});

export const activateUserHandler = withValidation(
  {
    paramsSchema: updateActiveSchema,
  },
  async (req, res, next) => {
    try {
      const id = req.params.id;

      if ((await userService.getById(id)).status == "active") {
        res.status(StatusCodes.OK).json({
          message: "User already activated!",
        });
      }

      await userService.update(id, {
        status: "active",
      });

      res.status(StatusCodes.OK).json({
        message: "User activated successfully!",
      });
    } catch (error) {
      next(error);
    }
  }
);

export const deactivateUserHandler = withValidation(
  {
    paramsSchema: updateActiveSchema,
  },
  async (req, res, next) => {
    try {
      const id = req.params.id;

      if ((await userService.getById(id)).status == "inactive") {
        res.status(StatusCodes.OK).json({
          message: "User already inactive!",
        });
      }

      await userService.update(id, {
        status: "inactive",
      });

      res.status(StatusCodes.OK).json({
        message: "User deactivated successfully!",
      });
    } catch (error) {
      next(error);
    }
  }
);
