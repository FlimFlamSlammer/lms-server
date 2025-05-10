import { Prisma } from "@prisma/client";
import { Subject } from "~/subjects/types";
import { Status } from "~/types";
import { Student } from "~/users/types";

export type Class = {
    id: string;
    name: string;
    status: Status;
    students?: Prisma.StudentCreateNestedManyWithoutClassesInput;
    subjects?: Prisma.SubjectCreateNestedManyWithoutClassesInput;
};

export type CreateClassDTO = Omit<Class, "id" | "status" | "students">;

export type UpdateClassDTO = Partial<Omit<Class, "id">>;

export type MutateStudentsDTO = {
    studentIds: string[];
};

export type MutateSubjectsDTO = {
    subjectIds: string[];
};
