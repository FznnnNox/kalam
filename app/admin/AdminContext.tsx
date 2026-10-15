// "use client";

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";
// import { supabase } from "@/app/beranda/lib/supabase";
// import { DATA, type Mahfuzot } from "@/app/beranda/data/mahfuzot";
// import type { Anggota } from "@/app/beranda/data/kelompok";

// type KategoriDb = { id: string; nama: string };
// type AnggotaDb = Anggota & { id: number };
// type Hasil = Promise<string | null>; // null = berhasil, string = pesan error

// type AdminCtx = {
//   siap: boolean;
//   error: string | null;
//   mahfuzot: Mahfuzot[];
//   kategori: KategoriDb[];
//   anggota: AnggotaDb[];
//   tambahMahfuzot: (m: Omit<Mahfuzot, "id">) => Hasil;
//   ubahMahfuzot: (id: number, m: Omit<Mahfuzot, "id">) => Hasil;
//   hapusMahfuzot: (id: number) => Hasil;
//   resetMahfuzot: () => Hasil;
//   tambahKategori: (nama: string) => Hasil;
//   ubahKategori: (index: number, nama: string) => Hasil;
//   hapusKategori: (index: number) => Hasil;
//   tambahAnggota: (a: Anggota) => Hasil;
//   ubahAnggota: (index: number, a: Anggota) => Hasil;
//   hapusAnggota: (index: number) => Hasil;
// };

// const Ctx = createContext<AdminCtx | null>(null);

// export function AdminProvider({ children }: { children: ReactNode }) {
//   const [siap, setSiap] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [mahfuzot, setMahfuzot] = useState<Mahfuzot[]>([]);
//   const [kategori, setKategori] = useState<KategoriDb[]>([]);
//   const [anggota, setAnggota] = useState<AnggotaDb[]>([]);

//   const ambil = useCallback(async () => {
//     const [m, k, a] = await Promise.all([
//       supabase.from("mahfuzot").select("id, ar, idn, kategori").order("id"),
//       supabase.from("kategori").select("id, nama").order("urutan"),
//       supabase.from("anggota").select("id, nama, peran").order("urutan").order("id"),
//     ]);
//     const err = m.error ?? k.error ?? a.error;
//     setError(err ? err.message : null);
//     setMahfuzot((m.data ?? []) as Mahfuzot[]);
//     setKategori((k.data ?? []) as KategoriDb[]);
//     setAnggota((a.data ?? []) as AnggotaDb[]);
//     setSiap(true);
//   }, []);

//   useEffect(() => {
//     ambil();
//   }, [ambil]);

//   // jalankan perintah tulis, lalu muat ulang data dari database
//   const jalankan = async (p: PromiseLike<{ error: { message: string } | null }>): Hasil => {
//     const { error: err } = await p;
//     if (err) return err.message;
//     await ambil();
//     return null;
//   };

//   // mahfuzot
//   const tambahMahfuzot = (m: Omit<Mahfuzot, "id">) =>
//     jalankan(supabase.from("mahfuzot").insert(m));
//   const ubahMahfuzot = (id: number, m: Omit<Mahfuzot, "id">) =>
//     jalankan(supabase.from("mahfuzot").update(m).eq("id", id));
//   const hapusMahfuzot = (id: number) =>
//     jalankan(supabase.from("mahfuzot").delete().eq("id", id));
//   const resetMahfuzot = async (): Hasil => {
//     const hapus = await supabase.from("mahfuzot").delete().gt("id", 0);
//     if (hapus.error) return hapus.error.message;
//     return jalankan(supabase.from("mahfuzot").insert(DATA.map(({ id: _id, ...m }) => m)));
//   };

//   // kategori: ubah dan hapus memakai id dari database
//   const tambahKategori = (nama: string) =>
//     jalankan(supabase.from("kategori").insert({ nama }));
//   const ubahKategori = async (index: number, nama: string): Hasil => {
//     const k = kategori[index];
//     const lama = k.nama;
//     const r = await supabase.from("kategori").update({ nama }).eq("id", k.id);
//     if (r.error) return r.error.message;
//     // ikut ubah semua mahfuzot yang memakai nama lama
//     if (lama !== nama) {
//       return jalankan(supabase.from("mahfuzot").update({ kategori: nama }).eq("kategori", lama));
//     }
//     await ambil();
//     return null;
//   };
//   const hapusKategori = (index: number) =>
//     jalankan(supabase.from("kategori").delete().eq("id", kategori[index].id));

//   // anggota
//   const tambahAnggota = (a: Anggota) =>
//     jalankan(supabase.from("anggota").insert({ ...a, urutan: anggota.length }));
//   const ubahAnggota = (index: number, a: Anggota) =>
//     jalankan(supabase.from("anggota").update(a).eq("id", anggota[index].id));
//   const hapusAnggota = (index: number) =>
//     jalankan(supabase.from("anggota").delete().eq("id", anggota[index].id));

//   return (
//     <Ctx.Provider
//       value={{
//         siap,
//         error,
//         mahfuzot,
//         kategori,
//         anggota,
//         tambahMahfuzot,
//         ubahMahfuzot,
//         hapusMahfuzot,
//         resetMahfuzot,
//         tambahKategori,
//         ubahKategori,
//         hapusKategori,
//         tambahAnggota,
//         ubahAnggota,
//         hapusAnggota,
//       }}
//     >
//       {children}
//     </Ctx.Provider>
//   );
// }

// export function useAdmin() {
//   const v = useContext(Ctx);
//   if (!v) throw new Error("useAdmin harus dipakai di dalam AdminProvider");
//   return v;
// }

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/app/beranda/lib/supabase";
import { DATA, type Mahfuzot } from "@/app/beranda/data/mahfuzot";
import type { Anggota } from "@/app/beranda/data/kelompok";

type KategoriDb = { id: string; nama: string };
type MahfuzotDb = Mahfuzot & { kategori_id: string };
type AnggotaDb = Anggota & { id: number };
type MahfuzotRow = {
  id: number;
  ar: string;
  idn: string;
  kategori_id: string;
  kategori: { nama: string } | null;
};
type PgErr = { message: string; code?: string };
type Hasil = Promise<string | null>; // null = berhasil, string = pesan error

type AdminCtx = {
  siap: boolean;
  error: string | null;
  mahfuzot: MahfuzotDb[];
  kategori: KategoriDb[];
  anggota: AnggotaDb[];
  tambahMahfuzot: (m: { ar: string; idn: string; kategori_id: string }) => Hasil;
  ubahMahfuzot: (id: number, m: { ar: string; idn: string; kategori_id: string }) => Hasil;
  hapusMahfuzot: (id: number) => Hasil;
  resetMahfuzot: () => Hasil;
  tambahKategori: (nama: string) => Hasil;
  ubahKategori: (index: number, nama: string) => Hasil;
  hapusKategori: (index: number) => Hasil;
  tambahAnggota: (a: Anggota) => Hasil;
  ubahAnggota: (index: number, a: Anggota) => Hasil;
  hapusAnggota: (index: number) => Hasil;
};

const Ctx = createContext<AdminCtx | null>(null);

// pesan yang ramah untuk error dari database
const pesan = (e: PgErr) =>
  e.code === "23503"
    ? "Kategori ini masih dipakai mahfuzot. Pindahkan dulu mahfuzotnya."
    : e.message;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [siap, setSiap] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mahfuzot, setMahfuzot] = useState<MahfuzotDb[]>([]);
  const [kategori, setKategori] = useState<KategoriDb[]>([]);
  const [anggota, setAnggota] = useState<AnggotaDb[]>([]);

  const ambil = useCallback(async () => {
    const [m, k, a] = await Promise.all([
      supabase
        .from("mahfuzot")
        .select("id, ar, idn, kategori_id, kategori:kategori_id(nama)")
        .order("id"),
      supabase.from("kategori").select("id, nama").order("urutan"),
      supabase.from("anggota").select("id, nama, peran").order("urutan").order("id"),
    ]);
    const err = m.error ?? k.error ?? a.error;
    setError(err ? err.message : null);

    const rows = (m.data ?? []) as unknown as MahfuzotRow[];
    setMahfuzot(
      rows.map((r) => ({
        id: r.id,
        ar: r.ar,
        idn: r.idn,
        kategori: r.kategori?.nama ?? "",
        kategori_id: r.kategori_id,
      })),
    );
    setKategori((k.data ?? []) as KategoriDb[]);
    setAnggota((a.data ?? []) as AnggotaDb[]);
    setSiap(true);
  }, []);

  useEffect(() => {
    ambil();
  }, [ambil]);

  // jalankan perintah tulis, lalu muat ulang data dari database
  const jalankan = async (p: PromiseLike<{ error: PgErr | null }>): Hasil => {
    const { error: err } = await p;
    if (err) return pesan(err);
    await ambil();
    return null;
  };

  // mahfuzot
  const tambahMahfuzot = (m: { ar: string; idn: string; kategori_id: string }) =>
    jalankan(supabase.from("mahfuzot").insert(m));

  const ubahMahfuzot = (id: number, m: { ar: string; idn: string; kategori_id: string }) =>
    jalankan(supabase.from("mahfuzot").update(m).eq("id", id));

  const hapusMahfuzot = (id: number) =>
    jalankan(supabase.from("mahfuzot").delete().eq("id", id));

  // reset: hapus semua, lalu isi ulang dari mahfuzot.ts dengan kategori_id yang sesuai
  const resetMahfuzot = async (): Hasil => {
    const hapus = await supabase.from("mahfuzot").delete().gt("id", 0);
    if (hapus.error) return pesan(hapus.error);

    const { data: ks, error: errK } = await supabase.from("kategori").select("id, nama");
    if (errK) return pesan(errK);

    const peta = new Map<string, string>(
      (ks ?? []).map((k) => [k.nama.toLowerCase(), k.id] as [string, string]),
    );
    const baris = DATA.flatMap(({ ar, idn, kategori }) => {
      const kid = peta.get(kategori.toLowerCase());
      return kid ? [{ ar, idn, kategori_id: kid }] : [];
    });
    return jalankan(supabase.from("mahfuzot").insert(baris));
  };

  // kategori: cukup ubah nama, karena mahfuzot merujuk ke id
  const tambahKategori = (nama: string) =>
    jalankan(supabase.from("kategori").insert({ nama }));

  const ubahKategori = (index: number, nama: string) =>
    jalankan(supabase.from("kategori").update({ nama }).eq("id", kategori[index].id));

  const hapusKategori = (index: number) =>
    jalankan(supabase.from("kategori").delete().eq("id", kategori[index].id));

  // anggota
  const tambahAnggota = (a: Anggota) =>
    jalankan(supabase.from("anggota").insert({ ...a, urutan: anggota.length }));

  const ubahAnggota = (index: number, a: Anggota) =>
    jalankan(supabase.from("anggota").update(a).eq("id", anggota[index].id));

  const hapusAnggota = (index: number) =>
    jalankan(supabase.from("anggota").delete().eq("id", anggota[index].id));

  return (
    <Ctx.Provider
      value={{
        siap,
        error,
        mahfuzot,
        kategori,
        anggota,
        tambahMahfuzot,
        ubahMahfuzot,
        hapusMahfuzot,
        resetMahfuzot,
        tambahKategori,
        ubahKategori,
        hapusKategori,
        tambahAnggota,
        ubahAnggota,
        hapusAnggota,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdmin harus dipakai di dalam AdminProvider");
  return v;
}