export default function SkeletonCard() {
  return (
    <div className="flex gap-3 p-4 bg-[#1a1d27] border border-[#343536] rounded-xl animate-pulse">
      <div className="flex flex-col items-center gap-1 min-w-[40px]">
        <div className="w-4 h-4 bg-[#343536] rounded" />
        <div className="w-6 h-3 bg-[#343536] rounded" />
        <div className="w-4 h-4 bg-[#343536] rounded" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="w-24 h-3 bg-[#343536] rounded-full" />
        <div className="w-full h-4 bg-[#343536] rounded" />
        <div className="w-3/4 h-4 bg-[#343536] rounded" />
        <div className="w-20 h-3 bg-[#343536] rounded-full" />
      </div>
    </div>
  );
}