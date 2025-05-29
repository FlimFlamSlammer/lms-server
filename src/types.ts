export const validStatuses = ["active", "inactive"] as const;
export type Status = (typeof validStatuses)[number];

export const validBoolStrings = ["true", "false"] as const;
export type BoolString = (typeof validBoolStrings)[number];

export type ListParams = {
    page: number;
    size: number;
    mode: "pagination" | "all";
    search?: string;
    status: Status | "all" | string;
};
