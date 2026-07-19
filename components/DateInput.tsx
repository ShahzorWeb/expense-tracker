"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import Calendar from "@/components/Calendar";

interface DateInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function DateInput({ label, value, onChange }: DateInputProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-medium text-neutral-400 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white hover:border-neutral-600 transition"
      >
        <span>{formatDate(value)}</span>
        <CalendarIcon size={16} className="text-neutral-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2">
          <Calendar
            selectedDate={value}
            onSelect={(date) => onChange(date)}
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
