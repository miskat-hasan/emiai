"use client";

import { useGetCountriesQuery } from "@/redux/api/services/commonApi";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ExploreFilterModal({ open, onClose, onApply }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const { data: countriesResponse } = useGetCountriesQuery(undefined, {
    skip: !open,
  });
  const countries = countriesResponse?.data || [];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[400px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Subtle bottom gradient glow matching the role-based theme */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 pointer-events-none opacity-[0.12] z-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-primary), transparent)",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-xl font-bold text-gray-900">Filter</h3>
          </div>

          <hr className="border-gray-100 mx-6" />

          {/* Body */}
          <div className="px-6 py-6 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] font-medium text-gray-500">
                Country
              </label>

              <div className="relative">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-transparent focus:border-primary/30 outline-none rounded-xl px-4 py-3.5 text-[15px] font-medium text-gray-800 transition-colors cursor-pointer"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 pt-2 flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-[15px] font-semibold text-teal-800 hover:text-teal-900 transition-colors px-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (onApply) onApply({ country: selectedCountry });
                onClose();
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-2.5 rounded-xl text-[15px] font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
