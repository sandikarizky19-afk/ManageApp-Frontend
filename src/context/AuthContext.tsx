import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUserName,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from '../lib/api';

interface AuthContextType {
  user: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUserName();

    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    await loginUser(username, password);
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
