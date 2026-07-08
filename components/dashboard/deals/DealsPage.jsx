// "use client";
// import { useState, useRef, useEffect } from "react";
// import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
// import DealCard from "@/components/cards/DealCard";
// import { useGetDealsQuery } from "@/redux/api/services/dealApi";

// const STATUS_FILTERS = [
//   "All",
//   "Pending",
//   "In Progress",
//   "Delivery",
//   "Completed",
// ];

// // ─── Filter dropdown ──────────────────────────────────────────────────────────

// function FilterDropdown({ value, onChange }) {
//   const [open, setOpen] = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const h = e => {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   return (
//     <div ref={ref} className="relative">
//       <button
//         onClick={() => setOpen(v => !v)}
//         className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-black hover:border-primary/40 transition-colors"
//       >
//         <SlidersHorizontal size={14} className="text-gray" />
//         {value}
//         <ChevronDown size={13} className="text-gray" />
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-30">
//           {STATUS_FILTERS.map(f => (
//             <button
//               key={f}
//               onClick={() => {
//                 onChange(f);
//                 setOpen(false);
//               }}
//               className={`w-full text-left px-4 py-2 text-sm transition-colors
//                 ${
//                   value === f
//                     ? "text-primary font-semibold bg-primary/5"
//                     : "text-gray hover:bg-gray-50 hover:text-black"
//                 }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function DealsPage({ role }) {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const { data: dealData, isLoading } = useGetDealsQuery();

//   // const filtered = ALL_DEALS.filter(d => {
//   //   const matchSearch = d.person.toLowerCase().includes(search.toLowerCase());
//   //   const matchFilter = filter === "All" || d.status === filter;
//   //   return matchSearch && matchFilter;
//   // });

//   return (
//     <div className="space-y-6">
//       {/* ── Page heading ── */}
//       <div>
//         <h1 className="text-2xl font-bold text-black">Deals</h1>
//         <p className="text-sm text-gray mt-0.5">
//           <span className="text-primary font-medium">Dashboard</span>
//           {" / "}
//           <span>Deals</span>
//         </p>
//       </div>

//       {/* ── Toolbar ── */}
//       <div className="flex items-center justify-between gap-3 flex-wrap">
//         <h2 className="text-base font-semibold text-black">All Deal Offer</h2>

//         <div className="flex items-center gap-2">
//           {/* Search */}
//           <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-colors">
//             <Search size={14} className="text-gray shrink-0" />
//             <input
//               type="text"
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search in name"
//               className="bg-transparent text-sm text-black placeholder-gray/60 outline-none w-40"
//             />
//           </div>

//           {/* Filter */}
//           <FilterDropdown value={filter} onChange={setFilter} />
//         </div>
//       </div>

//       {/* ── Grid ── */}
//       {isLoading ? (
//         "Loading...."
//       ) : dealData?.data?.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//           {dealData?.data?.map(deal => (
//             <DealCard key={deal?.id} deal={deal} role={role} />
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-20 text-gray">
//           <p className="text-base font-medium">No deals found</p>
//           <p className="text-sm mt-1 text-gray/70">
//             Try adjusting your search or filter
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

// Previous
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import DealCard from "@/components/cards/DealCard";

// ─── Mock data ────────────────────────────────────────────────────────────────

const ALL_DEALS = [
  {
    id: 1,
    status: "Pending",
    person: "Lina Armand",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
  },
  {
    id: 2,
    status: "In Progress",
    person: "Arlene McCoy",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
  },
  {
    id: 3,
    status: "Delivery",
    person: "Cameron Williamson",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
  },
  {
    id: 4,
    status: "Extension",
    person: "Darrell Steward",
    extensionDate: "Feb 24, 2026",
    extensionMessage: "Here will be the message...",
    duration: "21 days",
  },
  {
    id: 5,
    status: "Completed",
    person: "Jerome Bell",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
  },
  {
    id: 6,
    status: "Delivery",
    person: "Leslie Alexander",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
  },
  {
    id: 7,
    status: "Completed",
    person: "Jerome Bell",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
  },
  {
    id: 8,
    status: "Extension",
    person: "Marvin McKinney",
    extensionDate: "May 24, 2026",
    extensionMessage: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    duration: "21 days",
  },
  {
    id: 9,
    status: "Completed",
    person: "Jerome Bell",
    date: "Feb 24, 2026",
    description: "I need a video Ads for my Cyberpunk 2077 Game lunching",
    netPayout: "SAR 4500",
    isRatingGiven: true,
  },
];

const STATUS_FILTERS = [
  "All",
  "Pending",
  "In Progress",
  "Delivery",
  "Completed",
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
        className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-black hover:border-primary/40 transition-colors"
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DealsPage({ role }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = ALL_DEALS.filter(d => {
    const matchSearch = d.person.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || d.status === filter;
    return matchSearch && matchFilter;
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
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(deal => (
            <DealCard key={deal.id} {...deal} role={role} />
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
    </div>
  );
}
