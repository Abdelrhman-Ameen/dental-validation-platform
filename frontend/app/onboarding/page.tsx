import { AuthGuard } from "@/components/auth/auth-guard";
import { OnboardingForm } from "@/components/auth/onboarding-form";
import { ModeToggle } from "@/components/common/mode-toggle";

export default function OnboardingPage() {
  return (
    <AuthGuard role="doctor" allowMissingProfile>
      <main className="clinical-grid relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="absolute right-4 top-4">
          <ModeToggle />
        </div>
        <OnboardingForm />
      </main>
    </AuthGuard>
  );
}
