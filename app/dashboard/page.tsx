import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardOverview() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const expenses = userId
    ? await prisma.expense.findMany({
        where: { userId, date: { gte: startOfMonth } },
        include: { category: true },
        orderBy: { date: "desc" },
      })
    : [];

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const budget = userId
    ? await prisma.budget.findFirst({
        where: {
          userId,
          categoryId: null,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        },
      })
    : null;

  const remaining = budget ? budget.amount - totalSpent : null;

  const summaryCards = [
    {
      label: "Total Spent This Month",
      value: `Rs ${totalSpent.toFixed(0)}`,
      accent: "text-white",
    },
    {
      label: "Remaining Budget",
      value: remaining !== null ? `Rs ${remaining.toFixed(0)}` : "Not set",
      accent: remaining !== null && remaining < 0 ? "text-red-400" : "text-emerald-400",
    },
    {
      label: "Transactions",
      value: `${expenses.length}`,
      accent: "text-white",
    },
  ];

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
            <p className={`mt-2 text-2xl font-bold ${card.accent}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {expenses.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 text-center text-sm text-neutral-500">
          No expenses yet — add your first expense to see it here.
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 divide-y divide-neutral-800">
          {expenses.slice(0, 5).map((e) => (
            <div key={e.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm text-white">{e.description}</p>
                <p className="text-xs text-neutral-500">
                  {e.category?.name || "Uncategorized"} ·{" "}
                  {new Date(e.date).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm font-medium text-white">Rs {e.amount.toFixed(0)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
