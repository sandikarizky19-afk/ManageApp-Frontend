import { type FormEvent, useState } from 'react';
import { SERVICES } from '../../lib/api';

type Role = 'admin' | 'user';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export function Register() {
  const [form, setForm] = useState<RegisterForm>({
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

      const response = await fetch(`${SERVICES.AUTH}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || 'Gagal mendaftarkan user',
        );
      }

      setSuccess('User berhasil didaftarkan');

      // Reset form
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
    <div className="mx-auto w-full max-w-lg">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Register User</h1>

          <p className="mt-1 text-sm text-gray-500">
            Tambahkan user baru ke dalam sistem.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            role="status"
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
                px-4 py-2.5 text-sm text-gray-900
                outline-none transition
                placeholder:text-gray-400
                focus:border-teal-500
                focus:ring-2 focus:ring-teal-100
              "
            />
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
                px-4 py-2.5 text-sm text-gray-900
                outline-none transition
                placeholder:text-gray-400
                focus:border-teal-500
                focus:ring-2 focus:ring-teal-100
              "
            />
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
                px-4 py-2.5 text-sm text-gray-900
                outline-none transition
                placeholder:text-gray-400
                focus:border-teal-500
                focus:ring-2 focus:ring-teal-100
              "
            />
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
                bg-white px-4 py-2.5 text-sm text-gray-900
                outline-none transition
                focus:border-teal-500
                focus:ring-2 focus:ring-teal-100
              "
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full rounded-lg bg-teal-600
              px-4 py-2.5 text-sm font-semibold text-white
              transition hover:bg-teal-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isLoading ? 'Mendaftarkan...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
}
