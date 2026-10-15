import { supabase } from "./supabase";

// login dengan username: cari email-nya dulu, lalu masuk dengan email dan kata sandi
export async function masukDenganUsername(username: string, password: string): Promise<string | null> {
  const { data: email, error: errCari } = await supabase.rpc("email_dari_username", {
    p_username: username.trim().toLowerCase(),
  });

  if (errCari || !email) return "Username atau kata sandi salah.";

  const { error: errMasuk } = await supabase.auth.signInWithPassword({ email, password });
  if (errMasuk) return "Username atau kata sandi salah.";

  return null;
}

// keluar dari akun
export async function keluar(): Promise<void> {
  await supabase.auth.signOut();
}

// ambil username dari akun yang sedang login, atau null jika belum login
export async function ambilUserSaatIni(): Promise<string | null> {
  const { data: sesi } = await supabase.auth.getSession();
  const userId = sesi.session?.user.id;
  if (!userId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .maybeSingle();

  return data?.username ?? null;
}