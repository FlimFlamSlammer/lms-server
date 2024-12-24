import { Status } from "~/types";

export const validClassTypes = ["optional", "mandatory"] as const;
export type ClassType = (typeof validClassTypes)[number];

export type Class = {
	id: string;
	name: string;
	type: ClassType;
	status: Status;
};

export type CreateClassDTO = Omit<Class, "id" | "status">;

export type UpdateClassDTO = Partial<Omit<Class, "id">>;
