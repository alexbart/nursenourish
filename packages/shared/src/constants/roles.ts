export const Roles = {
  ADMIN: "ADMIN",
  USER: "USER",
  PHARMACIST: "PHARMACIST",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];