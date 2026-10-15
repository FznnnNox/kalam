"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Home,
  Maximize2,
  Tags,
  Users,
} from "lucide-react";
import { arabic } from "@/app/beranda/lib/fonts";
import { useAdmin } from "./AdminContext";
import { Kartu, PASTEL, ikonBulat } from "./components/ui";

const adaArab = (s: string) => /[\u0600-\u06FF]/.test(s);
const persen = (bagian: number, total: number) =>
  total > 0 ? Math.round((bagian / total) * 100) : 0;

export default function DashboardAdmin() {
  const { mahfuzot, anggota, kategori } = useAdmin();

  const daftarKategori = kategori.map((k) => k.nama);

  const perKategori = kategori.map((k, i) => {
    const daftar = mahfuzot.filter((m) => m.kategori === k.nama);
    return {
      id: k.id,
      nama: k.nama,
      jumlah: daftar.length,
      contoh: daftar[0]?.ar ?? "",
      gaya: PASTEL[i % PASTEL.length],
    };
  });
  const maksimal = Math.max(1, ...perKategori.map((k) => k.jumlah));

  const kelengkapan = [
    {
      label: "Teks Arab terisi",
      nilai: persen(mahfuzot.filter((m) => adaArab(m.ar)).length, mahfuzot.length),
      warna: "from-[#3B58D6] to-[#2A44B7]",
    },
    {
      label: "Terjemahan terisi",
      nilai: persen(mahfuzot.filter((m) => m.idn.trim()).length, mahfuzot.length),
      warna: "from-[#7CCB6A] to-[#4FA84A]",
    },
    {
      label: "Kategori terpakai",
      nilai: persen(
        daftarKategori.filter((nama) => mahfuzot.some((m) => m.kategori === nama)).length,
        daftarKategori.length,
      ),
      warna: "from-[#F5C84B] to-[#E6A817]",
    },
    {
      label: "Anggota punya peran",
      nilai: persen(anggota.filter((a) => a.peran.trim()).length, anggota.length),
      warna: "from-[#F2A07B] to-[#E07A4F]",
    },
  ];

  const statistik = [
    { label: "Mahfuzot", nilai: mahfuzot.length, Icon: BookOpen },
    { label: "Kategori", nilai: kategori.length, Icon: Tags },
    { label: "Anggota", nilai: anggota.length, Icon: Users },
  ];

  return (
    <>
      <header className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/beranda"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#2A44B7] shadow-sm ring-1 ring-[#2A44B7]/10 transition hover:bg-[#2A44B7] hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2A44B7]/30 active:scale-95"
          >
            <Home size={14} />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-light tracking-tight sm:text-5xl">Dashboard</h1>
          <p className="mt-2 text-sm text-[#6B7280] sm:text-base">
            Ringkasan data mahfuzot dan kelompok
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:flex lg:gap-4">
          {statistik.map(({ label, nilai, Icon }, i) => (
            <div
              key={label}
              className="flex flex-col items-start gap-3 rounded-3xl bg-white p-4 shadow-[0_8px_30px_rgba(42,68,183,0.08)] ring-1 ring-black/5 sm:flex-row sm:items-center sm:gap-4 sm:pr-7 lg:min-w-[150px]"
            >
              <span
                className={`${PASTEL[i % PASTEL.length].avatar} flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12`}
              >
                <Icon size={20} />
              </span>
              <div>
                <p className="text-[11px] font-medium text-[#6B7280] sm:text-xs">{label}</p>
                <p className="text-2xl font-semibold leading-none text-[#1A1A1A] sm:text-3xl">
                  {nilai}
                </p>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* kiri: kategori sebagai kartu pastel */}
        <Kartu>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-light">Pilih kategori</h2>
              <p className="text-xs text-[#6B7280]">Klik untuk melihat mahfuzot</p>
            </div>
            <Link href="/admin/kategori" aria-label="Buka kategori" className={ikonBulat}>
              <Maximize2 size={14} />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {perKategori.map((k) => (
              <Link
                key={k.id}
                href="/admin/mahfuzot"
                className={`${k.gaya.kartu} group block rounded-3xl p-5 transition hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium">{k.nama}</p>
                  <ArrowUpRight
                    size={16}
                    className="text-[#4B5563] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
                <p
                  dir="rtl"
                  lang="ar"
                  className={`${arabic.className} mt-3 truncate text-right text-lg text-[#1A1A1A]/80`}
                >
                  {k.contoh || "—"}
                </p>
                <p className="mt-1 text-xs text-[#4B5563]">{k.jumlah} mahfuzot</p>
              </Link>
            ))}
          </div>
        </Kartu>

        <div className="space-y-6">
          {/* grafik batang */}
          <Kartu>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-light">Sebaran mahfuzot</h2>
                <p className="text-xs text-[#6B7280]">Jumlah mahfuzot di setiap kategori</p>
              </div>
              <span className="rounded-full border border-[#E5E7EB] px-3 py-1.5 text-xs text-[#4B5563]">
                Semua
              </span>
            </div>

            <div className="mt-6 flex h-56 items-end justify-between gap-3 sm:gap-6">
              {perKategori.map((k) => (
                <div key={k.id} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-xs font-semibold text-[#4B5563]">{k.jumlah}</span>
                  <div
                    className={`${k.gaya.batang} w-full max-w-[56px] rounded-2xl transition-all duration-500`}
                    style={{ height: `${Math.max((k.jumlah / maksimal) * 100, 4)}%` }}
                  />
                  <span className="truncate text-[11px] text-[#6B7280]">{k.nama}</span>
                </div>
              ))}
            </div>
          </Kartu>

          <div className="grid gap-6 md:grid-cols-2">
            {/* kelengkapan data */}
            <Kartu>
              <h2 className="text-xl font-light">Kelengkapan data</h2>
              <p className="text-xs text-[#6B7280]">Periksa data sebelum disalin</p>
              <ul className="mt-5 space-y-4">
                {kelengkapan.map((k) => (
                  <li key={k.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{k.label}</span>
                      <span className="font-semibold">{k.nilai}%</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F8]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${k.warna} transition-all duration-500`}
                        style={{ width: `${k.nilai}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Kartu>

            {/* anggota */}
            <Kartu>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-light">Anggota</h2>
                  <p className="text-xs text-[#6B7280]">Tim pengembang</p>
                </div>
                <Link href="/admin/kelompok" aria-label="Kelola anggota" className={ikonBulat}>
                  <Users size={14} />
                </Link>
              </div>
              <ul className="mt-5 space-y-4">
                {anggota.map((a, i) => (
                  <li key={a.id} className="flex items-center gap-3">
                    <span
                      className={`${PASTEL[i % PASTEL.length].avatar} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold`}
                    >
                      {a.nama.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.nama}</p>
                      <p className="truncate text-xs text-[#6B7280]">{a.peran || "Belum ada peran"}</p>
                    </div>
                    <BookOpen size={14} className="hidden text-[#9CA3AF] sm:block" />
                  </li>
                ))}
              </ul>
            </Kartu>
          </div>
        </div>
      </div>
    </>
  );
}