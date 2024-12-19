export const validUserRoles = [
	"student",
	"teacher",
	"admin",
	"superadmin",
] as const;
export type UserRole = (typeof validUserRoles)[number];

export const validStatuses = ["active", "inactive"] as const;

export const UserRoles = {
	STUDENT: validUserRoles[0],
	TEACHER: validUserRoles[1],
	ADMIN: validUserRoles[2],
	SUPERADMIN: validUserRoles[3],
};

export type User = {
	name: string;
	id: string;
	email: string;
	phoneNumber?: string;
	status: string;
	password: string;
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
