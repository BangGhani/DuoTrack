"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Copy, HeartHandshake, Users } from "lucide-react";

import { createCouple, joinCouple } from "@/lib/couple";
import { getMyProfile } from "@/lib/profile";

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

export default function CoupleSetupPage() {
  const router = useRouter();

  const [joinCode, setJoinCode] = useState("");
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  const [isChecking, setIsChecking] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      try {
        const profile = await getMyProfile();

        if (profile?.couple_id) {
          router.replace("/dashboard");
          return;
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal cek profile";
        toast.error(message);
      } finally {
        setIsChecking(false);
      }
    }

    checkProfile();
  }, [router]);

  async function handleCreateCouple() {
    try {
      setIsCreating(true);

      const result = await createCouple();

      if (result?.invite_code) {
        setInviteCode(result.invite_code);
      }

      toast.success("Couple berhasil dibuat");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal membuat couple";
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleJoinCouple(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!joinCode.trim()) {
      toast.error("Invite code wajib diisi");
      return;
    }

    try {
      setIsJoining(true);

      await joinCouple(joinCode.trim().toUpperCase());

      toast.success("Berhasil join couple");
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal join couple";
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  }

  async function handleCopyInviteCode() {
    if (!inviteCode) return;

    await navigator.clipboard.writeText(inviteCode);
    toast.success("Invite code disalin");
  }

  if (isChecking) {
    return (
      <div className="rounded-3xl bg-background p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Mengecek status couple...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Setup Couple</h1>
        <p className="mt-2 text-muted-foreground">
          Buat couple baru atau masuk ke couple pasanganmu pakai invite code.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <HeartHandshake className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Buat Couple</CardTitle>
            <CardDescription>
              Buat ruang bersama, lalu bagikan invite code ke pasanganmu.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              onClick={handleCreateCouple}
              disabled={isCreating || Boolean(inviteCode)}
              className="w-full rounded-2xl"
            >
              {isCreating ? "Membuat..." : "Buat Couple"}
            </Button>

            {inviteCode && (
              <div className="rounded-3xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">Invite Code</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-2xl font-bold tracking-widest">
                    {inviteCode}
                  </p>

                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="rounded-2xl"
                    onClick={handleCopyInviteCode}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Kirim kode ini ke pasanganmu supaya dia bisa join.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Join Couple</CardTitle>
            <CardDescription>
              Kalau pasanganmu sudah membuat couple, masukkan invite code di sini.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleJoinCouple} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Invite Code</Label>
                <Input
                  id="inviteCode"
                  placeholder="Contoh: ABCDEFGH"
                  value={joinCode}
                  onChange={(event) =>
                    setJoinCode(event.target.value.toUpperCase())
                  }
                  disabled={isJoining}
                />
              </div>

              <Button
                type="submit"
                disabled={isJoining}
                className="w-full rounded-2xl"
              >
                {isJoining ? "Join..." : "Join Couple"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}