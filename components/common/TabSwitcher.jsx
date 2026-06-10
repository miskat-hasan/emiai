"use client";

export default function TabSwitcher({
  tabs = [],
  active,
  onChange,
  className = "",
}) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`
            px-5 py-2 rounded-xl text-sm font-medium transition-all duration-150
            ${
              active === tab.key
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm shadow-primary/30"
                : "bg-gradient-to-r from-primary/20 to-secondary/20 text-black hover:bg-primary/30 cursor-pointer"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
