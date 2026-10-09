import {
  Eye,
  EyeOff,
  CreditCardPlus,
  HandCoins,
  BookOpen,
  House,
  Plane,
  Check,
} from 'lucide-react';
import { useState } from 'react';

type SavingGoal = {
  id: number;
  name: string;
  icon: React.ReactNode;
  saved: number;
  target: number;
};

const savingGoals: SavingGoal[] = [
  {
    id: 1,
    name: 'Beli Buku',
    icon: <BookOpen size={16} />,
    saved: 750000,
    target: 1000000,
  },
  {
    id: 2,
    name: 'Beli Rumah',
    icon: <House size={16} />,
    saved: 12500000,
    target: 50000000,
  },
  {
    id: 3,
    name: 'Liburan',
    icon: <Plane size={16} />,
    saved: 3500000,
    target: 10000000,
  },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
};

const SavingCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedGoalId, setSelectedGoalId] = useState(1);

  const selectedGoal =
    savingGoals.find((goal) => goal.id === selectedGoalId) ?? savingGoals[0];

  const progress = Math.min(
    Math.round((selectedGoal.saved / selectedGoal.target) * 100),
    100,
  );

  return (
    <div
      className="
        group
        relative
        aspect-[3/1.8]
        w-full
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-[#535172]
        via-[#4a4868]
        to-[#393557]
        text-white
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* Background curves */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="  absolute inset-0
          bg-gradient-to-br
          from-[#292747]
          via-[#403c68]
          to-[#625d86]"
        />

        <div
          className=" absolute
          -right-32
          -top-40
          h-[420px]
          w-[420px]
          rounded-[45%_55%_70%_30%/40%_45%_55%_60%]
          bg-gradient-to-br
          from-[#8178ad]
          via-[#686292]
          to-[#4b476f]
          opacity-80
          blur-[1px]"
        />

        <div
          className="  absolute
            -right-20
            -bottom-44
            h-[360px]
            w-[520px]
            rounded-[50%]
            bg-gradient-to-r
            from-[#716b9a]/40
            via-[#938db5]/30
            to-transparent
            rotate-[-12deg]"
        />

        <div
          className="  absolute
            -bottom-24
            -left-24
            h-64
            w-64
            rounded-full
            bg-emerald-400/10
            blur-3xl"
        />

        {/* Glow */}
        <div
          className="    absolute
              left-1/3
              top-[-100px]
              h-56
              w-56
              rounded-full
              bg-white/5
              blur-3xl"
        />

        <div className="absolute right-20 top-10 h-32 w-32 rounded-full bg-violet-300/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl
                bg-amber-300/15
                text-amber-200
                backdrop-blur-sm
              "
            >
              <HandCoins size={20} />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-semibold">Tabungan</span>

              <span className="text-[10px] text-white/50">Saving Goals</span>
            </div>
          </div>

          {/* Show / Hide */}
          <button
            type="button"
            onClick={() => setShowBalance((prev) => !prev)}
            className="
              rounded-full
              bg-white/10
              p-2
              text-white/70
              backdrop-blur-sm
              transition
              hover:bg-white/20
              hover:text-white
            "
            aria-label={showBalance ? 'Sembunyikan saldo' : 'Tampilkan saldo'}
          >
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Goal List */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Pilih tujuan
            </span>

            <span className="text-[10px] text-white/40">
              {savingGoals.length} goals
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {savingGoals.map((goal) => {
              const isSelected = goal.id === selectedGoalId;

              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`
                    flex
                    shrink-0
                    items-center
                    gap-2
                    rounded-xl
                    border
                    px-3
                    py-2
                    text-xs
                    font-medium
                    transition-all
                    duration-200

                    ${
                      isSelected
                        ? `
                          border-amber-200/30
                          bg-amber-200/15
                          text-amber-100
                          shadow-sm
                        `
                        : `
                          border-white/10
                          bg-white/5
                          text-white/60
                          hover:border-white/20
                          hover:bg-white/10
                          hover:text-white
                        `
                    }
                  `}
                >
                  {goal.icon}

                  <span>{goal.name}</span>

                  {isSelected && <Check size={13} className="text-amber-200" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Saving Information */}
        <div className="mt-auto">
          {/* Label */}
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
              Saldo Terkumpul
            </span>

            <span className="text-[10px] font-medium text-amber-200">
              {progress}%
            </span>
          </div>

          {/* Balance */}
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tracking-tight">
              {showBalance ? formatRupiah(selectedGoal.saved) : 'Rp ••••••••'}
            </span>

            <span className="text-[10px] text-white/50">
              dari {formatRupiah(selectedGoal.target)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="
                h-full
                rounded-full
                bg-gradient-to-r
                from-amber-300
                to-amber-100
                shadow-[0_0_12px_rgba(252,211,77,0.35)]
                transition-all
                duration-500
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Bottom */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              className="
                group/button
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-amber-200/20
                bg-amber-200/10
                px-4
                py-2.5
                text-xs
                font-medium
                text-amber-100
                backdrop-blur-md
                transition-all
                duration-200
                hover:bg-amber-100
                hover:text-[#393557]
                hover:shadow-lg
              "
            >
              <CreditCardPlus
                size={16}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-200
                  group-hover/button:rotate-90
                "
              />

              <span>Menabung</span>
            </button>

            <div className="text-right">
              <p className="text-[9px] tracking-[0.18em] text-white/40">
                TARGET
              </p>

              <p className="mt-1 text-[10px] font-medium text-white/70">
                {formatRupiah(selectedGoal.target)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingCard;
