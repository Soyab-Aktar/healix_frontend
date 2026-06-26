import { UserRole } from "@/lib/authUtils";

export interface UserInfo {
  id: string;
  name: string,
  email: string,
  role: UserRole;
  needPasswordChange?: boolean;
  image?: string;
  patient?: {
    profilePhoto?: string;
  };
  doctor?: {
    profilePhoto?: string;
  };
  admin?: {
    profilePhoto?: string;
  };
  superAdmin?: {
    profilePhoto?: string;
  };
}