import { Status } from "~/types";

export const validSubjectTypes = ["optional", "mandatory"] as const;
export type SubjectType = (typeof validSubjectTypes)[number];

export type Subject = {
	id: string;
	name: string;
	grade: number;
	startYear: number;
	endYear: number;
	type: string;
	status: Status;
};

export type CreateSubjectDTO = Omit<Subject, "id" | "status">;

export type UpdateSubjectDTO = Partial<Omit<Subject, "id">>;
