import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  ShoppingCart,
  Utensils,
  Wallet,
  Car,
  Receipt,
} from 'lucide-react';

type Transaction = {
  id: number;
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  icon: React.ReactNode;
  date: string;
};

const transactions: Transaction[] = [
  {
    id: 1,
    title: 'Gaji',
    description: 'Pendapatan bulanan',
    amount: 4000000,
    type: 'income',
    icon: <Wallet size={17} />,
    date: 'Hari ini',
  },
  {
    id: 2,
    title: 'Belanja',
    description: 'Kebutuhan rumah',
    amount: 250000,
    type: 'expense',
    icon: <ShoppingCart size={17} />,
    date: 'Hari ini',
  },
  {
    id: 3,
    title: 'Makan',
    description: 'Restoran',
    amount: 45000,
    type: 'expense',
    icon: <Utensils size={17} />,
    date: 'Kemarin',
  },
  {
    id: 4,
    title: 'Transportasi',
    description: 'Transport',
    amount: 30000,
    type: 'expense',
    icon: <Car size={17} />,
    date: 'Kemarin',
  },
  {
    id: 5,
    title: 'Tagihan Internet',
    description: 'Internet bulanan',
    amount: 250000,
    type: 'expense',
    icon: <Receipt size={17} />,
    date: '28 Sep',
  },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

export default function RecentTransactions() {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-[#535172]/10
              text-[#535172]
            "
          >
            <Receipt size={18} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Transaksi Terbaru
            </h2>

            <p className="text-[11px] text-slate-400">Aktivitas terakhir</p>
          </div>
        </div>

        <button
          type="button"
          className="
            flex items-center gap-1
            text-[11px] font-medium
            text-[#535172]
            transition
            hover:text-[#393657]
          "
        >
          Lihat semua
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Transactions */}
      <div className="mt-5 divide-y divide-slate-100">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === 'income';

          return (
            <div
              key={transaction.id}
              className="
                flex items-center justify-between
                gap-3
                py-3
                first:pt-0
                last:pb-0
              "
            >
              {/* Left */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-xl
                    ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }
                  `}
                >
                  {transaction.icon}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-700">
                    {transaction.title}
                  </p>

                  <p className="truncate text-[10px] text-slate-400">
                    {transaction.description}
                  </p>

                  <p className="mt-0.5 text-[9px] text-slate-300">
                    {transaction.date}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="shrink-0 text-right">
                <p
                  className={`
                    text-xs font-bold
                    ${isIncome ? 'text-emerald-600' : 'text-slate-700'}
                  `}
                >
                  {isIncome ? '+' : '-'}
                  {formatRupiah(transaction.amount)}
                </p>

                <p className="mt-1 flex items-center justify-end gap-1 text-[9px] text-slate-400">
                  {isIncome ? (
                    <>
                      <ArrowDownLeft size={10} />
                      Masuk
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={10} />
                      Keluar
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
