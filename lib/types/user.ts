export type UserRole = "admin" | "organization" | "photographer";

// Replace with your real session/auth type once wired up.
export interface CurrentUser {
  role: UserRole;
}
