import {
  SERVICES,
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '../lib/api';

import type {
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../types/auth';

async function authRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${SERVICES.AUTH}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || response.statusText || 'Auth API error',
    );
  }

  return data as T;
}

export async function loginUser(username: string, password: string) {
  const data = await authRequest<{
    data?: LoginResponse;
    access_token?: string;
    refresh_token?: string;
  }>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const accessToken = data?.data?.access_token ?? data?.access_token;

  const refreshToken = data?.data?.refresh_token ?? data?.refresh_token;

  if (!accessToken || !refreshToken) {
    throw new Error('Respons login tidak valid.');
  }

  setTokens(accessToken, refreshToken);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
}

export async function registerUser(payload: RegisterRequest) {
  return authRequest<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string) {
  return authRequest<{ message: string }>('/api/v1/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return authRequest<{ message: string }>('/api/v1/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export async function logoutUser() {
  const accessToken = getAccessToken();

  const refreshToken = getRefreshToken();

  try {
    await fetch(`${SERVICES.AUTH}/api/v1/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
    });
  } catch {
    // Tetap lanjut membersihkan session
    // di sisi client.
  } finally {
    clearAuthTokens();
  }
}
