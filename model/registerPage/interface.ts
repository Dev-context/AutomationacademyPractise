export interface userRegister {
  firstName: string;
  lastName?: string;
  userEmail: string;
  occupation?: string;
  gender?: "Male" | "Female";
  userMobile: string;
  userPassword: string;
  confirmPassword: string;
  required?: boolean;
}
