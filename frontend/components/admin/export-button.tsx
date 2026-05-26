"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  async function exportCsv() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/export");
      if (!response.ok) {
        throw new Error("Export failed.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "quiz-attempts.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" onClick={exportCsv} disabled={loading}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      Export CSV
    </Button>
  );
}
