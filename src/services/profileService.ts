import { apiFetch, SERVICES } from '../lib/api';
import type {
  ApiResponse,
  ChangePasswordRequest,
  CheckAktifUserResponse,
  ProfileResponse,
  UpdateProfileRequest,
} from '../types/auth';

const base = { baseUrl: SERVICES.AUTH };

export async function getProfile(): Promise<ProfileResponse> {
  const res = await apiFetch<ApiResponse<ProfileResponse>>(
    '/api/v1/profile',
    base,
  );
  if (!res.data) throw new Error('Data profil kosong.');
  return res.data;
}

export function updateProfile(body: UpdateProfileRequest) {
  return apiFetch<ApiResponse<null>>('/api/v1/profile', {
    ...base,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function changePassword(body: ChangePasswordRequest) {
  return apiFetch<ApiResponse<null>>('/api/v1/profile/password', {
    ...base,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export async function checkAktifUser(): Promise<CheckAktifUserResponse> {
  const res = await apiFetch<ApiResponse<CheckAktifUserResponse>>(
    '/api/v1/profile/status',
    base,
  );
  if (!res.data) throw new Error('Data status pengguna kosong.');
  return res.data;
}

export function nonAktifUser() {
  return apiFetch<ApiResponse<null>>('/api/v1/profile/deactivate', {
    ...base,
    method: 'PATCH',
  });
}
