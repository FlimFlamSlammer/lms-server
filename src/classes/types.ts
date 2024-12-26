import { Status } from "~/types";

export type Class = {
	id: string;
	name: string;
	status: Status;
};

export type CreateClassDTO = Omit<Class, "id" | "status">;

export type UpdateClassDTO = Partial<Omit<Class, "id">>;
