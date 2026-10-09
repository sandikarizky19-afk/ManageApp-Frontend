import { Eye, EyeOff, CreditCardPlus, Wallet } from 'lucide-react';
import { useState } from 'react';

const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div
      className="
        group
        relative aspect-[3/1.2]
        w-full
        overflow-hidden
        rounded-3xl
        bg-[#535172]
        text-white
        shadow-xl
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      "
    >
      {/* Background curves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-24 h-[500px] w-[500px] rounded-full bg-[#393557]" />

        <div className="absolute -right-48 -top-32 h-[520px] w-[520px] rounded-full border-[45px] border-[#716b91]" />

        <div className="absolute -right-64 -top-40 h-[570px] w-[570px] rounded-full border-[35px] border-[#8580a2]" />

        <div className="absolute -right-80 -top-48 h-[620px] w-[620px] rounded-full border-[25px] border-[#9b96b5]" />

        {/* subtle glow */}
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Balance */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Wallet size={15} className="text-white/60" />

              <span className="text-sm font-medium text-white/70">
                Saldo tersedia
              </span>
            </div>

            <span className="mt-1 text-3xl font-bold tracking-tight">
              {showBalance ? 'Rp25.000.000' : 'Rp••••••••'}
            </span>

            <span className="mt-1 text-[10px] font-medium tracking-wider text-white/50">
              MAIN BALANCE
            </span>
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom */}
        <div className="flex items-end justify-between">
          {/* Add button */}
          <button
            type="button"
            className="
              group/button
              flex items-center gap-2
              rounded-xl
              border border-white/20
              bg-white/10
              px-4 py-2.5
              text-xs font-medium
              text-white
              backdrop-blur-md
              transition-all duration-200
              hover:bg-white
              hover:text-[#393557]
              hover:shadow-lg
            "
          >
            <CreditCardPlus
              size={16}
              strokeWidth={1.8}
              className="
                transition-transform duration-200
                group-hover/button:rotate-90
              "
            />

            <span>Tambah Saldo</span>
          </button>

          {/* Account info */}
          <div className="text-right">
            <p className="text-[9px] tracking-[0.18em] text-white/50">
              TERAKHIR DIPERBARUI
            </p>

            <p className="mt-1 text-[10px] font-medium text-white/80">
              Hari ini, 13:24
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
