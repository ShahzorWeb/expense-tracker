"use client";

import { Bell, UserCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import MobileNav from "@/components/MobileNav";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-3 sm:px-6 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        <h2 className="text-sm sm:text-base font-semibold text-white truncate">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="text-neutral-500 hover:text-neutral-300" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-300">
          <UserCircle size={22} className="shrink-0" />
          <span className="text-xs sm:text-sm font-medium max-w-[90px] sm:max-w-none truncate">
            {session?.user?.name || session?.user?.email || "Account"}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-neutral-500 hover:text-red-400 shrink-0"
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
