"use client";

import { Bell, BellOff } from "lucide-react";
import { SHOLAT_LIST, type Hasil } from "../../../lib/jadwal";
import { IKON, type Info } from "../utils";

export default function DaftarWaktu({
  hasil,
  info,
  pengingat,
  onToggle,
}: {
  hasil: Hasil | null;
  info: Info | null;
  pengingat: Record<string, boolean>;
  onToggle: (nama: string) => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_6px_24px_rgba(42,68,183,0.07)] sm:p-5">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Waktu Sholat Hari Ini</h3>
        <p className="text-xs text-[#6B7280]">{hasil?.tanggal ?? ""}</p>
      </div>

      <ul className="space-y-2">
        {SHOLAT_LIST.map(({ nama }) => {
          const Icon = IKON[nama];
          const aktif = info?.berikutnya.nama === nama;
          const ingatkan = pengingat[nama] ?? true;
          return (
            <li
              key={nama}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                aktif
                  ? "bg-gradient-to-r from-[#3B58D6] to-[#2A44B7] text-white shadow-md shadow-[#2A44B7]/25"
                  : "bg-[#F4F6FB]"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  aktif ? "bg-white/20" : "bg-white text-[#2A44B7] shadow-sm"
                }`}
              >
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${aktif ? "text-white" : "text-[#1A1A1A]"}`}>{nama}</p>
                <p className={`text-xs ${aktif ? "text-white/75" : "text-[#6B7280]"}`}>
                  {hasil ? hasil.waktu[nama] : "--:--"} WIB
                </p>
              </div>
              <button
                onClick={() => onToggle(nama)}
                aria-pressed={ingatkan}
                aria-label={ingatkan ? `Matikan adzan ${nama}` : `Nyalakan adzan ${nama}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90 ${
                  aktif
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : ingatkan
                      ? "bg-[#2A44B7]/10 text-[#2A44B7] hover:bg-[#2A44B7]/20"
                      : "bg-[#E5E7EB] text-[#9CA3AF] hover:bg-[#D1D5DB]"
                }`}
              >
                {ingatkan ? <Bell size={16} /> : <BellOff size={16} />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}