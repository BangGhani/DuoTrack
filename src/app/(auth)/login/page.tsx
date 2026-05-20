"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";

import { login } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email dan password wajib diisi");
      return;
    }

    try {
      setIsLoading(true);

      const loginData = await login(email, password);
      const userId = loginData.user?.id;

      if (!userId) {
        throw new Error("User tidak ditemukan setelah login");
      }

      const supabase = createClient();

      const { data: profile, error: profileError } = await supabase
        .from("user")
        .select("couple_id")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      toast.success("Login berhasil");

      if (profile?.couple_id) {
        router.replace("/dashboard");
      } else {
        router.replace("/couple/setup");
      }

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Heart className="h-6 w-6 text-primary" />
        </div>

        <div>
          <CardTitle className="text-2xl">Masuk ke DuoTrack</CardTitle>
          <CardDescription>
            Lanjutkan tracking tabungan dan target bareng pasanganmu.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              Lupa password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full rounded-2xl"
            disabled={isLoading}
          >
            {isLoading ? "Masuk..." : "Masuk"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Daftar
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
