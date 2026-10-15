"use client";

import { useEffect, useRef, useState } from "react";

const C = 130;
const R_LUAR = 120;

// titik di lingkaran: 0 = utara (atas), searah jarum jam
function pt(d: number, r: number) {
  const a = (d * Math.PI) / 180;
  return { x: C + r * Math.sin(a), y: C - r * Math.cos(a) };
}

// tick oranye tiap 10 derajat, kecuali kelipatan 30 yang dipakai tick hijau
const TICK_KECIL = Array.from({ length: 36 }, (_, i) => i * 10).filter((d) => d % 30 !== 0);
const TICK_BESAR = Array.from({ length: 12 }, (_, i) => i * 30);
const LABEL: Record<number, string> = { 0: "N", 90: "E", 180: "S", 270: "W" };

export default function PiringanKiblat({
  qibla,
  heading,
  jarak,
  perluIzinSensor,
  onAktifkanSensor,
}: {
  qibla: number;
  heading: number | null;
  jarak: number | null;
  perluIzinSensor: boolean;
  onAktifkanSensor: () => void;
}) {
  // rotasi yang sudah "tidak dibungkus" (bisa lebih dari 360 atau kurang dari 0),
  // sehingga animasi selalu mengambil jalur terpendek
  const [putaran, setPutaran] = useState(0);
  const putaranRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const selisih = targetRef.current - putaranRef.current;
      if (Math.abs(selisih) < 0.05) {
        putaranRef.current = targetRef.current;
        setPutaran(putaranRef.current);
        rafRef.current = null;
        return;
      }
      // mengejar target secara bertahap: lebih halus dan tidak tertinggal
      putaranRef.current += selisih * 0.25;
      setPutaran(putaranRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (heading === null) return;

    // piringan berputar berlawanan arah perangkat
    const tujuan = -heading;
    // selisih terpendek antara posisi sekarang dan tujuan, dalam rentang -180..180
    const delta = ((((tujuan - putaranRef.current) % 360) + 540) % 360) - 180;
    targetRef.current = putaranRef.current + delta;

    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [heading]);

  const kaabah = pt(qibla, 100);

  return (
    <section className="flex flex-col items-center p-6">
      <svg viewBox="0 0 260 260" className="w-full max-w-[280px]">
        <g transform={`rotate(${putaran} ${C} ${C})`}>
          {/* tick oranye kecil */}
          {TICK_KECIL.map((d) => {
            const a = pt(d, R_LUAR);
            const b = pt(d, R_LUAR - 9);
            return (
              <line
                key={`k-${d}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#F5B453"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* tick hijau besar */}
          {TICK_BESAR.map((d) => {
            const a = pt(d, R_LUAR);
            const b = pt(d, R_LUAR - 16);
            return (
              <line
                key={`b-${d}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="#7CB342"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}

          {/* label arah mata angin */}
          {Object.entries(LABEL).map(([d, teks]) => {
            const p = pt(Number(d), 84);
            return (
              <text
                key={d}
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className="fill-[#1A1A1A] text-[12px] font-bold"
              >
                {teks}
              </text>
            );
          })}

          {/* ikon Ka'bah di tepi piringan, pada arah kiblat */}
          <g transform={`translate(${kaabah.x} ${kaabah.y})`}>
            <circle r="13" fill="#E6F2D2" />
            <rect x="-7" y="-7" width="14" height="13" rx="1.5" fill="#1A1A1A" />
            <rect x="-7" y="-2" width="14" height="2.5" fill="#D4AF37" />
          </g>

          {/* jarum: merah ke arah kiblat, abu-abu gelap ke belakang */}
          <g transform={`rotate(${qibla} ${C} ${C})`}>
            <polygon points={`${C},${C - 72} ${C - 9},${C} ${C + 9},${C}`} fill="#EF5A5A" />
            <polygon points={`${C},${C + 56} ${C - 9},${C} ${C + 9},${C}`} fill="#3F3F46" />
          </g>
        </g>
      </svg>

      <p className="mt-2 text-sm text-[#7A9A2E]">Qibla {qibla.toFixed(2)}° from north</p>
      <p className="mt-1 text-sm font-bold text-[#1A1A1A]">
        Distance to Ka&apos;bah {jarak !== null ? Math.round(jarak).toLocaleString("en-US") : "--"} KM
      </p>

      {heading === null && (
        <div className="mt-4 text-center">
          <p className="text-[11px] text-[#6B7280]">
            Sensor kompas belum terbaca. Putar perangkat untuk melihat arah yang akurat.
          </p>
          {perluIzinSensor && (
            <button
              onClick={onAktifkanSensor}
              className="mt-2 rounded-full bg-[#2A44B7] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#2A44B7]/25 transition hover:bg-[#1F36A0] active:scale-95"
            >
              Aktifkan sensor kompas
            </button>
          )}
        </div>
      )}
    </section>
  );
}