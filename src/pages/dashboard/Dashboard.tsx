import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const { user, logout, refresh } = useAuth();
  const [status, setStatus] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setStatus('');

    try {
      await refresh();
      setStatus('Token berhasil diperbarui.');
    } catch (err) {
      setStatus('Gagal memperbarui token.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setStatus('');

    try {
      await logout();
    } catch (err) {
      setStatus('Gagal melakukan logout.');
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-emerald-600">Online</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Selamat datang, {user} 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Berikut adalah informasi akun dan aktivitas kamu.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Authentication Status
            </p>
            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Kamu sedang login
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Session authentication kamu sedang aktif.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 sm:flex">
            <span className="text-2xl">✓</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing || isLoggingOut}
          className="
            flex items-center justify-center gap-3
            rounded-xl border border-gray-200 bg-white
            px-5 py-4 font-semibold text-gray-700 shadow-sm
            transition-all hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          <span>↻</span>
          {isRefreshing ? 'Memproses...' : 'Refresh Token'}
        </button>

        <button
          onClick={handleLogout}
          disabled={isRefreshing || isLoggingOut}
          className="
            flex items-center justify-center gap-3
            rounded-xl border border-red-200 bg-red-50
            px-5 py-4 font-semibold text-red-700 shadow-sm
            transition-all hover:bg-red-100
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          {isLoggingOut ? 'Keluar...' : 'Logout'}
        </button>
      </div>

      {status && (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {status}
        </div>
      )}
    </>
  );
}
