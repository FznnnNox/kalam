"use client";

import { useEffect, useRef, useState } from "react";
import { jamKeDate, SHOLAT_LIST, type Hasil } from "../../../lib/jadwal";
import { KEY_PENGINGAT, KEY_SUARA } from "../utils";

export function useAdzan(hasil: Hasil | null, now: Date | null) {
  const [pengingat, setPengingat] = useState<Record<string, boolean>>({});
  const [suaraAktif, setSuaraAktif] = useState(false);
  const [sedangBunyi, setSedangBunyi] = useState(false);
  const [pesanSuara, setPesanSuara] = useState<string | null>(null);

  const adzanRef = useRef<HTMLAudioElement | null>(null);
  const terakhirCekRef = useRef<number | null>(null);
  const pengingatRef = useRef(pengingat);
  const suaraRef = useRef(suaraAktif);
  const sudahBukaRef = useRef(false);

  useEffect(() => {
    pengingatRef.current = pengingat;
  }, [pengingat]);

  useEffect(() => {
    suaraRef.current = suaraAktif;
  }, [suaraAktif]);

  // muat pengaturan dan siapkan elemen audio, termasuk status putar/berhenti
  useEffect(() => {
    try {
      setPengingat(JSON.parse(localStorage.getItem(KEY_PENGINGAT) ?? "{}"));
      setSuaraAktif(localStorage.getItem(KEY_SUARA) === "1");
    } catch {}

    const audio = new Audio("/audio/adzan.mp3");
    audio.preload = "auto";
    audio.onplay = () => setSedangBunyi(true);
    audio.onpause = () => setSedangBunyi(false);
    audio.onended = () => setSedangBunyi(false);
    audio.onerror = () => {
      console.warn("[adzan] file /audio/adzan.mp3 tidak ditemukan atau tidak bisa dibaca");
      setPesanSuara("File adzan tidak ditemukan. Pastikan ada di public/audio/adzan.mp3");
    };
    adzanRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  // buka kunci audio pada interaksi pertama, hanya jika belum ada yang berbunyi
  useEffect(() => {
    const bukaKunci = () => {
      const audio = adzanRef.current;
      if (!audio || sudahBukaRef.current || !audio.paused) return;
      audio.muted = true;
      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
          sudahBukaRef.current = true;
        })
        .catch(() => {
          audio.muted = false;
        });
    };
    window.addEventListener("pointerdown", bukaKunci);
    window.addEventListener("keydown", bukaKunci);
    return () => {
      window.removeEventListener("pointerdown", bukaKunci);
      window.removeEventListener("keydown", bukaKunci);
    };
  }, []);

  // cek setiap tick: apakah ada waktu sholat di antara pengecekan sebelumnya dan sekarang
  useEffect(() => {
    if (!now || !hasil) return;
    const sekarang = now.getTime();
    const sebelumnya = terakhirCekRef.current ?? sekarang - 1000;
    terakhirCekRef.current = sekarang;

    for (const { nama } of SHOLAT_LIST) {
      const t = jamKeDate(hasil.waktu[nama], now).getTime();
      if (t <= sebelumnya || t > sekarang) continue;

      if (!(pengingatRef.current[nama] ?? true)) continue;

      if (suaraRef.current && adzanRef.current) {
        const audio = adzanRef.current;
        audio.currentTime = 0;
        audio.play().catch((e) => {
          console.warn("[adzan] gagal diputar:", e);
          setPesanSuara("Adzan diblokir browser. Klik sekali di halaman ini, lalu tunggu waktu berikutnya.");
        });
      }

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`Waktu ${nama} telah tiba`, { body: "Saatnya menunaikan sholat." });
      }
    }
  }, [now, hasil]);

  // tombol Tes: putar jika diam, dan tidak melakukan apa-apa jika sudah berbunyi
  const tesAdzan = () => {
    const audio = adzanRef.current;
    if (!audio) return;
    if (!audio.paused) return;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setPesanSuara(null))
      .catch((e) => {
        console.warn("[adzan] tes gagal:", e);
        setPesanSuara("Gagal memutar adzan. Cek file public/audio/adzan.mp3 atau klik halaman dulu.");
      });
  };

  // hentikan adzan yang sedang berbunyi
  const hentikanAdzan = () => {
    const audio = adzanRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setSedangBunyi(false);
  };

  const aktifkanSuara = async () => {
    const audio = adzanRef.current;
    if (!audio) return;

    // jika adzan sedang berbunyi, cukup aktifkan pengaturannya tanpa mengganggu suara
    if (!audio.paused) {
      setSuaraAktif(true);
      localStorage.setItem(KEY_SUARA, "1");
      return;
    }

    try {
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      sudahBukaRef.current = true;
      setSuaraAktif(true);
      setPesanSuara(null);
      localStorage.setItem(KEY_SUARA, "1");
    } catch (e) {
      console.warn("[adzan] tidak bisa mengaktifkan:", e);
      setPesanSuara("Browser memblokir suara. Coba lagi, atau cek file public/audio/adzan.mp3.");
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  };

  const nonaktifkanSuara = () => {
    setSuaraAktif(false);
    localStorage.setItem(KEY_SUARA, "0");
  };

  const togglePengingat = (nama: string) => {
    setPengingat((prev) => {
      const next = { ...prev, [nama]: !(prev[nama] ?? true) };
      try {
        localStorage.setItem(KEY_PENGINGAT, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  return {
    pengingat,
    suaraAktif,
    sedangBunyi,
    pesanSuara,
    aktifkanSuara,
    nonaktifkanSuara,
    togglePengingat,
    tesAdzan,
    hentikanAdzan,
  };
}