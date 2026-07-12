"use client";

import { Bell, UserCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6">
      <h2 className="text-base font-semibold text-white">Dashboard</h2>

      <div className="flex items-center gap-4">
        <button className="text-neutral-500 hover:text-neutral-300" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-2 text-neutral-300">
          <UserCircle size={24} />
          <span className="text-sm font-medium hidden sm:inline">
            {session?.user?.name || session?.user?.email || "Account"}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-neutral-500 hover:text-red-400"
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
