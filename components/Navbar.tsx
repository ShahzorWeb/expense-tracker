"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, UserCircle, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import MobileNav from "@/components/MobileNav";

interface Alert {
  message: string;
  severity: "warning" | "danger";
}

export default function Navbar() {
  const { data: session } = useSession();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function getSeenMessages(): string[] {
    try {
      return JSON.parse(localStorage.getItem("seenAlerts") || "[]");
    } catch {
      return [];
    }
  }

  function loadAlerts() {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        const newAlerts: Alert[] = data.alerts || [];
        setAlerts(newAlerts);
        const seen = getSeenMessages();
        const unseen = newAlerts.filter((a) => !seen.includes(a.message));
        setUnseenCount(unseen.length);
      })
      .catch(() => {});
  }

  useEffect(() => {
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleBellClick() {
    const willOpen = !open;
    setOpen(willOpen);
    loadAlerts();
    if (willOpen) {
      // Mark all currently visible alerts as seen
      setTimeout(() => {
        const currentMessages = alerts.map((a) => a.message);
        localStorage.setItem("seenAlerts", JSON.stringify(currentMessages));
        setUnseenCount(0);
      }, 0);
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950 px-3 sm:px-6 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <MobileNav />
        <h2 className="text-sm sm:text-base font-semibold text-white truncate">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={handleBellClick}
            className="relative text-neutral-500 hover:text-neutral-300"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                {unseenCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-neutral-800 bg-neutral-900 shadow-lg z-50">
              <div className="px-4 py-3 border-b border-neutral-800">
                <p className="text-sm font-semibold text-white">Notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-neutral-500">
                    No alerts right now.
                  </p>
                ) : (
                  alerts.map((alert, i) => (
                    <div key={i} className="px-4 py-3 border-b border-neutral-800 last:border-0">
                      <p
                        className={`text-sm ${
                          alert.severity === "danger" ? "text-red-400" : "text-yellow-400"
                        }`}
                      >
                        {alert.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
