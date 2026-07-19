"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  onClose?: () => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Calendar({ selectedDate, onSelect, onClose }: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

  const today = new Date();

  function goToPreviousMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  let startOffset = firstDayOfMonth.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; monthOffset: -1 | 0 | 1 }[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, monthOffset: -1 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, monthOffset: 0 });
  }
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const nextIndex = cells.length - (startOffset + daysInMonth);
    cells.push({ day: nextIndex + 1, monthOffset: 1 });
  }

  function isSameDay(day: number, monthOffset: number) {
    const actualMonth = viewMonth + monthOffset;
    return (
      day === selectedDate.getDate() &&
      actualMonth === selectedDate.getMonth() &&
      viewYear === selectedDate.getFullYear()
    );
  }

  function isToday(day: number, monthOffset: number) {
    const actualMonth = viewMonth + monthOffset;
    return (
      day === today.getDate() &&
      actualMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  }

  function handleDayClick(day: number, monthOffset: number) {
    const date = new Date(viewYear, viewMonth + monthOffset, day);
    onSelect(date);
    onClose?.();
  }

  return (
    <div className="w-64 rounded-xl border border-neutral-800 bg-neutral-900 p-3 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          aria-label="Previous month"
          className="text-neutral-400 hover:text-emerald-400"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold text-white">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </p>
        <button
          onClick={goToNextMonth}
          aria-label="Next month"
          className="text-neutral-400 hover:text-emerald-400"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-neutral-500 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          const selected = isSameDay(cell.day, cell.monthOffset);
          const todayCell = isToday(cell.day, cell.monthOffset);
          return (
            <button
              key={i}
              onClick={() => handleDayClick(cell.day, cell.monthOffset)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition
                ${cell.monthOffset !== 0 ? "text-neutral-600" : "text-neutral-200"}
                ${selected ? "bg-emerald-500 text-black font-bold" : "hover:bg-neutral-800"}
                ${todayCell && !selected ? "ring-1 ring-emerald-500/50" : ""}
              `}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
