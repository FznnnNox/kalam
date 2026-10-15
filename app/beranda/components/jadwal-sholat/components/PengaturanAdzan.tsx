"use client";

import { Square, Volume2, VolumeX } from "lucide-react";

export default function PengaturanAdzan({
  suaraAktif,
  sedangBunyi,
  pesan,
  onAktifkan,
  onNonaktifkan,
  onHentikan,
}: {
  suaraAktif: boolean;
  sedangBunyi: boolean;
  pesan: string | null;
  onAktifkan: () => void;
  onNonaktifkan: () => void;
  onHentikan: () => void;
}) {
  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_6px_24px_rgba(42,68,183,0.07)] sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#1A1A1A]">Suara adzan</p>
          <p className="text-xs text-[#6B7280]">
            {suaraAktif ? "Adzan akan berbunyi saat waktu sholat tiba." : "Aktifkan agar adzan berbunyi otomatis."}
          </p>
        </div>
        <button
          onClick={suaraAktif ? onNonaktifkan : onAktifkan}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition active:scale-95 ${
            suaraAktif
              ? "bg-[#2A44B7]/10 text-[#2A44B7] hover:bg-[#2A44B7]/20"
              : "bg-[#2A44B7] text-white shadow-md shadow-[#2A44B7]/25 hover:bg-[#1F36A0]"
          }`}
        >
          {suaraAktif ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {suaraAktif ? "Matikan adzan" : "Aktifkan adzan"}
        </button>
      </div>

      {sedangBunyi && (
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#EEF1F8] pt-3">
          <p className="text-xs text-[#6B7280]">Adzan sedang berbunyi.</p>
          <button
            onClick={onHentikan}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#E5484D] px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#E5484D]/25 transition hover:bg-[#D13438] active:scale-95"
          >
            <Square size={12} fill="currentColor" />
            Hentikan
          </button>
        </div>
      )}

      {pesan && <p className="mt-2 text-xs text-[#E5484D]">{pesan}</p>}
    </section>
  );
}