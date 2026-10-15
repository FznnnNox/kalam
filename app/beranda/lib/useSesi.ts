"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export function useSesi() {
  const [siap, setSiap] = useState(false);
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let aktif = true;

    const muat = async (userId: string | null) => {
      if (!aktif) return;
      if (!userId) {
        setLogin(false);
        setUsername(null);
        setSiap(true);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .maybeSingle();
      if (!aktif) return;
      setLogin(true);
      setUsername(data?.username ?? null);
      setSiap(true);
    };

    supabase.auth.getSession().then(({ data }) => muat(data.session?.user.id ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      muat(session?.user.id ?? null);
    });

    return () => {
      aktif = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { siap, login, username };
}