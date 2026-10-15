import type { Mahfuzot } from "../data/mahfuzot";

export type Layout = "tengah" | "editorial" | "kartu" | "minimal";
export type FontAr = "amiri" | "naskh";
export type FontLa = "playfair" | "poppins" | "georgia";
export type Rata = "kiri" | "tengah";

export type PosterConfig = {
  layout: Layout;
  latarA: string;
  latarB: string;
  gradien: boolean;
  warnaTeks: string;
  warnaAksen: string;
  fontAr: FontAr;
  fontLa: FontLa;
  ukuranAr: number;
  ukuranIdn: number;
  rata: Rata;
  judul: string;
  tampilkanKategori: boolean;
  tampilkanBrand: boolean;
  teksBrand: string;
};

export const LAYOUTS: { id: Layout; label: string }[] = [
  { id: "tengah", label: "Tengah" },
  { id: "editorial", label: "Editorial" },
  { id: "kartu", label: "Kartu" },
  { id: "minimal", label: "Minimal" },
];

export const PALET: {
  label: string;
  latarA: string;
  latarB: string;
  warnaTeks: string;
  warnaAksen: string;
}[] = [
  { label: "Biru", latarA: "#3B58D6", latarB: "#1F36A0", warnaTeks: "#FFFFFF", warnaAksen: "#FFFFFF" },
  { label: "Krem", latarA: "#FBF6EA", latarB: "#F1E7CF", warnaTeks: "#3A2E1A", warnaAksen: "#B8903F" },
  { label: "Gelap", latarA: "#15151C", latarB: "#15151C", warnaTeks: "#F5F5F7", warnaAksen: "#E5484D" },
  { label: "Hijau", latarA: "#0F5132", latarB: "#146C43", warnaTeks: "#F0FFF4", warnaAksen: "#A7F3D0" },
  { label: "Putih", latarA: "#FFFFFF", latarB: "#FFFFFF", warnaTeks: "#1A1A1A", warnaAksen: "#2A44B7" },
];

export const FONT_AR_OPSI: { id: FontAr; label: string }[] = [
  { id: "amiri", label: "Amiri" },
  { id: "naskh", label: "Noto Naskh" },
];

export const FONT_LA_OPSI: { id: FontLa; label: string }[] = [
  { id: "playfair", label: "Playfair" },
  { id: "poppins", label: "Poppins" },
  { id: "georgia", label: "Georgia" },
];

export const CONFIG_AWAL: PosterConfig = {
  layout: "tengah",
  latarA: "#3B58D6",
  latarB: "#1F36A0",
  gradien: true,
  warnaTeks: "#FFFFFF",
  warnaAksen: "#FFFFFF",
  fontAr: "amiri",
  fontLa: "playfair",
  ukuranAr: 72,
  ukuranIdn: 24,
  rata: "tengah",
  judul: "Kata Mutiara",
  tampilkanKategori: true,
  tampilkanBrand: true,
  teksBrand: "Mahfuzot",
};

const FONT_AR: Record<FontAr, string> = {
  amiri: "'Amiri', serif",
  naskh: "'Noto Naskh Arabic', serif",
};

const FONT_LA: Record<FontLa, string> = {
  playfair: "'Playfair Display', serif",
  poppins: "'Poppins', sans-serif",
  georgia: "Georgia, serif",
};

const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:ital,wght@0,400;0,600;1,400&display=swap";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// hanya terima warna hex agar aman dimasukkan ke atribut style
const hex = (s: string) => (/^#[0-9a-f]{3,8}$/i.test(s) ? s : "#000000");

const CSS = `
  @page { size: A4 portrait; margin: 0; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

  .page {
    width: 210mm; height: 297mm; position: relative; overflow: hidden;
    background: var(--bg); color: var(--fg); font-family: var(--fla);
    display: flex; flex-direction: column; padding: 20mm 18mm;
  }
  .judul {
    font-size: 12px; letter-spacing: .3em; text-transform: uppercase;
    color: var(--ac); opacity: .85;
  }
  .mid {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: var(--align);
  }
  .garis { width: 56px; height: 4px; background: var(--ac); margin-bottom: 32px; }
  .ar {
    font-family: var(--far); direction: rtl; font-size: var(--ar);
    line-height: 1.9; margin: 0 0 .25em; text-align: var(--rataAr); width: 100%;
  }
  .idn {
    font-style: italic; font-size: var(--idn); line-height: 1.5;
    margin: 0; text-align: var(--rata); opacity: .92; max-width: 100%;
  }
  .bot {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 12px; letter-spacing: .2em; text-transform: uppercase;
  }
  .kat { color: var(--ac); font-weight: 700; }
  .brand { opacity: .6; }

  /* Tengah: bingkai rapi di sekeliling */
  .L-tengah::before {
    content: ""; position: absolute; inset: 10mm; pointer-events: none;
    border: 1.5px solid var(--ac); border-radius: 10mm; opacity: .5;
  }

  /* Editorial: garis panjang, dan footer dengan garis pemisah */
  .L-editorial .garis { width: 120px; height: 6px; }
  .L-editorial .bot { border-top: 1px solid var(--ac); padding-top: 12px; }

  /* Kartu: isi di dalam kotak dengan aksen di atas */
  .L-kartu .mid {
    background: rgba(128,128,128,.08); border-radius: 8mm;
    padding: 14mm 12mm; border-top: 6px solid var(--ac);
  }

  /* Minimal: ruang kosong lega, tanpa dekorasi */
  .L-minimal { padding: 26mm 24mm; }
  .L-minimal .garis { display: none; }
  .L-minimal .idn { border-left: 3px solid var(--ac); padding-left: 16px; }
`;

// Satu sumber HTML untuk pratinjau dan cetak, supaya hasilnya selalu sama
export function buildPosterHtml(m: Mahfuzot, c: PosterConfig) {
  const bg = c.gradien ? `linear-gradient(160deg, ${hex(c.latarA)}, ${hex(c.latarB)})` : hex(c.latarA);
  const vars = [
    `--bg:${bg}`,
    `--fg:${hex(c.warnaTeks)}`,
    `--ac:${hex(c.warnaAksen)}`,
    `--far:${FONT_AR[c.fontAr]}`,
    `--fla:${FONT_LA[c.fontLa]}`,
    `--ar:${Math.min(Math.max(c.ukuranAr, 30), 120)}px`,
    `--idn:${Math.min(Math.max(c.ukuranIdn, 12), 48)}px`,
    `--align:${c.rata === "tengah" ? "center" : "flex-start"}`,
    `--rata:${c.rata === "tengah" ? "center" : "left"}`,
    `--rataAr:${c.rata === "tengah" ? "center" : "right"}`,
  ].join(";");

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Poster Mahfuzot</title>
<link href="${FONT_LINK}" rel="stylesheet" />
<style>${CSS}</style>
</head>
<body>
<div class="page L-${c.layout}" style="${vars}">
  <div class="judul">${esc(c.judul)}</div>
  <div class="mid">
    <div class="garis"></div>
    <p class="ar" lang="ar">${esc(m.ar)}</p>
    <p class="idn">&ldquo;${esc(m.idn)}&rdquo;</p>
  </div>
  <div class="bot">
    <span class="kat">${c.tampilkanKategori ? esc(m.kategori) : ""}</span>
    <span class="brand">${c.tampilkanBrand ? esc(c.teksBrand) : ""}</span>
  </div>
</div>
</body>
</html>`;
}

export function cetakPoster(m: Mahfuzot, c: PosterConfig) {
  const w = window.open("", "_blank", "width=800,height=1000");
  if (!w) {
    alert("Pop-up diblokir. Izinkan pop-up untuk mencetak poster.");
    return;
  }
  w.document.write(buildPosterHtml(m, c));
  w.document.close();

  const fonts = w.document.fonts;
  (fonts ? fonts.ready : Promise.resolve()).then(() => setTimeout(() => w.print(), 400));
}