"use client";

import { useState, useRef, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import { ChevronDown, Search } from "lucide-react";
import { COUNTRY_PHONE_LIST } from "@/lib/countryPhoneList";

export default function CountryCodeSelect({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const selected = COUNTRY_PHONE_LIST.find(
    c => c.dial === value || c.code === value,
  );

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
    else setQuery("");
  }, [open]);

  const filtered = COUNTRY_PHONE_LIST.filter(
    c =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.dial.includes(query) ||
      c.code.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`w-[104px] shrink-0 flex items-center justify-between gap-1.5 bg-gray-50 border text-black text-sm rounded-xl px-3 py-3 outline-none transition-all cursor-pointer ${
          error ? "border-red-300" : "border-gray-100 focus:border-primary/40"
        } ${open ? "bg-white border-primary/40" : ""}`}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          {selected ? (
            <>
              <ReactCountryFlag
                countryCode={selected.code}
                svg
                style={{ width: "16px", height: "16px", borderRadius: "2px" }}
              />
              <span className="truncate">{selected.dial}</span>
            </>
          ) : (
            <span className="text-gray-400">Code</span>
          )}
        </span>
        <ChevronDown size={13} className="text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-[280px] bg-white rounded-xl border border-gray-100 shadow-lg z-30 overflow-hidden">
          <div className="p-2 border-b border-gray-50">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
              <Search size={14} className="text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search country or code"
                className="w-full bg-transparent outline-none text-sm text-black placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="text-center text-xs text-gray-400 py-4">
                No matches.
              </p>
            )}
            {filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  onChange(c.dial, c.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer text-left ${
                  selected?.code === c.code ? "bg-primary/5" : ""
                }`}
              >
                <ReactCountryFlag
                  countryCode={c.code}
                  svg
                  style={{ width: "16px", height: "16px", borderRadius: "2px" }}
                />
                <span className="flex-1 truncate text-gray-700">{c.name}</span>
                <span className="text-gray-400 shrink-0">{c.dial}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
