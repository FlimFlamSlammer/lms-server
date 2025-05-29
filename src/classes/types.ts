import { Prisma } from "@prisma/client";
import { Course } from "~/courses/types";
import { Status } from "~/types";
import { Student } from "~/users/types";

export type Class = {
    id: string;
    name: string;
    status: Status;
    students?: Prisma.StudentCreateNestedManyWithoutClassesInput;
    courses?: Prisma.CourseCreateNestedManyWithoutClassesInput;
};

export type CreateClassDTO = Omit<Class, "id" | "status" | "students">;

export type UpdateClassDTO = Partial<Omit<Class, "id">>;

export type MutateStudentsDTO = {
    studentIds: string[];
};

export type MutateCoursesDTO = {
    courseIds: string[];
};
