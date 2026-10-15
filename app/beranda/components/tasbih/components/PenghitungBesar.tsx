"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { formatDurasi } from "../utils";

const WARNA_KONFETI = ["#2A44B7", "#3B58D6", "#7C93F0", "#F59E0B", "#FFFFFF", "#60A5FA"];
const JUMLAH_KONFETI = 28;

export default function PenghitungBesar({
  count,
  target,
  detik,
  onTambah,
  onReset,
}: {
  count: number;
  target: number;
  detik: number;
  onTambah: () => void;
  onReset: () => void;
}) {
  const selesai = count > 0 && count >= target;
  const progres = Math.min(count / target, 1);

  return (
    <section className="relative flex h-full flex-col justify-between overflow-hidden p-5 sm:p-6">
      <style>{`
        @keyframes tasbih-jatuh {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(340px) rotate(540deg); opacity: 0; }
        }
        @keyframes tasbih-muncul {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes tasbih-denyut {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `}</style>

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#EEF1FB] px-3 py-1 font-mono text-xs font-semibold text-[#2A44B7]">
          {formatDurasi(detik)}
        </span>
        <button
          onClick={onReset}
          aria-label="Atur ulang hitungan"
          className="flex items-center gap-1.5 rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-[#4B5563] transition hover:text-[#2A44B7] active:scale-95"
        >
          <RotateCcw size={13} />
          Atur ulang
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="font-mono text-6xl font-bold tabular-nums text-[#2A44B7] sm:text-7xl">{count}</p>
        <p className="mt-1 text-xs text-[#6B7280]">
          {Math.min(count, target)} / {target} menuju target
        </p>
        <div className="mx-auto mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-[#EEF1F8]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3B58D6] to-[#2A44B7] transition-all duration-300"
            style={{ width: `${progres * 100}%` }}
          />
        </div>
      </div>

      {/* tombol tap: lintasan pill dengan lingkaran biru di dalamnya */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onTambah}
          disabled={selesai}
          aria-label={selesai ? "Target tercapai" : `Tap untuk menambah, saat ini ${count}`}
          className="group relative flex h-24 w-full max-w-xs items-center justify-center rounded-full bg-gradient-to-b from-[#E4EAFD] to-[#D3DDFA] shadow-inner transition disabled:cursor-default"
        >
          <span
            className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7C93F0] via-[#3B58D6] to-[#2A44B7] shadow-lg shadow-[#2A44B7]/40 transition duration-150 ${
              selesai ? "opacity-60" : "group-hover:scale-105 group-active:scale-90"
            }`}
          />
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-[#6B7280]">
        {selesai ? "Alhamdulillah, target sudah tercapai" : "Tekan lingkaran biru untuk menambah hitungan"}
      </p>

      {/* kartu hadiah saat target tercapai */}
      {selesai && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 p-6 backdrop-blur-sm rounded-[10px]">
          {/* konfeti */}
          {Array.from({ length: JUMLAH_KONFETI }).map((_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute top-0 h-2.5 w-2.5 rounded-sm"
              style={{
                left: `${(i * 37) % 100}%`,
                background: WARNA_KONFETI[i % WARNA_KONFETI.length],
                animation: `tasbih-jatuh ${1.6 + (i % 5) * 0.2}s ease-in ${(i % 7) * 0.12}s infinite`,
              }}
            />
          ))}

          <div
            className="relative w-full max-w-xs p-6 text-center"
            style={{ animation: "tasbih-muncul 400ms ease-out, tasbih-denyut 2s ease-in-out 400ms infinite" }}
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#3B58D6] to-[#2A44B7] text-white shadow-lg shadow-[#2A44B7]/30">
              <Sparkles size={26} />
            </span>
            <p className="mt-4 text-lg font-bold text-[#1A1A1A]">Masya Allah!</p>
            <p className="mt-1 text-sm text-[#4B5563]">
              Hitungan {target} sudah tercapai. Waktu sesi: {formatDurasi(detik)}
            </p>
            <button
              onClick={onReset}
              className="mt-5 w-full rounded-full bg-[#2A44B7] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#2A44B7]/25 transition hover:bg-[#1F36A0] active:scale-95"
            >
              Mulai lagi
            </button>
          </div>
        </div>
      )}
    </section>
  );
}