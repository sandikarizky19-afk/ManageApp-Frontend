export function LoadingScreen() {
  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-white/80 backdrop-blur-sm
      "
      role="status"
      aria-live="polite"
      aria-label="Sedang memproses login"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="
            h-12 w-12
            animate-spin
            rounded-full
            border-4
            border-teal-100
            border-t-teal-600
          "
        />

        <p className="text-sm font-medium text-slate-600">
          Halaman sedang dimuat...
        </p>
      </div>
    </div>
  );
}
