"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DATASET_VERSION } from "@/lib/constants";
import type { DatasetCase, DatasetCaseStatus } from "@/lib/types";

type FilterTab = "all" | "live" | "hidden";

type ApiResponse = {
  cases?: DatasetCase[];
  liveCount?: number;
  totalCount?: number;
  error?: string;
};

export function DatasetManager() {
  const [cases, setCases] = useState<DatasetCase[]>([]);
  const [liveCount, setLiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadCases = useCallback(async () => {
    try {
      setError("");
      const response = await fetch("/api/admin/dataset-cases", { cache: "no-store" });
      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.cases) {
        throw new Error(data.error || "Failed to load dataset cases.");
      }
      setCases(data.cases);
      setLiveCount(data.liveCount || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dataset cases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCases();
  }, [loadCases]);

  const filteredCases = cases.filter((c) => {
    if (filter === "all") return true;
    return c.status === filter;
  });

  const allFilteredSelected =
    filteredCases.length > 0 && filteredCases.every((c) => selected.has(c.questionId));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const c of filteredCases) next.delete(c.questionId);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        for (const c of filteredCases) next.add(c.questionId);
        return next;
      });
    }
  }

  function flashMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function bulkSetStatus(status: DatasetCaseStatus) {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/dataset-cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: [...selected], status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update.");
      setSelected(new Set());
      flashMessage(`${data.updated} case(s) set to ${status}.`);
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setBusy(false);
    }
  }

  async function bulkDelete() {
    if (selected.size === 0) return;
    const confirmed = window.confirm(
      `Permanently delete ${selected.size} case(s)? This will remove question files, answer keys, and images. This action cannot be undone.`
    );
    if (!confirmed) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/dataset-cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: [...selected] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete.");
      setSelected(new Set());
      flashMessage(`Deleted ${data.deleted} case(s). ${data.remaining} remaining.`);
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete cases.");
    } finally {
      setBusy(false);
    }
  }

  async function singleSetStatus(questionId: string, status: DatasetCaseStatus) {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/dataset-cases", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: [questionId], status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update.");
      flashMessage(`${questionId} set to ${status}.`);
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setBusy(false);
    }
  }

  async function singleDelete(questionId: string) {
    const confirmed = window.confirm(
      `Permanently delete ${questionId}? This will remove the question, answer key, and image file. This cannot be undone.`
    );
    if (!confirmed) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/dataset-cases", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIds: [questionId] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete.");
      flashMessage(`Deleted ${questionId}. ${data.remaining} remaining.`);
      await loadCases();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete case.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading dataset cases...
      </div>
    );
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: cases.length },
    { key: "live", label: "Live", count: liveCount },
    { key: "hidden", label: "Hidden", count: cases.length - liveCount },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Validation dataset
          </CardTitle>
          <CardDescription>
            Manage the validation cases. Set images to Live (included in quiz) or Hidden (excluded). Delete permanently removes files.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
          <div className="rounded-md border bg-background p-3">
            <p className="font-medium text-foreground">Dataset version</p>
            <p>{DATASET_VERSION}</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="font-medium text-foreground">Live cases</p>
            <p className="text-emerald-400 font-semibold">{liveCount} of {cases.length} active</p>
          </div>
          <div className="rounded-md border bg-background p-3">
            <p className="font-medium text-foreground">Hidden cases</p>
            <p className="text-amber-400 font-semibold">{cases.length - liveCount} excluded</p>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {message && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          <CheckCircle2 className="h-4 w-4" />
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Toolbar: Filter tabs + Bulk actions */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setFilter(tab.key); setSelected(new Set()); }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  filter === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 opacity-70">({tab.count})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">{DATASET_VERSION}</Badge>
          </div>
        </div>

        {/* Select all + Bulk action bar */}
        <div className="flex flex-wrap items-center gap-2 rounded-md border bg-card/50 px-3 py-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded accent-primary"
            />
            {allFilteredSelected ? "Deselect all" : "Select all"} ({filteredCases.length})
          </label>

          {selected.size > 0 && (
            <>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm text-muted-foreground">{selected.size} selected</span>
              <div className="h-4 w-px bg-border" />

              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void bulkSetStatus("live")}
                className="h-7 text-xs gap-1"
              >
                <Eye className="h-3.5 w-3.5" />
                Set Live
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void bulkSetStatus("hidden")}
                className="h-7 text-xs gap-1"
              >
                <EyeOff className="h-3.5 w-3.5" />
                Set Hidden
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={busy}
                onClick={() => void bulkDelete()}
                className="h-7 text-xs gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Case list */}
      <div className="grid gap-3">
        {filteredCases.length === 0 && (
          <Card>
            <CardContent className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
              No cases match the current filter.
            </CardContent>
          </Card>
        )}

        {filteredCases.map((caseItem) => (
          <div
            key={caseItem.questionId}
            className={`grid gap-4 rounded-lg border p-4 transition md:grid-cols-[auto_150px_minmax(0,1fr)_auto] ${
              selected.has(caseItem.questionId)
                ? "border-primary/50 bg-primary/5"
                : "bg-card"
            } ${caseItem.status === "hidden" ? "opacity-70" : ""}`}
          >
            {/* Checkbox */}
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={selected.has(caseItem.questionId)}
                onChange={() => toggleSelect(caseItem.questionId)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </div>

            {/* Image thumbnail */}
            <div className="relative h-24 overflow-hidden rounded-md border bg-black">
              <Image
                src={caseItem.imageUrl}
                alt={`Case ${caseItem.questionId}`}
                fill
                className="object-contain p-1"
                sizes="150px"
              />
            </div>

            {/* Info */}
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={caseItem.status === "live" ? "success" : "warning"}>
                  {caseItem.status}
                </Badge>
                <Badge variant="outline">{caseItem.difficulty}</Badge>
                {caseItem.dominantCondition && (
                  <Badge variant="secondary">{caseItem.dominantCondition}</Badge>
                )}
                <span className="text-sm text-muted-foreground">
                  {caseItem.annotationCount} annotations
                </span>
              </div>
              <p className="line-clamp-1 font-medium">{caseItem.questionText}</p>
              {caseItem.referenceFindings && caseItem.referenceFindings.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Findings:{" "}
                  {caseItem.referenceFindings
                    .map((f) => `${f.condition} (${f.toothIds.join(", ")})`)
                    .join(" · ")}
                </p>
              )}
              <p className="text-xs text-muted-foreground font-mono">{caseItem.imageUrl}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <div className="flex flex-col gap-1.5 items-end">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {caseItem.questionId}
                </span>

                {caseItem.status === "live" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void singleSetStatus(caseItem.questionId, "hidden")}
                    className="h-7 text-xs gap-1 w-full"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                    Hide
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void singleSetStatus(caseItem.questionId, "live")}
                    className="h-7 text-xs gap-1 w-full"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Set Live
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy}
                  onClick={() => void singleDelete(caseItem.questionId)}
                  className="h-7 text-xs gap-1 w-full"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
