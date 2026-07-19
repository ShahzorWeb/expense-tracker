import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59);

  const [overallBudget, categoryBudgets, expenses] = await Promise.all([
    prisma.budget.findFirst({ where: { userId, categoryId: null, month, year } }),
    prisma.budget.findMany({
      where: { userId, categoryId: { not: null }, month, year },
      include: { category: true },
    }),
    prisma.expense.findMany({
      where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
      include: { category: true },
    }),
  ]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const alerts: { message: string; severity: "warning" | "danger" }[] = [];

  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });

  if (overallBudget) {
    const pct = (totalSpent / overallBudget.amount) * 100;
    if (pct >= 100) {
      alerts.push({
        message: `You've exceeded your ${monthName} overall budget of Rs ${overallBudget.amount.toFixed(0)}.`,
        severity: "danger",
      });
    } else if (pct >= 90) {
      alerts.push({
        message: `You've used ${pct.toFixed(0)}% of your ${monthName} overall budget.`,
        severity: "warning",
      });
    }
  }

  for (const cb of categoryBudgets) {
    const name = cb.category?.name || "Unknown";
    const spent = expenses
      .filter((e) => e.category?.name === name)
      .reduce((sum, e) => sum + e.amount, 0);
    const pct = (spent / cb.amount) * 100;

    if (pct >= 100) {
      alerts.push({
        message: `You've exceeded your ${monthName} "${name}" budget of Rs ${cb.amount.toFixed(0)}.`,
        severity: "danger",
      });
    } else if (pct >= 90) {
      alerts.push({
        message: `You've used ${pct.toFixed(0)}% of your ${monthName} "${name}" budget.`,
        severity: "warning",
      });
    }
  }

  return NextResponse.json({ alerts });
}
