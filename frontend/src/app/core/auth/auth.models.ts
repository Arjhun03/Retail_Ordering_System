export type UserRole = 'Customer' | 'Admin' | 'BrandManager' | 'Brand Manager';

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string | null;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserSummary {
  userId: number;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  expiresAtUtc: string;
  user: UserSummary;
}

export interface UserProfileResponse {
  userId: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAtUtc: string;
}

export interface UpdateUserProfileRequest {
  fullName: string;
  phone?: string | null;
}

export interface StoredAuthSession {
  token: string;
  expiresAtUtc: string;
  user: UserSummary;
}

export interface ProblemDetailsError {
  title?: string;
  detail?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
