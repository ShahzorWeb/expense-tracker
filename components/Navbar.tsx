import { Bell, UserCircle } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6">
      <h2 className="text-base font-semibold text-white">Dashboard</h2>

      <div className="flex items-center gap-4">
        <button className="text-neutral-500 hover:text-neutral-300" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className="flex items-center gap-2 text-neutral-300 hover:text-white" aria-label="Profile">
          <UserCircle size={24} />
          <span className="text-sm font-medium hidden sm:inline">Shahzor</span>
        </button>
      </div>
    </header>
  );
}
