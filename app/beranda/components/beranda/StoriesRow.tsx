import { Clock, Flame, Leaf, Lightbulb, Sparkles, type LucideIcon } from "lucide-react";

// label harus sama dengan nilai kategori di data/mahfuzot.ts
const ITEMS: { label: string; Icon: LucideIcon; from: string; to: string; isNew?: boolean }[] = [
  { label: "Semangat", Icon: Flame, from: "#3B58D6", to: "#2A44B7", isNew: true },
  { label: "Sabar", Icon: Leaf, from: "#4C6AE0", to: "#2F49BD" },
  { label: "Ilmu", Icon: Lightbulb, from: "#2A44B7", to: "#1F36A0" },
  { label: "Waktu", Icon: Clock, from: "#3F5CD0", to: "#2A44B7" },
  { label: "Akhlak", Icon: Sparkles, from: "#5573E6", to: "#3149B5" },
];

export default function StoriesRow({
  aktif,
  onPilih,
}: {
  aktif: string;
  onPilih: (kategori: string) => void;
}) {
  return (
    <div className="flex gap-4 overflow-x-auto px-1 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:justify-between lg:gap-8">
      {ITEMS.map(({ label, Icon, from, to, isNew }) => {
        const terpilih = aktif === label;
        return (
          <button
            key={label}
            onClick={() => onPilih(label)}
            aria-pressed={terpilih}
            className="group flex shrink-0 flex-col items-center gap-2 focus-visible:outline-none lg:flex-1"
          >
            <span className="relative">
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-full text-white transition duration-200 group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[#2A44B7]/30 lg:h-20 lg:w-20 ${
                  terpilih
                    ? "ring-[3px] ring-[#2A44B7] ring-offset-2 ring-offset-[#F4F6FB]"
                    : "ring-2 ring-[#2A44B7]/40 ring-offset-2 ring-offset-[#F4F6FB]"
                }`}
                style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              >
                <Icon size={26} />
              </span>
              {isNew && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-[#E5484D] px-2 py-0.5 text-[9px] font-bold text-white ring-2 ring-[#F4F6FB]">
                  Baru
                </span>
              )}
            </span>
            <span
              className={`text-xs lg:text-sm ${
                terpilih ? "font-semibold text-[#2A44B7]" : "font-medium text-[#4B5563]"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}