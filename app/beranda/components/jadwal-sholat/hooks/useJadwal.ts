"use client";

import { useEffect, useState } from "react";
import { ambilJadwal, type Hasil } from "../../../lib/jadwal";

export function useJadwal(lat: number, lng: number) {
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [status, setStatus] = useState<"memuat" | "siap" | "gagal">("memuat");

  useEffect(() => {
    let aktif = true;
    setStatus("memuat");
    ambilJadwal(lat, lng, new Date())
      .then((h) => {
        if (!aktif) return;
        setHasil(h);
        setStatus("siap");
      })
      .catch(() => aktif && setStatus("gagal"));
    return () => {
      aktif = false;
    };
  }, [lat, lng]);

  return { hasil, status };
}