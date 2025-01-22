declare namespace Express {
    export interface Request {
        user: {
            name: string;
            id: string;
            email: string;
            phoneNumber?: string;
            status: string;
            password: string;
            role: "student" | "teacher" | "admin" | "superadmin";
            profileImage?: string;
            roleData?:
                | {
                      id: string;
                      birthDate: Date;
                      nis: string;
                      description?: string;
                      fatherName?: string;
                      motherName?: string;
                      guardianName?: string;
                      contactPhoneNumber: string;
                  }
                | {
                      id: string;
                      nig: string;
                      expertise?: string;
                      bachelorDegree?: string;
                      masterDegree?: string;
                      doctorateDegree?: string;
                      description?: string;
                  };
        };
    }
}
