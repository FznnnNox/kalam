"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart, Printer, Search, X } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { arabic } from "@/app/beranda/lib/fonts";
import PosterEditor from "./PosterEditor";
import AudioBacaan from "./AudioBacaan";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SEMUA = "Semua";
const FAVORIT = "Favorit";
const STORAGE_KEY = "mahfuzot-favorit";

type MahfuzotItem = {
  id: number;
  ar: string;
  idn: string;
  kategori_id: string;
};

type KategoriItem = {
  id: string;
  nama: string;
};

// hapus harakat agar pencarian teks Arab tetap cocok walau tanpa tanda baca
const normalisasi = (s: string) =>
  s
    .replace(/[\u064B-\u0652\u0670]/g, "")
    .toLowerCase()
    .trim();

export default function MahfuzotList({
  className = "",
  kategori: kategoriProp,
  onKategoriChange,
}: {
  className?: string;
  kategori?: string;
  onKategoriChange?: (k: string) => void;
}) {
  const [dataMahfuzot, setDataMahfuzot] = useState<MahfuzotItem[]>([]);
  const [dataKategori, setDataKategori] = useState<KategoriItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [kategoriLokal, setKategoriLokal] = useState<string>(SEMUA);
  const [favorit, setFavorit] = useState<number[]>([]);
  const [posterData, setPosterData] = useState<(MahfuzotItem & { kategori: string }) | null>(null);

  // Ambil data Mahfuzot dan Kategori dari Supabase saat komponen dimuat
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [resMahfuzot, resKategori] = await Promise.all([
        supabase.from("mahfuzot").select("*").order("id", { ascending: true }),
        supabase.from("kategori").select("*").order("urutan", { ascending: true }),
      ]);

      if (resMahfuzot.data) setDataMahfuzot(resMahfuzot.data);
      if (resKategori.data) setDataKategori(resKategori.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  // jika kategori dikirim dari Beranda, pakai nilai itu; jika tidak, pakai state lokal
  const kategori = kategoriProp ?? kategoriLokal;
  const setKategori = (k: string) => {
    setKategoriLokal(k);
    onKategoriChange?.(k);
  };

  // muat favorit dari localStorage setelah mount agar tidak hydration mismatch
  useEffect(() => {
    try {
      const simpan = localStorage.getItem(STORAGE_KEY);
      if (simpan) setFavorit(JSON.parse(simpan));
    } catch {
      // abaikan jika storage tidak tersedia
    }
  }, []);

  const toggleFavorit = (id: number) => {
    setFavorit((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // abaikan
      }
      return next;
    });
  };

  // Helper untuk mendapatkan nama kategori berdasarkan kategori_id
  const getNamaKategori = (kategoriId: string) => {
    const kat = dataKategori.find((k) => k.id === kategoriId);
    return kat ? kat.nama : "Tanpa Kategori";
  };

  const hasil = useMemo(() => {
    const q = normalisasi(query);
    return dataMahfuzot.filter((m) => {
      const namaKat = getNamaKategori(m.kategori_id);
      const cocokKategori =
        kategori === SEMUA ||
        (kategori === FAVORIT
          ? favorit.includes(m.id)
          : namaKat === kategori);
      const cocokTeks =
        !q ||
        normalisasi(m.ar).includes(q) ||
        m.idn.toLowerCase().includes(q) ||
        namaKat.toLowerCase().includes(q);
      return cocokKategori && cocokTeks;
    });
  }, [dataMahfuzot, dataKategori, query, kategori, favorit]);

  const pilihan = [SEMUA, FAVORIT, ...dataKategori.map((k) => k.nama)];

  const reset = () => {
    setQuery("");
    setKategori(SEMUA);
  };

  return (
    <section
      className={`rounded-3xl bg-white p-5 shadow-[0_6px_24px_rgba(42,68,183,0.07)] sm:p-6 lg:p-8 ${className}`}
    >
      <div>
        <h2 className="text-lg font-bold lg:text-xl">Daftar Mahfuzot</h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          {loading
            ? "Memuat data mahfuzot..."
            : `Menampilkan ${hasil.length} dari ${dataMahfuzot.length} mahfuzot`}
        </p>
      </div>

      <div className="relative mt-4">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari mahfuzot, arti, atau kategori..."
          aria-label="Cari mahfuzot"
          className="w-full rounded-full border border-[#E5E7EB] bg-[#F4F6FB] py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#2A44B7] focus:ring-2 focus:ring-[#2A44B7]/20"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#6B7280] hover:bg-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pilihan.map((k) => {
          const aktif = kategori === k;
          return (
            <button
              key={k}
              onClick={() => setKategori(k)}
              aria-pressed={aktif}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                aktif
                  ? "bg-[#2A44B7] text-white"
                  : "bg-[#F4F6FB] text-[#4B5563] hover:text-[#2A44B7]"
              }`}
            >
              {k === FAVORIT && (
                <Heart size={12} className={aktif ? "fill-white" : ""} />
              )}
              {k}
              {k === FAVORIT && favorit.length > 0 && (
                <span className={aktif ? "text-white/80" : "text-[#9CA3AF]"}>
                  ({favorit.length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-12 text-center text-sm text-[#6B7280]">
          Memuat data dari database...
        </div>
      ) : hasil.length > 0 ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((m) => {
            const disukai = favorit.includes(m.id);
            const namaKat = getNamaKategori(m.kategori_id);
            return (
              <li
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border border-[#EEF1F8] bg-[#FAFBFE] p-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p
                      dir="rtl"
                      lang="ar"
                      className={`${arabic.className} flex-1 text-2xl font-bold leading-relaxed text-[#1A1A1A]`}
                    >
                      {m.ar}
                    </p>
                    <button
                      onClick={() => toggleFavorit(m.id)}
                      aria-pressed={disukai}
                      aria-label={
                        disukai ? "Hapus dari favorit" : "Tambah ke favorit"
                      }
                      className="shrink-0 rounded-full p-2 transition hover:bg-white active:scale-90"
                    >
                      <Heart
                        size={20}
                        className={
                          disukai
                            ? "fill-[#E5484D] text-[#E5484D]"
                            : "text-[#9CA3AF]"
                        }
                      />
                    </button>
                  </div>
                  <span className="mt-2 inline-block rounded-full bg-[#2A44B7]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#2A44B7]">
                    {namaKat}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm italic text-[#4B5563]">
                    &ldquo;{m.idn}&rdquo;
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <AudioBacaan teksAr={m.ar} teksIdn={m.idn} />
                    <button
                      onClick={() => setPosterData({ ...m, kategori: namaKat })}
                      className="flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 text-xs font-semibold text-[#2A44B7] shadow-sm ring-1 ring-[#2A44B7]/15 transition hover:bg-[#2A44B7] hover:text-white active:scale-95"
                    >
                      <Printer size={13} />
                      Desain poster
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-[#6B7280]">
            {kategori === FAVORIT && favorit.length === 0
              ? "Belum ada mahfuzot favorit. Tekan ikon hati untuk menyimpannya."
              : "Tidak ada mahfuzot yang cocok dengan pencarian kamu."}
          </p>
          <button
            onClick={reset}
            className="rounded-full bg-[#2A44B7]/10 px-4 py-2 text-xs font-semibold text-[#2A44B7] hover:bg-[#2A44B7]/20"
          >
            Reset pencarian
          </button>
        </div>
      )}

      {posterData && (
        <PosterEditor
          mahfuzot={posterData}
          onClose={() => setPosterData(null)}
        />
      )}
    </section>
  );
}