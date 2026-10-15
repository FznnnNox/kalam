export type Zikir = { id: string; ar: string; lafal: string; arti: string };

export const ZIKIR: Zikir[] = [
  { id: "subhanallah", ar: "سُبْحَانَ اللهِ", lafal: "Subhanallah", arti: "Maha Suci Allah" },
  { id: "alhamdulillah", ar: "الْحَمْدُ لِلهِ", lafal: "Alhamdulillah", arti: "Segala puji bagi Allah" },
  { id: "allahuakbar", ar: "اللهُ أَكْبَرُ", lafal: "Allahu Akbar", arti: "Allah Maha Besar" },
  { id: "tahlil", ar: "لَا إِلَهَ إِلَّا اللهُ", lafal: "Laa ilaaha illallah", arti: "Tiada Tuhan selain Allah" },
  { id: "istighfar", ar: "أَسْتَغْفِرُ اللهَ", lafal: "Astaghfirullah", arti: "Aku memohon ampun kepada Allah" },
];

export const TARGET_OPSI = [33, 99, 100];

export const KEY_TASBIH = "tasbih-state";

export type Simpanan = { zikirId: string; count: number; target: number; detik: number };

export const SIMPANAN_AWAL: Simpanan = { zikirId: ZIKIR[0].id, count: 0, target: 33, detik: 0 };

export const pad = (n: number) => String(n).padStart(2, "0");

export const formatDurasi = (detik: number) =>
  `${pad(Math.floor(detik / 3600))}:${pad(Math.floor((detik % 3600) / 60))}:${pad(detik % 60)}`;