import { TABS, type Tab } from "./nav";

export default function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav
      aria-label="Menu bawah"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EEF1F8] bg-white shadow-[0_-8px_28px_rgba(42,68,183,0.10)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4 gap-1 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2.5">
        {TABS.map(({ id, label, Icon }) => {
          const aktif = tab === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                aria-current={aktif ? "page" : undefined}
                className="group flex w-full flex-col items-center gap-1 focus-visible:outline-none"
              >
                <span
                  className={`flex h-9 w-14 items-center justify-center rounded-2xl transition-all duration-200 group-active:scale-95 ${
                    aktif ? "bg-[#EEF1FB] text-[#2A44B7]" : "text-[#9CA3AF]"
                  }`}
                >
                  <Icon size={20} strokeWidth={aktif ? 2.4 : 2} />
                </span>
                <span
                  className={`whitespace-nowrap text-[11px] leading-tight ${
                    aktif ? "font-semibold text-[#2A44B7]" : "font-medium text-[#6B7280]"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}