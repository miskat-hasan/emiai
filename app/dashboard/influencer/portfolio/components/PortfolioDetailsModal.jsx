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
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
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
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/90 p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 absolute" />
            <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-white animate-spin absolute" />
            <Image src="/logo.png" alt="Logo" width={22} height={22} className="object-contain z-10 brightness-0 invert" />
          </div>
          <span className="text-white/70 text-sm font-medium tracking-widest uppercase">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!rawPortfolio) return null;

  const portfolio = {
    id: rawPortfolio.id,
    title: rawPortfolio.title,
    likes: rawPortfolio.likes_count ?? 0,
    views: rawPortfolio.views_count ?? 0,
    publishedAt: formatDate(rawPortfolio.created_at),
    items: (rawPortfolio.media || []).map((m) => ({
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000000]/90 p-4 no-scrollbar">
      <div className="relative w-full max-w-[800px] bg-[#000000]/50 p-6 sm:py-8 sm:pl-14 pr-8 overflow-y-auto max-h-[90vh]">
        {/* Top-right action buttons */}
        <div className="absolute top-6 left-2 flex flex-col items-center gap-4 z-50">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {user?.avatar ? (
              <Image
                src={getImageUrl(user.avatar)}
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
          <button 
            onClick={handleBookmark}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkFilledSVG2 className="w-10 h-10 text-primary" />
            ) : (
              <BookmarkSVG className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Share */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <ShareSVG className="w-5 h-5 text-gray-400" />
          </button>

          {/* Email */}
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors">
            <MailSVG className="w-5 h-5 text-gray-400" />
          </button>

          {/* Edit */}
          {onEdit && (
            <button
              onClick={() => onEdit(rawPortfolio)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
              title="Edit Portfolio"
            >
              <Pencil size={18} className="text-gray-400" />
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
              <HeartSVG2 className="w-5 h-5 text-gray-400" />
            )}
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
                    src={getImageUrl(item.image)}
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
                      src={getImageUrl(gallery.avatar)}
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
                    src={getImageUrl(img)}
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
