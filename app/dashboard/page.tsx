const summaryCards = [
  { label: 'Total Spent This Month', value: 'Rs 0', accent: 'text-white' },
  { label: 'Remaining Budget', value: 'Rs 0', accent: 'text-emerald-400' },
  { label: 'Transactions', value: '0', accent: 'text-white' },
];

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Welcome back 👋</h1>
        <p className="text-sm text-neutral-400">
          Here&apos;s a snapshot of your spending this month.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
          >
            <p className="text-sm text-neutral-400">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold ${card.accent}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center text-sm text-neutral-500">
        No expenses yet — add your first expense to see it here.
      </div>
    </div>
  );
}
