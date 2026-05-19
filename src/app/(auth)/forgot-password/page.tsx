"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

import { resetPassword } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      toast.error("Email wajib diisi");
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword(email);

      setIsSent(true);
      toast.success("Link reset password sudah dikirim");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal mengirim reset password.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>

        <div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Masukkan email akunmu. Nanti link reset password dikirim ke sana.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {isSent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Cek email kamu dan klik link reset password. Jangan lupa cek spam,
              karena email kadang suka nyasar seperti keputusan manusia jam 2 pagi.
            </p>

            <Button asChild className="w-full rounded-2xl">
              <Link href="/login">Kembali ke Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
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

            <Button type="submit" className="w-full rounded-2xl" disabled={isLoading}>
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Ingat password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}