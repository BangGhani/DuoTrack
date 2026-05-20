"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Copy, Heart, LogOut, UserRound, Users } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { deleteCouple } from "@/lib/couple";
import { createClient } from "@/lib/supabase/client";
import { getMyProfile } from "@/lib/profile";
import { formatDate } from "@/lib/utils/format";
import type { Profile } from "@/types/database";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CoupleData = {
  id: string;
  invite_code: string;
  created_at: string;
};

const leaveCoupleMessages = [
  "Kalau ada masalah sama couple, coba bicarain baik-baik dulu 😊",
  "Yakin mau keluar? Kadang yang perlu diperbaiki itu komunikasi, bukan tombol keluar.",
  "DuoTrack cuma aplikasi, tapi hubungan kalian tetap butuh ngobrol. Absurd ya, teknologi kalah sama komunikasi.",
  "Sebelum keluar, pastikan ini bukan keputusan impulsif gara-gara mood jelek hari ini.",
];

function ProfileCard({
  title,
  description,
  profile,
  emptyText,
}: {
  title: string;
  description: string;
  profile: Profile | null;
  emptyText?: string;
}) {
  return (
    <Card className="rounded-3xl border-none shadow-sm">
      <CardHeader>
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <UserRound className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        {profile ? (
          <>
            <p>
              <span className="text-muted-foreground">Nama:</span>{" "}
              <span className="font-medium">{profile.name ?? "-"}</span>
            </p>

            <p>
              <span className="text-muted-foreground">Gender:</span>{" "}
              <span className="font-medium">
                {profile.gender === 1
                  ? "Laki-laki"
                  : profile.gender === 2
                    ? "Perempuan"
                    : "-"}
              </span>
            </p>

            <p>
              <span className="text-muted-foreground">Tanggal lahir:</span>{" "}
              <span className="font-medium">{formatDate(profile.birth)}</span>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">
            {emptyText ?? "Data belum tersedia"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function CouplePage() {
  const router = useRouter();

  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [partnerProfile, setPartnerProfile] = useState<Profile | null>(null);
  const [couple, setCouple] = useState<CoupleData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState(leaveCoupleMessages[0]);

  useEffect(() => {
    async function loadCouple() {
      try {
        const profile = await getMyProfile();

        if (!profile) {
          toast.error("Profile tidak ditemukan");
          router.replace("/login");
          return;
        }

        if (!profile.couple_id) {
          router.replace("/couple/setup");
          return;
        }

        setMyProfile(profile);

        const supabase = createClient();

        const { data: coupleData, error: coupleError } = await supabase
          .from("couple")
          .select("id, invite_code, created_at")
          .eq("id", profile.couple_id)
          .maybeSingle<CoupleData>();

        if (coupleError) {
          throw coupleError;
        }

        if (!coupleData) {
          throw new Error(
            "Data couple tidak ditemukan. Cek RLS couple atau function create_couple.",
          );
        }

        setCouple(coupleData);

        const { data: members, error: membersError } = await supabase
          .from("user")
          .select("id, name, gender, birth, couple_id, created_at")
          .eq("couple_id", profile.couple_id)
          .returns<Profile[]>();

        if (membersError) {
          throw membersError;
        }

        const partner =
          members?.find((member) => member.id !== profile.id) ?? null;
        setPartnerProfile(partner);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Gagal mengambil data couple";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadCouple();
  }, [router]);

  async function handleCopyInviteCode() {
    if (!couple?.invite_code) return;

    await navigator.clipboard.writeText(couple.invite_code);
    toast.success("Invite code disalin");
  }

  function openLeaveDialog() {
    const randomMessage =
      leaveCoupleMessages[
        Math.floor(Math.random() * leaveCoupleMessages.length)
      ];

    setLeaveMessage(randomMessage);
    setIsLeaveDialogOpen(true);
  }

  async function handleLeaveCouple() {
    try {
      setIsLeaving(true);

      await deleteCouple();

      toast.success("Berhasil keluar dari Couple");
      setIsLeaveDialogOpen(false);
      router.replace("/couple/setup");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal keluar dari Couple";
      toast.error(message);
    } finally {
      setIsLeaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-background p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Memuat data couple...</p>
      </div>
    );
  }

  if (!couple) {
    return (
      <div className="rounded-3xl bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Couple belum bisa dimuat</h1>
        <p className="mt-2 text-muted-foreground">
          Kemungkinan RLS couple belum benar atau user belum punya couple_id.
        </p>

        <Button
          onClick={() => router.replace("/couple/setup")}
          className="mt-6 rounded-2xl"
        >
          Ke Setup Couple
        </Button>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apakah kamu yakin mau keluar dari Couple?
            </AlertDialogTitle>

            <AlertDialogDescription className="space-y-3">
              <span className="block">{leaveMessage}</span>

              <span className="block">
                Kalau kamu lanjut, kamu akan keluar dari couple ini dan perlu
                setup ulang atau join pakai invite code lagi.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving} className="rounded-2xl">
              Batal dulu
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleLeaveCouple}
              disabled={isLeaving}
              className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLeaving ? "Keluar..." : "Ya, keluar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="space-y-6">
        <section>
          <h1 className="text-2xl font-bold">Couple</h1>
          <p className="mt-2 text-muted-foreground">
            Kelola ruang bersama kamu dan pasangan.
          </p>
        </section>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Invite Code</CardTitle>
            <CardDescription>
              Bagikan kode ini ke pasanganmu supaya dia bisa join ke couple
              kamu.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-3xl bg-muted p-4">
              <p className="text-sm text-muted-foreground">Kode Couple</p>

              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-2xl font-bold tracking-widest">
                  {couple.invite_code}
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

              {!partnerProfile && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Pasanganmu belum join. Kirim kode ini ke pasanganmu dulu.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <ProfileCard
            title="Kamu"
            description="Data diri kamu di DuoTrack."
            profile={myProfile}
          />

          <ProfileCard
            title="Couple mu"
            description="Data pasanganmu akan muncul setelah join."
            profile={partnerProfile}
            emptyText="Pasanganmu belum join ke couple ini."
          />
        </div>

        <Card className="rounded-3xl border-none shadow-sm">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
              <Users className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>Keluar dari Couple</CardTitle>
            <CardDescription>Kamu bisa keluar dari couple ini</CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              variant="destructive"
              className="w-full rounded-2xl"
              onClick={openLeaveDialog}
              disabled={isLeaving}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar dari Couple
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
