import { type FormEvent, useState } from 'react';
import { registerUser } from '../../services/authService';
import type { RegisterRequest } from '../../types/auth';

export function Register() {
  const [form, setForm] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Hilangkan error ketika user mulai memperbaiki input
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Validasi frontend
    if (!form.username.trim()) {
      setError('Username wajib diisi');
      return;
    }

    if (!form.email.trim()) {
      setError('Email wajib diisi');
      return;
    }

    if (!form.password.trim()) {
      setError('Password wajib diisi');
      return;
    }

    if (!form.role) {
      setError('Role wajib dipilih');
      return;
    }

    try {
      setIsLoading(true);

      await registerUser(form);

      setSuccess('User berhasil didaftarkan');

      setForm({
        username: '',
        email: '',
        password: '',
        role: 'user',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div
            className="
                group flex h-10 w-10 cursor-pointer
                items-center justify-center
                rounded-xl bg-teal-100 text-teal-600
                shadow-sm

                animate-bounce
                transition-all duration-300

                hover:bg-teal-600
                hover:text-white
                hover:shadow-lg
                hover:shadow-teal-200
                hover:[animation-play-state:paused]
                hover:-translate-y-1
              "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="
                h-5 w-5
                transition-transform duration-300
                group-hover:scale-110
              "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19a6 6 0 0 0-12 0"
              />

              <circle cx="9" cy="7" r="4" />

              <path
                d="M19 8v6m3-3h-6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="
                  origin-center
                  transition-transform duration-300
                  group-hover:rotate-90
                "
              />
            </svg>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Register User</h1>

            <p className="text-sm text-gray-500">
              Tambahkan user baru ke dalam sistem.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-gray-100 px-6 py-5">
          <h2 className="text-base font-semibold text-gray-900">
            Informasi User
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Lengkapi informasi berikut untuk membuat akun user baru.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2"
        >
          {/* Error */}
          {error && (
            <div
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:col-span-2"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 md:col-span-2"
              role="status"
            >
              {success}
            </div>
          )}

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              autoComplete="username"
              className="
              w-full rounded-lg border border-gray-300
              bg-gray-50 px-4 py-2.5
              text-sm text-gray-900
              outline-none transition-all
              placeholder:text-gray-400
              hover:border-gray-400
              focus:border-teal-500
              focus:bg-white
              focus:ring-4 focus:ring-teal-50
            "
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Gunakan username yang mudah dikenali.
            </p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              autoComplete="email"
              className="
              w-full rounded-lg border border-gray-300
              bg-gray-50 px-4 py-2.5
              text-sm text-gray-900
              outline-none transition-all
              placeholder:text-gray-400
              hover:border-gray-400
              focus:border-teal-500
              focus:bg-white
              focus:ring-4 focus:ring-teal-50
            "
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Gunakan email yang masih aktif.
            </p>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              autoComplete="new-password"
              className="
              w-full rounded-lg border border-gray-300
              bg-gray-50 px-4 py-2.5
              text-sm text-gray-900
              outline-none transition-all
              placeholder:text-gray-400
              hover:border-gray-400
              focus:border-teal-500
              focus:bg-white
              focus:ring-4 focus:ring-teal-50
            "
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Gunakan password yang kuat dan aman.
            </p>
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="
              w-full rounded-lg border border-gray-300
              bg-gray-50 px-4 py-2.5
              text-sm text-gray-900
              outline-none transition-all
              hover:border-gray-400
              focus:border-teal-500
              focus:bg-white
              focus:ring-4 focus:ring-teal-50
            "
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <p className="mt-1.5 text-xs text-gray-400">
              Tentukan hak akses user dalam sistem.
            </p>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-6 md:col-span-2">
            <p className="text-xs text-gray-400">
              Pastikan informasi yang dimasukkan sudah benar.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="
              rounded-lg bg-teal-600
              px-6 py-2.5
              text-sm font-semibold text-white
              shadow-sm
              transition-all
              hover:bg-teal-700
              hover:shadow
              focus:outline-none
              focus:ring-4 focus:ring-teal-100
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            >
              {isLoading ? 'Mendaftarkan...' : 'Register User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
