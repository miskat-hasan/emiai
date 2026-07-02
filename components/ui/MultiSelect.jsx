"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const MultiSelect = ({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value = [],
  isLoading,
  onChange,
  className,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selected = Array.isArray(value) ? value.map(String) : [];

  const toggle = optId => {
    const strId = String(optId);

    const next = selected.includes(strId)
      ? selected.filter(v => v !== strId)
      : [...selected, strId];

    onChange(next);
  };

  const removeItem = (optId, e) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== String(optId)));
  };

  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setSearch("");
    }
  }, [open]);

  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const getLabel = opt =>
    opt.name ??
    opt.training_center_name ??
    opt.company ??
    opt.course_name ??
    opt.title ??
    `${opt.first_name ?? ""} ${opt.last_name ?? ""}`.trim();

  const filteredOptions = options.filter(opt =>
    getLabel(opt).toLowerCase().includes(search.toLowerCase()),
  );

  const selectedOptions = options.filter(o => selected.includes(String(o.id)));

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col gap-2 w-full ${className || ""}`}
    >
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-black">
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen(prev => !prev)}
        className={`relative w-full min-h-[46px] rounded-xl bg-gray-100 border px-4 py-2.5 cursor-pointer flex items-center justify-between transition-all
        ${
          error
            ? "border-red-500"
            : open
              ? "border-primary/40 bg-white ring-2 ring-primary/10"
              : "border-transparent hover:bg-gray-50"
        }`}
      >
        <span
          className={`text-sm ${selected.length ? "text-black" : "text-gray"}`}
        >
          {selected.length
            ? `${selected.length} item${
                selected.length > 1 ? "s" : ""
              } selected`
            : placeholder}
        </span>

        <FaChevronDown
          className={`text-gray transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          size={14}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 left-0 w-full z-50">
          <div className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                placeholder="Search..."
                className="w-full rounded-lg bg-gray-100 border border-transparent px-3 py-2 text-sm text-black placeholder:text-gray/60 outline-none focus:border-primary/40 focus:bg-white transition-all"
              />
            </div>

            {/* Options */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-4 text-sm text-gray">Loading...</div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-4 py-4 text-sm text-gray">
                  {search ? "No results found" : "No options available"}
                </div>
              ) : (
                filteredOptions.map(opt => {
                  const isSelected = selected.includes(String(opt.id));

                  return (
                    <div
                      key={opt.id}
                      onClick={e => {
                        e.stopPropagation();
                        toggle(opt.id);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-all
                        ${
                          isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-black hover:bg-gray-50"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all
                          ${
                            isSelected
                              ? "bg-primary border-primary"
                              : "bg-white border-gray-300"
                          }`}
                      >
                        {isSelected && (
                          <svg
                            viewBox="0 0 10 8"
                            className="w-3 h-3"
                            fill="none"
                          >
                            <path
                              d="M1 4L3.8 7L9 1"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      <span>{getLabel(opt)}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {selected.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
                <span className="text-xs text-gray">
                  {selected.length} selected
                </span>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                  className="text-xs font-medium text-primary hover:opacity-80 transition cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected Items */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {selectedOptions.map(opt => (
            <span
              key={opt.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-medium"
            >
              {getLabel(opt)}

              <FaTimes
                className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100 hover:text-red-500 transition"
                onClick={e => removeItem(opt.id, e)}
              />
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelect;
