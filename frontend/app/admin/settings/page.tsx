"use client";

import { AttemptsTable } from "@/components/admin/attempts-table";
import { ExportButton } from "@/components/admin/export-button";
import { ModelForm } from "@/components/admin/model-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAdminCollections } from "@/hooks/useAdmin";

export default function AdminSettingsPage() {
  const { attempts } = useAdminCollections();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Settings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Protocol controls</h1>
          <p className="mt-2 text-muted-foreground">Configure AI baselines and export validated results.</p>
        </div>
        <ExportButton />
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-6">
          <ModelForm />
          <Card>
            <CardHeader>
              <CardTitle>Security toggles</CardTitle>
              <CardDescription>Operational switches for research administration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">Require one attempt per doctor</span>
                <Switch checked readOnly />
              </label>
              <label className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">Hide answer key from client</span>
                <Switch checked readOnly />
              </label>
              <label className="flex items-center justify-between rounded-md border p-3">
                <span className="text-sm font-medium">Record device metadata</span>
                <Switch checked readOnly />
              </label>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-normal">Attempt export preview</h2>
          <AttemptsTable attempts={attempts.slice(0, 20)} />
        </div>
      </div>
    </div>
  );
}
