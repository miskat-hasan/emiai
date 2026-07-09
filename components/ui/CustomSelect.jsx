"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Check, Search } from "lucide-react";

const CustomSelect = ({
  id,
  label,
  placeholder = "Select...",
  options = [],
  value,
  onChange,
  search = false,
  clearable = false,
  valueKey = "value",
  labelKey = "label",
  isLoading = false,
  disabled = false,
  error,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const optionRefs = useRef([]);

  const listboxId = `${id ?? "select"}-listbox`;

  const getLabel = opt => opt?.[labelKey] ?? "";
  const getValue = opt => opt?.[valueKey];

  const filteredOptions = search
    ? options.filter(opt =>
        getLabel(opt).toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  const selectedOption = options.find(
    opt => String(getValue(opt)) === String(value),
  );

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // On open: focus search (or keep trigger focused), highlight the selected item
  useEffect(() => {
    if (open) {
      const selectedIdx = filteredOptions.findIndex(
        opt => String(getValue(opt)) === String(value),
      );
      setHighlightedIndex(selectedIdx >= 0 ? selectedIdx : 0);

      if (search) {
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    } else {
      setQuery("");
      setHighlightedIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep highlighted option scrolled into view
  useEffect(() => {
    if (open && highlightedIndex >= 0) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex, open]);

  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const selectOption = opt => {
    const optValue = getValue(opt);
    const isSameAsSelected = String(optValue) === String(value);

    if (isSameAsSelected && clearable) {
      onChange?.("");
    } else {
      onChange?.(optValue);
    }
    closeAndRefocus();
  };

  const handleTriggerKeyDown = e => {
    if (disabled) return;

    if (!open && ["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(i => Math.min(i + 1, filteredOptions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(i => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(filteredOptions.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        closeAndRefocus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col gap-1.5 w-full ${className || ""}`}
    >
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-black">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger — real <button> for native focus/keyboard support */}
        <button
          id={id}
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => setOpen(prev => !prev)}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          className={`relative w-full min-h-[46px] rounded-xl bg-gray-100 border px-4 py-2.5 flex items-center justify-between transition-all text-left
            ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
            ${
              error
                ? "border-red-500"
                : open
                  ? "border-primary/40 bg-white ring-0 ring-primary/10"
                  : "border-transparent hover:bg-gray-50"
            }`}
        >
          {search && open ? (
            <span className="flex items-center gap-2 w-full">
              <Search size={14} className="text-gray shrink-0" />
              <input
                ref={searchRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleTriggerKeyDown}
                placeholder={
                  selectedOption ? getLabel(selectedOption) : placeholder
                }
                className="w-full bg-transparent outline-none text-sm text-black placeholder:text-gray/60"
              />
            </span>
          ) : (
            <span
              className={`text-sm truncate ${
                selectedOption ? "text-black" : "text-gray/60"
              }`}
            >
              {selectedOption ? getLabel(selectedOption) : placeholder}
            </span>
          )}

          <FaChevronDown
            size={13}
            className={`text-gray shrink-0 ml-2 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        {open && !disabled && (
          <div className="absolute top-full mt-2 left-0 w-full z-50">
            <div className="rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              <ul
                ref={listRef}
                id={listboxId}
                role="listbox"
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `${listboxId}-opt-${highlightedIndex}`
                    : undefined
                }
                className="max-h-60 overflow-y-auto py-2"
              >
                {isLoading ? (
                  <li className="px-4 py-4 text-sm text-gray">Loading...</li>
                ) : filteredOptions.length === 0 ? (
                  <li className="px-4 py-4 text-sm text-gray">
                    {query ? "No results found" : "No options available"}
                  </li>
                ) : (
                  filteredOptions.map((opt, i) => {
                    const isSelected = String(getValue(opt)) === String(value);
                    const isHighlighted = i === highlightedIndex;

                    return (
                      <li
                        key={getValue(opt)}
                        id={`${listboxId}-opt-${i}`}
                        role="option"
                        aria-selected={isSelected}
                        ref={el => (optionRefs.current[i] = el)}
                        onMouseEnter={() => setHighlightedIndex(i)}
                        onClick={() => selectOption(opt)}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2
                          ${
                            isSelected
                              ? "text-primary font-medium"
                              : "text-black"
                          }
                          ${isHighlighted ? "bg-gray-50" : ""}
                          ${isSelected && isHighlighted ? "bg-primary/10" : ""}
                          ${isSelected && !isHighlighted ? "bg-primary/5" : ""}
                        `}
                      >
                        <span className="truncate">{getLabel(opt)}</span>
                        {isSelected && (
                          <Check size={14} className="text-primary shrink-0" />
                        )}
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default CustomSelect;
