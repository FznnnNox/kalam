"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Search, Trash2, X } from "lucide-react";
import { arabic } from "@/app/beranda/lib/fonts";
import { useAdmin } from "../AdminContext";
import {
  Judul,
  Kartu,
  Pesan,
  PASTEL,
  inputCls,
  ikonBulat,
  tombolLembut,
  tombolUtama,
} from "../components/ui";

type Form = { id: number | null; ar: string; idn: string; kategori_id: string };

// hanya huruf Arab, harakat, tanda baca Arab, dan spasi
const KARAKTER_ARAB = "\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF\\s";
const REGEX_ARAB = new RegExp(`^[${KARAKTER_ARAB}]*$`);
const REGEX_BUKAN_ARAB = new RegExp(`[^${KARAKTER_ARAB}]`, "g");
const bersihkanArab = (s: string) => s.replace(REGEX_BUKAN_ARAB, "");

export default function MahfuzotAdminPage() {
  const {
    mahfuzot,
    kategori,
    siap,
    tambahMahfuzot,
    ubahMahfuzot,
    hapusMahfuzot,
    resetMahfuzot,
  } = useAdmin();

  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);

  const warnaKategori = (kategoriId: string) =>
    PASTEL[Math.max(0, kategori.findIndex((k) => k.id === kategoriId)) % PASTEL.length];

  const hasil = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return mahfuzot;
    return mahfuzot.filter(
      (m) =>
        m.ar.includes(query.trim()) ||
        m.idn.toLowerCase().includes(q) ||
        m.kategori.toLowerCase().includes(q),
    );
  }, [mahfuzot, query]);

  const bukaTambah = () => {
    setError(null);
    setForm({ id: null, ar: "", idn: "", kategori_id: kategori[0]?.id ?? "" });
  };

  const simpan = async () => {
    if (!form) return;
    if (!form.ar.trim() || !form.idn.trim()) {
      setError("Teks Arab dan terjemahan wajib diisi.");
      return;
    }
    if (!REGEX_ARAB.test(form.ar)) {
      setError("Teks Arab hanya boleh berisi huruf Arab.");
      return;
    }
    if (!form.kategori_id) {
      setError("Pilih kategori terlebih dahulu.");
      return;
    }

    const bersih = {
      ar: form.ar.trim(),
      idn: form.idn.trim(),
      kategori_id: form.kategori_id,
    };

    setMemproses(true);
    const err =
      form.id === null
        ? await tambahMahfuzot(bersih)
        : await ubahMahfuzot(form.id, bersih);
    setMemproses(false);

    if (err) {
      setError(err);
      return;
    }
    setForm(null);
    setError(null);
  };

  const hapus = async (id: number) => {
    if (!window.confirm("Hapus mahfuzot ini?")) return;
    const err = await hapusMahfuzot(id);
    if (err) window.alert(err);
  };

  const reset = async () => {
    if (!window.confirm("Kembalikan semua mahfuzot ke data awal dari mahfuzot.ts?")) return;
    const err = await resetMahfuzot();
    if (err) window.alert(err);
    setForm(null);
  };

  return (
    <>
      <Judul
        judul="Daftar Mahfuzot"
        sub={siap ? `${mahfuzot.length} mahfuzot tersimpan` : "Memuat data..."}
        aksi={
          <>
            <button onClick={bukaTambah} className={tombolUtama}>
              <Plus size={14} />
              Tambah
            </button>
            <button onClick={reset} className={tombolLembut}>
              <RotateCcw size={14} />
              Reset
            </button>
          </>
        }
      />

      <Kartu>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari mahfuzot, arti, atau kategori..."
            aria-label="Cari mahfuzot"
            className={`${inputCls} rounded-full py-3 pl-11`}
          />
        </div>
      </Kartu>

      {form && (
        <Kartu>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-light">
              {form.id === null ? "Tambah mahfuzot" : `Edit mahfuzot #${form.id}`}
            </h2>
            <button onClick={() => setForm(null)} aria-label="Tutup form" className={ikonBulat}>
              <X size={14} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="ar" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">
                Teks Arab
              </label>
              <input
                id="ar"
                dir="rtl"
                lang="ar"
                value={form.ar}
                onChange={(e) => setForm({ ...form, ar: bersihkanArab(e.target.value) })}
                placeholder="اكتب النص العربي هنا"
                className={`${arabic.className} ${inputCls} text-lg`}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="idn" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">
                Terjemahan
              </label>
              <input
                id="idn"
                value={form.idn}
                onChange={(e) => setForm({ ...form, idn: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="kategori" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">
                Kategori
              </label>
              <select
                id="kategori"
                value={form.kategori_id}
                onChange={(e) => setForm({ ...form, kategori_id: e.target.value })}
                className={inputCls}
              >
                {kategori.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

      <Kartu className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs text-[#9CA3AF]">
              <tr className="border-b border-[#EEF1F8]">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Teks Arab</th>
                <th className="px-6 py-4 font-medium">Terjemahan</th>
                <th className="px-6 py-4 font-medium">Kategori</th>
                <th className="px-6 py-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {!siap && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">
                    Memuat mahfuzot...
                  </td>
                </tr>
              )}
              {siap &&
                hasil.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-[#F1F3F9] transition last:border-0 hover:bg-[#FAFBFE]"
                  >
                    <td className="px-6 py-4 tabular-nums text-[#9CA3AF]">{m.id}</td>
                    <td className="px-6 py-4">
                      <span dir="rtl" lang="ar" className={`${arabic.className} text-base`}>
                        {m.ar}
                      </span>
                    </td>
                    <td className="max-w-xs px-6 py-4 text-[#4B5563]">{m.idn}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`${warnaKategori(m.kategori_id).kartu} rounded-full px-3 py-1 text-[11px] font-semibold text-[#1A1A1A]/80`}
                      >
                        {m.kategori || "Tanpa kategori"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setError(null);
                            setForm({
                              id: m.id,
                              ar: m.ar,
                              idn: m.idn,
                              kategori_id: m.kategori_id,
                            });
                          }}
                          aria-label={`Edit mahfuzot ${m.id}`}
                          className="rounded-full p-2 text-[#2A44B7] transition hover:bg-[#2A44B7]/10"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => hapus(m.id)}
                          aria-label={`Hapus mahfuzot ${m.id}`}
                          className="rounded-full p-2 text-[#E5484D] transition hover:bg-[#E5484D]/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              {siap && hasil.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#6B7280]">
                    Tidak ada data yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Kartu>
    </>
  );
}