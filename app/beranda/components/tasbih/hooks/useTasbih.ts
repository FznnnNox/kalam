"use client";

import { useEffect, useState } from "react";
import { KEY_TASBIH, SIMPANAN_AWAL, type Simpanan } from "../utils";

export function useTasbih() {
  const [s, setS] = useState<Simpanan>(SIMPANAN_AWAL);
  const [siap, setSiap] = useState(false);

  // muat dari localStorage setelah mount agar tidak hydration mismatch
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_TASBIH);
      if (raw) setS({ ...SIMPANAN_AWAL, ...JSON.parse(raw) });
    } catch {}
    setSiap(true);
  }, []);

  // simpan setiap perubahan
  useEffect(() => {
    if (!siap) return;
    try {
      localStorage.setItem(KEY_TASBIH, JSON.stringify(s));
    } catch {}
  }, [s, siap]);

  // timer hanya berjalan saat sedang menghitung (belum mencapai target)
  const berjalan = s.count > 0 && s.count < s.target;
  useEffect(() => {
    if (!siap || !berjalan) return;
    const timer = setInterval(() => setS((p) => ({ ...p, detik: p.detik + 1 })), 1000);
    return () => clearInterval(timer);
  }, [siap, berjalan]);

  // tambah hitungan, berhenti otomatis saat target tercapai
  const tambah = () => {
    setS((p) => {
      if (p.count >= p.target) return p;
      const next = p.count + 1;
      if (next === p.target) navigator.vibrate?.([120, 60, 120]);
      else if (next % 10 === 0) navigator.vibrate?.(30);
      return { ...p, count: next };
    });
  };

  const reset = () => setS((p) => ({ ...p, count: 0, detik: 0 }));

  const gantiZikir = (id: string) => setS((p) => ({ ...p, zikirId: id, count: 0, detik: 0 }));

  // ganti target juga memulai ulang hitungan
  const gantiTarget = (target: number) => setS((p) => ({ ...p, target, count: 0, detik: 0 }));

  return { s, tambah, reset, gantiZikir, gantiTarget };
}