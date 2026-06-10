"use client";

/**
 * AuthButton
 * Full-width gradient submit button for auth forms.
 *
 * Props:
 *  - children: ReactNode
 *  - loading: boolean
 *  - type: "submit" | "button"
 *  - onClick: () => void
 *  - variant: "primary" | "social"
 */
export default function AuthButton({
  children,
  loading = false,
  type = "submit",
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  if (variant === "social") {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`
          flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl
          border border-gray-200 bg-white text-sm font-medium text-black
          hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm
          active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
          ${className}
        `}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      {...props}
      className={`
        relative w-full py-3.5 rounded-xl font-semibold text-sm text-white
        bg-gradient-to-r from-[#F57802] to-[#E54500]
        hover:from-[#E56E00] hover:to-[#D04000]
        hover:shadow-lg hover:shadow-orange-500/25
        active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
        transition-all duration-200 cursor-pointer
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
