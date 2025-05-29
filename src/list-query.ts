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
    resultsKey?: string;
};

export const listQuery = async <T = unknown>({
    query: { search, mode, page, size, status },
    where = {},
    model,
    searchKey,
    statusKey = "status",
    resultsKey = "data",
}: ListQueryParams) => {
    const baseWhere: Record<string, unknown> = { ...where };

    if (searchKey && search) {
        baseWhere[searchKey] = {
            contains: search,
        };
    }

    baseWhere[statusKey] = status !== "all" ? status : undefined;

    const table = prisma[model.toLowerCase() as any] as any;

    const data = (await table.findMany({
        ...(mode === "pagination"
            ? {
                  take: size,
                  skip: (page - 1) * size,
              }
            : {}),
        where: baseWhere,
    })) as T;

    const total = await table.count({ baseWhere });

    const res: Record<string, unknown> = { total };
    res[resultsKey] = data;

    return res;
};
