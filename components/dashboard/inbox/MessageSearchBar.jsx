"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import { useGetMessagesQuery } from "@/redux/api/services/chatApi";

export default function MessageSearchBar({
  conversationId,
  open,
  onClose,
  onJumpToMessage,
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      setQuery("");
      setDebouncedQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const { data, isFetching } = useGetMessagesQuery(
    { conversationId, q: debouncedQuery || undefined },
    { skip: !open || !conversationId || !debouncedQuery },
  );

  const results = data?.data ?? [];

  useEffect(() => setActiveIndex(0), [debouncedQuery]);

  useEffect(() => {
    if (results.length > 0) onJumpToMessage?.(results[activeIndex]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, results.length]);

  if (!open) return null;

  const goPrev = () =>
    setActiveIndex(i => (i === 0 ? results.length - 1 : i - 1));
  const goNext = () =>
    setActiveIndex(i => (i === results.length - 1 ? 0 : i + 1));

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-50/50 bg-white shrink-0">
      <Search size={16} className="text-gray-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search in conversation..."
        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
        onKeyDown={e => {
          if (e.key === "Enter") e.shiftKey ? goPrev() : goNext();
          if (e.key === "Escape") onClose();
        }}
      />

      {debouncedQuery && !isFetching && (
        <span className="text-xs text-gray-400 shrink-0">
          {results.length > 0
            ? `${activeIndex + 1}/${results.length}`
            : "No results"}
        </span>
      )}
      {isFetching && (
        <span className="text-xs text-gray-400 shrink-0">Searching...</span>
      )}

      {results.length > 1 && (
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={goPrev}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={goNext}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 cursor-pointer shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
