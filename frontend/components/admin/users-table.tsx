"use client";

import { useState } from "react";
import { Shield, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { assignUserRole } from "@/lib/functions";
import type { Role, UserProfile } from "@/lib/types";

export function UsersTable({ users }: { users: UserProfile[] }) {
  const [savingUid, setSavingUid] = useState("");

  async function setRole(uid: string, role: Role) {
    setSavingUid(uid);
    try {
      await assignUserRole({ uid, role });
    } finally {
      setSavingUid("");
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Governorate</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Quiz</TableHead>
            <TableHead className="text-right">Manage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-background text-primary">
                    {user.role === "admin" ? <Shield className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium">{user.name || "Unnamed user"}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={user.role === "admin" ? "warning" : "outline"}>{user.role}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.university || "Not set"}</TableCell>
              <TableCell className="text-muted-foreground">{user.governorate || "Not set"}</TableCell>
              <TableCell className="text-muted-foreground">{user.academicStage || "Not set"}</TableCell>
              <TableCell className="text-muted-foreground">{user.yearsExperience ?? 0} years</TableCell>
              <TableCell>{user.hasCompletedQuiz ? <Badge variant="success">Completed</Badge> : <Badge variant="outline">Pending</Badge>}</TableCell>
              <TableCell className="text-right">
                <div className="ml-auto flex max-w-[230px] items-center gap-2">
                  <Select
                    value={user.role}
                    onChange={(event) => void setRole(user.uid, event.target.value as Role)}
                    disabled={savingUid === user.uid}
                  >
                    <option value="doctor">doctor</option>
                    <option value="admin">admin</option>
                  </Select>
                  <Button variant="outline" size="sm" disabled={savingUid === user.uid}>
                    Save
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!users.length ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                No users found yet.
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
