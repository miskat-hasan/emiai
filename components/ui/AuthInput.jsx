"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * AuthInput
 * Reusable input for auth forms.
 *
 * Props:
 *  - label: string
 *  - type: string (default "text") — "password" adds show/hide toggle
 *  - placeholder: string
 *  - error: string | undefined
 *  - registration: object from react-hook-form register()
 *  - rest: any other input attrs
 */
export default function AuthInput({
  label,
  type = "text",
  placeholder,
  error,
  registration = {},
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[#203430]">{label}</label>
      )}
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          {...registration}
          {...rest}
          className={`
            w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-[#203430]
            placeholder:text-[#63716E]/60 outline-none border border-transparent
            transition-all duration-200
            focus:bg-white focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(245,120,2,0.08)]
            ${isPassword ? "pr-11" : ""}
            ${error ? "border-red-400 bg-red-50 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]" : ""}
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#63716E] hover:text-[#203430] transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}
