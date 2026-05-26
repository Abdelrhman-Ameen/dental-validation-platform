"use client";

import { AlertCircle, BarChart3, BrainCircuit, Database, Download, Users } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/common/stat-card";
import { AttemptsTable } from "@/components/admin/attempts-table";
import { ExportButton } from "@/components/admin/export-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminCollections } from "@/hooks/useAdmin";

export function AdminDashboard() {
  const { users, attempts, leaderboard, activeUsers, error } = useAdminCollections();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">External validation control center</h1>
          <p className="mt-2 text-muted-foreground">
            Manage dataset images, doctors, AI models, exports, attempts, and validation analytics.
          </p>
        </div>
        <ExportButton />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Users" value={String(users.length)} icon={Users} />
        <StatCard label="Attempts" value={String(attempts.length)} icon={BarChart3} tone="emerald" />
        <StatCard label="Live leaderboard" value={String(leaderboard.length)} icon={BrainCircuit} />
        <StatCard label="Active users" value={String(activeUsers)} hint="Authenticated monitored profiles" icon={Database} tone="amber" />
      </div>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/10">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-4">
        <Button variant="outline" asChild>
          <Link href="/admin/datasets">
            <Database className="h-4 w-4" />
            Manage dataset
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/users">
            <Users className="h-4 w-4" />
            Manage users
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/admin/analytics">
            <BarChart3 className="h-4 w-4" />
            View analytics
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/api/admin/export">
            <Download className="h-4 w-4" />
            CSV endpoint
          </Link>
        </Button>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-normal">Latest attempts</h2>
        <AttemptsTable attempts={attempts.slice(0, 10)} />
      </section>
    </div>
  );
}
