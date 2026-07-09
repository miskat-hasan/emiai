"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, ShoppingCart, Handshake, Settings, Eye } from "lucide-react";
import AuthButton from "@/components/ui/AuthButton";

const ROLES = [
  { key: "influencer", label: "Influencer", icon: Mic, color: "#F57802" },
  {
    key: "advertiser",
    label: "Advertiser",
    icon: ShoppingCart,
    color: "#125896",
  },
  { key: "agency", label: "Agency", icon: Handshake, color: "#DE4385" },
  { key: "guest", label: "Guest", icon: Eye, color: "#D20061" },
];

export default function RegistrationPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!selected) {
      setError("Please select a role to continue.");
      return;
    }
    setError("");
    sessionStorage.setItem("reg_role", selected);
    router.push("/registration/info");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Choose your role</h1>
        <p className="text-sm text-gray mt-1">
          Create your account and start connecting today.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ROLES.map(({ key, label, icon: Icon, color }) => {
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelected(key);
                setError("");
              }}
              className={`
                flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium
                border-2 transition-all duration-150 text-left cursor-pointer
                ${
                  isSelected
                    ? "border-primary bg-primary/5 text-black"
                    : "border-transparent bg-gray-100 text-gray hover:bg-gray-200"
                }
              `}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
              {label}
              {isSelected && (
                <span className="ml-auto w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}

      <AuthButton type="button" onClick={handleNext}>
        Next
      </AuthButton>

      <p className="text-center text-sm text-gray">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
