"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className = "", wrapperClassName = "", icon: Icon, ...props },
  ref,
) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray pointer-events-none"
          />
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none transition-all
            ${Icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-500 bg-red-50/40"
                : "bg-gray-100 border-transparent focus:border-primary/40 focus:bg-white"
            }
            ${className}`}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
