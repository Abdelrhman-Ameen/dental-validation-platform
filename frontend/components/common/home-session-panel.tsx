"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";

export function HomeSessionPanel() {
  const router = useRouter();
  const { loading, profile } = useAuth();

  async function handleLogout() {
    await logout();
    router.refresh();
  }

  if (loading) {
    return null;
  }

  if (!profile) {
    return (
      <Button size="lg" asChild>
        <Link href="/login?next=/onboarding">
          Start benchmark
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  const destination = profile.role === "admin"
    ? "/admin"
    : profile.hasCompletedQuiz
      ? "/quiz/result"
      : "/quiz";
  const welcome = profile.role === "admin"
    ? `Welcome admin ${profile.name}`
    : `Welcome Doctor ${profile.name}`;

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-primary">{welcome}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href={destination}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
