"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  ClipboardList,
  Database,
  Gauge,
  Home,
  LogOut,
  Settings,
  ShieldCheck,
  Trophy,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";
import { ADMIN_NAV, DOCTOR_NAV } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";

const iconMap = {
  "/admin": Gauge,
  "/admin/users": Users,
  "/admin/datasets": Database,
  "/admin/analytics": BarChart3,
  "/admin/leaderboard": Trophy,
  "/admin/settings": Settings,
  "/quiz": ClipboardList,
  "/leaderboard": Trophy,
  "/quiz/result": Activity
};

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const nav = admin ? ADMIN_NAV : DOCTOR_NAV;

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 flex-col border-r border-white/10 bg-[#222829] text-clinical-text md:flex">
        <div className="border-b border-white/10 p-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-primary">Dental AI</p>
              <p className="text-xs text-clinical-muted">Validation portal</p>
            </div>
          </Link>
        </div>
        <div className="border-b border-white/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-sm font-semibold text-primary">
              {initials(profile?.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{profile?.name || "Doctor"}</p>
              <p className="truncate text-xs text-clinical-muted">{admin ? "Admin access" : profile?.university || "Research participant"}</p>
            </div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-2 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-clinical-muted transition hover:bg-white/5 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Study home
          </Link>
          {nav.map((item) => {
            const Icon = iconMap[item.href as keyof typeof iconMap] || Activity;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition",
                  active ? "bg-secondary text-secondary-foreground" : "text-clinical-muted hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:ml-72 md:px-8">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">{admin ? "Admin console" : "External validation"}</p>
          <p className="text-sm font-semibold">{profile?.name || "Secure session"}</p>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 md:ml-72 md:px-8">{children}</main>
    </div>
  );
}
