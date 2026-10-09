import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Memuat file .env dari folder tempat vite.config.ts berada
  // Parameter ketiga (''): memuat SEMUA variabel env, bukan hanya yang berawalan VITE_
  const env = loadEnv(mode, process.cwd(), '');

  // Ambil PORT dari env, konversi ke Number. Fallback ke 3000 jika kosong
  const port = Number(env.PORT) || 3000;
  const host = env.HOST || '127.0.0.1';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: host,
      port: port,
      strictPort: true, // Garansi server selalu berjalan di port sesuai .env
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  };
});
