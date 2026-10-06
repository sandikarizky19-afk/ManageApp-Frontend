import { createContext, useContext, useState, useEffect } from 'react';
import {
  clearAuthTokens,
  getCurrentUserName,
  getLastAuthActivity,
  getRefreshToken,
  isAccessTokenExpired,
  markAuthActivity,
  refreshAccessToken,
} from '../lib/api';
import { loginUser, logoutUser } from '../services/authService';

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const refreshToken = getRefreshToken();

        // Tidak ada refresh token berarti
        // tidak ada session yang bisa dipulihkan.
        if (!refreshToken) {
          clearAuthTokens();
          setUser(null);
          return;
        }

        const lastActivity = getLastAuthActivity();
        if (
          lastActivity === null ||
          Date.now() - lastActivity >= IDLE_TIMEOUT_MS
        ) {
          clearAuthTokens();
          setUser(null);
          return;
        }

        const accessTokenExpired = isAccessTokenExpired();

        if (accessTokenExpired) {
          // Access token expired.
          // Coba ambil access token baru.
          await refreshAccessToken();
        }

        // Setelah token dipastikan masih valid / berhasil di-refresh,
        // ambil username dari access token terbaru.
        setUser(getCurrentUserName());
      } catch {
        // Refresh gagal → session dianggap tidak valid.
        clearAuthTokens();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    let idleTimer = 0;
    let lastPointerMoveAt = 0;

    const expireIfIdle = () => {
      const lastActivity = getLastAuthActivity();
      const remaining = lastActivity
        ? IDLE_TIMEOUT_MS - (Date.now() - lastActivity)
        : 0;

      if (remaining <= 0) {
        clearAuthTokens();
        setUser(null);
        return;
      }

      idleTimer = window.setTimeout(expireIfIdle, remaining);
    };

    const recordActivity = (event: Event) => {
      const lastActivity = getLastAuthActivity();
      if (
        lastActivity === null ||
        Date.now() - lastActivity >= IDLE_TIMEOUT_MS
      ) {
        expireIfIdle();
        return;
      }

      const now = Date.now();
      if (event.type === 'pointermove' && now - lastPointerMoveAt < 5000) {
        return;
      }

      lastPointerMoveAt = now;
      markAuthActivity();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(expireIfIdle, IDLE_TIMEOUT_MS);
    };

    const checkOnReturn = () => expireIfIdle();

    idleTimer = window.setTimeout(expireIfIdle, IDLE_TIMEOUT_MS);
    window.addEventListener('pointerdown', recordActivity);
    window.addEventListener('pointermove', recordActivity);
    window.addEventListener('keydown', recordActivity);
    window.addEventListener('scroll', recordActivity, true);
    window.addEventListener('touchstart', recordActivity);
    window.addEventListener('focus', checkOnReturn);
    document.addEventListener('visibilitychange', checkOnReturn);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('pointerdown', recordActivity);
      window.removeEventListener('pointermove', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('scroll', recordActivity, true);
      window.removeEventListener('touchstart', recordActivity);
      window.removeEventListener('focus', checkOnReturn);
      document.removeEventListener('visibilitychange', checkOnReturn);
    };
  }, [user]);

  const login = async (username: string, password: string) => {
    await loginUser(username, password);
    markAuthActivity();
    setUser(getCurrentUserName());
  };

  const logout = async () => {
    await logoutUser();

    setUser(null);
  };

  const refresh = async () => {
    await refreshAccessToken();

    setUser(getCurrentUserName());
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
};
