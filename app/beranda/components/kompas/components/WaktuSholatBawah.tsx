"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CloudSun,
  MoonStar,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import {
  jamKeDate,
  SHOLAT_LIST,
  type Hasil,
  type NamaSholat,
} from "../../../lib/jadwal";

const IKON: Record<NamaSholat, LucideIcon> = {
  Subuh: Sunrise,
  Dzuhur: Sun,
  Ashar: CloudSun,
  Maghrib: Sunset,
  Isya: MoonStar,
};

// posisi vertikal ikon mengikuti lengkung bumi: tengah paling tinggi
const OFFSET_ATAS = [30, 12, 0, 12, 30];

export default function WaktuSholatBawah({ hasil }: { hasil: Hasil | null }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // sholat berikutnya untuk disorot
  const berikutnya =
    hasil && now
      ? (SHOLAT_LIST.find(({ nama }) => jamKeDate(hasil.waktu[nama], now) > now)
          ?.nama ?? SHOLAT_LIST[0].nama)
      : null;

  return (
    <section className="relative flex h-full flex-col overflow-hidden p-6">
      {/* ikon waktu sholat di atas bumi, tersusun melengkung */}
      <div className="relative z-10 grid grid-cols-5 gap-1 text-center">
        {SHOLAT_LIST.map(({ nama }, i) => {
          const Icon = IKON[nama];
          const aktif = berikutnya === nama;
          return (
            <div
              key={nama}
              className="flex flex-col items-center gap-1.5"
              style={{ marginTop: OFFSET_ATAS[i] }}
            >
              <p
                className={`text-[11px] font-semibold ${aktif ? "text-[#2A44B7]" : "text-[#4B5563]"}`}
              >
                {nama}
              </p>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  aktif
                    ? "bg-[#2A44B7] text-white shadow-md shadow-[#2A44B7]/30"
                    : "bg-white text-[#F59E0B] shadow-sm"
                }`}
              >
                <Icon size={17} />
              </span>
              <p className="text-[11px] tabular-nums text-[#6B7280]">
                {hasil ? hasil.waktu[nama] : "--:--"}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
