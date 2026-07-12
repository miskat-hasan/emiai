"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken, getStoredUser } from "@/lib/auth-storage";
import { getRoleHomeRoute } from "@/lib/roleRoutes";
import AuthButton from "@/components/ui/AuthButton";
import SocialMediaConnect from "@/components/dashboard/profile/SocialMediaConnect";

export default function OnboardingSocialPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/login");
    }
  }, [router]);

  const finishOnboarding = () => {
    const role = getStoredUser()?.role;
    router.push(getRoleHomeRoute(role));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-black">Connect Your Socials</h1>
        <p className="text-sm text-gray mt-1">
          Connect at least one account so brands can find you.
        </p>
      </div>

      <SocialMediaConnect variant="onboarding" />

      <div className="flex flex-col items-center gap-3 mt-2">
        <div className="w-full">
          <AuthButton type="button" onClick={finishOnboarding}>
            Home
          </AuthButton>
        </div>
        <button
          type="button"
          onClick={finishOnboarding}
          className="text-sm font-medium text-gray hover:text-black transition-colors cursor-pointer"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
