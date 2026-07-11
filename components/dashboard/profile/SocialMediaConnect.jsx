"use client";

import { Unlink, ChevronRight, Loader2 } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { BsTiktok, BsYoutube } from "react-icons/bs";
import { toast } from "react-toastify";
import { useState } from "react";
import { InstagramIconSVG, SnapchatIconSVG } from "@/components/common/Svg";
import { openSocialOAuthPopup, SOCIAL_PLATFORMS } from "@/lib/socialAuth";
import {
  useGetSocialStatusQuery,
  useConnectSocialAccountMutation,
  useDisconnectSocialAccountMutation,
} from "@/redux/api/services/socialApi";

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

function getStatusHandle(platform, data) {
  if (!data) return null;
  return (
    data.username ??
    data.handle ??
    data[`${platform}_username`] ??
    data.ig_username ??
    null
  );
}

export default function SocialMediaConnect({ variant = "profile" }) {
  const [connectingKey, setConnectingKey] = useState(null);
  const [disconnectingKey, setDisconnectingKey] = useState(null);

  const [connectSocialAccount] = useConnectSocialAccountMutation();
  const [disconnectSocialAccount] = useDisconnectSocialAccountMutation();

  // Fixed hook calls per platform (rules of hooks — can't loop useQuery)
  const igStatus = useGetSocialStatusQuery("instagram");
  const ttStatus = useGetSocialStatusQuery("tiktok");
  const fbStatus = useGetSocialStatusQuery("facebook");
  const scStatus = useGetSocialStatusQuery("snapchat");
  const ytStatus = useGetSocialStatusQuery("youtube");

  const statusMap = {
    instagram: igStatus,
    tiktok: ttStatus,
    facebook: fbStatus,
    snapchat: scStatus,
    youtube: ytStatus,
  };

  const handleConnect = async platformKey => {
    setConnectingKey(platformKey);
    try {
      const { code } = await openSocialOAuthPopup(platformKey);
      const redirect_uri = `${window.location.origin}/onboarding/social/callback/${platformKey}`;

      await connectSocialAccount({
        platform: platformKey,
        code,
        redirect_uri,
      }).unwrap();
      toast.success(`${SOCIAL_PLATFORMS[platformKey].name} connected`);
    } catch (err) {
      if (err?.message !== "cancelled") {
        toast.error(
          err?.data?.message ??
            err?.message ??
            "Couldn't connect. Please try again.",
        );
      }
    } finally {
      setConnectingKey(null);
    }
  };

  const handleDisconnect = async platformKey => {
    setDisconnectingKey(platformKey);
    try {
      await disconnectSocialAccount(platformKey).unwrap();
      toast.success(`${SOCIAL_PLATFORMS[platformKey].name} disconnected`);
    } catch (err) {
      toast.error(
        err?.data?.message ?? "Couldn't disconnect. Please try again.",
      );
    } finally {
      setDisconnectingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {variant === "profile" && (
        <div>
          <h3 className="text-lg font-bold text-black">Social media connect</h3>
          <p className="text-xs text-gray mt-0.5">
            Link your accounts so brands can see your reach.
          </p>
        </div>
      )}

      {variant === "profile" && <hr className="border-gray-100" />}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {PLATFORM_UI.map(({ key, label, Icon, iconClass }) => {
          const { data, isLoading } = statusMap[key];
          const connected = !!data?.data?.connected;
          const handle = getStatusHandle(key, data?.data);
          const isConnecting = connectingKey === key;
          const isDisconnecting = disconnectingKey === key;
          const busy = isConnecting || isDisconnecting;

          return (
            <div
              key={key}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-colors ${
                connected
                  ? "bg-gradient-to-r from-primary/5 to-transparent border-primary/20"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                <Icon size={18} className={iconClass} />
              </div>

              <button
                type="button"
                onClick={() => !connected && !busy && handleConnect(key)}
                disabled={connected || busy}
                className="flex-1 min-w-0 text-left disabled:cursor-default"
              >
                <p className="text-sm font-semibold text-black truncate">
                  {label}
                </p>
                <p className="text-xs text-gray truncate">
                  {isLoading
                    ? "Checking..."
                    : isConnecting
                      ? "Connecting..."
                      : isDisconnecting
                        ? "Disconnecting..."
                        : connected
                          ? (handle ?? "Connected")
                          : "Not connected"}
                </p>
              </button>

              {busy ? (
                <Loader2
                  size={16}
                  className="text-gray animate-spin shrink-0"
                />
              ) : connected ? (
                <button
                  type="button"
                  onClick={() => handleDisconnect(key)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                  aria-label={`Disconnect ${label}`}
                >
                  <Unlink size={15} />
                </button>
              ) : (
                <ChevronRight size={16} className="text-gray shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
