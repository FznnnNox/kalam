"use client";

import { useState } from "react";
import { outfit } from "./lib/fonts";
import Beranda from "./components/beranda/Beranda";
import TopNav from "./components/layouts/TopNav";
import BottomNav from "./components/layouts/BottomNav";
import JadwalSholat from "./components/jadwal-sholat/JadwalSholat";
import Tasbih from "./components/tasbih/Tasbih";
import Kompas from "./components/kompas/Kompas";
import type { Tab } from "./components/layouts/nav";

export default function Dashboard(_props: { onBack?: () => void }) {
  const [tab, setTab] = useState<Tab>("beranda");

  const change = (t: Tab) => {
    setTab(t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`${outfit.className} flex min-h-[100dvh] flex-col bg-[#F4F6FB] text-[#1A1A1A]`}
    >
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-6 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
        <div className={tab === "beranda" ? "" : "hidden"}>
          <Beranda tab={tab} onChange={change} />
        </div>

        <div className={tab === "beranda" ? "hidden" : "space-y-5 lg:space-y-6"}>
          <TopNav tab={tab} onChange={change} />

          {/* jadwal sholat tetap ter-mount agar adzan berbunyi di tab mana pun */}
          <div className={tab === "jadwal-sholat" ? "" : "hidden"}>
            <JadwalSholat />
          </div>

          {tab === "tasbih" && <Tasbih />}
          {tab === "kompas" && <Kompas />}
        </div>
      </main>

      {/* bar bawah ada di alur layout, bukan fixed, jadi selalu di tepi bawah */}
      <BottomNav tab={tab} onChange={change} />
    </div>
  );
}