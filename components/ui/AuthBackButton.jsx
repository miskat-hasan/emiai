"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Uses router.back() rather than a hardcoded href — since the registration
// flow is strictly linear (each step guards on the previous step's
// sessionStorage key), the browser history naturally mirrors the step
// order, so "back" always lands on the correct previous step without
// needing to hardcode per-page destinations.
export default function AuthBackButton({ className = "" }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`w-full py-2  flex items-center justify-center rounded-lg text-gray-500 hover:text-black hover:bg-gray-200 bg-gray-100 transition-colors cursor-pointer ${className}`}
      aria-label="Go back"
    >
      Back
    </button>
  );
}
