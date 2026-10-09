const WORKSPACE_API_URL =
  import.meta.env.VITE_WORKSPACE_API_URL || 'http://127.0.0.1:8080';
const AUTH_API_URL =
  import.meta.env.VITE_AUTH_API_URL || 'http://127.0.0.1:8081';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const LAST_ACTIVITY_KEY = 'last_activity_at';

interface ApiOptions extends RequestInit {
  baseUrl?: string;
  _retry?: boolean;
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getLastAuthActivity(): number | null {
  const value = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!value) return null;

  const timestamp = Number(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function markAuthActivity() {
  localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function getCurrentUserName(): string | null {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    );
    return decoded.user_name || decoded.username || null;
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(): boolean {
  const token = getAccessToken();

  if (!token) {
    return true;
  }

  try {
    const payload = token.split('.')[1];

    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    );

    if (!decoded.exp) {
      return true;
    }

    return decoded.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearAuthTokens();
    throw new Error('Refresh token tidak tersedia.');
  }

  const res = await fetch(`${AUTH_API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    clearAuthTokens();
    throw new Error(data?.message || data?.error || 'Refresh token gagal.');
  }

  const nextAccessToken = data?.data?.access_token ?? data?.access_token;
  const nextRefreshToken =
    data?.data?.refresh_token ?? data?.refresh_token ?? refreshToken;

  if (!nextAccessToken) {
    clearAuthTokens();
    throw new Error('Respons refresh token tidak valid.');
  }

  setTokens(nextAccessToken, nextRefreshToken);
  return nextAccessToken;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { baseUrl = WORKSPACE_API_URL, ...fetchOptions } = options;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;

  const requestHeaders = new Headers(fetchOptions.headers || {});
  requestHeaders.set('Content-Type', 'application/json');

  const token = getAccessToken();
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  console.log('API REQUEST:', {
    url,
    method: fetchOptions.method ?? 'GET',
  });

  let response = await fetch(url, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  if (response.status === 401 && !options._retry) {
    try {
      const nextToken = await refreshAccessToken();
      const retryHeaders = new Headers(fetchOptions.headers || {});
      retryHeaders.set('Content-Type', 'application/json');
      retryHeaders.set('Authorization', `Bearer ${nextToken}`);

      const retryRequest: RequestInit = {
        ...fetchOptions,
        headers: retryHeaders,
      };

      response = await fetch(url, retryRequest);
    } catch {
      clearAuthTokens();
      throw new Error('Sesi Anda telah berakhir. Silakan login kembali.');
    }
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      errorBody?.message ||
        errorBody?.error ||
        response.statusText ||
        'API error',
    );
  }

  return response.json() as Promise<T>;
}

export const SERVICES = {
  WORKSPACE: WORKSPACE_API_URL,
  AUTH: AUTH_API_URL,
};

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, getAccessToken, getRefreshToken };

export function getTokenClaims(): {
  user_name?: string;
  email?: string;
  role?: string;
} | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return null;
  }
}
