"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination
 * Props:
 *  - currentPage: number
 *  - totalPages: number
 *  - onPageChange: (page: number) => void
 *  - perPage: number
 *  - onPerPageChange: (n: number) => void
 *  - totalResults: number
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 8,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  totalResults = 80,
}) {
  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
      {/* Per-page selector */}
      <div className="flex items-center gap-2 text-sm text-gray">
        <span>Show</span>
        <div className="relative">
          <select
            value={perPage}
            onChange={e => onPerPageChange?.(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-1.5 text-sm text-black font-medium focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            {[10, 20, 50].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray text-xs">
            ▾
          </span>
        </div>
        <span>of {totalResults} results</span>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <PageBtn
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={14} />
        </PageBtn>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 text-center text-sm text-gray"
            >
              …
            </span>
          ) : (
            <PageBtn
              key={p}
              active={p === currentPage}
              onClick={() => onPageChange?.(p)}
            >
              {p}
            </PageBtn>
          ),
        )}

        <PageBtn
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={14} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-8 h-8 rounded-lg text-sm font-medium flex items-center justify-center transition-colors
        ${active ? "bg-primary text-white shadow-sm shadow-primary/30" : ""}
        ${!active && !disabled ? "text-gray hover:bg-gray-100" : ""}
        ${disabled ? "text-gray-300 cursor-not-allowed" : ""}
      `}
    >
      {children}
    </button>
  );
}

function buildPageList(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}
