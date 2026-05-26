"use client";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { QuizAttempt } from "@/lib/types";
import { formatPercent, formatSeconds } from "@/lib/utils";

export function AttemptsTable({ attempts }: { attempts: QuizAttempt[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Doctor</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Dataset</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((attempt) => (
            <TableRow key={attempt.attemptId}>
              <TableCell className="font-medium">{attempt.userName}</TableCell>
              <TableCell className="text-muted-foreground">{attempt.university}</TableCell>
              <TableCell>{attempt.totalScore}/{attempt.totalQuestions}</TableCell>
              <TableCell>{formatPercent(attempt.accuracy)}</TableCell>
              <TableCell>{formatSeconds(attempt.timeTaken)}</TableCell>
              <TableCell>
                <Badge variant="outline">{attempt.datasetVersion}</Badge>
              </TableCell>
            </TableRow>
          ))}
          {!attempts.length ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No attempts have been submitted.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
