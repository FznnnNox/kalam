import { CircleDot, Compass, Home, MoonStar, type LucideIcon } from "lucide-react";

export type Tab = "beranda" | "jadwal-sholat" | "tasbih" | "kompas";

export const TABS: { id: Tab; label: string; Icon: LucideIcon }[] = [
  { id: "beranda", label: "Beranda", Icon: Home },
  { id: "jadwal-sholat", label: "Jadwal Sholat", Icon: MoonStar },
  { id: "tasbih", label: "Tasbih", Icon: CircleDot },
  { id: "kompas", label: "Kompas", Icon: Compass },
];