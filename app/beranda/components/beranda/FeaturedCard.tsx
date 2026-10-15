"use client";

import { useEffect, useState } from "react";
import { BookOpen, Tag } from "lucide-react";
import { arabic } from "../../lib/fonts";
import { DATA } from "../../data/mahfuzot";

export default function FeaturedCard({ className = "" }: { className?: string }) {
  const [idx, setIdx] = useState(0);

  // dihitung di client agar tidak hydration mismatch
  useEffect(() => {
    setIdx(new Date().getDate() % DATA.length);
  }, []);

  const item = DATA[idx];

  return (
    <section
      className={`rounded-3xl bg-white p-3 shadow-[0_6px_24px_rgba(42,68,183,0.07)] sm:p-4 ${className}`}
    >
      <div className="relative flex h-52 flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B58D6] via-[#2A44B7] to-[#1F36A0] px-6 text-center text-white sm:h-60 lg:h-72">
        <span className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/10" />

        <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Kata Hari Ini
        </span>
        <p
          dir="rtl"
          lang="ar"
          className={`${arabic.className} relative mt-3 text-3xl font-bold leading-relaxed sm:text-4xl lg:text-5xl`}
        >
          {item.ar}
        </p>
        <p className="relative mt-2 max-w-md text-xs italic text-white/80 sm:text-sm">
          &ldquo;{item.idn}&rdquo;
        </p>

        <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
          <span className="h-1.5 w-5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
      </div>

      <div className="flex items-center gap-3 px-2 pb-1 pt-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2A44B7]/10 text-[#2A44B7]">
          <BookOpen size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold lg:text-base">Kata Mutiara Hari Ini</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Tag size={12} className="text-[#2A44B7]" />
            {item.kategori}
          </p>
        </div>
      </div>
    </section>
  );
}