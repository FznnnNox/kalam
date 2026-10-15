"use client";

import { useRouter } from "next/navigation";
import Dashboard from "./Dashboard";

export default function DashboardPage() {
  const router = useRouter();
  return <Dashboard onBack={() => router.push("/")} />;
}