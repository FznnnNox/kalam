"use client";

import { useTasbih } from "./hooks/useTasbih";
import { ZIKIR } from "./utils";
import KartuZikir from "./components/KartuZikir";
import PenghitungBesar from "./components/PenghitungBesar";

export default function Tasbih() {
  const { s, tambah, reset, gantiZikir, gantiTarget } = useTasbih();
  const zikir = ZIKIR.find((z) => z.id === s.zikirId) ?? ZIKIR[0];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-18">
      <header className="text-center">
        <h2 className="text-lg font-bold text-[#1A1A1A]">Tasbih</h2>
      </header>

      {/* mobile: bertumpuk, desktop: berdampingan dengan tinggi sama */}
      <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
        <KartuZikir
          zikir={zikir}
          zikirId={s.zikirId}
          target={s.target}
          onGanti={gantiZikir}
          onTarget={gantiTarget}
        />
        <PenghitungBesar
          count={s.count}
          target={s.target}
          detik={s.detik}
          onTambah={tambah}
          onReset={reset}
        />
      </div>
    </div>
  );
}