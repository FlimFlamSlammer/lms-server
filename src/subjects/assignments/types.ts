import { ListParams, Status } from "~/types";

export const validAssignmentStatuses = ["draft", "posted", "canceled"] as const;
export type AssignmentStatus = (typeof validAssignmentStatuses)[number];

export type Assignment = {
    id: string;
    title: string;
    teacherId: string;
    subjectId: string;
    attachmentPath?: string;
    status: AssignmentStatus;
    startTime: Date;
    endTime: Date;
    maxGrade: number;
};

export type CreateAssignmentDTO = Omit<Assignment, "id" | "status">;

export type UpdateAssignmentDTO = Partial<Omit<Assignment, "id">>;

export type AssignmentListParams = Omit<ListParams, "status"> & {
    status: AssignmentStatus | "all";
    active?: Boolean;
};
