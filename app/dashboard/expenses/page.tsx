"use client";

import { useEffect, useState, FormEvent } from "react";
import { Trash2 } from "lucide-react";
import InputField from "@/components/InputField";

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: { name: string } | null;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadExpenses() {
    const res = await fetch("/api/expenses");
    const data = await res.json();
    setExpenses(data);
    setLoading(false);
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, description, category }),
    });

    setAmount("");
    setDescription("");
    setCategory("");
    setSubmitting(false);
    loadExpenses();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Expenses</h1>
        <p className="text-sm text-neutral-400">Add and manage your expenses.</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-4"
      >
        <InputField
          label="Amount"
          id="amount"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <InputField
          label="Description"
          id="description"
          type="text"
          placeholder="e.g. Groceries"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <InputField
          label="Category"
          id="category"
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
            {submitting ? "Adding..." : "Add Expense"}
          </button>
        </div>
      </form>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-sm text-neutral-500">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="p-6 text-center text-sm text-neutral-500">
            No expenses yet — add your first one above.
          </p>
        ) : (
          <div className="divide-y divide-neutral-800">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-white">{exp.description}</p>
                  <p className="text-xs text-neutral-500">
                    {exp.category?.name || "Uncategorized"} ·{" "}
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-medium text-white">Rs {exp.amount.toFixed(0)}</p>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    aria-label="Delete expense"
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
