"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { KeyRound } from "lucide-react";

import { updatePassword } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdatePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password || !passwordConfirmation) {
      toast.error("Password baru wajib diisi");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    if (password !== passwordConfirmation) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    try {
      setIsLoading(true);

      await updatePassword(password);

      toast.success("Password berhasil diubah");
      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengubah password.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <KeyRound className="h-6 w-6 text-primary" />
        </div>

        <div>
          <CardTitle className="text-2xl">Password Baru</CardTitle>
          <CardDescription>
            Masukkan password baru untuk akun DuoTrack kamu.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Konfirmasi Password</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              placeholder="Ulangi password baru"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full rounded-2xl" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}