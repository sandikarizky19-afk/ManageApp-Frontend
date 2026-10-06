import { useEffect, useState } from 'react';
import { getTokenClaims } from '../../lib/api';
import {
  changePassword,
  getProfile,
  updateProfile,
} from '../../services/profileService';
import type { Gender, UpdateProfileRequest } from '../../types/auth';

type Notice = { type: 'success' | 'error'; text: string } | null;

type ProfileForm = {
  full_name: string;
  gender: Gender | '';
  birth_date: string;
  address: string;
  avatar_url: string;
};

export function Profile() {
  const claims = getTokenClaims();

  const [form, setForm] = useState<ProfileForm>({
    full_name: '',
    gender: '',
    birth_date: '',
    address: '',
    avatar_url: '',
  });
  const [pw, setPw] = useState({ old_password: '', new_password: '' });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [profileNotice, setProfileNotice] = useState<Notice>(null);
  const [pwNotice, setPwNotice] = useState<Notice>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProfile();
        if (cancelled) return;
        setCreatedAt(p.created_at);
        setForm({
          full_name: p.full_name ?? '',
          gender: p.gender ?? '',
          birth_date: p.birth_date ? p.birth_date.slice(0, 10) : '', // input date butuh YYYY-MM-DD
          address: p.address ?? '',
          avatar_url: p.avatar_url ?? '',
        });
      } catch (e) {
        if (!cancelled)
          setProfileNotice({
            type: 'error',
            text: e instanceof Error ? e.message : 'Gagal memuat profil.',
          });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onField =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setProfileNotice({ type: 'error', text: 'Nama lengkap wajib diisi.' });
      return;
    }
    setSavingProfile(true);
    setProfileNotice(null);
    try {
      const payload: UpdateProfileRequest = {
        full_name: form.full_name,
        gender: form.gender === '' ? null : form.gender,
        birth_date: form.birth_date || null,
        address: form.address || null,
        avatar_url: form.avatar_url || null,
      };

      await updateProfile(payload);
      setProfileNotice({
        type: 'success',
        text: 'Profil berhasil diperbarui.',
      });
    } catch (err) {
      setProfileNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Gagal menyimpan.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.new_password.length < 8) {
      setPwNotice({ type: 'error', text: 'Password baru minimal 8 karakter.' });
      return;
    }
    setSavingPw(true);
    setPwNotice(null);
    try {
      await changePassword(pw);
      setPw({ old_password: '', new_password: '' });
      setPwNotice({ type: 'success', text: 'Password berhasil diperbarui.' });
    } catch (err) {
      setPwNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Gagal mengganti password.',
      });
    } finally {
      setSavingPw(false);
    }
  };

  const initial = (form.full_name || claims?.user_name || 'U')
    .charAt(0)
    .toUpperCase();

  function formatJoinDate(value: string | null): string {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <div className="min-h-screen bg-gray-50/50 lg:px-12 w-full">
      <div className="mb-8 flex items-center gap-4">
        {/* Profile Icon */}
        <div
          className="
            group relative flex h-10 w-10
            items-center justify-center
            rounded-xl bg-teal-100
            text-teal-600
            shadow-sm
            transition-all duration-300
            hover:bg-teal-600
            hover:text-white
            hover:shadow-lg
            hover:shadow-teal-200
            "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            {/* Lingkaran luar tetap diam */}
            <circle
              cx="12"
              cy="12"
              r="9"
              className="
                    transition-transform duration-300
                    group-hover:scale-105
                    "
            />

            {/* Kepala bergerak naik-turun */}
            <circle
              cx="12"
              cy="9"
              r="2.5"
              className="
                    animate-float2
                    origin-center
                    transition-transform duration-300
                    group-hover:scale-110
                    "
            />

            {/* Body bergerak sedikit */}
            <path
              d="M7.5 18a5 5 0 0 1 9 0"
              strokeLinecap="round"
              className="
                    animate-float2
                    transition-transform duration-300
                    group-hover:scale-105
                    "
            />
          </svg>

          {/* Online indicator */}
          <span
            className="
                absolute right-0.5 top-0.5
                h-2.5 w-2.5
                rounded-full
                bg-emerald-500
                ring-2 ring-white
                transition-transform duration-300
                group-hover:scale-125
            "
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pengaturan Profil
          </h1>
          <p className="text-sm text-gray-500">
            Kelola informasi pribadi dan keamanan akun Anda.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Column: Avatar & Basic Account Info */}
        <div className="w-full md:w-1/3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col items-center justify-center">
              <div className="relative mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-teal-100 text-4xl font-bold text-teal-600 ring-4 ring-white shadow-md">
                {initial}
                <button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-teal-600 p-2 text-white transition-colors hover:bg-teal-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {form.full_name || claims?.user_name}
              </h2>
              <p className="text-sm text-gray-500">{claims?.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  readOnly
                  value={claims?.user_name ?? ''}
                  className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  readOnly
                  value={claims?.email ?? ''}
                  className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card Tambahan di Kolom Kiri: Status & Aksi */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-900 border-b pb-2">
              Status Akun
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Role</span>
                <span className="font-semibold text-gray-900">
                  {claims?.role === 'admin' ? 'Administrator' : 'Pengguna'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Bergabung</span>
                <span className="font-semibold text-gray-900">
                  {''}
                  {formatJoinDate(createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  Aktif
                </span>
              </div>
            </div>

            {/* Danger Zone / Logout */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Keluar Akun
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detail Profile & Security */}
        <div className="flex w-full flex-col gap-6 md:w-2/3">
          {/* Card 1: Informasi Pribadi */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">
              Informasi Pribadi
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="fullName"
                >
                  Nama Lengkap
                </label>
                <input
                  id="fullName"
                  value={form.full_name}
                  onChange={onField('full_name')}
                  disabled={loading}
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="gender"
                >
                  Jenis Kelamin
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={onField('gender')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="" disabled>
                    Pilih jenis kelamin
                  </option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="birthDate"
                >
                  Tanggal Lahir
                </label>
                <input
                  id="birthDate"
                  type="date"
                  value={form.birth_date}
                  onChange={onField('birth_date')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="address"
                >
                  Alamat
                </label>
                <textarea
                  id="address"
                  value={form.address}
                  onChange={onField('address')}
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                ></textarea>
              </div>
            </div>
            {profileNotice && (
              <p
                className={`mt-4 text-sm ${profileNotice.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {profileNotice.text}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile || loading}
                className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {savingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>

          {/* Card 2: Keamanan (Ganti Password) */}
          <form
            onSubmit={handleChangePassword}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-4 text-lg font-bold text-gray-900 border-b pb-2">
              Keamanan
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="oldPassword"
                >
                  Password Saat Ini
                </label>
                <input
                  id="oldPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={pw.old_password}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, old_password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-semibold text-gray-700"
                  htmlFor="newPassword"
                >
                  Password Baru
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={pw.new_password}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, new_password: e.target.value }))
                  }
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            {pwNotice && (
              <p
                role="alert"
                className={`mt-4 text-sm ${
                  pwNotice.type === 'success'
                    ? 'text-emerald-600'
                    : 'text-red-600'
                }`}
              >
                {pwNotice.text}
              </p>
            )}

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingPw}
                className="rounded-lg bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPw ? 'Memproses...' : 'Ganti Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
