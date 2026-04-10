export type UserRole = "patient" | "doctor" | "hospital";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}
