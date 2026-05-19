import { createClient } from "@/lib/supabase/client";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  gender: number;
};

export async function signup(payload: SignupPayload) {
  const functionsUrl = process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL;

  if (!functionsUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL");
  }

  const response = await fetch(`${functionsUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Signup failed");
  }

  return result;
}

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}