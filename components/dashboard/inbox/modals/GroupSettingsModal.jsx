"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { X, Camera } from "lucide-react";
import { useUpdateGroupInfoMutation } from "@/redux/api/services/chatApi";

const TOGGLES = [
  {
    key: "allow_members_to_send_messages",
    label: "Allow members to send messages",
  },
  {
    key: "allow_members_to_add_remove_participants",
    label: "Allow members to add/remove participants",
  },
  {
    key: "allow_members_to_change_group_info",
    label: "Allow members to change group info",
  },
  {
    key: "admins_must_approve_new_members",
    label: "Admins must approve new members",
  },
  { key: "allow_invite_users_via_link", label: "Allow invite via link" },
];

export default function GroupSettingsModal({ open, onClose, chat }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [toggles, setToggles] = useState({});
  const fileInputRef = useRef(null);

  const [updateGroupInfo, { isLoading }] = useUpdateGroupInfoMutation();

  useEffect(() => {
    if (!open || !chat) return;
    setName(chat.user?.name ?? "");
    setDescription(chat.groupSetting?.description ?? "");
    setAvatarFile(null);
    setAvatarPreview(null);
    setToggles({
      allow_members_to_send_messages:
        !!chat.groupSetting?.allow_members_to_send_messages,
      allow_members_to_add_remove_participants:
        !!chat.groupSetting?.allow_members_to_add_remove_participants,
      allow_members_to_change_group_info:
        !!chat.groupSetting?.allow_members_to_change_group_info,
      admins_must_approve_new_members:
        !!chat.groupSetting?.admins_must_approve_new_members,
      allow_invite_users_via_link:
        !!chat.groupSetting?.allow_invite_users_via_link,
    });
  }, [open, chat]);

  if (!open) return null;

  const handleAvatarSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const toggleSwitch = key =>
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Group name is required.");
      return;
    }
    const fd = new FormData();
    fd.append("name", name.trim());
    if (avatarFile) fd.append("group[avatar]", avatarFile);
    fd.append("group[description]", description.trim());
    fd.append("group[type]", "private");
    Object.entries(toggles).forEach(([key, value]) => {
      fd.append(`group[${key}]`, value ? 1 : 0);
    });

    try {
      const res = await updateGroupInfo({
        groupId: chat.id,
        formData: fd,
      }).unwrap();
      toast.success(res?.message ?? "Group updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to update group.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[440px] bg-white rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">Group settings</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
          <div className="flex flex-col items-center pb-6">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center mb-2">
              {avatarPreview || chat?.user?.avatar?.length > 2 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview || chat.user.avatar}
                  alt="Group avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={22} className="text-gray-300" />
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera size={18} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Group name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 text-sm text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 border border-gray-100 text-sm text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <p className="text-xs font-semibold text-gray-500">Permissions</p>
              {TOGGLES.map(t => (
                <div key={t.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 pr-4">{t.label}</span>
                  <button
                    type="button"
                    onClick={() => toggleSwitch(t.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                      toggles[t.key] ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
                        toggles[t.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 pt-3 shrink-0">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl text-[15px] font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-[0_4px_14px_rgba(240,90,40,0.25)]"
          >
            {isLoading ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
