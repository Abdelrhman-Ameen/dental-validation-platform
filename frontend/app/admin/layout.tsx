import { AppShell } from "@/components/common/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard role="admin">
      <AppShell admin>{children}</AppShell>
    </AuthGuard>
  );
}
