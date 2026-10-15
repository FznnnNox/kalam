"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { KELOMPOK } from "@/app/beranda/data/kelompok";
import { useAdmin } from "../AdminContext";
import { Judul, Kartu, Pesan, PASTEL, inputCls, ikonBulat, tombolUtama } from "../components/ui";

type Form = { index: number | null; nama: string; peran: string };

export default function KelompokAdminPage() {
  const { anggota, siap, tambahAnggota, ubahAnggota, hapusAnggota } = useAdmin();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);

  const simpan = async () => {
    if (!form) return;
    const nama = form.nama.trim();
    const peran = form.peran.trim();
    if (!nama || !peran) {
      setError("Nama dan peran wajib diisi.");
      return;
    }

    setMemproses(true);
    const err =
      form.index === null
        ? await tambahAnggota({ nama, peran })
        : await ubahAnggota(form.index, { nama, peran });
    setMemproses(false);

    if (err) {
      setError(err);
      return;
    }
    setForm(null);
    setError(null);
  };

  const hapus = async (index: number) => {
    if (!window.confirm("Hapus anggota ini?")) return;
    const err = await hapusAnggota(index);
    if (err) window.alert(err);
  };

  return (
    <>
      <Judul
        judul="Nama Kelompok"
        sub={siap ? `${KELOMPOK.nomor} · ${anggota.length} anggota` : "Memuat data..."}
        aksi={
          <button
            onClick={() => {
              setError(null);
              setForm({ index: null, nama: "", peran: "" });
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
            <h2 className="text-xl font-light">{form.index === null ? "Tambah anggota" : "Edit anggota"}</h2>
            <button onClick={() => setForm(null)} aria-label="Tutup form" className={ikonBulat}>
              <X size={14} />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="nama" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Nama</label>
              <input
                id="nama"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="peran" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Peran</label>
              <input
                id="peran"
                value={form.peran}
                onChange={(e) => setForm({ ...form, peran: e.target.value })}
                className={inputCls}
              />
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

      <Kartu className="p-3 sm:p-4">
        {!siap ? (
          <p className="px-4 py-12 text-center text-sm text-[#6B7280]">Memuat anggota...</p>
        ) : anggota.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-[#6B7280]">Belum ada anggota.</p>
        ) : (
          <ul>
            {anggota.map((a, i) => (
              <li
                key={a.id}
                className="flex items-center gap-4 rounded-2xl px-3 py-4 transition hover:bg-[#FAFBFE] sm:px-4"
              >
                <span
                  className={`${PASTEL[i % PASTEL.length].avatar} flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold`}
                >
                  {a.nama.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl">{a.nama}</p>
                  <p className="truncate text-xs text-[#6B7280]">{a.peran}</p>
                </div>
                <span className="hidden rounded-full bg-[#F4F6FB] px-3 py-1 text-xs font-semibold text-[#4B5563] sm:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setError(null);
                      setForm({ index: i, nama: a.nama, peran: a.peran });
                    }}
                    aria-label={`Edit ${a.nama}`}
                    className="rounded-full p-2 text-[#2A44B7] transition hover:bg-[#2A44B7]/10"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => hapus(i)}
                    aria-label={`Hapus ${a.nama}`}
                    className="rounded-full p-2 text-[#E5484D] transition hover:bg-[#E5484D]/10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Kartu>
    </>
  );
}