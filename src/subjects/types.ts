import { Status } from "~/types";

export type Subject = {
	id: string;
	name: string;
	grade: number;
	startYear: number;
	endYear: number;
	status: Status;
};

export type CreateSubjectDTO = Omit<Subject, "id" | "status">;

export type UpdateSubjectDTO = Partial<Omit<Subject, "id">>;

export type MutateTeachersDTO = {
	teacherIds: string[];
};

export type MutateClassesDTO = {
	classIds: string[];
};
