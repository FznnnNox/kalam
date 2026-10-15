"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { arabic } from "../../../lib/fonts";
import { TARGET_OPSI, ZIKIR, type Zikir } from "../utils";

export default function KartuZikir({
  zikir,
  zikirId,
  target,
  onGanti,
  onTarget,
}: {
  zikir: Zikir;
  zikirId: string;
  target: number;
  onGanti: (id: string) => void;
  onTarget: (t: number) => void;
}) {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <section className="flex h-full flex-col rounded-3xl bg-gradient-to-br from-[#3B58D6] via-[#2A44B7] to-[#1F36A0] p-5 text-white shadow-xl shadow-[#2A44B7]/25 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">Zikir aktif</p>
        <button
          onClick={() => setTerbuka((v) => !v)}
          aria-expanded={terbuka}
          className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold transition hover:bg-white/25"
        >
          Ganti
          <ChevronDown size={14} className={`transition ${terbuka ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
        <p
          dir="rtl"
          lang="ar"
          className={`${arabic.className} text-3xl font-bold leading-loose sm:text-4xl`}
        >
          {zikir.ar}
        </p>
        <p className="mt-1 text-sm font-semibold text-white/90">{zikir.lafal}</p>
        <p className="mt-0.5 text-xs italic text-white/70">&ldquo;{zikir.arti}&rdquo;</p>
      </div>

      {terbuka && (
        <ul className="mb-5 space-y-1.5 rounded-2xl bg-white p-2">
          {ZIKIR.map((z) => {
            const aktif = z.id === zikirId;
            return (
              <li key={z.id}>
                <button
                  onClick={() => {
                    onGanti(z.id);
                    setTerbuka(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    aktif ? "bg-[#2A44B7] text-white" : "text-[#1A1A1A] hover:bg-[#F4F6FB]"
                  }`}
                >
                  <span>
                    <span className="font-semibold">{z.lafal}</span>
                    <span className={`ml-2 text-xs ${aktif ? "text-white/75" : "text-[#6B7280]"}`}>{z.arti}</span>
                  </span>
                  {aktif && <Check size={16} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex items-center justify-center gap-2">
        <span className="text-xs text-white/80">Target</span>
        {TARGET_OPSI.map((t) => (
          <button
            key={t}
            onClick={() => onTarget(t)}
            aria-pressed={target === t}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              target === t ? "bg-white text-[#2A44B7]" : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </section>
  );
}