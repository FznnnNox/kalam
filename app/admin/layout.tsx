import { outfit } from "@/app/beranda/lib/fonts";
import Sidebar from "./components/Sidebar";
import AuthGuard from "./components/AuthGuard";
import { AdminProvider } from "./AdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminProvider>
        <div
          className={`${outfit.className} min-h-screen bg-gradient-to-br from-[#E4E8FA] via-[#F4F7FC] to-[#FBE9E1] text-[#1A1A1A]`}
        >
          <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-4 sm:px-6 lg:pl-32 lg:pr-10 lg:pt-12">
            <Sidebar />
            <main className="mt-5 space-y-6 lg:mt-0">{children}</main>
          </div>
        </div>
      </AdminProvider>
    </AuthGuard>
  );
}