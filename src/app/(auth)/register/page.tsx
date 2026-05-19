"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HeartHandshake } from "lucide-react";

import { signup } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [gender, setGender] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name || !email || !password || !gender) {
      toast.error("Semua field wajib diisi");
      return;
    }

    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    try {
      setIsLoading(true);

      await signup({
        name,
        email,
        password,
        gender: Number(gender),
      });

      toast.success("Akun berhasil dibuat. Silakan login.");
      router.replace("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Register gagal. Coba lagi.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <HeartHandshake className="h-6 w-6 text-primary" />
        </div>

        <div>
          <CardTitle className="text-2xl">Buat Akun DuoTrack</CardTitle>
          <CardDescription>
            Mulai tracking target bareng pasangan dengan cara yang lebih rapi.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nama kamu"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
            />
          </div>

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
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender} disabled={isLoading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Laki-laki</SelectItem>
                <SelectItem value="2">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full rounded-2xl" disabled={isLoading}>
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}