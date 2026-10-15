"use client";

import { useState } from "react";
import GreetingHeader from "./GreetingHeader";
import StoriesRow from "./StoriesRow";
import HeroCard from "./HeroCard";
import FeaturedCard from "./FeaturedCard";
import DailyProgressCard from "./DailyProgressCard";
import MahfuzotList from "./MahfuzotList";
import TopNav from "@/app/beranda/components/layouts/TopNav";
import type { Tab } from "@/app/beranda/components/layouts/nav";
import KelompokSection from "./KelompokSection";

const SEMUA = "Semua";

export default function Beranda({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const [kategori, setKategori] = useState<string>(SEMUA);

  const scrollKeMahfuzot = () =>
    document.getElementById("daftar-mahfuzot")?.scrollIntoView({ behavior: "smooth", block: "start" });

  // menekan story yang sama lagi akan menampilkan semua mahfuzot
  const pilihKategori = (k: string) => {
    setKategori((prev) => (prev === k ? SEMUA : k));
    scrollKeMahfuzot();
  };

  return (
    <div className="space-y-5 lg:space-y-6">
      <GreetingHeader />
      <TopNav tab={tab} onChange={onChange} />
      <HeroCard onExplore={scrollKeMahfuzot} />
      <StoriesRow aktif={kategori} onPilih={pilihKategori} />

      <div className="grid gap-5 lg:grid-cols-5 lg:gap-6">
        <FeaturedCard className="lg:col-span-3" />
        <DailyProgressCard className="lg:col-span-2" />
      </div>

      <div id="daftar-mahfuzot" className="scroll-mt-6">
        <MahfuzotList kategori={kategori} onKategoriChange={setKategori} />
      </div>

      <KelompokSection />
    </div>
  );
}