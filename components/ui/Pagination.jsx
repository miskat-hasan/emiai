"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  perPage = 10,
  onPerPageChange,
  totalResults = 0,
}) {
  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 mt-4 border-t border-gray-100">
      {/* Per-page selector + results count */}
      <div className="flex items-center gap-2 text-sm text-gray order-2 sm:order-1">
        <span>Show</span>
        <div className="relative">
          <select
            value={perPage}
            onChange={e => onPerPageChange?.(Number(e.target.value))}
            className="appearance-none bg-gray-100 border border-transparent rounded-lg pl-3 pr-7 py-1.5 text-sm text-black font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all cursor-pointer"
          >
            {[12, 24, 48].map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray text-[10px]">
            ▾
          </span>
        </div>
        <span className="whitespace-nowrap">
          of <span className="font-semibold text-black">{totalResults}</span>{" "}
          results
        </span>
      </div>

      {/* Page buttons */}
      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <NavBtn
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </NavBtn>

        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-8 h-8 flex items-center justify-center text-sm text-gray/70"
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
        </div>

        <NavBtn
          onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </NavBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center transition-all cursor-pointer
        ${
          active
            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm shadow-primary/30 scale-100"
            : "text-gray hover:bg-gray-100 hover:text-black"
        }
      `}
    >
      {children}
    </button>
  );
}

function NavBtn({ children, disabled, onClick, "aria-label": ariaLabel }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-8 h-8 rounded-full flex items-center justify-center border transition-all
        ${
          disabled
            ? "border-gray-100 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray hover:border-primary/40 hover:text-primary hover:bg-primary/5 cursor-pointer"
        }
      `}
    >
      {children}
    </button>
  );
}

function buildPageList(current, total) {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [1];
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
