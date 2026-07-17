"use client";

import { useEffect, useState, FormEvent } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
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

  // Edit mode state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [saving, setSaving] = useState(false);

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

  function startEdit(exp: Expense) {
    setEditingId(exp.id);
    setEditAmount(String(exp.amount));
    setEditDescription(exp.description);
    setEditCategory(exp.category?.name || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditAmount("");
    setEditDescription("");
    setEditCategory("");
  }

  async function handleSaveEdit(id: string) {
    setSaving(true);
    await fetch(`/api/expenses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: editAmount,
        description: editDescription,
        category: editCategory,
      }),
    });
    setSaving(false);
    cancelEdit();
    loadExpenses();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Expenses</h1>
        <p className="text-sm text-neutral-400">Add and manage your expenses.</p>
      </div>

       <a
        href="/api/expenses/export"
        download
        className="self-start rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition"
      >
        Export CSV
      </a>

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
          onBlur={async () => {
            if (description && !category) {
              const res = await fetch("/api/categorize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
              });
              const data = await res.json();
              if (data.category) setCategory(data.category);
            }
          }}
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
            {expenses.map((exp) =>
              editingId === exp.id ? (
                <div
                  key={exp.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-5 py-3 bg-neutral-800/50"
                >
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full sm:w-24 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-white"
                    placeholder="Amount"
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full sm:flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-white"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full sm:w-32 rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-white"
                    placeholder="Category"
                  />
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => handleSaveEdit(exp.id)}
                      disabled={saving}
                      aria-label="Save expense"
                      className="text-emerald-400 hover:text-emerald-300 disabled:opacity-60"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      aria-label="Cancel edit"
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ) : (
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
                      onClick={() => startEdit(exp)}
                      aria-label="Edit expense"
                      className="text-neutral-500 hover:text-emerald-400"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      aria-label="Delete expense"
                      className="text-neutral-500 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
