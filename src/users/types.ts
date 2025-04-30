export const validUserRoles = [
    "student",
    "teacher",
    "admin",
    "superadmin",
] as const;
export type UserRole = (typeof validUserRoles)[number];

export type User = {
    name: string;
    id: string;
    email: string;
    phoneNumber?: string;
    status: string;
    password: string;
    needsPasswordChange: boolean;
    role: UserRole;
    profileImage?: string;
    roleData?: Student | Teacher;
};
export type Student = {
    id: string;
    birthDate: Date;
    nis: string;
    description?: string;
    fatherName?: string;
    motherName?: string;
    guardianName?: string;
    contactPhoneNumber: string;
};
export type Teacher = {
    id: string;
    nig: string;
    expertise?: string;
    bachelorDegree?: string;
    masterDegree?: string;
    doctorateDegree?: string;
    description?: string;
};

export type CreateUserDTO = Omit<User, "status" | "id">;
export type CreateStudentDTO = Omit<Student, "id">;
export type CreateTeacherDTO = Omit<Teacher, "id">;

export type UpdateUserDTO = Partial<Omit<User, "role" | "id">>;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;
export type UpdateTeacherDTO = Partial<CreateTeacherDTO>;
