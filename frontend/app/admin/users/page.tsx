"use client";

import { ExportButton } from "@/components/admin/export-button";
import { UsersTable } from "@/components/admin/users-table";
import { useAdminCollections } from "@/hooks/useAdmin";

export default function AdminUsersPage() {
  const { users } = useAdminCollections();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Access control</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Users</h1>
          <p className="mt-2 text-muted-foreground">Manage doctor and admin roles for the validation platform.</p>
        </div>
        <ExportButton />
      </div>
      <UsersTable users={users} />
    </div>
  );
}
