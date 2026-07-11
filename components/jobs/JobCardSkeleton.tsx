export default function JobCardSkeleton() {
  return (
    <div className="w-full flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-gray-100 bg-white animate-pulse">
      {/* Logo placeholder */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-100 shrink-0" />

      {/* Content */}
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-gray-100 rounded-md w-3/5" />
        <div className="h-3 bg-gray-100 rounded-md w-2/5" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 bg-gray-100 rounded-full w-16" />
          <div className="h-5 bg-gray-100 rounded-full w-24" />
          <div className="h-5 bg-gray-100 rounded-full w-20" />
        </div>
      </div>

      {/* Date placeholder */}
      <div className="hidden sm:flex flex-col items-end gap-2">
        <div className="h-3 bg-gray-100 rounded-md w-14" />
      </div>
    </div>
  );
}
