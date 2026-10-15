"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Volume2 } from "lucide-react";

// cari suara berdasarkan awalan kode bahasa, misalnya "ar" cocok dengan ar-SA atau ar-EG
const cariSuara = (synth: SpeechSynthesis, awalan: string) =>
  synth
    .getVoices()
    .find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(awalan)) ?? null;

export default function AudioBacaan({ teksAr, teksIdn }: { teksAr: string; teksIdn: string }) {
  const [didukung, setDidukung] = useState(false);
  const [sedangBaca, setSedangBaca] = useState(false);
  const [adaSuaraArab, setAdaSuaraArab] = useState(true);

  // simpan referensi utterance agar tidak dihapus oleh garbage collector di sebagian browser
  const utterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setDidukung(true);

    const synth = window.speechSynthesis;
    // daftar suara sering kosong saat awal, jadi cek ulang setiap kali sudah tersedia
    const perbarui = () => setAdaSuaraArab(cariSuara(synth, "ar") !== null);
    perbarui();
    synth.addEventListener("voiceschanged", perbarui);

    return () => {
      synth.removeEventListener("voiceschanged", perbarui);
      synth.cancel();
    };
  }, []);

  const berhenti = () => {
    window.speechSynthesis.cancel();
    utterancesRef.current = [];
    setSedangBaca(false);
  };

  const toggle = () => {
    if (sedangBaca) {
      berhenti();
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const ar = new SpeechSynthesisUtterance(teksAr);
    ar.lang = "ar-SA";
    ar.rate = 0.8;
    const suaraAr = cariSuara(synth, "ar");
    if (suaraAr) ar.voice = suaraAr;

    const idn = new SpeechSynthesisUtterance(teksIdn);
    idn.lang = "id-ID";
    idn.rate = 0.95;
    const suaraId = cariSuara(synth, "id");
    if (suaraId) idn.voice = suaraId;

    ar.onerror = berhenti;
    idn.onend = berhenti;
    idn.onerror = berhenti;

    utterancesRef.current = [ar, idn];
    setSedangBaca(true);

    // jeda singkat setelah cancel, karena speak langsung setelahnya kadang diabaikan Chrome
    setTimeout(() => {
      synth.speak(ar);
      synth.speak(idn);
    }, 60);
  };

  if (!didukung) return null;

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={toggle}
        aria-label={sedangBaca ? "Berhenti" : "Putar bacaan"}
        className="flex items-center gap-1.5 rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-[#2A44B7] transition hover:bg-[#2A44B7] hover:text-white active:scale-95"
      >
        {sedangBaca ? <Pause size={13} /> : <Volume2 size={13} />}
        {sedangBaca ? "Berhenti" : "Putar"}
      </button>
      {!adaSuaraArab && (
        <p className="text-[10px] text-[#9CA3AF]">Suara Arab belum terpasang</p>
      )}
    </div>
  );
}