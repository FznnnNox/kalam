// import { TABS, type Tab } from "./nav";

// export default function TopNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
//   return (
//     <>
//       {/* desktop: menu di atas */}
//       <nav aria-label="Menu utama" className="mx-auto hidden w-full max-w-lg lg:block">
//         <ul className="grid grid-cols-4 gap-6">
//           {TABS.map(({ id, label, Icon }) => {
//             const aktif = tab === id;
//             return (
//               <li key={id}>
//                 <button
//                   onClick={() => onChange(id)}
//                   aria-current={aktif ? "page" : undefined}
//                   className="group flex w-full flex-col items-center gap-1.5 focus-visible:outline-none"
//                 >
//                   <span
//                     className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[#2A44B7]/30 ${
//                       aktif
//                         ? "bg-gradient-to-br from-[#3B58D6] to-[#2A44B7] text-white shadow-md shadow-[#2A44B7]/30 ring-2 ring-[#2A44B7]/30 ring-offset-2 ring-offset-[#F4F6FB]"
//                         : "bg-white text-[#2A44B7] shadow-[0_4px_16px_rgba(42,68,183,0.08)] ring-1 ring-[#E5E9F5]"
//                     }`}
//                   >
//                     <Icon size={20} strokeWidth={aktif ? 2.4 : 2} />
//                   </span>
//                   <span
//                     className={`whitespace-nowrap text-center text-xs leading-tight ${
//                       aktif ? "font-semibold text-[#2A44B7]" : "font-medium text-[#4B5563]"
//                     }`}
//                   >
//                     {label}
//                   </span>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* mobile: bar di bawah layar */}
//       {/* mobile: bar full-width yang menempel ke tepi bawah layar */}
// <nav
//   aria-label="Menu bawah"
//   className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EEF1F8] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(42,68,183,0.10)] lg:hidden"
// >
//   <ul className="mx-auto grid max-w-md grid-cols-4 gap-1 px-3 pb-4 pt-3">
//     {TABS.map(({ id, label, Icon }) => {
//       const aktif = tab === id;
//       return (
//         <li key={id}>
//           <button
//             onClick={() => onChange(id)}
//             aria-current={aktif ? "page" : undefined}
//             className="group flex w-full flex-col items-center gap-1 focus-visible:outline-none"
//           >
//             <span
//               className={`flex h-9 w-14 items-center justify-center rounded-2xl transition-all duration-200 group-active:scale-95 ${
//                 aktif ? "bg-[#EEF1FB] text-[#2A44B7]" : "text-[#9CA3AF]"
//               }`}
//             >
//               <Icon size={20} strokeWidth={aktif ? 2.4 : 2} />
//             </span>
//             <span
//               className={`whitespace-nowrap text-[11px] leading-tight ${
//                 aktif ? "font-semibold text-[#2A44B7]" : "font-medium text-[#6B7280]"
//               }`}
//             >
//               {label}
//             </span>
//           </button>
//         </li>
//       );
//     })}
//   </ul>
// </nav>
//     </>
//   );
// }

import { TABS, type Tab } from "./nav";

export default function TopNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav aria-label="Menu utama" className="mx-auto hidden w-full max-w-lg lg:block">
      <ul className="grid grid-cols-4 gap-6">
        {TABS.map(({ id, label, Icon }) => {
          const aktif = tab === id;
          return (
            <li key={id}>
              <button
                onClick={() => onChange(id)}
                aria-current={aktif ? "page" : undefined}
                className="group flex w-full flex-col items-center gap-1.5 focus-visible:outline-none"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-105 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[#2A44B7]/30 ${
                    aktif
                      ? "bg-gradient-to-br from-[#3B58D6] to-[#2A44B7] text-white shadow-md shadow-[#2A44B7]/30 ring-2 ring-[#2A44B7]/30 ring-offset-2 ring-offset-[#F4F6FB]"
                      : "bg-white text-[#2A44B7] shadow-[0_4px_16px_rgba(42,68,183,0.08)] ring-1 ring-[#E5E9F5]"
                  }`}
                >
                  <Icon size={20} strokeWidth={aktif ? 2.4 : 2} />
                </span>
                <span
                  className={`whitespace-nowrap text-center text-xs leading-tight ${
                    aktif ? "font-semibold text-[#2A44B7]" : "font-medium text-[#4B5563]"
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