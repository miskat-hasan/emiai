import React from "react";
import Image from "next/image";
import { Plus, SlidersHorizontal } from "lucide-react";

export default function SelectUsersModal({
  users,
  searchQuery,
  setSearchQuery,
  selectedUsers,
  onToggleUser,
  onOpenFilter,
  onSendInvitation,
}) {
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Send Invitation</h2>
      
      {/* Search & Filter */}
      <div className="flex items-center gap-3 w-full mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none border border-transparent focus:border-primary/20"
          />
        </div>
        <button
          onClick={onOpenFilter}
          className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <SlidersHorizontal size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Users List */}
      <div className="w-full flex flex-col gap-4 mb-8">
        {filteredUsers.map((user) => {
          const isSelected = selectedUsers.includes(user.id);
          return (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium text-gray-900">{user.name}</span>
              </div>
              <button
                onClick={() => onToggleUser(user.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <Plus size={16} />
                Invitation
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onSendInvitation}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white py-3.5 rounded-2xl font-medium text-[16px] transition-all duration-200"
      >
        Sent Invitation
      </button>
    </div>
  );
}
