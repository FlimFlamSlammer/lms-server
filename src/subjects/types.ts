export const validStatuses = ["active", "inactive"] as const;

export type Subject = {
	id: string;
	name: string;
	grade: number;
	startYear: number;
	endYear: number;
	status: string;
};

export type CreateSubjectDTO = Omit<Subject, "id" | "status">;

export type UpdateSubjectDTO = Omit<Subject, "id">;
