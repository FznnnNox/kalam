"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSesi } from "@/app/beranda/lib/useSesi";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { siap, login } = useSesi();

  useEffect(() => {
    if (siap && !login) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [siap, login, pathname, router]);

  // selama memeriksa sesi, atau sebelum diarahkan, jangan tampilkan isi admin
  if (!siap || !login) {
    return <div className="min-h-screen bg-[#F4F6FB]" />;
  }

  return <>{children}</>;
}