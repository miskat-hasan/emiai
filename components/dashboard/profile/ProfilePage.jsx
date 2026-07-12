"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Pencil } from "lucide-react";
import ProfileForm from "./ProfileForm";
import BusinessManagerView from "./BusinessManagerView";
import AgencyView from "./AgencyView";
import SocialMediaConnect from "./SocialMediaConnect";
import LogoutModal from "./LogoutModal";
import { useLogoutUserMutation } from "@/redux/api/authApi";
import { removeUser } from "@/redux/slices/authSlice";
import { getCookie } from "@/lib/cookies";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("about-me");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Avatar upload state lives here now — the header preview and the
  // form submit both need it, and the header is outside the tab content.
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  // Role read from the cookie (matches how routing/middleware decide role),
  // not just the redux user object, so tabs are correct even before
  // the user slice has hydrated.
  const [role] = useState(() => getCookie("role") ?? user?.role ?? null);

  const isInfluencer = role === "influencer";

  const sidebarTabs = useMemo(() => {
    const tabs = [{ id: "about-me", label: "About Me" }];
    if (isInfluencer) {
      tabs.push(
        { id: "business-manager", label: "Business Manager" },
        { id: "agency", label: "Agency" },
      );
    }
    tabs.push({ id: "social-connect", label: "Social media connect" });
    return tabs;
  }, [isInfluencer]);

  const handleLogoutConfirm = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      // fail silently
    } finally {
      dispatch(removeUser());
      document.cookie = "token=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "role=; path=/; max-age=0; SameSite=Lax";
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  const handleAvatarSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarSaved = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const displayAvatar =
    avatarPreview ||
    (user?.avatar ? `${user.avatar}` : null);

  return (
    <div className="space-y-8 pb-16">
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-col items-center text-center space-y-3 shrink-0 xl:w-[350px]">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden group border border-gray-100 shadow-xs">
            {displayAvatar ? (
              <Image
                src={displayAvatar}
                alt={user?.name ?? "Profile"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray bg-gray-200">
                {user?.name
                  ?.split(" ")
                  .map(n => n[0])
                  .join("") ?? "U"}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-1.5 bg-primary text-white rounded-lg shadow-sm hover:scale-105 transition-transform cursor-pointer"
              aria-label="Change avatar"
            >
              <Pencil size={16} />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-black">
              {user?.name ?? "—"}
            </h2>
            <p className="text-xs font-medium text-gray mt-0.5 capitalize">
              {user?.role ?? role}
            </p>
          </div>
        </div>

        <div className="flex-1 w-full bg-gray-50/50 border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
          <div className="flex justify-between items-center bg-[#F7F7F7] border-b border-[#E5E6E6] px-5 py-3.5 text-sm">
            <span className="text-gray font-medium">Total Follower</span>
            <strong className="text-black font-semibold">130k</strong>
          </div>
          <div className="flex justify-between items-center bg-[#F7F7F7] border-b border-[#E5E6E6] px-5 py-3.5 text-sm">
            <span className="text-gray font-medium">Completed Deal</span>
            <strong className="text-black font-semibold">60</strong>
          </div>
          <div className="flex justify-between items-center bg-[#F7F7F7] border-b border-[#E5E6E6] px-5 py-3.5 text-sm">
            <span className="text-gray font-medium">Rating</span>
            <strong className="text-black font-semibold">4.5</strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <nav className="flex flex-col gap-1 lg:col-span-1 bg-white border border-gray-100 rounded-2xl p-4">
          {sidebarTabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-5 py-3.5 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-gray hover:bg-gray-50 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            className="w-full px-5 py-3.5 rounded-xl text-sm font-semibold text-gray hover:bg-red-50 hover:text-red-600 transition-all text-left mt-2 cursor-pointer"
          >
            Logout
          </button>
        </nav>

        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-6 min-h-[450px]">
          {activeTab === "about-me" && (
            <ProfileForm
              user={user}
              avatarFile={avatarFile}
              onAvatarSaved={handleAvatarSaved}
            />
          )}
          {activeTab === "business-manager" && isInfluencer && (
            <BusinessManagerView />
          )}
          {activeTab === "agency" && isInfluencer && <AgencyView />}
          {activeTab === "social-connect" && (
            <SocialMediaConnect variant="profile" />
          )}
        </div>
      </div>

      <LogoutModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        loading={isLoggingOut}
      />
    </div>
  );
}
