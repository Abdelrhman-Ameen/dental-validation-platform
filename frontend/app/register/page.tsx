import { Suspense } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { ModeToggle } from "@/components/common/mode-toggle";

export default function RegisterPage() {
  return (
    <main className="clinical-grid relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>
      <Suspense fallback={<div className="text-sm text-white/70">Loading registration...</div>}>
        <AuthCard mode="register" />
      </Suspense>
    </main>
  );
}
