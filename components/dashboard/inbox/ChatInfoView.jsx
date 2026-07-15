// components/dashboard/inbox/ChatInfoView.jsx
"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Video,
  Calendar,
  ChevronDown,
  UserPlus,
  LogOut,
  MoreVertical,
  Settings,
  Link2,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import { MinusCircleSVG, ExclamationCircleSVG } from "@/components/common/Svg";
import BlockModal from "./modals/BlockModal";
import ReportModal from "./modals/ReportModal";
import DeliveryModal from "./modals/DeliveryModal";
import ExtensionDeliveryModal from "./modals/ExtensionDeliveryModal";
import LeaveGroupModal from "./modals/LeaveGroupModal";
import AddMemberModal from "./modals/AddMemberModal";
import GroupSettingsModal from "./modals/GroupSettingsModal";
import {
  useAddGroupAdminsMutation,
  useRemoveGroupAdminsMutation,
  useRemoveGroupMembersMutation,
  useDeleteGroupMutation,
  useRegenerateInviteMutation,
  useGetGroupMembersQuery,
} from "@/redux/api/services/chatApi";

export default function ChatInfoView({ chat, currentUserId, onBack }) {
  const { user, deliveryDate, gallery } = chat;
  const [activeTab, setActiveTab] = useState("gallery");

  // Modal states
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [memberMenuId, setMemberMenuId] = useState(null);

  const [addAdmins] = useAddGroupAdminsMutation();
  const [removeAdmins] = useRemoveGroupAdminsMutation();
  const [removeMembers] = useRemoveGroupMembersMutation();
  const [deleteGroup, { isLoading: isDeletingGroup }] =
    useDeleteGroupMutation();
  const [regenerateInvite, { isLoading: isRegenerating }] =
    useRegenerateInviteMutation();

  const isCurrentUserAdmin = chat.isAdmin;

  const isGroup = user.role === "Group";
  const { data: liveMembers, isLoading: isLoadingMembers } =
    useGetGroupMembersQuery(chat.id, {
      skip: !isGroup || !chat.id,
    });

  // Prefer the dedicated members endpoint (fresher, has full user objects)
  // over the cached participants list from /api/conversations; fall back to
  // the cached list while the live query is still loading.
  const members =
    liveMembers?.data?.map(m => ({
      id: m.user?.id,
      name: m.user?.name,
      avatar: m.user?.avatar,
      role: m.role,
      roleColor:
        m.role === "super_admin" || m.role === "admin"
          ? "text-primary"
          : "text-gray-400",
    })) ??
    chat.members ??
    [];

  const handleToggleAdmin = async member => {
    setMemberMenuId(null);
    const isAdmin = member.role === "admin" || member.role === "super_admin";
    try {
      if (isAdmin) {
        await removeAdmins({
          groupId: chat.id,
          member_ids: [member.id],
        }).unwrap();
        toast.success(`${member.name} is no longer an admin.`);
      } else {
        await addAdmins({ groupId: chat.id, member_ids: [member.id] }).unwrap();
        toast.success(`${member.name} is now an admin.`);
      }
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't update admin status.");
    }
  };

  const handleRemoveMember = async member => {
    setMemberMenuId(null);
    try {
      await removeMembers({
        groupId: chat.id,
        member_ids: [member.id],
      }).unwrap();
      toast.success(`${member.name} removed from group.`);
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't remove member.");
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm("Delete this group permanently? This cannot be undone."))
      return;
    try {
      await deleteGroup(chat.id).unwrap();
      toast.success("Group deleted.");
      onBack();
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't delete group.");
    }
  };

  const handleCopyInvite = async () => {
    if (!chat.inviteLink) return;
    const token = chat.inviteLink.split("/").pop();
    const inviteLink = `${window.location.origin}/dashboard/invite/${token}`;
    await navigator.clipboard.writeText(inviteLink);
    toast.success("Invite link copied.");
  };

  const handleRegenerateInvite = async () => {
    try {
      const res = await regenerateInvite(chat.id).unwrap();
      const token = res?.data?.invite_link.split("/").pop();
      const inviteLink = `${window.location.origin}/dashboard/invite/${token}`;
      await navigator.clipboard.writeText(inviteLink);
      toast.success("New invite link copied to clipboard.");
    } catch (err) {
      toast.error(err?.data?.message ?? "Couldn't regenerate invite link.");
    }
  };

  const tabs = ["Gallery", "Documents", "Links"];

  // Render Group Chat View
  if (user.role === "Group") {
    return (
      <div className="flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-gray-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative animate-in slide-in-from-right-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 shrink-0 z-10 bg-transparent">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          {isCurrentUserAdmin && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Settings size={20} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pb-8">
          <div className="flex flex-col items-center px-6 lg:px-10 mt-2">

            {/* Collage Avatar (mocked with an image) */}
            <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-[24px] overflow-hidden mb-6 mt-[-10px] shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                alt="Group Chat"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <h2 className="text-[22px] font-bold text-gray-900 mb-3">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 text-center max-w-[280px] mb-8 leading-relaxed font-medium">
              You can check the offer. You can check the offer. You can check
              the offer.
            </p>

            <div className="flex items-center gap-7 mb-10">
              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                <LogOut size={24} strokeWidth={2} className="rotate-180" />
              </button>
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="text-gray-800 hover:text-black transition-colors cursor-pointer"
              >
                <UserPlus size={24} strokeWidth={2.5} />
              </button>
              <button
                onClick={handleCopyInvite}
                disabled={!chat.inviteLink}
                className="text-gray-800 hover:text-black transition-colors cursor-pointer disabled:opacity-30"
                title="Copy invite link"
              >
                <Share2 size={24} strokeWidth={2.5} />
              </button>
              <button className="w-[42px] h-[42px] rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30 cursor-pointer">
                <Video size={20} strokeWidth={2.5} />
              </button>
            </div>
            {isCurrentUserAdmin && chat.inviteLink && (
              <button
                onClick={handleRegenerateInvite}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity cursor-pointer mb-6 disabled:opacity-50"
              >
                <Link2 size={13} />
                {isRegenerating ? "Regenerating..." : "Regenerate invite link"}
              </button>
            )}

            <hr className="w-full border-gray-200 mb-8" />

            {/* Members List */}
            <div className="w-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-[15px]">
                  All Member ({members.length})
                </h3>
                <ChevronDown
                  size={20}
                  className="text-gray-500 cursor-pointer hover:text-gray-800 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-6">
                {isLoadingMembers && (
                  <p className="text-center text-xs text-gray-400 py-2">
                    Loading members...
                  </p>
                )}
                {members.map(member => (
                  <div
                    key={member.id}
                    className="relative flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                        <Image
                          src={getImageUrl(member.avatar)}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-row items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-[15px] text-gray-800">
                          {member.name}
                        </span>
                        <span
                          className={`text-[13px] font-medium ${member.roleColor}`}
                        >
                          ({member.role})
                        </span>
                      </div>
                    </div>
                    {isCurrentUserAdmin && member.id !== currentUserId && (
                      <>
                        <button
                          onClick={() =>
                            setMemberMenuId(
                              memberMenuId === member.id ? null : member.id,
                            )
                          }
                          className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1"
                        >
                          <MoreVertical size={20} />
                        </button>
                        {memberMenuId === member.id && (
                          <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-30">
                            <button
                              onClick={() => handleToggleAdmin(member)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              <ShieldCheck size={13} />
                              {member.role === "admin" ||
                              member.role === "super_admin"
                                ? "Remove as admin"
                                : "Make admin"}
                            </button>
                            <button
                              onClick={() => handleRemoveMember(member)}
                              className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} />
                              Remove from group
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {isCurrentUserAdmin && (
              <button
                onClick={handleDeleteGroup}
                disabled={isDeletingGroup}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-xl py-3 mt-8 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={15} />
                {isDeletingGroup ? "Deleting..." : "Delete group"}
              </button>
            )}
          </div>
        </div>

        {/* Modals for Group Chat */}
        <LeaveGroupModal
          isOpen={isLeaveModalOpen}
          groupId={chat.id}
          onClose={() => setIsLeaveModalOpen(false)}
        />

        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          groupId={chat.id}
          existingMemberIds={members.map(m => m.id)}
          onClose={() => setIsAddMemberModalOpen(false)}
        />

        <GroupSettingsModal
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          chat={chat}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-gray-100/80 m-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 shrink-0 z-10">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
     
      </div>

      <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-2 mb-8">
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-[24px] overflow-hidden mb-4 shadow-sm">
            {user.avatar.length > 2 ? (
              <Image
                src={getImageUrl(user.avatar)}
                alt={user.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary/20 text-primary flex items-center justify-center font-bold text-2xl">
                {user.avatar}
              </div>
            )}
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-6">{user.name}</h2>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBlockModalOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm cursor-pointer"
            >
              <MinusCircleSVG className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm cursor-pointer"
            >
              <ExclamationCircleSVG className="w-[18px] h-[18px]" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm cursor-pointer">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30 cursor-pointer">
              <Video size={18} />
            </button>
          </div>
        </div>

        <hr className="border-gray-100 mb-8" />

        {/* Delivery Section */}
        {deliveryDate && (
          <div className="mb-8 flex flex-col gap-4">
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100/50">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-800">
                  Delivery Date
                </span>
                <span className="text-xs text-gray-500">{deliveryDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-900">1/3</span>
                <button
                  onClick={() => setIsExtensionModalOpen(true)}
                  className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm shadow-primary/20 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Calendar size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsDeliveryModalOpen(true)}
              className="w-full bg-primary text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.2)] cursor-pointer"
            >
              Delivery
            </button>
          </div>
        )}

        {/* Gallery / Tabs Section */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm">
              Gallery, Document, Link
            </h3>
            <ChevronDown size={18} className="text-gray-400" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {tabs.map(tab => {
              const tabId = tab.toLowerCase();
              const isActive = activeTab === tabId;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tabId)}
                  className={`
                    px-4 py-2 rounded-full text-xs font-medium transition-colors shrink-0 cursor-pointer
                    ${
                      isActive
                        ? "bg-primary text-white shadow-sm shadow-primary/20"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Grid Content */}
          {activeTab === "gallery" && gallery && gallery.length > 0 && (
            <div className="grid grid-cols-4 gap-2.5 mt-2">
              {gallery.map((imgUrl, i) => (
                <div
                  key={i}
                  className="aspect-square relative rounded-xl overflow-hidden bg-gray-100"
                >
                  <Image
                    src={getImageUrl(imgUrl)}
                    alt={`Gallery item ${i}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab !== "gallery" && (
            <div className="py-8 text-center text-sm text-gray-400 bg-gray-50 rounded-2xl border border-gray-100/50">
              No content available for {activeTab}.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        userId={user.id}
        userName={user.name}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
      />

      <ExtensionDeliveryModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
      />

      <LeaveGroupModal
        isOpen={isLeaveModalOpen}
        groupId={chat.id}
        onClose={() => setIsLeaveModalOpen(false)}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        groupId={chat.id}
        existingMemberIds={chat.members?.map(m => m.id) ?? []}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
}
