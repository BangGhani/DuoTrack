"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut, Trash2, UserRound } from "lucide-react";

import { logout } from "@/lib/auth";
import { deleteMyProfile, getMyProfile, updateMyProfile } from "@/lib/profile";
import type { Profile } from "@/types/database";
import { formatDate } from "@/lib/utils/format";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();

        if (!data) {
          toast.error("Profile tidak ditemukan atau belum bisa diakses");
          return;
        }
        setProfile(data);
        setName(data.name ?? "");
        setGender(data.gender ? String(data.gender) : "");
        setBirth(data.birth ?? "");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat profile";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleUpdateProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !gender) {
      toast.error("Nama dan gender wajib diisi");
      return;
    }

    try {
      setIsSaving(true);

      await updateMyProfile({
        name: name.trim(),
        gender: Number(gender),
        birth: birth || null,
      });

      toast.success("Profile berhasil diperbarui");

      const freshProfile = await getMyProfile();
      setProfile(freshProfile);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal update profile";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);

      await logout();

      toast.success("Berhasil logout");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal logout";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function handleDeleteProfile() {
    const confirmed = window.confirm(
      "Yakin mau hapus akun? Aksi ini akan menghapus profile dan akun login kamu.",
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      await deleteMyProfile();
      await logout();

      toast.success("Akun berhasil dihapus");
      router.replace("/register");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal hapus akun";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-background p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Memuat profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Kelola data akun DuoTrack kamu.
        </p>
      </section>

      <Card className="rounded-3xl border-none shadow-sm">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <UserRound className="h-6 w-6 text-primary" />
          </div>

          <CardTitle>Info Akun</CardTitle>
          <CardDescription>
            Data dasar akun kamu untuk DuoTrack.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Nama:</span>{" "}
            <span className="font-medium">{profile?.name ?? "-"}</span>
          </p>

          <p>
            <span className="text-muted-foreground">Gender:</span>{" "}
            <span className="font-medium">
              {profile?.gender === 1
                ? "Laki-laki"
                : profile?.gender === 2
                  ? "Perempuan"
                  : "-"}
            </span>
          </p>

          <p>
            <span className="text-muted-foreground">Tanggal lahir:</span>{" "}
            <span className="font-medium">{formatDate(profile?.birth)}</span>
          </p>

          <p>
            <span className="text-muted-foreground">Status Couple:</span>{" "}
            <span className="font-medium">
              {profile?.couple_id ? "Sudah punya couple" : "Belum punya couple"}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update nama, gender, dan tanggal lahir.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={gender}
                onValueChange={setGender}
                disabled={isSaving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Laki-laki</SelectItem>
                  <SelectItem value="2">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth">Tanggal Lahir</Label>
              <Input
                id="birth"
                type="date"
                value={birth}
                onChange={(event) => setBirth(event.target.value)}
                disabled={isSaving}
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl"
              disabled={isSaving}
            >
              {isSaving ? "Menyimpan..." : "Simpan Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Akun</CardTitle>
          <CardDescription>
            Logout atau hapus akun DuoTrack kamu.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button
            variant="secondary"
            className="w-full rounded-2xl"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoggingOut ? "Logout..." : "Logout"}
          </Button>

          <Button
            variant="destructive"
            className="w-full rounded-2xl"
            onClick={handleDeleteProfile}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Menghapus..." : "Hapus Akun"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
