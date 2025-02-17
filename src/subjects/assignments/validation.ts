import { listQuerySchema } from "~/validation";
import { validAssignmentStatuses } from "./types";
import { z } from "zod";
import { validBoolStrings } from "~/types";

export const getAssignmentsQuerySchema = z.intersection(
    listQuerySchema.omit({ status: true }),
    z.object({
        status: z
            .enum([...validAssignmentStatuses, "all"] as const)
            .optional()
            .default("all"),
        active: z
            .enum([...validBoolStrings, "all"] as const)
            .optional()
            .default("all"),
        done: z
            .enum([...validBoolStrings, "all"] as const)
            .optional()
            .default("all"),
        started: z
            .enum([...validBoolStrings, "all"] as const)
            .optional()
            .default("all"),
    })
);
