"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Bookmark, Share2, Video,
  Calendar, ChevronDown, UserPlus, LogOut, MoreVertical
} from "lucide-react";
import { MinusCircleSVG, ExclamationCircleSVG } from "@/components/common/Svg";
import BlockModal from "./modals/BlockModal";
import ReportModal from "./modals/ReportModal";
import DeliveryModal from "./modals/DeliveryModal";
import ExtensionDeliveryModal from "./modals/ExtensionDeliveryModal";
import LeaveGroupModal from "./modals/LeaveGroupModal";
import AddMemberModal from "./modals/AddMemberModal";

export default function ChatInfoView({ chat, onBack }) {
  const { user, deliveryDate, gallery } = chat;
  const [activeTab, setActiveTab] = useState("gallery");

  // Modal states
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const tabs = ["Gallery", "Message", "Documents", "Links"];

  // Render Group Chat View
  if (user.role === "Group") {
    return (
      <div className="flex flex-col h-full bg-white rounded-[24px] overflow-hidden border border-gray-100/80 m-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative animate-in slide-in-from-right-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 lg:p-6 shrink-0 z-10 bg-transparent">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-8 scrollbar-hide">
          <div className="flex flex-col items-center px-6 lg:px-10 mt-2">

            <div className="relative w-full flex justify-end">
              <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black transition-colors cursor-pointer">
                <Bookmark size={22} className="fill-gray-500 text-gray-500" />
              </button>
            </div>

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

            <h2 className="text-[22px] font-bold text-gray-900 mb-3">{user.name}</h2>
            <p className="text-sm text-gray-500 text-center max-w-[280px] mb-8 leading-relaxed font-medium">
              You can check the offer. You can check the offer. You can check the offer.
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
              <button className="text-gray-800 hover:text-black transition-colors cursor-pointer">
                <Share2 size={24} strokeWidth={2.5} />
              </button>
              <button className="w-[42px] h-[42px] rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm shadow-red-500/30 cursor-pointer">
                <Video size={20} strokeWidth={2.5} />
              </button>
            </div>

            <hr className="w-full border-gray-200 mb-8" />

            {/* Members List */}
            <div className="w-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-[15px]">All Member ({chat.members?.length || 0})</h3>
                <ChevronDown size={20} className="text-gray-500 cursor-pointer hover:text-gray-800 transition-colors" />
              </div>

              <div className="flex flex-col gap-6">
                {chat.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex flex-row items-center gap-1.5 mt-0.5">
                        <span className="font-semibold text-[15px] text-gray-800">{member.name}</span>
                        <span className={`text-[13px] font-medium ${member.roleColor}`}>({member.role})</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Modals for Group Chat */}
        <LeaveGroupModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
        />

        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
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
        <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
          <Bookmark size={20} className="fill-gray-400 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 lg:px-8 pb-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

        {/* Profile Section */}
        <div className="flex flex-col items-center mt-2 mb-8">
          <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-[24px] overflow-hidden mb-4 shadow-sm">
            {user.avatar.length > 2 ? (
              <Image
                src={user.avatar}
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
                <span className="text-sm font-medium text-gray-800">Delivery Date</span>
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
            <h3 className="font-semibold text-gray-900 text-sm">Gallery, Document, Link</h3>
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
                    ${isActive
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
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
                <div key={i} className="aspect-square relative rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={imgUrl}
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
        onClose={() => setIsLeaveModalOpen(false)}
      />

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
}
