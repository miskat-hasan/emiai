export default function MessagesSkeleton() {
  const widths = ["w-2/5", "w-3/5", "w-1/3", "w-1/2"];
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {widths.map((w, i) => (
        <div
          key={i}
          className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className={`h-14 ${w} max-w-[70%] rounded-2xl bg-gray-100`} />
        </div>
      ))}
    </div>
  );
}
