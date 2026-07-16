"use client";

import { useEffect, useState, FormEvent } from "react";
import InputField from "@/components/InputField";

export default function BudgetsPage() {
  const [budget, setBudget] = useState<number | null>(null);
  const [spent, setSpent] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    const [budgetRes, expensesRes] = await Promise.all([
      fetch("/api/budget"),
      fetch("/api/expenses"),
    ]);
    const budgetData = await budgetRes.json();
    const expenses = await expensesRes.json();

    setBudget(budgetData?.amount ?? null);
    const total = expenses.reduce(
      (sum: number, e: { amount: number }) => sum + e.amount,
      0
    );
    setSpent(total);
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
      body: JSON.stringify({ amount }),
    });
    setAmount("");
    setSubmitting(false);
    load();
  }

  const remaining = budget !== null ? budget - spent : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Budgets</h1>
        <p className="text-sm text-neutral-400">Set your monthly spending limit.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-400">Monthly Budget</p>
          <p className="mt-2 text-2xl font-bold text-white">
            {loading ? "..." : budget !== null ? `Rs ${budget.toFixed(0)}` : "Not set"}
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
        className="flex flex-col sm:flex-row gap-3 items-end rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
      >
        <div className="flex-1 w-full">
          <InputField
            label="Set monthly budget"
            id="budgetAmount"
            type="number"
            placeholder="e.g. 20000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save Budget"}
        </button>
      </form>
    </div>
  );
}
