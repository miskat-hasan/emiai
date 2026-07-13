"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { X, Search, Check, Camera } from "lucide-react";
import { getImageUrl } from "@/helper/getImageUrl";
import {
  useGetAvailableUsersQuery,
  useCreateGroupConversationMutation,
} from "@/redux/api/services/chatApi";

export default function CreateGroupModal({ open, onClose, onCreated }) {
  const [step, setStep] = useState(1); // 1: pick members, 2: group details
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { data, isLoading } = useGetAvailableUsersQuery(
    { q: searchQuery || undefined },
    { skip: !open },
  );
  const [createGroup, { isLoading: isCreating }] =
    useCreateGroupConversationMutation();

  if (!open) return null;

  const users = data?.data?.data ?? [];

  const reset = () => {
    setStep(1);
    setSearchQuery("");
    setSelectedIds([]);
    setGroupName("");
    setDescription("");
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleAvatarSelect = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCreate = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required.");
      return;
    }
    try {
      // NOTE: the documented payload takes group.avatar as a value (null in
      // the sample), not a file — if the backend actually expects a file
      // upload for the group avatar, this endpoint needs to accept
      // multipart/form-data instead of JSON. Flag to backend if avatar
      // upload on creation is needed; for now this sends JSON without it.
      const res = await createGroup({
        name: groupName.trim(),
        participants: selectedIds,
        group: {
          description: description.trim() || undefined,
          type: "private",
          avatar: null,
        },
      }).unwrap();

      toast.success(res?.message ?? "Group created successfully!");
      onCreated?.(res?.data);
      closeAndReset();
    } catch (err) {
      toast.error(err?.data?.message ?? "Failed to create group.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && closeAndReset()}
    >
      <div className="relative w-full max-w-[420px] bg-gradient-to-b from-white via-white to-primary/10 rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-900">
            {step === 1 ? "New group" : "Group details"}
          </h3>
          <button
            onClick={closeAndReset}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {step === 1 ? (
          <>
            <div className="px-6 pb-4 shrink-0">
              <div className="bg-[#F9F9F9] rounded-xl px-4 py-3 flex items-center gap-2 border border-gray-100">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search people"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                />
              </div>
              {selectedIds.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {selectedIds.length} selected
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
              <div className="flex flex-col gap-4 pb-4">
                {isLoading && (
                  <p className="text-center text-xs text-gray-400 py-4">
                    Loading...
                  </p>
                )}
                {!isLoading && users.length === 0 && (
                  <p className="text-center text-xs text-gray-400 py-4">
                    No users found.
                  </p>
                )}
                {users.map(user => {
                  const isSelected = selectedIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      onClick={() => toggleSelect(user.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-500 shrink-0">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getImageUrl(user.avatar)}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user.name?.[0]
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                          isSelected
                            ? "bg-primary border-primary"
                            : "border-gray-200"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={13}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 pt-3 shrink-0">
              <button
                onClick={() => setStep(2)}
                disabled={selectedIds.length === 0}
                className="w-full py-3.5 rounded-xl text-[15px] font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-[0_4px_14px_rgba(240,90,40,0.25)]"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
              <div className="flex flex-col items-center pt-2 pb-6">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center mb-2">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Group avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera size={22} className="text-gray-300" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleAvatarSelect}
                  />
                </div>
                <span className="text-[11px] text-gray-400">
                  Photo not sent yet — pending backend upload support
                </span>
              </div>

              <div className="flex flex-col gap-4 pb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Group name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. Campaign Team"
                    className="w-full bg-gray-50 border border-gray-100 text-sm text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    placeholder="What's this group about?"
                    className="w-full bg-gray-50 border border-gray-100 text-sm text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-primary/40 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 pt-3 shrink-0 flex items-center gap-3">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-bold text-[#1C4E3F] hover:opacity-80 transition-opacity cursor-pointer px-2"
              >
                Back
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating || !groupName.trim()}
                className="flex-1 py-3.5 rounded-xl text-[15px] font-semibold bg-primary text-white hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-[0_4px_14px_rgba(240,90,40,0.25)]"
              >
                {isCreating ? "Creating..." : "Create Group"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
