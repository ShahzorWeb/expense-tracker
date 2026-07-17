import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import InsightsChartWrapper from "@/components/InsightsChartWrapper";

export default async function InsightsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return null;
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const expenses = await prisma.expense.findMany({
    where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
    include: { category: true },
  });

  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    const name = exp.category?.name || "Uncategorized";
    categoryTotals[name] = (categoryTotals[name] || 0) + exp.amount;
  }

  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalSpent = chartData.reduce((sum, c) => sum + c.value, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Insights</h1>
        <p className="text-sm text-neutral-400">
          Your spending breakdown for{" "}
          {now.toLocaleString("default", { month: "long", year: "numeric" })}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-500">Total Spent</p>
          <p className="text-2xl font-bold text-white">Rs {totalSpent.toFixed(0)}</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-500">Categories</p>
          <p className="text-2xl font-bold text-white">{chartData.length}</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-xs text-neutral-500">Top Category</p>
          <p className="text-2xl font-bold text-white">{chartData[0]?.name || "—"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="text-sm font-semibold text-white mb-2">Spending by Category</h2>
        <InsightsChartWrapper data={chartData} />
      </div>

      {chartData.length > 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="divide-y divide-neutral-800">
            {chartData.map((c) => (
              <div key={c.name} className="flex items-center justify-between px-5 py-3">
                <p className="text-sm text-white">{c.name}</p>
                <p className="text-sm font-medium text-white">Rs {c.value.toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
