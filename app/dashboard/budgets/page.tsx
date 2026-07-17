"use client";

import { useEffect, useState, FormEvent } from "react";
import InputField from "@/components/InputField";

interface CategoryBudget {
  id: string;
  amount: number;
  category: { name: string } | null;
}

interface Expense {
  amount: number;
  category?: { name: string } | null;
}

export default function BudgetsPage() {
  const [overall, setOverall] = useState<number | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const [budgetRes, expensesRes] = await Promise.all([
      fetch("/api/budget"),
      fetch("/api/expenses"),
    ]);
    const budgetData = await budgetRes.json();
    const expensesData = await expensesRes.json();

    setOverall(budgetData?.overall?.amount ?? null);
    setCategoryBudgets(budgetData?.categoryBudgets ?? []);
    setExpenses(expensesData);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, category }),
    });
    setAmount("");
    setCategory("");
    setSubmitting(false);
    load();
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = overall !== null ? overall - totalSpent : null;

  function spentForCategory(name: string) {
    return expenses
      .filter((e) => e.category?.name === name)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Budgets</h1>
        <p className="text-sm text-neutral-400">
          Set your monthly spending limit overall or per category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Overall Monthly Budget</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : overall !== null ? `Rs ${overall.toFixed(0)}` : "Not set"}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Remaining</p>
          <p
            className={`mt-2 text-2xl font-bold ${
              remaining !== null && remaining < 0 ? "text-red-400" : "text-emerald-400"
            }`}
          >
            {loading ? "..." : remaining !== null ? `Rs ${remaining.toFixed(0)}` : "—"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
      >
        <InputField
          label="Amount"
          id="budgetAmount"
          type="number"
          placeholder="e.g. 20000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <InputField
          label="Category (leave empty for overall)"
          id="budgetCategory"
          type="text"
          placeholder="e.g. Food"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Budget"}
          </button>
        </div>
      </form>

      {categoryBudgets.length > 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-800">
            <h2 className="text-sm font-semibold text-white">Category Budgets</h2>
          </div>
          <div className="divide-y divide-neutral-800">
            {categoryBudgets.map((b) => {
              const name = b.category?.name || "Unknown";
              const spentAmt = spentForCategory(name);
              const remainingAmt = b.amount - spentAmt;
              return (
                <div key={b.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm text-white">{name}</p>
                    <p className="text-xs text-neutral-500">
                      Spent Rs {spentAmt.toFixed(0)} of Rs {b.amount.toFixed(0)}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      remainingAmt < 0 ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    Rs {remainingAmt.toFixed(0)} left
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
