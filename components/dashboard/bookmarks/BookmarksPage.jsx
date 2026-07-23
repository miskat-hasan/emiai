"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import PortfolioBookmarkCard from "@/components/cards/PortfolioBookmarkCard";
import EventBookmarkCard from "@/components/cards/EventBookmarkCard";
import AdCard from "@/components/dashboard/ads/AdCard";
import AdCardSkeleton from "@/components/dashboard/ads/AdCardSkeleton";
import Pagination from "@/components/ui/Pagination";
import {
  useToggleBookmarkMutation,
  useGetBookmarksQuery,
} from "@/redux/api/services/bookmarkApi";
import { getImageUrl } from "@/helper/getImageUrl";
import PortfolioDetailsModal from "@/app/dashboard/influencer/portfolio/components/PortfolioDetailsModal";
import { useSelector } from "react-redux";

// ─── Filter options ───────────────────────────────────────────────────────────

const FILTERS = ["Portfolio", "Events", "Ads"];

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-black hover:border-primary/40 transition-colors cursor-pointer"
      >
        <SlidersHorizontal size={14} className="text-gray" />
        {value}
        <ChevronDown size={13} className="text-gray" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-30">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => {
                onChange(f);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer
                ${
                  value === f
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-gray hover:bg-gray-50 hover:text-black"
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Grid layouts per filter ──────────────────────────────────────────────────

function PortfolioGrid({ items, onToggle, onPortfolioClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray text-sm py-10 text-center w-full">
        No portfolio bookmarks found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => {
        const pf = item.bookmarkable || item.item || item;

        let imageUrl = pf.image || pf.photo || pf.imageUrl || pf.media_url || pf.media?.[0]?.media_url;
        imageUrl = getImageUrl(imageUrl);

        return (
          <PortfolioBookmarkCard
            key={pf.id}
            image={imageUrl}
            title={pf.title || "Portfolio"}
            details={pf.details || pf.description || "Portfolio Details"}
            likes={pf.likes || "0"}
            views={pf.views || "0"}
            bookmarked={true}
            onBookmark={() => onToggle(pf.id)}
            onClick={() => onPortfolioClick?.(pf.id)}
          />
        );
      })}
    </div>
  );
}

function EventGrid({ items, onToggle, onEventClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray text-sm py-10 text-center w-full">
        No event bookmarks found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => {
        const ev = item.bookmarkable || item.item || item;

        let imageUrl = ev.photo || ev.image || ev.imageUrl || ev.media_url || ev.media?.[0]?.media_url;
        imageUrl = getImageUrl(imageUrl);

        return (
          <EventBookmarkCard
            key={ev.id}
            image={imageUrl}
            title={ev.title || "Event Title"}
            description={ev.description || "Event Description"}
            organizer={
              ev.organizer ||
              ev.event_sponsorships?.[0]?.sponsor?.name ||
              "Event CO."
            }
            date={ev.date || ev.start_date || "Event Date"}
            bookmarked={true}
            onBookmark={() => onToggle(ev.id)}
            onClick={() => onEventClick?.(ev.id)}
          />
        );
      })}
    </div>
  );
}

function AdGrid({ items, onToggle, onAdClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-gray text-sm py-10 text-center w-full">
        No ad bookmarks found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map(item => {
        const ad = item.bookmarkable || item.item || item;

        let imageUrl = ad.media_url || ad.imageUrl || ad.media?.[0]?.media_url;
        imageUrl = getImageUrl(imageUrl);
        let mediaType = ad.media_type || ad.mediaType;

        if (!mediaType && imageUrl) {
          if (imageUrl.match(/\.(mp4|webm|mov|ogg)(\?.*)?$/i)) {
            mediaType = "video";
          } else {
            mediaType = "image";
          }
        }

        return (
          <AdCard
            key={ad.id}
            imageUrl={imageUrl}
            mediaType={mediaType}
            userName={ad.userName || "Advertiser " + (ad.advertiser_id || "1")}
            userAvatar={
              ad.userAvatar ||
              "https://i.pravatar.cc/150?u=" + (ad.advertiser_id || "1")
            }
            description={ad.description}
            timeAgo={ad.timeAgo || ""}
            isBookmarked={true}
            status={ad.status || "active"}
            publishAt={ad.publish_at || ad.publishAt}
            onBookmarkToggle={() => onToggle(ad.id)}
            onClick={() => onAdClick(ad)}
          />
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BookmarksPage({ role }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth?.user);
  const [filter, setFilter] = useState("Ads");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  
  const [selectedPortfolioId, setSelectedPortfolioId] = useState(null);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);

  const typeMap = {
    Portfolio: "portfolio",
    Events: "event",
    Ads: "ad",
  };

  const {
    data: responseData,
    isLoading,
    isError,
  } = useGetBookmarksQuery(typeMap[filter]);
  const [toggleBookmark] = useToggleBookmarkMutation();

  let rawItems = [];
  if (Array.isArray(responseData)) rawItems = responseData;
  else if (Array.isArray(responseData?.data)) rawItems = responseData.data;
  else if (Array.isArray(responseData?.data?.data))
    rawItems = responseData.data.data;

  // Optimistic tracking for unbookmarked items
  const [unbookmarkedIds, setUnbookmarkedIds] = useState([]);

  // Filter out items that were just unbookmarked, and filter by search
  const visibleItems = rawItems.filter(item => {
    const id = item.bookmarkable?.id || item.item?.id || item.id;
    if (unbookmarkedIds.includes(id)) return false;

    // basic search filtering
    if (search) {
      const title = item.bookmarkable?.title || item.item?.title || item.title || "";
      const desc = item.bookmarkable?.description || item.item?.description || item.description || "";
      const s = search.toLowerCase();
      if (!title.toLowerCase().includes(s) && !desc.toLowerCase().includes(s)) {
        return false;
      }
    }
    return true;
  });

  const handleToggle = async (id, type) => {
    // Optimistic UI hide
    setUnbookmarkedIds(prev => [...prev, id]);
    try {
      await toggleBookmark({ id, type }).unwrap();
    } catch (err) {
      // Revert on error
      setUnbookmarkedIds(prev => prev.filter(bId => bId !== id));
    }
  };

  // Reset page & clear optimistic state when filter changes
  const handleFilterChange = f => {
    setFilter(f);
    setPage(1);
    setSearch("");
    setUnbookmarkedIds([]);
  };

  const handleAdClick = ad => {
    if (ad.status !== "scheduled") {
      router.push(`/dashboard/${role}/ads/${ad.id}`);
    }
  };

  const handleEventClick = (id) => {
    router.push(`/dashboard/${role}/events/${id}`);
  };

  const handlePortfolioClick = (id) => {
    setSelectedPortfolioId(id);
    setPortfolioModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-black">All Bookmark</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>All Bookmark</span>
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-black">Bookmark</h2>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-colors">
            <Search size={14} className="text-gray shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent text-sm text-black placeholder-gray/60 outline-none w-40"
            />
          </div>

          {/* Filter dropdown */}
          <FilterDropdown value={filter} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        filter === "Ads" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <AdCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="py-10 text-center text-gray animate-pulse">
            Loading bookmarks...
          </div>
        )
      ) : isError ? (
        <div className="py-10 text-center text-red-500">
          Failed to load bookmarks.
        </div>
      ) : (
        <>
          {filter === "Portfolio" && (
            <PortfolioGrid
              items={visibleItems}
              onToggle={id => handleToggle(id, typeMap.Portfolio)}
              onPortfolioClick={handlePortfolioClick}
            />
          )}
          {filter === "Events" && (
            <EventGrid
              items={visibleItems}
              onToggle={id => handleToggle(id, typeMap.Events)}
              onEventClick={handleEventClick}
            />
          )}
          {filter === "Ads" && (
            <AdGrid
              items={visibleItems}
              onToggle={id => handleToggle(id, "ad")}
              onAdClick={handleAdClick}
            />
          )}
        </>
      )}

      {/* Pagination */}
      <div className="mt-auto pt-6">
        {visibleItems.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={8}
            onPageChange={setPage}
            perPage={perPage}
            onPerPageChange={setPerPage}
            totalResults={80}
          />
        )}
      </div>
      <PortfolioDetailsModal
        open={portfolioModalOpen}
        onClose={() => setPortfolioModalOpen(false)}
        portfolioId={selectedPortfolioId}
        user={{
          name: user?.name ?? "User",
          role: user?.role ?? "Influencer",
          avatar: user?.avatar ?? "",
        }}
      />
    </div>
  );
}
