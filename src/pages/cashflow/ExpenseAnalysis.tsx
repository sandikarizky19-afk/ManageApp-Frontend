import {
  ArrowDownRight,
  CalendarDays,
  Lightbulb,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

type ExpenseCategory = {
  name: string;
  amount: number;
  percentage: number;
  icon: string;
};

const expenseCategories: ExpenseCategory[] = [
  {
    name: 'Makanan',
    amount: 1137500,
    percentage: 35,
    icon: '🍴',
  },
  {
    name: 'Belanja',
    amount: 812500,
    percentage: 25,
    icon: '🛒',
  },
  {
    name: 'Transportasi',
    amount: 650000,
    percentage: 20,
    icon: '🚗',
  },
  {
    name: 'Tagihan',
    amount: 650000,
    percentage: 20,
    icon: '🧾',
  },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function ExpenseAnalysis() {
  return (
    <section className="relative py-2">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#535172]/60">
            Financial Overview
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            Analisis Pengeluaran
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Lihat bagaimana uang kamu digunakan bulan ini.
          </p>
        </div>

        {/* Period */}
        <button
          type="button"
          className="
            flex w-fit items-center gap-2
            rounded-xl
            border border-slate-200
            bg-white
            px-3 py-2
            text-xs font-medium text-slate-600
            shadow-sm
            transition
            hover:bg-slate-50
          "
        >
          <CalendarDays size={14} />
          Oktober 2026
        </button>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* ================= LEFT ================= */}
        <div className="flex flex-col">
          <p className="text-xs font-medium text-slate-400">
            Total pengeluaran
          </p>

          <div className="mt-1 flex items-end gap-3">
            <h3 className="text-3xl font-bold tracking-tight text-slate-800">
              Rp3.250.000
            </h3>

            <div className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-500">
              <TrendingDown size={13} />
              12%
            </div>
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            dibandingkan bulan sebelumnya
          </p>

          {/* Donut */}
          <div className="relative mx-auto mt-8 h-52 w-52">
            <div
              className="
                absolute inset-0
                rounded-full
                bg-[conic-gradient(#535172_0deg_126deg,#8b87aa_126deg_216deg,#b8b5ca_216deg_288deg,#d9d8e4_288deg_360deg)]
              "
            />

            <div
              className="
                absolute inset-8
                flex flex-col
                items-center justify-center
                rounded-full
                bg-white
              "
            >
              <span className="text-[10px] font-medium text-slate-400">
                Total
              </span>

              <span className="mt-1 text-sm font-bold text-slate-700">
                Rp3,25 Jt
              </span>

              <span className="mt-0.5 text-[9px] text-slate-400">
                bulan ini
              </span>
            </div>
          </div>

          {/* Comparison */}
          <div
            className="
              mt-6
              flex items-center gap-3
              rounded-2xl
              bg-emerald-50
              px-4 py-3
            "
          >
            <div
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-xl
                bg-emerald-100
                text-emerald-600
              "
            >
              <ArrowDownRight size={16} />
            </div>

            <div>
              <p className="text-[10px] font-medium text-emerald-700">
                Pengeluaran lebih rendah
              </p>

              <p className="mt-0.5 text-[9px] text-emerald-600/70">
                12% dibanding bulan lalu
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-700">
                Pengeluaran berdasarkan kategori
              </h3>

              <p className="mt-1 text-[11px] text-slate-400">
                Distribusi pengeluaran bulan ini
              </p>
            </div>

            <span className="text-[10px] font-medium text-slate-400">
              4 kategori
            </span>
          </div>

          {/* Categories */}
          <div className="mt-6 space-y-6">
            {expenseCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-xl
                        bg-slate-100
                        text-sm
                      "
                    >
                      {category.icon}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {category.name}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {formatRupiah(category.amount)}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-600">
                    {category.percentage}%
                  </span>
                </div>

                {/* Progress */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="
                      h-full rounded-full
                      bg-[#535172]
                      transition-all duration-500
                    "
                    style={{
                      width: `${category.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ================= INSIGHT ================= */}
          <div
            className="
              mt-8
              border-t border-slate-100
              pt-6
            "
          >
            <div className="flex gap-3">
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-amber-50
                  text-amber-500
                "
              >
                <Lightbulb size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  Insight Keuangan
                </p>

                <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-slate-400">
                  Pengeluaran makanan menjadi kategori terbesar bulan ini, yaitu{' '}
                  <span className="font-semibold text-slate-600">
                    Rp1.137.500
                  </span>{' '}
                  atau 35% dari total pengeluaran.
                </p>

                <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-emerald-500">
                  <TrendingDown size={12} />
                  Pengeluaran turun 12% dibanding bulan lalu
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
