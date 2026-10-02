import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../services/auth.service';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (token && password !== confirmation) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (token) {
        const result = await resetPassword(token, password);
        setMessage(result.message);
        setIsComplete(true);
      } else {
        const result = await requestPasswordReset(email);
        setMessage(result.message);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Permintaan reset password gagal.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
        <div className="auth-card">
          <div className="py-5 text-xl font-semibold text-slate-700">
            <h1>{token ? 'Buat password baru' : 'Reset password'}</h1>
          </div>

          {isComplete ? (
            <div className="flex flex-col gap-5">
              <p className="text-sm text-emerald-700">{message}</p>
              <Link className="button-login text-center" to="/login">
                Kembali ke login
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {token ? (
                <>
                  <label className="flex flex-col gap-2">
                    <span className="text-md text-slate-600">
                      Password baru
                    </span>
                    <input
                      className="input-card"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-md text-slate-600">
                      Konfirmasi password
                    </span>
                    <input
                      className="input-card"
                      type="password"
                      value={confirmation}
                      onChange={(event) => setConfirmation(event.target.value)}
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                </>
              ) : (
                <label className="flex flex-col gap-2">
                  <span className="text-md text-slate-600">Email akun</span>
                  <input
                    className="input-card"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
              )}

              <button
                className="button-login"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Memproses...'
                  : token
                    ? 'Simpan password baru'
                    : 'Kirim tautan reset'}
              </button>
            </form>
          )}

          {message && !isComplete && (
            <p className="mt-4 text-sm text-emerald-700">{message}</p>
          )}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {!isComplete && (
            <Link
              className="mt-5 block text-sm font-medium text-teal-700 hover:text-teal-800"
              to="/login"
            >
              Kembali ke login
            </Link>
          )}
        </div>
      </section>

      <section className="relative flex items-center justify-center overflow-hidden bg-linear-to-br from-teal-500 via-teal-600 to-emerald-700 p-8 text-center text-white sm:p-10 lg:p-12">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10" />
        <div className="relative z-10 max-w-lg">
          <h2 className="text-3xl font-bold sm:text-4xl">
            {token ? 'Amankan akunmu' : 'Pulihkan akses akun'}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-teal-50 sm:text-base">
            {token
              ? 'Pilih password baru untuk melanjutkan menggunakan akunmu.'
              : 'Masukkan email akun dan kami akan mengirim tautan untuk membuat password baru.'}
          </p>
        </div>
      </section>
    </main>
  );
}
