"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ChevronRight, Check } from "lucide-react";
import { useConnectSocialAccountMutation } from "@/redux/api/services/userApi";
import { openSocialOAuthPopup, SOCIAL_PLATFORMS } from "@/lib/socialAuth";
import { getStoredToken, getStoredUser } from "@/lib/auth-storage";
import { getRoleHomeRoute } from "@/lib/roleRoutes";
import AuthButton from "@/components/ui/AuthButton";
import { InstagramIconSVG, SnapchatIconSVG } from "@/components/common/Svg";
import { FaFacebook } from "react-icons/fa";
import { BsTiktok, BsYoutube } from "react-icons/bs";

const PLATFORM_UI = [
  {
    key: "instagram",
    label: "Instagram",
    Icon: InstagramIconSVG,
    iconClass: "text-pink-500",
  },
  { key: "tiktok", label: "TikTok", Icon: BsTiktok, iconClass: "text-black" },
  {
    key: "facebook",
    label: "Facebook",
    Icon: FaFacebook,
    iconClass: "text-blue-600",
  },
  {
    key: "snapchat",
    label: "Snapchat",
    Icon: SnapchatIconSVG,
    iconClass: "text-yellow-400",
  },
  {
    key: "youtube",
    label: "YouTube",
    Icon: BsYoutube,
    iconClass: "text-red-600",
  },
];

export default function OnboardingSocialPage() {
  const router = useRouter();
  const [connectSocialAccount] = useConnectSocialAccountMutation();

  const [connections, setConnections] = useState({});
  const [connectingKey, setConnectingKey] = useState(null);

  useEffect(() => {
    if (!getStoredToken()) {
      router.replace("/login");
    }
  }, [router]);

  const handleConnect = async platformKey => {
    setConnectingKey(platformKey);
    try {
      const { code } = await openSocialOAuthPopup(platformKey);

      // TODO: once the backend endpoint is live, this exchanges the code
      // for the provider profile and returns the real connected handle
      let handle = "Connected";
      try {
        const res = await connectSocialAccount({
          platform: platformKey,
          code,
        }).unwrap();
        handle = res?.data?.username ? `@${res.data.username}` : handle;
      } catch {
        // Backend endpoint isn't live yet — keep the optimistic "Connected" state
      }

      setConnections(prev => ({ ...prev, [platformKey]: handle }));
      toast.success(`${SOCIAL_PLATFORMS[platformKey].name} connected`);
    } catch (err) {
      if (err?.message !== "cancelled") {
        toast.error(err?.message ?? "Couldn't connect. Please try again.");
      }
    } finally {
      setConnectingKey(null);
    }
  };

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

      <div className="flex flex-col gap-2.5">
        {PLATFORM_UI.map(({ key, label, Icon, iconClass }) => {
          const handle = connections[key];
          const isConnecting = connectingKey === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => !handle && handleConnect(key)}
              disabled={isConnecting}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-left disabled:opacity-60 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Icon size={18} className={iconClass} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-black">{label}</p>
                <p className="text-xs text-gray truncate">
                  {isConnecting ? "Connecting..." : (handle ?? "Not connected")}
                </p>
              </div>

              {handle ? (
                <Check size={16} className="text-primary shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-gray shrink-0" />
              )}
            </button>
          );
        })}
      </div>

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
