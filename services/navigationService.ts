import type { UserRole } from "@/types/user";

export function roleToDashboard(role: UserRole): string {
  switch (role) {
    case "patient":
      return "/patient/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "hospital":
      return "/hospital/dashboard";
    default:
      return "/login";
  }
}
