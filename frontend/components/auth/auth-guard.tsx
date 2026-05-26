"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/lib/types";

export function AuthGuard({
  children,
  role,
  allowMissingProfile = false
}: {
  children: React.ReactNode;
  role?: Role;
  allowMissingProfile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();
  const needsOnboarding =
    profile?.role === "doctor" &&
    (!profile.university || !profile.country || !profile.governorate || !profile.specialty || !profile.academicStage);
  const roleMismatch = Boolean(role && profile && profile.role !== role);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!profile && !allowMissingProfile) {
      router.replace("/onboarding");
      return;
    }
    if (needsOnboarding && !allowMissingProfile && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }
    if (roleMismatch) {
      router.replace(profile?.role === "admin" ? "/admin" : "/leaderboard");
    }
  }, [allowMissingProfile, loading, needsOnboarding, pathname, profile, roleMismatch, router, user]);

  if (
    loading ||
    !user ||
    (!profile && !allowMissingProfile) ||
    (needsOnboarding && !allowMissingProfile && pathname !== "/onboarding") ||
    roleMismatch
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          <Activity className="h-4 w-4 animate-pulse text-primary" />
          Validating secure session
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
