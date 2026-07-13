"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Wallet,
  Settings,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/budgets", label: "Budgets", icon: Wallet },
  { href: "/dashboard/insights", label: "Insights", icon: PieChart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="md:hidden text-neutral-300 hover:text-white shrink-0"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 flex flex-col bg-neutral-950 border-r border-neutral-800 px-4 py-6">
            <div className="mb-8 flex items-center justify-between px-1">
              <span className="text-lg font-bold text-white">
                Expense<span className="text-emerald-400">Tracker</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-neutral-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-neutral-900 hover:text-emerald-400"
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1 bg-black/60" onClick={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
