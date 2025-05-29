import { Prisma } from "@prisma/client";
import { Status } from "~/types";

export type Course = {
    id: string;
    name: string;
    grade: number;
    startYear: number;
    endYear: number;
    status: Status;
    classes?: Prisma.ClassCreateNestedManyWithoutCoursesInput;
    teachers?: Prisma.TeacherCreateNestedManyWithoutCoursesInput;
};

export type CreateCourseDTO = Omit<Course, "id" | "status">;

export type UpdateCourseDTO = Partial<Omit<Course, "id">>;

export type MutateTeachersDTO = {
    teacherIds: string[];
};

export type MutateClassesDTO = {
    classIds: string[];
};
