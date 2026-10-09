import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';

const cashflowData = [
  { day: 'Sen', income: 4000000, expense: 500000 },
  { day: 'Sel', income: 0, expense: 350000 },
  { day: 'Rab', income: 1500000, expense: 750000 },
  { day: 'Kam', income: 0, expense: 450000 },
  { day: 'Jum', income: 3000000, expense: 400000 },
  { day: 'Sab', income: 0, expense: 500000 },
  { day: 'Min', income: 0, expense: 300000 },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const totalIncome = cashflowData.reduce(
  (total, item) => total + item.income,
  0,
);

const totalExpense = cashflowData.reduce(
  (total, item) => total + item.expense,
  0,
);

export default function CashflowCard() {
  const maxValue = Math.max(
    ...cashflowData.flatMap((item) => [item.income, item.expense]),
  );

  const chartWidth = 700;
  const chartHeight = 220;

  const getX = (index: number) => {
    return (index / (cashflowData.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return chartHeight - (value / maxValue) * 180;
  };

  const incomePoints = cashflowData
    .map((item, index) => `${getX(index)},${getY(item.income)}`)
    .join(' ');

  const expensePoints = cashflowData
    .map((item, index) => `${getX(index)},${getY(item.expense)}`)
    .join(' ');

  return (
    <div
      className="
        relative
        h-full
        overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        p-5 sm:p-6
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl
                bg-[#535172]/10
                text-[#535172]
              "
            >
              <TrendingUp size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Cash Flow
              </h2>

              <p className="text-[11px] text-slate-400">Ringkasan keuangan</p>
            </div>
          </div>
        </div>

        {/* Period */}
        <button
          type="button"
          className="
            flex items-center gap-1.5
            rounded-xl
            border border-slate-200
            bg-slate-50
            px-3 py-2
            text-[11px] font-medium
            text-slate-600
            transition
            hover:bg-slate-100
          "
        >
          7 Hari
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Chart */}
      <div className="mt-6 w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
          className="h-52 w-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Horizontal lines */}
          {[0, 1, 2, 3].map((line) => {
            const y = (line / 3) * 180;

            return (
              <line
                key={line}
                x1="0"
                x2={chartWidth}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-100"
              />
            );
          })}

          {/* Income line */}
          <polyline
            points={incomePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-500"
          />

          {/* Expense line */}
          <polyline
            points={expensePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-400"
          />

          {/* Income points */}
          {cashflowData.map((item, index) => (
            <circle
              key={`income-${item.day}`}
              cx={getX(index)}
              cy={getY(item.income)}
              r="5"
              className="fill-white stroke-emerald-500"
              strokeWidth="3"
            />
          ))}

          {/* Expense points */}
          {cashflowData.map((item, index) => (
            <circle
              key={`expense-${item.day}`}
              cx={getX(index)}
              cy={getY(item.expense)}
              r="4"
              className="fill-white stroke-amber-400"
              strokeWidth="3"
            />
          ))}

          {/* Day labels */}
          {cashflowData.map((item, index) => (
            <text
              key={item.day}
              x={getX(index)}
              y={215}
              textAnchor="middle"
              className="fill-slate-400 text-[11px]"
            >
              {item.day}
            </text>
          ))}
        </svg>
      </div>

      {/* Summary */}
      <div className="mt-2 grid grid-cols-2 gap-3">
        {/* Income */}
        <div
          className="
            rounded-2xl
            border border-emerald-100
            bg-emerald-50
            p-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex h-7 w-7 items-center justify-center
                rounded-lg
                bg-emerald-100
                text-emerald-600
              "
            >
              <ArrowDownLeft size={14} />
            </div>

            <span className="text-[10px] font-medium text-slate-400">
              Pemasukan
            </span>
          </div>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {formatRupiah(totalIncome)}
          </p>
        </div>

        {/* Expense */}
        <div
          className="
            rounded-2xl
            border border-amber-100
            bg-amber-50
            p-3
          "
        >
          <div className="flex items-center gap-2">
            <div
              className="
                flex h-7 w-7 items-center justify-center
                rounded-lg
                bg-amber-100
                text-amber-600
              "
            >
              <ArrowUpRight size={14} />
            </div>

            <span className="text-[10px] font-medium text-slate-400">
              Pengeluaran
            </span>
          </div>

          <p className="mt-2 text-sm font-bold text-slate-800">
            {formatRupiah(totalExpense)}
          </p>
        </div>
      </div>
    </div>
  );
}
