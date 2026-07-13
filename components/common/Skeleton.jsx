export const DealCardSkeleton = ({ has_action }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="flex flex-col gap-4 flex-1">
        {/* Status row */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-14 bg-gray-100 rounded" />
          <div className="h-6 w-20 bg-gray-100 rounded-full" />
        </div>

        {/* Person + Date */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gray-100" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>

          <div className="text-right">
            <div className="h-3 w-10 bg-gray-100 rounded ml-auto mb-1" />
            <div className="h-3 w-16 bg-gray-100 rounded ml-auto" />
          </div>
        </div>

        {/* Description + Payout */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="h-3 w-28 bg-gray-100 rounded mb-2" />
            <div className="h-3 w-full bg-gray-100 rounded mb-1" />
            <div className="h-3 w-3/4 bg-gray-100 rounded" />
          </div>

          <div className="text-right shrink-0">
            <div className="h-3 w-20 bg-gray-100 rounded mb-2 ml-auto" />
            <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
          </div>
        </div>
      </div>

      {/* Actions */}
      {has_action && (
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-10 bg-gray-100 rounded-full" />
          <div className="flex-1 h-10 bg-gray-100 rounded-full" />
        </div>
      )}
    </div>
  );
};
