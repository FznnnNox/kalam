const TOTAL = 30;
const TICKS = 60;

export default function DailyProgressCard({
  className = "",
  current = 6,
}: {
  className?: string;
  current?: number;
}) {
  const filled = Math.round((current / TOTAL) * TICKS);

  return (
    <section
      className={`flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_6px_24px_rgba(42,68,183,0.07)] sm:p-6 ${className}`}
    >
      <div>
        <h2 className="text-lg font-bold lg:text-xl">Sudah Baca Hari Ini?</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Bangun kebiasaan membaca mahfuzot setiap hari.
        </p>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex items-end justify-between text-sm font-semibold">
          <span className="text-[#2A44B7]">{String(current).padStart(2, "0")}</span>
          <span className="text-[#6B7280]">{TOTAL}</span>
        </div>

        <div className="flex h-8 items-end justify-between">
          {Array.from({ length: TICKS }).map((_, i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full ${i % 5 === 0 ? "h-8" : "h-5"} ${
                i < filled ? "bg-[#2A44B7]" : "bg-[#D9DEEE]"
              }`}
            />
          ))}
        </div>

        <p className="mt-3 text-xs text-[#8B8B8B]">
          {current} dari {TOTAL} hari bulan ini
        </p>
      </div>
    </section>
  );
}