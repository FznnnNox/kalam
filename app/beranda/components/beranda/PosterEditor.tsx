"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Printer, RotateCcw, X } from "lucide-react";
import type { Mahfuzot } from "../../data/mahfuzot";
import {
  buildPosterHtml,
  cetakPoster,
  CONFIG_AWAL,
  FONT_AR_OPSI,
  FONT_LA_OPSI,
  LAYOUTS,
  PALET,
  type PosterConfig,
} from "@/app/beranda/lib/poster";

const LEBAR_A4 = 794; // px pada 96 dpi
const TINGGI_A4 = 1123; // px pada 96 dpi
const LEBAR_PRATINJAU_MAKS = 560;
const SEMBUNYI_SCROLLBAR = "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function Judul({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-semibold text-[#6B7280]">{children}</p>;
}

function Pilihan<T extends string>({
  opsi,
  nilai,
  onChange,
}: {
  opsi: { id: T; label: string }[];
  nilai: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opsi.map((o) => {
        const aktif = nilai === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={aktif}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              aktif ? "bg-[#2A44B7] text-white" : "bg-[#F4F6FB] text-[#4B5563] hover:text-[#2A44B7]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Warna({ label, nilai, onChange }: { label: string; nilai: string; onChange: (v: string) => void }) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <input
        type="color"
        value={nilai}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 cursor-pointer rounded border-0 bg-transparent p-0"
      />
    </label>
  );
}

function Geser({
  label,
  nilai,
  min,
  max,
  onChange,
}: {
  label: string;
  nilai: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs font-semibold text-[#6B7280]">
        <span>{label}</span>
        <span>{nilai}px</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={nilai}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#2A44B7]"
      />
    </div>
  );
}

function Saklar({ label, nilai, onChange }: { label: string; nilai: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={nilai}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#2A44B7]"
      />
    </label>
  );
}

export default function PosterEditor({
  mahfuzot,
  onClose,
}: {
  mahfuzot: Mahfuzot;
  onClose: () => void;
}) {
  const [c, setC] = useState<PosterConfig>(CONFIG_AWAL);

  const set = <K extends keyof PosterConfig>(k: K, v: PosterConfig[K]) =>
    setC((prev) => ({ ...prev, [k]: v }));

  const terapkanPalet = (p: (typeof PALET)[number]) =>
    setC((prev) => ({
      ...prev,
      latarA: p.latarA,
      latarB: p.latarB,
      warnaTeks: p.warnaTeks,
      warnaAksen: p.warnaAksen,
    }));

  // skala pratinjau mengikuti lebar kontainer
  const wrapRef = useRef<HTMLDivElement>(null);
  const [skala, setSkala] = useState(0.4);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSkala(e.contentRect.width / LEBAR_A4));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // tutup dengan tombol Esc
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const html = buildPosterHtml(mahfuzot, c);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl lg:h-[88vh] lg:flex-row"
      >
        {/* pratinjau: area scroll sendiri agar bagian bawah poster bisa dilihat */}
        <div className="order-1 flex h-[42vh] shrink-0 flex-col bg-[#F4F6FB] lg:order-2 lg:h-auto lg:min-w-0 lg:flex-1">
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <div
              ref={wrapRef}
              className="relative mx-auto w-full"
              style={{
                height: TINGGI_A4 * skala,
                maxWidth: LEBAR_PRATINJAU_MAKS,
              }}
            >
              <iframe
                title="Pratinjau poster"
                srcDoc={html}
                className="absolute left-0 top-0 border-0 bg-white shadow-xl"
                style={{
                  width: LEBAR_A4,
                  height: TINGGI_A4,
                  transform: `scale(${skala})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </div>

          <div className="flex shrink-0 gap-3 border-t border-[#E5E7EB] bg-white p-4 sm:px-6">
            <button
              onClick={() => setC(CONFIG_AWAL)}
              className="flex items-center gap-2 rounded-full bg-[#F4F6FB] px-4 py-2.5 text-sm font-semibold text-[#4B5563] hover:text-[#2A44B7]"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={() => cetakPoster(mahfuzot, c)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#2A44B7] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#2A44B7]/30 transition hover:bg-[#1F36A0] active:scale-95"
            >
              <Printer size={16} />
              Cetak poster
            </button>
          </div>
        </div>

        {/* panel pengaturan: scrollbar disembunyikan */}
        <div className="order-2 flex min-h-0 flex-1 flex-col border-t border-[#EEF1F8] bg-white lg:order-1 lg:w-80 lg:flex-none lg:shrink-0 lg:border-r lg:border-t-0">
          <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
            <h3 className="text-lg font-bold">Desain Poster</h3>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="rounded-full p-1.5 text-[#6B7280] hover:bg-[#F4F6FB]"
            >
              <X size={18} />
            </button>
          </div>

          <div className={`min-h-0 flex-1 space-y-6 overflow-y-auto px-5 pb-6 pt-3 sm:px-6 ${SEMBUNYI_SCROLLBAR}`}>
            <div>
              <Judul>Layout</Judul>
              <Pilihan opsi={LAYOUTS} nilai={c.layout} onChange={(v) => set("layout", v)} />
            </div>

            <div>
              <Judul>Palet cepat</Judul>
              <div className="flex flex-wrap gap-2">
                {PALET.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => terapkanPalet(p)}
                    className="flex items-center gap-2 rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-[#4B5563] hover:text-[#2A44B7]"
                  >
                    <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: p.latarA }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Judul>Warna</Judul>
              <Warna label="Latar" nilai={c.latarA} onChange={(v) => set("latarA", v)} />
              <Saklar label="Latar gradasi" nilai={c.gradien} onChange={(v) => set("gradien", v)} />
              {c.gradien && <Warna label="Latar bawah" nilai={c.latarB} onChange={(v) => set("latarB", v)} />}
              <Warna label="Warna teks" nilai={c.warnaTeks} onChange={(v) => set("warnaTeks", v)} />
              <Warna label="Warna aksen" nilai={c.warnaAksen} onChange={(v) => set("warnaAksen", v)} />
            </div>

            <div>
              <Judul>Font Arab</Judul>
              <Pilihan opsi={FONT_AR_OPSI} nilai={c.fontAr} onChange={(v) => set("fontAr", v)} />
            </div>

            <div>
              <Judul>Font terjemahan</Judul>
              <Pilihan opsi={FONT_LA_OPSI} nilai={c.fontLa} onChange={(v) => set("fontLa", v)} />
            </div>

            <div className="space-y-4">
              <Judul>Ukuran & perataan</Judul>
              <Geser label="Teks Arab" nilai={c.ukuranAr} min={40} max={110} onChange={(v) => set("ukuranAr", v)} />
              <Geser label="Terjemahan" nilai={c.ukuranIdn} min={14} max={40} onChange={(v) => set("ukuranIdn", v)} />
              <Pilihan
                opsi={[
                  { id: "kiri", label: "Rata kiri" },
                  { id: "tengah", label: "Rata tengah" },
                ]}
                nilai={c.rata}
                onChange={(v) => set("rata", v)}
              />
            </div>

            <div className="space-y-3">
              <Judul>Teks & footer</Judul>
              <input
                value={c.judul}
                onChange={(e) => set("judul", e.target.value)}
                placeholder="Judul atas"
                aria-label="Judul atas"
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F4F6FB] px-3 py-2 text-sm outline-none focus:border-[#2A44B7]"
              />
              <Saklar label="Tampilkan kategori" nilai={c.tampilkanKategori} onChange={(v) => set("tampilkanKategori", v)} />
              <Saklar label="Tampilkan brand" nilai={c.tampilkanBrand} onChange={(v) => set("tampilkanBrand", v)} />
              {c.tampilkanBrand && (
                <input
                  value={c.teksBrand}
                  onChange={(e) => set("teksBrand", e.target.value)}
                  placeholder="Nama brand"
                  aria-label="Nama brand"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F4F6FB] px-3 py-2 text-sm outline-none focus:border-[#2A44B7]"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}