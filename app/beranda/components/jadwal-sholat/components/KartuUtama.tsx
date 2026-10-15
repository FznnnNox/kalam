"use client";

import { Crosshair, MapPin } from "lucide-react";
import {
  jam,
  LABEL_LOKASI,
  pad,
  PANJANG_BUSUR,
  titikBusur,
  type Info,
  type StatusLokasi,
} from "../utils";

export default function KartuUtama({
  hasil,
  info,
  progres,
  sisa,
  statusLokasi,
  namaLokasi,
  status,
  onRefreshLokasi,
}: {
  hasil: { hijri: string } | null;
  info: Info | null;
  progres: number;
  sisa: { h: number; m: number; s: number };
  statusLokasi: StatusLokasi;
  namaLokasi: string;
  status: "memuat" | "siap" | "gagal";
  onRefreshLokasi: () => void;
}) {
  const titik = titikBusur(progres);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#3B58D6] via-[#2A44B7] to-[#1F36A0] p-6 text-white shadow-xl shadow-[#2A44B7]/25 sm:p-8">
      <span className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
      <span className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-white/10" />

      <header className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">Jadwal Sholat</h2>
          <p className="mt-0.5 text-xs text-white/70">{hasil?.hijri ?? "Memuat tanggal..."}</p>
        </div>
        <button
          onClick={onRefreshLokasi}
          title="Perbarui lokasi dari perangkat"
          className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:bg-white/25"
        >
          {statusLokasi === "izin" ? <Crosshair size={13} /> : <MapPin size={13} />}
          {namaLokasi}
        </button>
      </header>

      {statusLokasi !== "izin" && statusLokasi !== "meminta" && (
        <p className="relative mt-3 text-[11px] text-white/70">{LABEL_LOKASI[statusLokasi]}</p>
      )}

      {status === "gagal" ? (
        <p className="relative mt-10 text-center text-sm text-white/80">
          Jadwal belum bisa dimuat. Periksa koneksi internet lalu muat ulang halaman.
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-6 w-full max-w-xs">
            <svg viewBox="0 0 240 130" className="w-full overflow-visible">
              <path
                d="M 20 120 A 100 100 0 0 1 220 120"
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 20 120 A 100 100 0 0 1 220 120"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={PANJANG_BUSUR}
                strokeDashoffset={PANJANG_BUSUR * (1 - progres)}
                className="transition-[stroke-dashoffset] duration-1000"
              />
              {hasil && info && (
                <circle
                  cx={titik.x}
                  cy={titik.y}
                  r="8"
                  fill="#FFFFFF"
                  stroke="#2A44B7"
                  strokeWidth="4"
                  className="transition-all duration-1000"
                />
              )}
            </svg>

            <div className="absolute inset-x-0 bottom-0 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                {info ? `Menuju ${info.berikutnya.nama}` : "Memuat..."}
              </p>
              <p className="font-mono text-4xl font-bold tabular-nums sm:text-5xl">
                {pad(sisa.h)}:{pad(sisa.m)}
                <span className="text-2xl text-white/70">:{pad(sisa.s)}</span>
              </p>
            </div>
          </div>

          <div className="relative mt-6 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 text-sm">
            <div>
              <p className="text-xs text-white/60">Sebelumnya</p>
              <p className="mt-0.5 font-semibold">
                {info ? `${info.sebelumnya.nama} ${jam(info.sebelumnya.waktu)}` : "-"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Berikutnya</p>
              <p className="mt-0.5 font-semibold">
                {info ? `${info.berikutnya.nama} ${jam(info.berikutnya.waktu)}` : "-"}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}