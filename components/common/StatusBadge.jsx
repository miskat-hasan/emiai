const STATUS_STYLES = {
  Pending: "bg-[#FEF3C7] text-[#D97706]",
  Accepted: "bg-[#F3F4F6] text-gray",
  "In Progress": "bg-blue-50 text-blue-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-500",
  Extension: "bg-purple-50 text-purple-600",
  Delivered: "bg-gray-100 text-gray",
};

export default function StatusBadge({ status, className = "" }) {
  return (
    <span
      className={`
        inline-block capitalize text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap
        ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray"}
        ${className}
      `}
    >
      {status}
    </span>
  );
}
