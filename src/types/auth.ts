export type Role = 'admin' | 'user';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterResponse {
  message?: string;
  data?: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
export type Gender = 'male' | 'female';

export interface ProfileResponse {
  id: number;
  user_id: number;
  full_name: string;
  avatar_url: string | null;
  gender: Gender | null;
  birth_date: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  avatar_url?: string | null;
  gender?: Gender | null;
  birth_date?: string | null;
  address?: string | null;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}
