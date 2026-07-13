import Link from "next/link";
import { LayoutDashboard, Receipt, PieChart, Wallet, Settings } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/budgets", label: "Budgets", icon: Wallet },
  { href: "/dashboard/insights", label: "Insights", icon: PieChart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-16 sm:w-20 md:w-60 flex-col border-r border-neutral-800 bg-neutral-950 px-2 sm:px-3 md:px-4 py-4 md:py-6 shrink-0">
      <div className="mb-6 md:mb-8 px-1 md:px-2 text-center md:text-left text-sm md:text-lg font-bold text-white">
        <span className="md:hidden">ET</span>
        <span className="hidden md:inline">
          Expense<span className="text-emerald-400">Tracker</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            title={label}
            className="flex flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 rounded-lg px-1 md:px-3 py-2 md:py-2.5 text-[10px] md:text-sm font-medium text-neutral-400 transition hover:bg-neutral-900 hover:text-emerald-400 text-center md:text-left"
          >
            <Icon size={18} />
            <span className="leading-tight">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
