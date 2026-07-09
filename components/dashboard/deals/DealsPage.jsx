"use client";
import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import DealCard from "@/components/cards/DealCard";
import { useGetDealsQuery } from "@/redux/api/services/dealApi";
import { DealCardSkeleton } from "@/components/common/Skeleton";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Active",
  "Completed",
  "Rejected",
  "Delivered",
];

// ─── Filter dropdown ──────────────────────────────────────────────────────────
function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
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
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => {
                onChange(f);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 cursor-pointer text-sm transition-colors
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsPage({ role }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("");
  const [filter, setFilter] = useState("All");
  const { data: dealData, isFetching } = useGetDealsQuery({
    page,
    search,
    status: filter?.includes("All") ? "" : filter.toLocaleLowerCase(),
  });

  return (
    <div className="space-y-6">
      {/* ── Page heading ── */}
      <div>
        <h1 className="text-2xl font-bold text-black">Deals</h1>
        <p className="text-sm text-gray mt-0.5">
          <span className="text-primary font-medium">Dashboard</span>
          {" / "}
          <span>Deals</span>
        </p>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-base font-semibold text-black">All Deal Offer</h2>

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

          {/* Filter */}
          <FilterDropdown value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* ── Grid ── */}
      {isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 })?.map((_, idx) => (
            <DealCardSkeleton key={idx} />
          ))}
        </div>
      ) : dealData?.data?.data?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {dealData?.data?.data?.map(deal => (
            <DealCard key={deal?.id} deal={deal} role={role} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray">
          <p className="text-base font-medium">No deals found</p>
          <p className="text-sm mt-1 text-gray/70">
            Try adjusting your search or filter
          </p>
        </div>
      )}

      {!isFetching && (
        <div className="py-8 flex justify-center items-center gap-2 flex-wrap">
          {dealData?.data?.links?.map((item, idx) => (
            <button
              key={idx}
              disabled={!item.url}
              dangerouslySetInnerHTML={{ __html: item.label }}
              onClick={() => item.url && setPage(item.url.split("=")[1])}
              className={`px-3 py-1 rounded border border-gray-200 transition-all duration-200 ${item.active ? "bg-primary text-white" : "bg-white text-gray-700"} ${!item.url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
