"use client";

import Image from "next/image";
import Link from "next/link";
import { arabic, outfit } from "@/app/beranda/lib/fonts";
import { DATA } from "@/app/beranda/data/mahfuzot";

// id kata mutiara yang ditampilkan di sekeliling Al-Qur'an, sesuai urutan posisi
const ID_HIASAN = [4, 2, 1, 3, 5];

const POSISI = [
  "left-0 top-[19rem] -rotate-3",
  "left-2 top-[7.5rem] -rotate-2",
  "left-1/2 -translate-x-1/2 top-0",
  "right-2 top-[7.5rem] rotate-2",
  "right-0 top-[19rem] rotate-3",
];

const mutiara = ID_HIASAN.map((id, i) => {
  const item = DATA.find((d) => d.id === id);
  return item ? { ...item, pos: POSISI[i] } : null;
}).filter((m): m is (typeof DATA)[number] & { pos: string } => m !== null);

export default function OnboardingScreen() {
  return (
    <div
  className={`${outfit.className} relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-white px-6 py-8 text-[#1A1A1A] lg:px-10`}>
      {/* Glow biru tipis */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-[-10%] h-80 w-80 rounded-full bg-[#2A44B7]/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] bottom-[10%] h-80 w-80 rounded-full bg-[#2A44B7]/10 blur-[110px]"
      />

      {/* Lentera (hanya mobile) */}
      <div className="relative mt-2 flex h-64 w-full max-w-xs items-start justify-center lg:hidden">
        <Image
          src="/assets/lantern.png"
          alt="Bulan dan Lentera Ramadhan"
          width={320}
          height={260}
          priority
          className="object-contain drop-shadow-[0_10px_20px_rgba(42,68,183,0.2)]"
        />
      </div>

      {/* Konten utama */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-between lg:my-auto lg:max-w-6xl lg:flex-none lg:flex-row lg:justify-center lg:gap-12">
        {/* Kiri: Al-Qur'an dikelilingi kata mutiara (desktop) */}
        <div className="relative my-auto flex items-center justify-center lg:my-0 lg:h-[36rem] lg:w-[36rem] lg:flex-none">
          <div className="pointer-events-none absolute h-48 w-48 rounded-full bg-[#2A44B7]/15 blur-[70px] lg:h-72 lg:w-72 lg:bg-[#2A44B7]/20" />

          {mutiara.map((m, i) => (
            <div
              key={m.id}
              className={`absolute ${m.pos} hidden w-40 flex-col items-center rounded-2xl bg-[#2A44B7] px-4 py-3 text-center shadow-lg shadow-[#2A44B7]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1F36A0] hover:shadow-xl lg:flex`}
            >
              <span className="absolute -top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#2A44B7] bg-white text-xs font-bold text-[#2A44B7] shadow-md">
                {i + 1}
              </span>
              <p
                dir="rtl"
                lang="ar"
                className={`${arabic.className} text-xl font-bold leading-relaxed text-white`}
              >
                {m.ar}
              </p>
              <p className="mt-1 text-[11px] italic leading-snug text-white/75">
                &ldquo;{m.idn}&rdquo;
              </p>
            </div>
          ))}

          <div className="relative flex h-36 w-44 items-center justify-center lg:h-auto lg:w-auto lg:mt-12">
            <Image
              src="/assets/al-quran.png"
              alt="Al-Qur'an"
              width={140}
              height={140}
              priority
              className="object-contain drop-shadow-[0_12px_20px_rgba(42,68,183,0.3)] lg:h-64 lg:w-64"
            />
          </div>
        </div>

        {/* Teks, indikator & tombol (kanan di desktop) */}
        <div className="z-10 w-full max-w-xs space-y-6 text-center lg:max-w-md lg:flex-1 lg:text-left">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-[1.15] tracking-tight text-[#1A1A1A] lg:text-7xl">
              <span className="relative inline-block">
                <span className="relative z-0">Dalami</span>
                <svg
                  viewBox="0 0 300 110"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden
                  className="pointer-events-none absolute -bottom-3 -left-4 -right-4 -top-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)] -rotate-2"
                >
                  <path
                    d="M30 60 C 18 25, 120 6, 205 12 C 280 18, 298 52, 268 80 C 238 104, 110 104, 50 86 C 12 74, 8 46, 42 28 C 78 10, 150 4, 215 10"
                    stroke="#2A44B7"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>{" "}
              Hikmah
              <br />
              <span className="text-[#2A44B7]">Kata Mahfuzot</span>
            </h1>

            <p className="px-2 pt-2 text-sm font-normal leading-relaxed text-[#8B8B8B] lg:px-0 lg:text-lg">
              Temukan inspirasi dan bangun kedekatan dengan Mahfuzot melalui
              renungan kata mutiara setiap hari.
            </p>
          </div>

          {/* Indikator halaman (dekorasi) */}
          <div
            aria-hidden
            className="flex items-center justify-center gap-1.5 pt-1 lg:justify-start"
          >
            <span className="h-2 w-6 rounded-full bg-[#2A44B7]" />
            <span className="h-2 w-2 rounded-full bg-[#2A44B7]/25" />
            <span className="h-2 w-2 rounded-full bg-[#2A44B7]/25" />
          </div>

          <div className="flex justify-center pt-2 lg:justify-start">
            <Link
              href="/beranda"
              className="group inline-flex items-center gap-3 rounded-lg bg-[#2A44B7] px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-[#2A44B7]/30 transition-all duration-200 hover:bg-[#1F36A0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A44B7]/30 active:scale-95 lg:px-10 lg:py-4"
            >
              Mulai Sekarang
              <span className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                &#8599;
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
