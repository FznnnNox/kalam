"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useAdmin } from "../AdminContext";
import {
  Judul,
  Kartu,
  Pesan,
  PASTEL,
  inputCls,
  ikonBulat,
  tombolUtama,
} from "../components/ui";

type Form = { index: number | null; nama: string };

export default function KategoriAdminPage() {
  const { mahfuzot, kategori, siap, tambahKategori, ubahKategori, hapusKategori } = useAdmin();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);

  const daftar = kategori.map((k) => k.nama);

  const jumlahPakai = (nama: string) =>
    mahfuzot.filter((m) => m.kategori === nama).length;

  const simpan = async () => {
    if (!form) return;
    const nama = form.nama.trim();
    if (!nama) {
      setError("Nama kategori wajib diisi.");
      return;
    }
    // cek duplikat tanpa membedakan huruf besar/kecil, lewati item yang sedang diubah
    const duplikat = daftar.some(
      (k, i) => k.toLowerCase() === nama.toLowerCase() && i !== form.index,
    );
    if (duplikat) {
      setError("Kategori dengan nama itu sudah ada.");
      return;
    }

    setMemproses(true);
    const err =
      form.index === null
        ? await tambahKategori(nama)
        : await ubahKategori(form.index, nama);
    setMemproses(false);

    if (err) {
      setError(err);
      return;
    }
    setForm(null);
    setError(null);
  };

  const hapus = async (index: number) => {
    const nama = daftar[index];
    const jumlah = jumlahPakai(nama);
    if (jumlah > 0) {
      window.alert(
        `Kategori "${nama}" masih dipakai ${jumlah} mahfuzot. Ubah kategori mahfuzot tersebut dulu.`,
      );
      return;
    }
    if (!window.confirm(`Hapus kategori "${nama}"?`)) return;
    const err = await hapusKategori(index);
    if (err) window.alert(err);
  };

  return (
    <>
      <Judul
        judul="Kategori"
        sub={siap ? `${kategori.length} kategori tersedia` : "Memuat data..."}
        aksi={
          <button
            onClick={() => {
              setError(null);
              setForm({ index: null, nama: "" });
            }}
            className={tombolUtama}
          >
            <Plus size={14} />
            Tambah
          </button>
        }
      />

      {form && (
        <Kartu>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-light">
              {form.index === null ? "Tambah kategori" : "Ubah nama kategori"}
            </h2>
            <button onClick={() => setForm(null)} aria-label="Tutup form" className={ikonBulat}>
              <X size={14} />
            </button>
          </div>

          <label htmlFor="nama-kategori" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">
            Nama kategori
          </label>
          <input
            id="nama-kategori"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="contoh: Tawakal"
            className={inputCls}
          />

          <div className="mt-4">
            <Pesan teks={error} />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setForm(null)}
              className="rounded-full px-5 py-2.5 text-xs font-semibold text-[#4B5563] hover:bg-[#F4F6FB]"
            >
              Batal
            </button>
            <button onClick={simpan} disabled={memproses} className={tombolUtama}>
              {memproses ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </Kartu>
      )}

      {!siap ? (
        <Kartu>
          <p className="py-8 text-center text-sm text-[#6B7280]">Memuat kategori...</p>
        </Kartu>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {daftar.map((nama, i) => {
            const gaya = PASTEL[i % PASTEL.length];
            const jumlah = jumlahPakai(nama);
            return (
              <Kartu key={kategori[i].id} className={`${gaya.kartu} !shadow-none`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xl font-light">{nama}</p>
                    <p className="mt-1 text-xs text-[#4B5563]">{jumlah} mahfuzot</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setError(null);
                        setForm({ index: i, nama });
                      }}
                      aria-label={`Ubah kategori ${nama}`}
                      className="rounded-full bg-white/70 p-2 text-[#2A44B7] transition hover:bg-white"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => hapus(i)}
                      aria-label={`Hapus kategori ${nama}`}
                      className="rounded-full bg-white/70 p-2 text-[#E5484D] transition hover:bg-white"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Kartu>
            );
          })}
        </div>
      )}

      {siap && kategori.length === 0 && (
        <Kartu>
          <p className="py-8 text-center text-sm text-[#6B7280]">Belum ada kategori.</p>
        </Kartu>
      )}
    </>
  );
}