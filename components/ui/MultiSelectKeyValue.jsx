"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";

const MultiSelectKeyValue = ({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value = [],
  valueKey = "value",
  valuePlaceholder = "Value",
  valueType = "text",
  hideValueForIds = [],
  isLoading,
  onChange,
  className,
  error,
  onSearchChange,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selectedIds = Array.isArray(value) ? value.map(v => String(v.id)) : [];

  const toggle = optId => {
    const strId = String(optId);

    if (selectedIds.includes(strId)) {
      onChange(value.filter(v => String(v.id) !== strId));
    } else {
      const isHidden = hideValueForIds.includes(strId);
      onChange([...(value || []), { id: strId, [valueKey]: isHidden ? "0" : "" }]);
    }
  };

  const removeItem = (optId, e) => {
    e.stopPropagation();
    onChange(value.filter(v => String(v.id) !== String(optId)));
  };

  const updateItemValue = (optId, newValue) => {
    onChange(
      value.map(v =>
        String(v.id) === String(optId) ? { ...v, [valueKey]: newValue } : v
      )
    );
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

  const selectedOptions = options.filter(o => selectedIds.includes(String(o.id)));
  const allSelected =
    options.length > 0 && selectedOptions.length === options.length;

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
      <div className="relative">
        {/* Trigger */}
        <div
          onClick={() => {
            setOpen(true);
            searchRef.current?.focus();
          }}
          className={`relative w-full min-h-[46px] rounded-xl bg-gray-100 border px-4 py-2.5 cursor-text flex items-center justify-between transition-all
        ${
          error
            ? "border-red-500"
            : open
              ? "border-primary/40 bg-white ring-2 ring-primary/10"
              : "border-transparent hover:bg-gray-50"
        }`}
        >
          <input
            ref={searchRef}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
              if (!open) setOpen(true);
            }}
            placeholder={
              selectedIds.length
                ? `${selectedIds.length} item${selectedIds.length > 1 ? "s" : ""} selected`
                : placeholder
            }
            className="w-full bg-transparent outline-none text-sm text-black placeholder:text-gray/60"
          />

          <FaChevronDown
            onClick={e => {
              e.stopPropagation();
              setOpen(prev => !prev);
            }}
            className={`text-gray transition-transform duration-200 cursor-pointer ${
              open ? "rotate-180" : ""
            }`}
            size={14}
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute top-full mt-2 left-0 w-full z-50">
            <div className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              {/* Options */}
              <div className="max-h-60 overflow-y-auto py-2">
                {isLoading ? (
                  <div className="px-4 py-4 text-sm text-gray">Loading...</div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-gray">
                    {search ? "No results found" : "No options available"}
                  </div>
                ) : (
                  filteredOptions.map(opt => {
                    const isSelected = selectedIds.includes(String(opt.id));

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
              {options.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
                  <span className="text-xs text-gray">
                    {selectedIds.length} selected
                  </span>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        const currentIds = selectedIds;
                        const newItems = options
                          .filter(o => !currentIds.includes(String(o.id)))
                          .map(o => {
                            const isHidden = hideValueForIds.includes(String(o.id));
                            return { id: String(o.id), [valueKey]: isHidden ? "0" : "" };
                          });
                        onChange([...(value || []), ...newItems]);
                      }}
                      className="text-xs font-medium text-black hover:text-primary transition cursor-pointer"
                    >
                      Select All
                    </button>
                    {selectedIds.length > 0 && (
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
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Items with Value Input */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {selectedOptions.map(opt => {
            const itemValue = value.find(v => String(v.id) === String(opt.id))?.[valueKey] || "";
            return (
              <div
                key={opt.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 text-sm"
              >
                <span className="font-medium text-black">{getLabel(opt)}</span>
                
                <div className="flex items-center gap-3">
                  {!hideValueForIds.includes(String(opt.id)) && (
                    <input
                      type={valueType}
                      placeholder={valuePlaceholder}
                      value={itemValue}
                      onChange={e => updateItemValue(opt.id, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="w-32 px-3 py-1.5 text-sm rounded-lg bg-white border border-gray-300 text-black outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                  )}
                  <FaTimes
                    className="w-3.5 h-3.5 cursor-pointer opacity-60 hover:opacity-100 hover:text-red-500 transition-colors"
                    onClick={e => removeItem(opt.id, e)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelectKeyValue;
