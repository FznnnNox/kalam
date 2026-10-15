"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ambilJadwal, type Hasil } from "../../../lib/jadwal";

type Koordinat = { lat: number; lng: number };
type StatusLokasi = "meminta" | "izin" | "ditolak" | "gagal";
type OrientasiEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };

// ubah koordinat menjadi nama kota, provinsi, dan negara (tanpa API key)
async function namaTempat(lat: number, lng: number) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const d = await res.json();
    return {
      lokasi: [d.city || d.locality, d.principalSubdivision].filter(Boolean).join(", ") || "Lokasi kamu",
      negara: d.countryName ?? "",
    };
  } catch {
    return null;
  }
}

export function useKompas() {
  const [koordinat, setKoordinat] = useState<Koordinat | null>(null);
  const [lokasi, setLokasi] = useState("Mencari lokasi...");
  const [negara, setNegara] = useState("");
  const [status, setStatus] = useState<StatusLokasi>("meminta");
  const [hasil, setHasil] = useState<Hasil | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [perluIzinSensor, setPerluIzinSensor] = useState(false);

  // true setelah sensor absolut pernah mengirim data; sejak itu sensor relatif diabaikan
  const absolutAktifRef = useRef(false);

  // lokasi dari perangkat
  const mintaLokasi = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus("ditolak");
      return;
    }
    setStatus("meminta");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude: lat, longitude: lng } = p.coords;
        setKoordinat({ lat, lng });
        setStatus("izin");
        namaTempat(lat, lng).then((t) => {
          if (t) {
            setLokasi(t.lokasi);
            setNegara(t.negara);
          }
        });
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "ditolak" : "gagal"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 },
    );
  }, []);

  useEffect(() => {
    mintaLokasi();
  }, [mintaLokasi]);

  // jadwal sholat untuk ditampilkan di bagian bawah
  useEffect(() => {
    if (!koordinat) return;
    let aktif = true;
    ambilJadwal(koordinat.lat, koordinat.lng, new Date())
      .then((h) => {
        if (aktif) setHasil(h);
      })
      .catch(() => {});
    return () => {
      aktif = false;
    };
  }, [koordinat]);

  // iOS butuh izin khusus untuk sensor orientasi
  useEffect(() => {
    const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: unknown } })
      .DeviceOrientationEvent;
    if (DOE && typeof DOE.requestPermission === "function") setPerluIzinSensor(true);
  }, []);

  // baca arah kompas perangkat: prioritas sensor absolut, relatif hanya sebagai cadangan
  useEffect(() => {
    if (perluIzinSensor || !("DeviceOrientationEvent" in window)) return;

    const ambilHeading = (ev: OrientasiEvent): number | null => {
      // iOS: heading kompas langsung dari sistem
      if (typeof ev.webkitCompassHeading === "number" && ev.webkitCompassHeading >= 0) {
        return ev.webkitCompassHeading;
      }
      if (ev.alpha === null) return null;
      return (360 - ev.alpha) % 360;
    };

    // hanya perbarui jika berubah lebih dari 0.5°, agar tidak render berlebihan
    const simpan = (h: number) => {
      setHeading((prev) => {
        if (prev === null) return h;
        const selisih = Math.abs(((h - prev + 540) % 360) - 180);
        return selisih > 0.5 ? h : prev;
      });
    };

    const saatAbsolut = (e: Event) => {
      absolutAktifRef.current = true;
      const h = ambilHeading(e as OrientasiEvent);
      if (h !== null) simpan(h);
    };

    const saatRelatif = (e: Event) => {
      if (absolutAktifRef.current) return;
      const h = ambilHeading(e as OrientasiEvent);
      if (h !== null) simpan(h);
    };

    window.addEventListener("deviceorientationabsolute", saatAbsolut);
    window.addEventListener("deviceorientation", saatRelatif);
    return () => {
      window.removeEventListener("deviceorientationabsolute", saatAbsolut);
      window.removeEventListener("deviceorientation", saatRelatif);
    };
  }, [perluIzinSensor]);

  const aktifkanSensor = async () => {
    const DOE = (window as unknown as {
      DeviceOrientationEvent: { requestPermission: () => Promise<"granted" | "denied"> };
    }).DeviceOrientationEvent;
    try {
      const r = await DOE.requestPermission();
      if (r === "granted") setPerluIzinSensor(false);
    } catch {}
  };

  return {
    koordinat,
    lokasi,
    negara,
    status,
    hasil,
    heading,
    perluIzinSensor,
    aktifkanSensor,
    mintaLokasi,
  };
}