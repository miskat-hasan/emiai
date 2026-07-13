"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import { useState } from "react";
import Image from "next/image";
import { MoreHorizontal, Plus } from "lucide-react";
import AddManagerModal from "./AddManagerModal";

export default function BusinessManagerView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const managers = [
    {
      id: 1,
      name: "Mosfiqur Rahman Sifat",
      role: "Business Manager",
      email: "mosfiqurshs@gmail.com",
      permissions: "View Deals, Deal accept/Reject, View Portfolio, Chat",
      phone: "+1 123 456 9877",
      addedOn: "Feb 10, 2026",
      avatar: "https://i.pravatar.cc/400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-black">Business Manager</h3>
        {/* Trigger Modal Open */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center cursor-pointer gap-2 bg-primary text-white text-xs font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-xs"
        >
          <Plus size={16} />
          <span>Add New Business Manager</span>
        </button>
      </div>

      {/* Existing manager listing layout cards remain here... */}
      <div className="space-y-4">
        {managers.map((manager) => (
          <div 
            key={manager.id} 
            className="border border-gray-100 rounded-2xl p-5 md:p-6 space-y-6 bg-white shadow-xs"
          >
            {/* Action Row & User Meta Identity Header */}
            <div className="flex justify-between items-start">
              <span className="text-sm font-bold text-black tracking-wide">Action</span>
              <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Inner Pill Card Details Layout Block */}
            <div className="bg-gray-50/70 border border-gray-50 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white shadow-xs bg-gray-200">
                  <Image
                    src={getImageUrl(manager.avatar)}
                    alt={manager.name}
                    fill
                    className="object-cover"
                    fallbackSrc="/assets/avatar-placeholder.png"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black">{manager.name}</h4>
                  <p className="text-xs font-medium text-gray mt-0.5">{manager.role}</p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="block text-xs font-bold text-black">Added On</span>
                <span className="text-xs font-medium text-gray block mt-1">{manager.addedOn}</span>
              </div>
            </div>

            {/* Bottom Form Field Meta Properties Information Row Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1">
                <span className="block text-xs font-bold text-black">Mail</span>
                <span className="block text-xs text-gray truncate font-medium">{manager.email}</span>
              </div>

              <div className="space-y-1">
                <span className="block text-xs font-bold text-black">Permissions</span>
                <span className="block text-xs text-gray font-medium leading-relaxed">{manager.permissions}</span>
              </div>

              <div className="space-y-1">
                <span className="block text-xs font-bold text-black">Phone</span>
                <span className="block text-xs text-gray font-medium">{manager.phone}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Render Add Manager Modal */}
      <AddManagerModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

