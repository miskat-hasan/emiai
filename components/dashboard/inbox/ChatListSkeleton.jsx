export default function ChatListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 border-b border-gray-50/50 animate-pulse"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2 pt-0.5">
            <div className="h-3 bg-gray-100 rounded w-2/5" />
            <div className="h-2.5 bg-gray-100 rounded w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
