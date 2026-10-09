import BallanceCard from './BallanceCard';
import CashflowCard from './CashflowCard';
import ExpenseAnalysis from './ExpenseAnalysis';
import RecentTransactions from './RecentTransaction';
import SavingCard from './SavingCard';

export function Cashflow() {
  return (
    <div className="flex flex-col gap-6">
      {/* Layout 1 */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-[3]">
          <div className="h-full">
            <BallanceCard />
          </div>
        </div>

        <div className="min-w-0 flex-[2]">
          <div className="h-full">
            <SavingCard />
          </div>
        </div>
      </div>

      {/* Layout 2 */}
      <div className="flex flex-col gap-6 lg:flex-row items-stretch">
        <div className="min-w-0 flex-[3]">
          <div className="h-full">
            <CashflowCard />
          </div>
        </div>

        <div className="min-w-0 flex-[2]">
          <div className="h-full">
            <RecentTransactions />
          </div>
        </div>
      </div>

      {/* Layout 3 */}
      <ExpenseAnalysis />
    </div>
  );
}
