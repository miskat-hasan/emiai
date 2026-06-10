"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import PortfolioBookmarkCard from "@/components/cards/PortfolioBookmarkCard";
import EventBookmarkCard from "@/components/cards/EventBookmarkCard";
import MessageBookmarkCard from "@/components/cards/MessageBookmarkCard";
import Pagination from "@/components/common/Pagination";

// ─── Filter options ───────────────────────────────────────────────────────────

const FILTERS = ["Portfolio", "Events", "Message"];

// ─── Mock data ────────────────────────────────────────────────────────────────

const PORTFOLIO_DATA = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: i % 3 === 3 ? "Mobile Ads Portfolio" : "Bike Ads Portfolio",
  details: "Hello this is about my por...",
  likes: "23k",
  views: "23k",
  bookmarked: true,
  image: null,
}));

const EVENT_DATA = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "Digital Marketing Forum 2025",
  description: "Hello this is about my portfolio",
  organizer: "Event CO.",
  date: "Feb 17, 2026",
  bookmarked: true,
  image: null,
}));

const MESSAGE_DATA = [
  {
    id: 1,
    initials: "HR",
    avatarBg: "bg-teal-700",
    threadLabel: "Group Chat",
    senderName: "Esther Howard",
    time: "03:11 PM",
    preview:
      "Hi there, I'm interested in learning more about the company's privacy policy. Can you direct...",
    bookmarked: true,
  },
  {
    id: 2,
    avatar: null,
    initials: "JB",
    avatarBg: "bg-gray-500",
    senderName: "Jerome Bell",
    time: "09:40 AM",
    preview:
      "Hey there, I received an email from your company about a promotion. Can you give m...",
    bookmarked: true,
  },
  {
    id: 3,
    initials: "HR",
    avatarBg: "bg-teal-700",
    threadLabel: "Group Chat",
    senderName: "Esther Howard",
    time: "03:11 PM",
    preview:
      "Hi there, I'm interested in learning more about the company's privacy policy. Can you direct...",
    bookmarked: true,
  },
  {
    id: 4,
    initials: "KM",
    avatarBg: "bg-blue-500",
    senderName: "Kathryn Murphy",
    time: "09:40 AM",
    preview:
      "Hey there, I received an email from your company about a promotion. Can you give m...",
    bookmarked: true,
  },
  {
    id: 5,
    initials: "RE",
    avatarBg: "bg-gray-600",
    senderName: "Ralph Edwards",
    time: "09:40 AM",
    preview:
      "Hey there, I received an email from your company about a promotion. Can you give m...",
    bookmarked: true,
  },
  {
    id: 6,
    initials: "DR",
    avatarBg: "bg-pink-500",
    senderName: "Dianne Russell",
    time: "09:40 AM",
    preview:
      "Hey there, I received an email from your company about a promotion. Can you give m...",
    bookmarked: true,
  },
  {
    id: 7,
    initials: "HR",
    avatarBg: "bg-teal-700",
    threadLabel: "Group Chat",
    senderName: "Esther Howard",
    time: "03:11 PM",
    preview:
      "Hi there, I'm interested in learning more about the company's privacy policy. Can you direct...",
    bookmarked: true,
  },
  {
    id: 8,
    initials: "KW",
    avatarBg: "bg-rose-400",
    senderName: "Kristin Watson",
    time: "09:40 AM",
    preview:
      "Hey there, I received an email from your company about a promotion. Can you give m...",
    bookmarked: true,
  },
  {
    id: 9,
    initials: "HR",
    avatarBg: "bg-teal-700",
    threadLabel: "Group Chat",
    senderName: "Esther Howard",
    time: "03:11 PM",
    preview:
      "Hi there, I'm interested in learning more about the company's privacy policy. Can you direct...",
    bookmarked: true,
  },
];

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
        className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-black hover:border-primary/40 transition-colors"
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
              className={`w-full text-left px-4 py-2 text-sm transition-colors
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

function PortfolioGrid({ items, onToggle }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <PortfolioBookmarkCard
          key={item.id}
          {...item}
          onBookmark={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}

function EventGrid({ items, onToggle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <EventBookmarkCard
          key={item.id}
          {...item}
          onBookmark={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}

function MessageList({ items, onToggle }) {
  // Split into 3 equal columns like the screenshot
  const col1 = items.filter((_, i) => i % 3 === 0);
  const col2 = items.filter((_, i) => i % 3 === 1);
  const col3 = items.filter((_, i) => i % 3 === 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
      {[col1, col2, col3].map((col, ci) => (
        <div key={ci} className="divide-y divide-gray-100">
          {col.map(item => (
            <MessageBookmarkCard
              key={item.id}
              {...item}
              onBookmark={() => onToggle(item.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AllBookmarkPage() {
  const [filter, setFilter] = useState("Portfolio");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Local bookmark toggle state
  const [portfolioItems, setPortfolioItems] = useState(PORTFOLIO_DATA);
  const [eventItems, setEventItems] = useState(EVENT_DATA);
  const [messageItems, setMessageItems] = useState(MESSAGE_DATA);

  const togglePortfolio = id =>
    setPortfolioItems(prev =>
      prev.map(i => (i.id === id ? { ...i, bookmarked: !i.bookmarked } : i)),
    );
  const toggleEvent = id =>
    setEventItems(prev =>
      prev.map(i => (i.id === id ? { ...i, bookmarked: !i.bookmarked } : i)),
    );
  const toggleMessage = id =>
    setMessageItems(prev =>
      prev.map(i => (i.id === id ? { ...i, bookmarked: !i.bookmarked } : i)),
    );

  // Reset page when filter changes
  const handleFilterChange = f => {
    setFilter(f);
    setPage(1);
    setSearch("");
  };

  return (
    <div className="space-y-6">
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
              placeholder="Search in name"
              className="bg-transparent text-sm text-black placeholder-gray/60 outline-none w-40"
            />
          </div>

          {/* Filter dropdown */}
          <FilterDropdown value={filter} onChange={handleFilterChange} />
        </div>
      </div>

      {/* Content */}
      {filter === "Portfolio" && (
        <PortfolioGrid items={portfolioItems} onToggle={togglePortfolio} />
      )}
      {filter === "Events" && (
        <EventGrid items={eventItems} onToggle={toggleEvent} />
      )}
      {filter === "Message" && (
        <MessageList items={messageItems} onToggle={toggleMessage} />
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={8}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        totalResults={80}
      />
    </div>
  );
}
