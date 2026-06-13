import React from "react";

export default function FilterModal({ country, setCountry, onCancel, onFilter }) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Filter</h2>
      
      <div className="mb-10">
        <label className="block text-sm text-gray-500 mb-2">Country</label>
        <div className="relative">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-sm text-gray-900 outline-none appearance-none"
          >
            <option value="Bangladesh">Bangladesh</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
            <option value="India">India</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ▼
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-[#018063] font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onFilter}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-2.5 rounded-xl font-medium transition-all"
        >
          Filter
        </button>
      </div>
    </div>
  );
}
