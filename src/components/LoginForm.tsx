import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && <LoadingScreen />}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* KIRI */}
        <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
          <div className="auth-card">
            <div className="py-5 text-xl text-slate-500 font-semibold">
              <h1>Login</h1>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2">
                <span className="text-md text-slate-600">Username</span>
                <input
                  className="input-card"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-md text-slate-600">Password</span>
                <input
                  className="input-card"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </label>

              <button
                className="button-login"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </button>
            </form>
            {error && <p className="message error">{error}</p>}
          </div>
        </div>

        {/* KANAN */}
        <div className="relative flex items-center justify-center overflow-hidden bg-linear-to-br from-teal-500 via-teal-600 to-emerald-700 p-8 sm:p-10 lg:flex lg:p-12 xl:p-16">
          {/* Decorative circles */}
          {/* Bulatan 1 */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 animate-float-reverse" />

          {/* Bulatan 2 */}
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 animate-float" />

          {/* Bulatan 3 */}
          <div className="absolute right-20 bottom-20 h-32 w-32 rounded-full bg-white/5 animate-float-slow" />

          {/* Content */}
          <div className="relative z-10 max-w-lg text-center text-white">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome Back
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-teal-50 sm:mt-6 sm:text-base lg:text-lg">
              Senang melihatmu kembali. Silakan login untuk melanjutkan ke
              dashboard kamu.
            </p>

            <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-white/80 sm:mt-8 sm:w-20" />
          </div>
        </div>
      </div>
    </>
  );
}
