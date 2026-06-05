"use client";

import {
  BookmarkFilledSVG2,
  HeartSVG2,
  MailSVG,
  ShareSVG,
} from "@/components/common/Svg";
import { X, Heart, Eye } from "lucide-react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";

export default function AgencyPortfolioDetailsModal({
  open,
  onClose,
  portfolioId,
  portfolioData,
  user,
}) {
  if (!open) return null;

  const portfolio = portfolioData.find((p) => p.id === portfolioId);
  if (!portfolio) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/50 p-4 no-scrollbar">
      <div className="relative w-full max-w-[800px] bg-[#000000]/90 p-6 sm:py-8 sm:pl-14 pr-8 overflow-y-auto max-h-[90vh]">
        {/* Top-right action buttons */}
        <div className="absolute top-6 left-2 flex flex-col items-center gap-4 z-50">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0] ?? "U"}
              </span>
            )}
          </div>

          {/* Bookmark */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <BookmarkFilledSVG2 className="w-10 h-10 text-gray-400" />
          </button>

          {/* Share */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <ShareSVG className="w-5 h-5 text-gray-400" />
          </button>

          {/* Email */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <MailSVG className="w-5 h-5 text-gray-400" />
          </button>

          {/* Like */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <HeartSVG2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <X size={18} strokeWidth={2} />
        </button>

        {/* Portfolio items */}
        <div className="bg-white rounded-xl">
          {portfolio.items &&
            portfolio.items.map((item, index) => (
              <div key={index}>
                <div className="mb-4 h-[350px] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300"
                    width={700}
                    height={450}
                  />
                </div>
                <div className="pb-4 flex flex-col justify-center items-center text-gray-600 text-sm">
                  <h3 className="mb-2 text-lg font-bold text-[#202626]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] font-medium text-[#7a8582]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Header Section */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4 xl:p-9 text-center my-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <FaHeart size={28} strokeWidth={1.8} />
          </div>
          <h2 className="mb-2 text-lg font-bold text-[#202626]">
            Portfolio Title: {portfolio.title}
          </h2>
          <div className="flex items-center justify-center gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1.5">
              <Heart size={16} strokeWidth={1.8} />{" "}
              <span>{portfolio.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye size={16} strokeWidth={1.8} /> <span>{portfolio.views}</span>
            </div>
            <div>{portfolio.publishedAt}</div>
          </div>
        </div>

        {/* Bottom Gallery */}
        {portfolio.bottomGallery &&
          portfolio.bottomGallery.map((gallery, idx) => (
            <div key={idx} className="mt-6 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden shrink-0">
                  {gallery.avatar ? (
                    <Image
                      src={gallery.avatar}
                      alt={gallery.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                      {gallery.name?.[0] ?? "U"}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {gallery.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {gallery.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 h-50 xl:grid-cols-4 gap-2 mt-2">
                {gallery.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`Gallery ${i}`}
                    width={100}
                    height={200}
                    className="h-full w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
