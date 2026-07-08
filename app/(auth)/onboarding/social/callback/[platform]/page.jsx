"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function SocialOAuthCallbackPage() {
  const { platform } = useParams();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const error =
      searchParams.get("error") || searchParams.get("error_description");

    if (window.opener) {
      window.opener.postMessage(
        { type: "social-oauth-callback", platform, code, error },
        window.location.origin,
      );
    }

    window.close();
  }, [platform, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen text-sm text-gray">
      Completing sign-in...
    </div>
  );
}
