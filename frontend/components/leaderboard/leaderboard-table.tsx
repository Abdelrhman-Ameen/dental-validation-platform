"use client";

import { BrainCircuit, Medal, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeaderboardEntry } from "@/lib/types";
import { formatPercent, formatSeconds } from "@/lib/utils";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Rank</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead className="text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id} className={entry.participantType === "ai" ? "bg-primary/5" : undefined}>
              <TableCell className="font-semibold">
                <span className="inline-flex items-center gap-2">
                  {entry.rank <= 3 ? <Medal className="h-4 w-4 text-primary" /> : null}
                  {entry.rank}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background text-primary">
                    {entry.participantType === "ai" ? <BrainCircuit className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{entry.name}</p>
                    {entry.participantType === "ai" ? (
                      <Badge className="mt-1" variant="outline">
                        AI model
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{entry.university}</TableCell>
              <TableCell className="font-semibold">
                {entry.score}/{entry.totalQuestions}
              </TableCell>
              <TableCell>{formatPercent(entry.accuracy)}</TableCell>
              <TableCell className="text-right">{entry.participantType === "ai" ? "64 ms" : formatSeconds(entry.timeTaken)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
