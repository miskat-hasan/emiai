"use client";
import { getImageUrl } from "@/helper/getImageUrl";

import {
  BookmarkFilledSVG2,
  BookmarkSVG,
  HeartSVG2,
  MailSVG,
  ShareSVG,
} from "@/components/common/Svg";
import { X, Heart, Eye, Pencil } from "lucide-react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useGetSinglePortfolioQuery } from "@/redux/api/services/portfolioApi";
import { useEffect, useState } from "react";
import { useToggleBookmarkMutation } from "@/redux/api/services/bookmarkApi";
import { useStoreInteractionMutation } from "@/redux/api/services/interactionApi";
import { toast } from "react-toastify";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  
  const getOrdinalNum = (n) => {
    return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
  };

  return `${months[d.getMonth()]} ${getOrdinalNum(d.getDate())} ${d.getFullYear()}`;
}

export default function PortfolioDetailsModal({
  open,
  onClose,
  portfolioId,
  user,
  onEdit,
}) {
  const { data: res, isLoading } = useGetSinglePortfolioQuery(portfolioId, {
    skip: !open || !portfolioId,
  });

  const [toggleBookmark] = useToggleBookmarkMutation();
  const [storeInteraction] = useStoreInteractionMutation();

  useEffect(() => {
    if (open && portfolioId) {
      storeInteraction({
        target_type: "portfolio",
        target_id: portfolioId,
        interaction_type: "view",
      });
    }
  }, [open, portfolioId, storeInteraction]);

  const rawPortfolio = res?.data;

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (rawPortfolio) {
      setIsLiked(Boolean(rawPortfolio.is_liked));
      setIsBookmarked(Boolean(rawPortfolio.is_bookmarked));
    }
  }, [rawPortfolio]);

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/70 p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 absolute" />
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-white animate-spin absolute" />
            <Image src="/logo.png" alt="Logo" width={22} height={22} className="object-contain z-10 brightness-0 invert" style={{ width: "auto", height: "auto" }} />
          </div>
          <span className="text-white/70 text-sm font-medium tracking-widest uppercase">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!rawPortfolio || !rawPortfolio.portfolio) return null;

  const portfolioData = rawPortfolio.portfolio;

  const portfolio = {
    id: portfolioData.id,
    title: portfolioData.title,
    description: portfolioData.description,
    likes: portfolioData.likes_count ?? 0,
    views: portfolioData.views_count ?? 0,
    publishedAt: formatDate(portfolioData.created_at),
    items: (portfolioData.media || []).map((m) => ({
      title: m.title,
      description: "",
      image: `${apiUrl}/${m.media_url}`,
    })),
  };

  const handleLike = async () => {
    try {
      setIsLiked(prev => !prev);
      await storeInteraction({
        target_type: "portfolio",
        target_id: portfolioId,
        interaction_type: "like",
      }).unwrap();
    } catch (e) {
      setIsLiked(prev => !prev);
      toast.error("Failed to like portfolio");
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarked(prev => !prev);
      await toggleBookmark({
        type: "portfolio",
        id: portfolioId,
      }).unwrap();
    } catch (e) {
      setIsBookmarked(prev => !prev);
      toast.error("Failed to bookmark portfolio");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/70 p-4 sm:p-8 no-scrollbar">
      
      {/* Wrapper to align the floating buttons exactly to the right edge of the modal */}
      <div className="relative w-full max-w-[850px] h-full flex items-center justify-center">
        
        {/* Floating Action Buttons */}
        <div className="absolute top-1/2 -right-12 md:-right-16 -translate-y-1/2 flex flex-col items-center gap-3 z-50">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
            {user?.avatar ? (
              <Image
                src={getImageUrl(user.avatar)}
                alt={user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.[0] ?? "U"}
              </span>
            )}
          </div>

          {/* Bookmark */}
          <button 
            onClick={handleBookmark}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkFilledSVG2 className="w-5 h-5 text-primary" />
            ) : (
              <BookmarkSVG className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {/* Share */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <ShareSVG className="w-5 h-5 text-gray-500" />
          </button>

          {/* Email */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <MailSVG className="w-5 h-5 text-gray-500" />
          </button>

          {/* Edit */}
          {onEdit && (
            <button
              onClick={() => onEdit(portfolioData)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              title="Edit Portfolio"
            >
              <Pencil size={18} className="text-gray-500" />
            </button>
          )}

          {/* Like */}
          <button 
            onClick={handleLike}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            {isLiked ? (
              <FaHeart className="w-5 h-5 text-primary" />
            ) : (
              <HeartSVG2 className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 md:-top-6 -right-4 md:-right-12 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md z-50 transition-colors"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Main Modal Container (Scrollable) */}
        <div className="w-full max-h-[90vh] overflow-y-auto no-scrollbar pb-10">
          
          {/* Gallery Section */}
          <div className="w-full bg-white rounded-[24px] overflow-hidden mb-6 shadow-xl">
            {/* Top Portfolio Description once */}
            {portfolio.description && (
              <div className="px-6 py-8 md:px-14 md:py-10 text-center bg-white border-b border-gray-100">
                <p className="text-[14px] md:text-[15px] font-medium text-[#4a5552] leading-relaxed max-w-[95%] mx-auto whitespace-pre-wrap">
                  {portfolio.description}
                </p>
              </div>
            )}

            {/* Images and Titles */}
            {portfolio.items &&
              portfolio.items.map((item, index) => (
                <div key={index} className="flex flex-col border-b border-gray-100 last:border-0">
                  <div className="w-full bg-gray-50 flex justify-center">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title || "Portfolio media"}
                      className="w-full h-auto block object-contain max-h-[800px]"
                    />
                  </div>
                  {item.title && (
                    <div className="px-6 py-6 md:px-14 md:py-8 text-center bg-white">
                      <h3 className="text-[16px] md:text-[18px] font-bold text-[#202626]">
                        {item.title}
                      </h3>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Footer Stats Block */}
          <div className="w-full bg-white rounded-[24px] p-8 md:p-10 text-center shadow-xl flex flex-col items-center justify-center">
            <div className="flex justify-center mb-5">
              <FaHeart className="text-gray-400" size={24} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#202626] mb-5">
              Portfolio Title: {portfolio.title}
            </h2>
            <div className="flex items-center justify-center gap-6 text-gray-500 text-[13px] font-semibold mb-3">
              <div className="flex items-center gap-1.5">
                <FaHeart size={14} className="text-gray-400" />
                <span>{portfolio.likes >= 1000 ? (portfolio.likes/1000).toFixed(1)+'k' : portfolio.likes}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye size={16} className="text-gray-400" />
                <span>{portfolio.views >= 1000 ? (portfolio.views/1000).toFixed(1)+'k' : portfolio.views}</span>
              </div>
            </div>
            <p className="text-gray-400 text-[12px] font-medium">
              Published: {portfolio.publishedAt}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
