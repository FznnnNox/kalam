"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AnggotaItem = {
  id: string;
  nama: string;
  peran: string;
};

const KELOMPOK = {
  nomor: "Kelompok 1",
  judul: "Tim Pengembang",
};

export default function KelompokSection() {
  const [anggota, setAnggota] = useState<AnggotaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnggota() {
      const { data, error } = await supabase
        .from("kelompok")
        .select("*")
        .order("created_at", { ascending: true }); // Mengurutkan berdasarkan data yang masuk/dibuat

      if (error) {
        console.error("Gagal memuat data kelompok:", error.message);
      } else if (data) {
        setAnggota(data);
      }
      setLoading(false);
    }

    fetchAnggota();
  }, []);

  return (
    <section
      aria-labelledby="judul-kelompok"
      className="rounded-3xl p-6 text-[#1A1A1A] sm:p-8 lg:p-10"
    >
      <p className="text-sm text-[#8A8374]">{KELOMPOK.nomor}</p>
      <h2
        id="judul-kelompok"
        className="mt-1 text-3xl text-[#1A1A1A] sm:text-4xl"
      >
        {KELOMPOK.judul}
      </h2>

      {loading ? (
        <p className="mt-8 text-sm text-[#8A8374]">Memuat data tim...</p>
      ) : anggota.length === 0 ? (
        <p className="mt-8 text-sm text-[#8A8374]">Belum ada anggota tim.</p>
      ) : (
        <ul className="mt-8 border-t border-[#D9D3C5]">
          {anggota.map((a, i) => (
            <li
              key={a.id}
              className="flex items-center gap-4 border-b border-[#D9D3C5] py-5 sm:gap-8"
            >
              <span className="w-6 shrink-0 text-sm tabular-nums text-[#8A8374]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-xl text-[#1A1A1A] sm:text-2xl">
                {a.nama}
              </span>
              <span className="text-right text-sm text-[#4B4538]">
                {a.peran}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}