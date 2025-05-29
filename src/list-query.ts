import { Prisma } from "@prisma/client";
import { prismaInstance } from "./prisma-client";
import { ListParams } from "./types";

const prisma = prismaInstance;

export type ListQueryParams = {
    query: ListParams;
    model: Prisma.ModelName;
    where?: Record<string, unknown>;
    searchKey?: string;
    statusKey?: string;
};

export const listQuery = async <T>({
    query: { search, mode, page, size, status },
    where = {},
    model,
    searchKey,
    statusKey = "status",
}: ListQueryParams) => {
    const finalWhere: Record<string, unknown> = { ...where };

    if (searchKey && search) {
        finalWhere[searchKey] = {
            contains: search,
        };
    }

    finalWhere[statusKey] = status !== "all" ? status : undefined;

    const table = prisma[model.toLowerCase() as any] as any;

    const data = (await table.findMany({
        ...(mode === "pagination"
            ? {
                  take: size,
                  skip: (page - 1) * size,
              }
            : {}),
        where: finalWhere,
    })) as T;

    const total = (await table.count({ where: finalWhere })) as number;

    return { data, total };
};
