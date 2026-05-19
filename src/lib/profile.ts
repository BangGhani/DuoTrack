import type { Profile } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCurrentProfile(supabase: SupabaseClient) {
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
    .single<Profile>();

  if (error) {
    throw error;
  }

  return data;
}