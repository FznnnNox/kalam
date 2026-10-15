"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Tags,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { keluar } from "@/app/beranda/lib/auth"; // sesuaikan path

const MENU: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/mahfuzot", label: "Daftar Mahfuzot", Icon: BookOpen },
  { href: "/admin/kategori", label: "Kategori", Icon: Tags },
  { href: "/admin/kelompok", label: "Nama Kelompok", Icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [buka, setBuka] = useState(false);
  const [keluarProses, setKeluarProses] = useState(false);

  const aktifFn = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const menuAktif = MENU.find((m) => aktifFn(m.href)) ?? MENU[0];

  const handleKeluar = async () => {
    if (keluarProses) return;
    setKeluarProses(true);
    await keluar();
    router.replace("/login");
    router.refresh();
  };

  // tutup menu saat pindah halaman
  useEffect(() => {
    setBuka(false);
  }, [pathname]);

  // Escape menutup menu + kunci scroll saat terbuka
  useEffect(() => {
    if (!buka) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("keydown", onKey);
    const lama = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = lama;
    };
  }, [buka]);

  return (
    <>
      {/* desktop: dock ikon di kiri, tengah vertikal */}
      <aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 rounded-full bg-white p-2 shadow-[0_10px_40px_rgba(42,68,183,0.12)] lg:flex">
        {MENU.map(({ href, label, Icon }) => {
          const aktif = aktifFn(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={aktif ? "page" : undefined}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                aktif
                  ? "bg-[#1A1A1A] text-white shadow-lg"
                  : "text-[#6B7280] hover:bg-[#F4F6FB] hover:text-[#1A1A1A]"
              }`}
            >
              <Icon size={20} />
            </Link>
          );
        })}

        <div className="my-1 h-px w-8 bg-[#E5E7EB]" />

        <button
          type="button"
          onClick={handleKeluar}
          disabled={keluarProses}
          title="Keluar"
          aria-label="Keluar"
          className="flex h-12 w-12 items-center justify-center rounded-full text-[#E5484D] transition hover:bg-[#FEF2F2] disabled:opacity-50"
        >
          <LogOut size={20} />
        </button>
      </aside>

      {/* mobile: bar atas, hamburger di kanan */}
      <div className="sticky top-3 z-40 flex items-center justify-between rounded-full bg-white p-1.5 pl-4 shadow-[0_8px_30px_rgba(42,68,183,0.10)] lg:hidden">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
          <menuAktif.Icon size={16} className="text-[#2A44B7]" />
          {menuAktif.label}
        </div>
        <button
          type="button"
          onClick={() => setBuka(true)}
          aria-label="Buka menu"
          aria-expanded={buka}
          aria-controls="menu-mobile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition active:scale-95"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* mobile: menu muncul di tengah layar */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 lg:hidden ${
          buka ? "" : "pointer-events-none"
        }`}
        aria-hidden={!buka}
      >
        <div
          onClick={() => setBuka(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            buka ? "opacity-100" : "opacity-0"
          }`}
        />

        <nav
          id="menu-mobile"
          aria-label="Menu admin"
          className={`relative w-full max-w-xs rounded-3xl bg-white p-3 shadow-[0_20px_60px_rgba(42,68,183,0.25)] transition duration-300 ${
            buka ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <div className="mb-2 flex items-center justify-between pl-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setBuka(false)}
              aria-label="Tutup menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F4F6FB]"
            >
              <X size={18} />
            </button>
          </div>

          <ul className="space-y-1">
            {MENU.map(({ href, label, Icon }) => {
              const aktif = aktifFn(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={aktif ? "page" : undefined}
                    tabIndex={buka ? 0 : -1}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      aktif
                        ? "bg-[#1A1A1A] text-white"
                        : "text-[#4B5563] hover:bg-[#F4F6FB]"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-2 h-px bg-[#E5E7EB]" />

          <button
            type="button"
            onClick={handleKeluar}
            disabled={keluarProses}
            tabIndex={buka ? 0 : -1}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#E5484D] transition hover:bg-[#FEF2F2] disabled:opacity-50"
          >
            <LogOut size={18} />
            {keluarProses ? "Keluar..." : "Keluar"}
          </button>
        </nav>
      </div>
    </>
  );
}