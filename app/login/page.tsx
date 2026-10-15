"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import { masukDenganUsername } from "@/app/beranda/lib/auth";

// username: 3-20 karakter, huruf, angka, titik, garis bawah, atau strip
const POLA_USERNAME = /^[a-zA-Z0-9._-]{3,20}$/;

// tujuan setelah login berhasil
const TUJUAN_SETELAH_LOGIN = "/admin";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memproses, setMemproses] = useState(false);

  const kirim = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!POLA_USERNAME.test(username)) {
      setError("Username 3-20 karakter: huruf, angka, titik, garis bawah, atau strip.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setMemproses(true);
    const err = await masukDenganUsername(username, password);

    if (err) {
      setMemproses(false);
      setError(err);
      return;
    }

    // berhasil: sesi sudah tersimpan di browser, pindah ke admin
    router.replace(TUJUAN_SETELAH_LOGIN);
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F6FB] px-4 py-10 text-[#1A1A1A]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[10%] top-[-10%] h-80 w-80 rounded-full bg-[#2A44B7]/10 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[10%] -left-[15%] h-80 w-80 rounded-full bg-[#2A44B7]/10 blur-[110px]"
      />

      <div className="relative w-full max-w-sm">
        <Link
          href="/beranda"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] transition hover:text-[#2A44B7]"
        >
          <ArrowLeft size={14} />
          Kembali ke beranda
        </Link>

        <div className="rounded-3xl p-6 sm:p-8">
          <form onSubmit={kirim} noValidate className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full rounded-full border border-[#E5E7EB] bg-[#F4F6FB] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#2A44B7] focus:ring-2 focus:ring-[#2A44B7]/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">
                Kata sandi
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  id="password"
                  type={lihatPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-full border border-[#E5E7EB] bg-[#F4F6FB] py-3 pl-11 pr-11 text-sm outline-none transition focus:border-[#2A44B7] focus:ring-2 focus:ring-[#2A44B7]/20"
                />
                <button
                  type="button"
                  onClick={() => setLihatPassword((v) => !v)}
                  aria-label={lihatPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[#6B7280] transition hover:bg-white hover:text-[#2A44B7]"
                >
                  {lihatPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-xl bg-[#FEF2F2] px-3 py-2 text-xs text-[#E5484D]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={memproses}
              className="flex w-full items-center justify-center rounded-full bg-[#2A44B7] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2A44B7]/30 transition hover:bg-[#1F36A0] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {memproses ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}