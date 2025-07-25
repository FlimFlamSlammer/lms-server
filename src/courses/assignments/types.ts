import { ListParams, Status } from "~/types";

export const validAssignmentStatuses = ["draft", "posted", "canceled"] as const;
export type AssignmentStatus = (typeof validAssignmentStatuses)[number];

export type Assignment = {
    id: string;
    title: string;
    teacherId: string;
    courseId: string;
    description?: string;
    status: AssignmentStatus;
    startTime: Date;
    endTime: Date;
    maxGrade: number;
    submissions?: AssignmentToStudent[];
};

export type AssignmentToStudent = {
    studentId: string;
    assignmentId: string;
    grade?: number;
    attachmentPath: string;
};

export type CreateAssignmentDTO = Omit<Assignment, "id" | "status">;

export type UpdateAssignmentDTO = Partial<Omit<Assignment, "id">>;

export type AssignmentListParams = Omit<ListParams, "status"> & {
    status: AssignmentStatus | "all";
    active: string;
    done: string;
    started: string;
};

export type SubmitAssignmentDTO = {
    studentId: string;
    attachmentPath: string;
};

export type UpdateSubmissionDTO = {
    grade: number;
};
