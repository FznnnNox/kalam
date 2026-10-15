"use client";

import { useCallback, useEffect, useState } from "react";
import { KOTA_DEFAULT, type StatusLokasi } from "../utils";

type Koordinat = { lat: number; lng: number; nama: string };

// ubah koordinat menjadi nama kota dan provinsi, misalnya "Tangerang, Banten"
async function namaTempat(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const d = await res.json();
    const kota = d.city || d.locality;
    const provinsi = d.principalSubdivision;
    return [kota, provinsi].filter(Boolean).join(", ") || null;
  } catch {
    return null;
  }
}

export function useLokasi() {
  const [koordinat, setKoordinat] = useState<Koordinat>(KOTA_DEFAULT);
  const [statusLokasi, setStatusLokasi] = useState<StatusLokasi>("meminta");

  const mintaLokasi = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusLokasi("gagal");
      return;
    }
    setStatusLokasi("meminta");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude: lat, longitude: lng } = p.coords;
        // tampilkan dulu koordinatnya, lalu ganti dengan nama kota begitu sudah didapat
        setKoordinat({ lat, lng, nama: "Lokasi kamu" });
        setStatusLokasi("izin");

        namaTempat(lat, lng).then((nama) => {
          if (!nama) return;
          // hanya perbarui jika koordinatnya masih sama
          setKoordinat((k) => (k.lat === lat && k.lng === lng ? { ...k, nama } : k));
        });
      },
      (err) => setStatusLokasi(err.code === err.PERMISSION_DENIED ? "ditolak" : "gagal"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 },
    );
  }, []);

  useEffect(() => {
    mintaLokasi();
  }, [mintaLokasi]);

  return { koordinat, statusLokasi, mintaLokasi };
}