"use client";

import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, className = "", wrapperClassName = "", rows = 3, ...props },
  ref,
) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${wrapperClassName}`}>
      {label && (
        <label className="text-sm font-medium text-black">{label}</label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-black placeholder:text-gray/60 outline-none transition-all resize-none
          ${
            error
              ? "border-red-500 bg-red-50/40"
              : "bg-gray-100 border-transparent focus:border-primary/40 focus:bg-white"
          }
          ${className}`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Textarea;
