"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  MinusCircle,
} from "lucide-react";
import Pagination from "@/components/common/Pagination";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK = [
  {
    id: 1,
    name: "Jenny Wilson",
    type: "Influencer",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 2,
    name: "Kristin Watson",
    type: "Advertiser",
    date: "19 Jun 2035",
    time: "8:31 PM",
    avatar: null,
  },
  {
    id: 3,
    name: "Wade Warren",
    type: "Influencer",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 4,
    name: "Cody Fisher",
    type: "Advertiser",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 5,
    name: "Dianne Russell",
    type: "Advertiser",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 6,
    name: "Courtney Henry",
    type: "Influencer",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 7,
    name: "Jerome Bell",
    type: "Advertising Agency",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 8,
    name: "Devon Lane",
    type: "Business Manager",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 9,
    name: "Leslie Alexander",
    type: "Advertising Agency",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
  {
    id: 10,
    name: "Floyd Miles",
    type: "Influencer",
    date: "19 Jun 2035",
    time: "8:35 PM",
    avatar: null,
  },
];

const SORT_OPTIONS = ["Name", "Type", "Date"];
const FILTER_OPTIONS = [
  "All",
  "Influencer",
  "Advertiser",
  "Advertising Agency",
  "Business Manager",
];

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, sortBy, sortDir }) {
  if (sortBy !== field)
    return <ChevronsUpDown size={12} className="text-gray-300" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} className="text-primary" />
  ) : (
    <ChevronDown size={12} className="text-primary" />
  );
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({ trigger, children }) {
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
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div className="absolute right-0 mt-1.5 min-w-[160px] bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-30">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlockPersonPage({ role }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [blocked, setBlocked] = useState(MOCK);

  const handleSort = field => {
    if (sortBy === field) setSortDir(d => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleUnblock = id => {
    setBlocked(prev => prev.filter(p => p.id !== id));
  };

  const filtered = blocked
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || p.type === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      const key = sortBy.toLowerCase();
      const cmp = (a[key] ?? "").localeCompare(b[key] ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const TH = ({ label, field }) => (
    <th
      className="px-4 py-3 text-left text-xs font-semibold text-[#63716E] cursor-pointer select-none whitespace-nowrap"
      onClick={() => field && handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        {field && <SortIcon field={field} sortBy={sortBy} sortDir={sortDir} />}
      </div>
    </th>
  );

  return (
    <div className="space-y-6 font-dm-sans">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-[#203430]">Block Person</h1>
        <p className="text-sm text-[#63716E] mt-0.5">
          <span className="text-primary font-medium">Dashboard</span> / Block
          Person
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 flex-wrap border-b border-gray-100">
          <h2 className="text-base font-semibold text-[#203430]">Block List</h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary/40 focus-within:bg-white transition-all">
              <Search size={14} className="text-[#63716E] shrink-0" />
              <input
                type="text"
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search"
                className="bg-transparent text-sm text-[#203430] placeholder:text-[#63716E]/60 outline-none w-36"
              />
            </div>

            {/* Filter */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#203430] hover:border-primary/40 transition-colors cursor-pointer">
                  <SlidersHorizontal size={13} className="text-[#63716E]" />
                  Filter
                  <ChevronDown size={12} className="text-[#63716E]" />
                </button>
              }
            >
              {close =>
                FILTER_OPTIONS.map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setFilter(f);
                      setPage(1);
                      close();
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${filter === f ? "text-primary font-semibold bg-primary/5" : "text-[#63716E] hover:bg-gray-50"}`}
                  >
                    {f}
                  </button>
                ))
              }
            </Dropdown>

            {/* Sort by */}
            <div className="flex items-center gap-2 text-sm text-[#63716E]">
              <span>Sort by:</span>
              <Dropdown
                trigger={
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[#203430] hover:border-primary/40 transition-colors cursor-pointer">
                    {sortBy}{" "}
                    <ChevronDown size={12} className="text-[#63716E]" />
                  </button>
                }
              >
                {close =>
                  SORT_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setSortBy(s);
                        setSortDir("asc");
                        setPage(1);
                        close();
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortBy === s ? "text-primary font-semibold bg-primary/5" : "text-[#63716E] hover:bg-gray-50"}`}
                    >
                      {s}
                    </button>
                  ))
                }
              </Dropdown>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                <TH label="Name" field="name" />
                <TH label="Type" field="type" />
                <TH label="Date" field="date" />
                <TH label="Time" />
                <TH label="Action" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-[#63716E]"
                  >
                    No blocked users found
                  </td>
                </tr>
              ) : (
                paged.map(p => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden shrink-0 flex items-center justify-center">
                          {p.avatar ? (
                            <Image
                              src={p.avatar}
                              alt={p.name}
                              width={36}
                              height={36}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-white text-xs font-bold">
                              {p.name[0]}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-[#203430]">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#63716E]">
                      {p.type}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#63716E]">
                      {p.date}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#63716E]">
                      {p.time}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUnblock(p.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-[#63716E] hover:text-red-500 text-sm font-medium transition-colors border border-gray-200 hover:border-red-200 cursor-pointer"
                      >
                        <MinusCircle size={14} />
                        Unblock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            perPage={perPage}
            onPerPageChange={n => {
              setPerPage(n);
              setPage(1);
            }}
            totalResults={filtered.length}
          />
        </div>
      </div>
    </div>
  );
}
