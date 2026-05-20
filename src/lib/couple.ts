import { createClient } from "@/lib/supabase/client";

type CreateCoupleResult = {
  success?: boolean;
  message?: string;
  invite_code?: string;
};

function normalizeRpcResult<T>(data: T | T[] | null): T | null {
  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data;
}

export async function createCouple() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("create_couple");

  if (error) {
    throw error;
  }

  return normalizeRpcResult<CreateCoupleResult>(data);
}

export async function joinCouple(inviteCode: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("join_couple", {
    p_invite_code: inviteCode,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCouple() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("delete_couple");

  if (error) {
    throw error;
  }

  return data;
}