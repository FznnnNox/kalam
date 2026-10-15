"use client";

import { BookOpen, LayoutDashboard, LogIn, User } from "lucide-react";
import Link from "next/link";
import { useSesi } from "@/app/beranda/lib/useSesi";

export default function GreetingHeader() {
  const { siap, login, username } = useSesi();

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Bagian Profil & Teks Greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B58D6] to-[#2A44B7] text-white shadow-md shadow-[#2A44B7]/25 sm:h-12 sm:w-12 lg:h-14 lg:w-14">
          <User className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight sm:text-lg lg:text-2xl">
            {siap && login && username
              ? `Assalamualaikum, ${username}!`
              : "Assalamualaikum!"}
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#6B7280] lg:text-sm">
            <BookOpen size={13} className="shrink-0 text-[#2A44B7]" />
            Hikmah harian Mahfuzot
          </p>
        </div>
      </div>

      {/* Bagian Tombol Aksi (Dashboard / Masuk) */}
      {siap && (
        <div className="flex items-center justify-end gap-2 sm:shrink-0">
          {login ? (
            <Link
              href="/admin"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#2A44B7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#2A44B7]/25 transition hover:bg-[#1F36A0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A44B7]/30 active:scale-95 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 lg:text-sm"
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#2A44B7] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-[#2A44B7]/25 transition hover:bg-[#1F36A0] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A44B7]/30 active:scale-95 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 lg:text-sm"
            >
              <LogIn size={15} />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}