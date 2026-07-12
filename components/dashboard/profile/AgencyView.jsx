"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import AddAgencyModal from "./AddAgencyModal";

const mockAgencies = [
  {
    id: 1,
    name: "Dyson Agency",
   logo: "https://randomuser.me/api/portraits/men/32.jpg",
    addedOn: "Feb 10, 2026",
    mail: "mosfiqurshs@gmail.com",
    permissions: "Exclusive",
    phone: "+1 123 456 9877"
  }
];

export default function AgencyView() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#202626]">Agency</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#FF5C26] to-[#FF5C26] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Agency</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-2xs">
        <div className="flex justify-between items-center pb-2">
          <h4 className="text-sm font-bold text-[#202626]">Action</h4>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* Agency List Matrix */}
        {mockAgencies.map((agency) => (
          <div key={agency.id} className="space-y-4">
            {/* Header Identity Box */}
            <div className="flex justify-between items-center bg-[#F9F9F9] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black flex items-center justify-center text-white font-bold text-xs">
                  {/* Fallback to text if img fails, styling like the dark Dyson emblem */}
                  <Image 
                    src={getImageUrl(agency.logo)} 
                    alt={agency.name} 
                    fill 
                    className="object-cover invert brightness-0"
                  />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#202626]">{agency.name}</h5>
                  <p className="text-xs text-gray-400 font-medium">Agency</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Added On</span>
                <span className="text-xs font-semibold text-gray-500">{agency.addedOn}</span>
              </div>
            </div>

            {/* Information Grid Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pt-1">
              <div>
                <span className="block text-xs font-bold text-[#202626] mb-1">Mail</span>
                <span className="text-xs font-medium text-gray-400 break-all">{agency.mail}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-[#202626] mb-1">Permissions</span>
                <span className="text-xs font-medium text-gray-400">{agency.permissions}</span>
              </div>
              <div>
                <span className="block text-xs font-bold text-[#202626] mb-1">Phone</span>
                <span className="text-xs font-medium text-gray-400">{agency.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agency Popup Flow */}
      <AddAgencyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}