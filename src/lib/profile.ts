import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export async function getMyProfile() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("user")
    .select("id, name, gender, birth, couple_id, created_at")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateMyProfile(payload: {
  name: string;
  gender: number;
  birth: string | null;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("update_profile", {
    p_name: payload.name,
    p_gender: payload.gender,
    p_birth: payload.birth,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteMyProfile() {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.access_token) {
    throw new Error("Session tidak ditemukan");
  }

  const functionsUrl = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!functionsUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const response = await fetch(`${functionsUrl}/delete-profile`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Gagal hapus akun");
  }

  return result;
}