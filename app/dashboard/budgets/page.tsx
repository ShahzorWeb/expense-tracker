"use client";

import { useEffect, useState, FormEvent } from "react";
import InputField from "@/components/InputField";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import DateInput from "@/components/DateInput";

interface CategoryBudget {
  id: string;
  amount: number;
  category: { name: string } | null;
}

interface Expense {
  amount: number;
  date: string;
  category?: { name: string } | null;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function BudgetsPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const [overall, setOverall] = useState<number | null>(null);
  const [overallId, setOverallId] = useState<string | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    const [budgetRes, expensesRes] = await Promise.all([
      fetch(`/api/budget?month=${selectedMonth}&year=${selectedYear}`),
      fetch("/api/expenses"),
    ]);
    const budgetData = await budgetRes.json();
    const expensesData = await expensesRes.json();

    setOverall(budgetData?.overall?.amount ?? null);
    setOverallId(budgetData?.overall?.id ?? null);
    setCategoryBudgets(budgetData?.categoryBudgets ?? []);
    setAllExpenses(expensesData);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [selectedMonth, selectedYear]);

  function goToPreviousMonth() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, category, month: selectedMonth, year: selectedYear }),
    });
    setAmount("");
    setCategory("");
    setSubmitting(false);
    load();
  }

  async function handleDeleteBudget(id: string) {
    await fetch(`/api/budget/${id}`, { method: "DELETE" });
    load();
  }

  const expenses = allExpenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
  });

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = overall !== null ? overall - totalSpent : null;

  function spentForCategory(name: string) {
    return expenses
      .filter((e) => e.category?.name === name)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  const isCurrentMonth =
    selectedMonth === now.getMonth() + 1 && selectedYear === now.getFullYear();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Budgets</h1>
        <p className="text-sm text-neutral-400">
          Set your monthly spending limit overall or per category.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-3">
        <button
          onClick={goToPreviousMonth}
          aria-label="Previous month"
          className="text-neutral-400 hover:text-emerald-400"
        >
          <ChevronLeft size={20} />
        </button>
        <p className="text-sm font-semibold text-white min-w-[160px] text-center">
          {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          {isCurrentMonth && (
            <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
              Current
            </span>
          )}
        </p>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="text-neutral-400 hover:text-emerald-400"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="max-w-xs">
        <DateInput
          label="Jump to a date"
          value={new Date(selectedYear, selectedMonth - 1, 1)}
          onChange={(date) => {
            setSelectedMonth(date.getMonth() + 1);
            setSelectedYear(date.getFullYear());
          }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-400">Overall Budget</p>
            {overallId && (
              <button
                onClick={() => handleDeleteBudget(overallId)}
                aria-label="Delete overall budget"
                className="text-neutral-500 hover:text-red-400"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
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
            {submitting
              ? "Saving..."
              : `Save for ${MONTH_NAMES[selectedMonth - 1]}`}
          </button>
        </div>
      </form>

      {categoryBudgets.length > 0 && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-800">
            <h2 className="text-sm font-semibold text-white">
              Category Budgets — {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
            </h2>
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
                  <div className="flex items-center gap-3">
                    <p
                      className={`text-sm font-medium ${
                        remainingAmt < 0 ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      Rs {remainingAmt.toFixed(0)} left
                    </p>
                    <button
                      onClick={() => handleDeleteBudget(b.id)}
                      aria-label="Delete budget"
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
