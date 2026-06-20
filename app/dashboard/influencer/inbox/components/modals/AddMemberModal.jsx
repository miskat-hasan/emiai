"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SlidersHorizontal, Plus } from "lucide-react";

export default function AddMemberModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const mockUsers = [
    { id: "1", name: "Dianne Russell", avatar: "https://i.pravatar.cc/150?u=dianne" },
    { id: "2", name: "Esther Howard", avatar: "https://i.pravatar.cc/150?u=esther" },
    { id: "3", name: "Theresa Webb", avatar: "https://i.pravatar.cc/150?u=theresa" },
    { id: "4", name: "Ronald Richards", avatar: "https://i.pravatar.cc/150?u=ronald" },
    { id: "5", name: "Cody Fisher", avatar: "https://i.pravatar.cc/150?u=cody" },
  ];

  const handleToggleAdd = (id) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(prev => prev.filter(mId => mId !== id));
    } else {
      setSelectedMembers(prev => [...prev, id]);
    }
  };

  const handleAddSubmit = () => {
    toast.success(`Added ${selectedMembers.length} members successfully.`);
    setSelectedMembers([]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-[400px] bg-gradient-to-b from-white via-white to-[#FFF2E8] rounded-[24px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">

        {/* Header and Search */}
        <div className="flex flex-col items-center pt-8 pb-6 px-6 shrink-0">
          <h3 className="text-[20px] font-bold text-gray-900 mb-6">
            Add member
          </h3>
          
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 bg-[#F9F9F9] rounded-xl px-4 py-3 flex items-center border border-gray-100">
              <input
                type="text"
                placeholder="here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-600"
              />
            </div>
            <button className="w-[50px] h-[48px] bg-[#F9F9F9] rounded-xl flex items-center justify-center text-gray-800 border border-gray-100 hover:bg-gray-100 transition-colors shrink-0">
              <SlidersHorizontal size={20} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
          <div className="flex flex-col gap-5 pb-6">
            {mockUsers.map((user) => {
              const isSelected = selectedMembers.includes(user.id);
              return (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-100/50">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <span className="font-semibold text-[15px] text-gray-800">{user.name}</span>
                  </div>
                  <button
                    onClick={() => handleToggleAdd(user.id)}
                    className={`
                      flex items-center justify-center gap-1.5 px-4 py-1.5 min-w-[80px] rounded-xl text-[14px] font-medium transition-colors border cursor-pointer
                      ${isSelected 
                        ? 'bg-primary text-white border-primary' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Plus size={16} strokeWidth={2.5} className={isSelected ? "text-white" : "text-gray-500"} />
                    {isSelected ? 'Added' : 'Add'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Button Area */}
        <div className="p-6 pt-2 shrink-0">
          <button
            onClick={handleAddSubmit}
            className={`
              w-full py-3.5 rounded-xl text-[16px] font-semibold transition-opacity shadow-[0_4px_14px_rgba(240,90,40,0.25)] cursor-pointer
              ${selectedMembers.length > 0 ? 'bg-primary text-white hover:opacity-90' : 'bg-[#EF6A37] text-white'}
            `}
          >
            Add
          </button>
        </div>

      </div>
    </div>
  );
}
