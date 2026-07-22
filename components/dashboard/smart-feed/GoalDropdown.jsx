// components/dashboard/smart-feed/GoalDropdown.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function GoalDropdown({ goals, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const activeGoal = goals.find(g => g.value === value);

  useEffect(() => {
    const handleClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E7E7E7] bg-[#FAFAFA] px-3 text-[12px] font-semibold text-[#202326] transition-colors hover:border-primary hover:text-primary cursor-pointer"
      >
        Goal: {activeGoal?.label}
        <ChevronDown
          size={13}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-10 mb-2 w-[140px] overflow-hidden rounded-xl border border-[#ECECEC] bg-white py-1 shadow-lg">
          {goals.map(goal => (
            <button
              key={goal.id}
              type="button"
              onClick={() => {
                onChange(goal.value);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-left text-[13px] font-medium transition-colors cursor-pointer ${
                goal.value === value
                  ? "bg-[#FFF6EE] text-primary"
                  : "text-[#202326] hover:bg-[#FAFAFA]"
              }`}
            >
              {goal.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
