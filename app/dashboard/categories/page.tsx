"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  _count: { expenses: number };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">Categories</h1>
        <p className="text-sm text-neutral-400">
          Manage the categories used across your expenses.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-sm text-neutral-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-neutral-500">
            No categories yet — add expenses with categories to see them here.
          </p>
        ) : (
          <div className="divide-y divide-neutral-800">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-white">{c.name}</p>
                  <p className="text-xs text-neutral-500">
                    {c._count.expenses} expense{c._count.expenses !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  aria-label="Delete category"
                  className="text-neutral-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
