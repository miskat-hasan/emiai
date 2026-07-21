const STATUS_STYLES = {
  pending: "bg-[#FEF3C7] text-[#D97706]",
  accepted: "bg-blue-50 text-blue-500",
  active: "bg-blue-50 text-blue-500",
  "in progress": "bg-blue-50 text-blue-500",
  completed: "bg-emerald-50 text-emerald-500",
  rejected: "bg-red-50 text-red-500",
  extension: "bg-purple-50 text-purple-500",
  delivered: "bg-indigo-50 text-indigo-500",
  draft: "bg-gray-100 text-gray-500",
  closed: "bg-gray-100 text-gray-500",
};

export default function StatusBadge({ status, className = "" }) {
  const normalizedStatus = status?.toLowerCase?.() || "";
  
  return (
    <span
      className={`
        inline-block capitalize text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap
        ${STATUS_STYLES[normalizedStatus] ?? "bg-gray-100 text-gray-500"}
        ${className}
      `}
    >
      {status || "Unknown"}
    </span>
  );
}
