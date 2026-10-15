import { CloudSun, MoonStar, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import { jamKeDate, SHOLAT_LIST, tambahHari, type Hasil, type NamaSholat } from "../../lib/jadwal";

export const KOTA_DEFAULT = { lat: -6.12, lng: 106.15, nama: "Serang, Banten" };
export const KEY_PENGINGAT = "jadwal-pengingat";
export const KEY_SUARA = "jadwal-suara-adzan";
export const PANJANG_BUSUR = Math.PI * 100;

export type StatusLokasi = "meminta" | "izin" | "ditolak" | "gagal" | "default";

export const IKON: Record<NamaSholat, LucideIcon> = {
  Subuh: Sunrise,
  Dzuhur: Sun,
  Ashar: CloudSun,
  Maghrib: Sunset,
  Isya: MoonStar,
};

export const LABEL_LOKASI: Record<StatusLokasi, string> = {
  meminta: "Meminta izin lokasi...",
  izin: "Lokasi perangkat",
  ditolak: "Izin lokasi ditolak, memakai Serang",
  gagal: "Lokasi tidak terbaca, memakai Serang",
  default: "Serang, Banten",
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const jam = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// titik di busur setengah lingkaran berdasarkan progres 0..1
export function titikBusur(progres: number) {
  const sudut = Math.PI - progres * Math.PI;
  return { x: 120 + 100 * Math.cos(sudut), y: 120 - 100 * Math.sin(sudut) };
}

// sholat sebelumnya dan berikutnya dari waktu sekarang
export function hitungSholat(waktu: Hasil["waktu"], now: Date) {
  const daftar = SHOLAT_LIST.map(({ nama }) => ({ nama, waktu: jamKeDate(waktu[nama], now) }));

  const idx = daftar.findIndex((s) => s.waktu > now);
  if (idx === -1) {
    // sudah lewat Isya: Subuh besok (perkiraan dari jadwal hari ini)
    return {
      sebelumnya: daftar[daftar.length - 1],
      berikutnya: { nama: daftar[0].nama, waktu: tambahHari(daftar[0].waktu, 1) },
    };
  }
  return {
    sebelumnya: idx === 0 ? { nama: daftar[4].nama, waktu: tambahHari(daftar[4].waktu, -1) } : daftar[idx - 1],
    berikutnya: daftar[idx],
  };
}

export type Info = ReturnType<typeof hitungSholat>;

// progres busur dan sisa waktu hitung mundur
export function hitungProgres(info: Info, now: Date) {
  const total = info.berikutnya.waktu.getTime() - info.sebelumnya.waktu.getTime();
  const progres = Math.min(Math.max((now.getTime() - info.sebelumnya.waktu.getTime()) / total, 0), 1);
  const detik = Math.max(Math.floor((info.berikutnya.waktu.getTime() - now.getTime()) / 1000), 0);
  const sisa = { h: Math.floor(detik / 3600), m: Math.floor((detik % 3600) / 60), s: detik % 60 };
  return { progres, sisa };
}