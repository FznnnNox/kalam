import type { ReactNode } from "react";

// palet pastel untuk kartu kategori dan batang grafik, diulang sesuai urutan
export const PASTEL = [
  { kartu: "bg-[#DCDDFB]", batang: "bg-[#8B8FF0]", avatar: "bg-[#DCDDFB] text-[#3B3F9A]" },
  { kartu: "bg-[#D7ECFB]", batang: "bg-[#6FB7E8]", avatar: "bg-[#D7ECFB] text-[#1F5F8B]" },
  { kartu: "bg-[#DFF7D9]", batang: "bg-[#7CCB6A]", avatar: "bg-[#DFF7D9] text-[#2E6B26]" },
  { kartu: "bg-[#FBE3D6]", batang: "bg-[#F2A07B]", avatar: "bg-[#FBE3D6] text-[#8A4324]" },
  { kartu: "bg-[#FFF3C4]", batang: "bg-[#F5C84B]", avatar: "bg-[#FFF3C4] text-[#7A5A08]" },
];

export const inputCls =
  "w-full rounded-2xl border border-[#E5E7EB] bg-[#F7F8FC] px-4 py-2.5 text-sm outline-none transition focus:border-[#2A44B7] focus:ring-2 focus:ring-[#2A44B7]/15";

export const tombolUtama =
  "flex items-center gap-1.5 rounded-full bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#333] active:scale-95";

export const tombolLembut =
  "flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-[#4B5563] shadow-sm ring-1 ring-[#E5E7EB] transition hover:text-[#2A44B7] active:scale-95";

export const ikonBulat =
  "flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#4B5563] transition hover:text-[#2A44B7]";

export function Kartu({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <section
      className={`rounded-[28px] bg-white p-5 shadow-[0_8px_30px_rgba(42,68,183,0.06)] sm:p-7 ${className}`}
    >
      {children}
    </section>
  );
}

export function Judul({ judul, sub, aksi }: { judul: string; sub?: string; aksi?: ReactNode }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-light tracking-tight sm:text-4xl">{judul}</h1>
        {sub && <p className="mt-1 text-sm text-[#6B7280]">{sub}</p>}
      </div>
      {aksi && <div className="flex flex-wrap gap-2">{aksi}</div>}
    </header>
  );
}

export function Pesan({ teks }: { teks: string | null }) {
  if (!teks) return null;
  return (
    <p role="alert" className="rounded-2xl bg-[#FEF2F2] px-4 py-2.5 text-xs text-[#E5484D]">
      {teks}
    </p>
  );
}