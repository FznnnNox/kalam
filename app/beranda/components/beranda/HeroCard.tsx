import Image from "next/image";
import { PlayCircle } from "lucide-react";

export default function HeroCard({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-[0_6px_24px_rgba(42,68,183,0.07)] sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-[#2A44B7]/10 blur-3xl" />

      <div className="relative min-h-[150px] pr-28 sm:pr-44 lg:min-h-[190px] lg:pr-72">
        <h2 className="text-xl font-bold sm:text-2xl lg:text-4xl">Hikmah Hari Ini</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4B5563] lg:mt-3 lg:text-base">
          Perdalam ilmu, kesabaran, dan semangat melalui kata mutiara setiap hari.
        </p>
        <button
          onClick={onExplore}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2A44B7] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2A44B7]/30 transition hover:bg-[#1F36A0] active:scale-95 lg:mt-7 lg:px-6 lg:py-3"
        >
          <PlayCircle size={18} />
          Jelajahi Mahfuzot
        </button>
      </div>

      <Image
        src="/assets/al-quran.png"
        alt="Al-Qur'an"
        width={240}
        height={240}
        priority
        className="pointer-events-none absolute bottom-3 right-3 h-28 w-28 object-contain drop-shadow-[0_10px_18px_rgba(42,68,183,0.25)] sm:h-36 sm:w-36 lg:bottom-4 lg:right-10 lg:h-48 lg:w-48"
      />
    </section>
  );
}