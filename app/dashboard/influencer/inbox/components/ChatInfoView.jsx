"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Bookmark, MinusCircle, AlertCircle, Share2, Video,
  Calendar, ChevronDown
} from "lucide-react";
import BlockModal from "./modals/BlockModal";
import ReportModal from "./modals/ReportModal";
import DeliveryModal from "./modals/DeliveryModal";
import ExtensionDeliveryModal from "./modals/ExtensionDeliveryModal";

export default function ChatInfoView({ chat, onBack }) {
  const { user, deliveryDate, gallery } = chat;
  const [activeTab, setActiveTab] = useState("gallery");

  // Modal states
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  const tabs = ["Gallery", "Message", "Documents", "Links"];

  return (
    <div className="flex flex-col h-full bg-white relative animate-in slide-in-from-right-8 duration-300">
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
              <MinusCircle size={18} />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-black transition-colors shadow-sm cursor-pointer"
            >
              <AlertCircle size={18} />
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
    </div>
  );
}
