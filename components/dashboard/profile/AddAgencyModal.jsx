"use client";

import CustomSelect from "@/components/ui/CustomSelect";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function AddAgencyModal({ open, onClose }) {
  const [isExclusive, setIsExclusive] = useState(false);
  const [permission, setPermission] = useState("Chat permission");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const {
    control,
    formState: { errors },
  } = useForm();

  if (!open) return null;

  const permissionsList = [
    "Chat permission",
    "Portfolio permission",
    "Voucher add permission",
    "Deal manage permission",
    "Create Event/Contest permission",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FAF6F0] w-full max-w-xl rounded-3xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-[#202626] mb-6">Add Agency</h3>

        <form onSubmit={e => e.preventDefault()} className="space-y-5">
          {/* Form Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              name="agency"
              control={control}
              rules={{ required: "Agency is required" }}
              render={({ field }) => (
                <CustomSelect
                  label="Agency"
                  placeholder="Select an Agency"
                  // options={countries}
                  valueKey="code"
                  labelKey="name"
                  search
                  // isLoading={isCountriesLoading}
                  // value={field.value}
                  // onChange={field.onChange}
                  // error={errors.Agency?.message}
                />
              )}
            />

            {/* Exclusive Linear Toggle Option */}
            <div className="flex items-center justify-between sm:pt-6 px-1">
              <span className="text-xs font-bold text-[#202626]">
                Exclusive
              </span>
              <button
                type="button"
                onClick={() => setIsExclusive(!isExclusive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isExclusive
                    ? "bg-gradient-to-r from-[#FF5C26] to-[#FF7A45]"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isExclusive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Custom Styled Dropdown Panel Box */}
          <div className="space-y-1.5 relative">
            <label className="text-xs font-medium text-gray-500">
              Permission
            </label>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-[#F1EDE7] text-sm text-[#202626] font-medium px-4 py-3 rounded-xl flex justify-between items-center cursor-pointer select-none"
            >
              <span>{permission}</span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Simulated Select Dropdown Options Overlay */}
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-1 bg-[#F1EDE7] rounded-xl overflow-hidden shadow-lg z-10 border border-gray-200/40">
                {permissionsList.map(item => (
                  <div
                    key={item}
                    onClick={() => {
                      setPermission(item);
                      setDropdownOpen(false);
                    }}
                    className={`px-4 py-2.5 text-xs font-medium cursor-pointer transition-all ${
                      permission === item
                        ? "bg-gradient-to-r from-[#FF5C26] to-[#FF7A45] text-white"
                        : "text-[#202626] hover:bg-black/5"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-bold text-[#1C4E3F] hover:opacity-80 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#FF5C26] text-white text-xs font-bold px-6 py-3 rounded-xl hover:opacity-90 shadow-sm transition-opacity cursor-pointer"
            >
              Add Agency
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
