export type NamaSholat = "Subuh" | "Dzuhur" | "Ashar" | "Maghrib" | "Isya";

// nama tampilan dipetakan ke kunci yang dipakai API Aladhan
export const SHOLAT_LIST: { nama: NamaSholat; key: string }[] = [
  { nama: "Subuh", key: "Fajr" },
  { nama: "Dzuhur", key: "Dhuhr" },
  { nama: "Ashar", key: "Asr" },
  { nama: "Maghrib", key: "Maghrib" },
  { nama: "Isya", key: "Isha" },
];

export type Hasil = {
  tanggal: string;
  hijri: string;
  waktu: Record<NamaSholat, string>; // format "HH:MM"
};

const pad = (n: number) => String(n).padStart(2, "0");

export async function ambilJadwal(lat: number, lng: number, tanggal: Date): Promise<Hasil> {
  const tgl = `${pad(tanggal.getDate())}-${pad(tanggal.getMonth() + 1)}-${tanggal.getFullYear()}`;
  // method 20 = Kemenag RI
  const url = `https://api.aladhan.com/v1/timings/${tgl}?latitude=${lat}&longitude=${lng}&method=20`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal memuat jadwal");
  const { data } = await res.json();

  const t = data.timings as Record<string, string>;
  const waktu = Object.fromEntries(
    SHOLAT_LIST.map(({ nama, key }) => [nama, t[key].split(" ")[0]]), // buang "(WIB)"
  ) as Record<NamaSholat, string>;

  const h = data.date.hijri;
  return {
    tanggal: data.date.readable,
    hijri: `${h.day} ${h.month.en} ${h.year} H`,
    waktu,
  };
}

// ubah "04:38" menjadi Date pada tanggal base
export const jamKeDate = (hhmm: string, base: Date) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(base);
  d.setHours(h, m, 0, 0);
  return d;
};

export const tambahHari = (d: Date, n: number) => new Date(d.getTime() + n * 86400000);