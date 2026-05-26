"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Chrome, Loader2, LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithEmail, loginWithGoogle, registerWithEmail } from "@/lib/auth";
import type { UserProfile } from "@/lib/types";

type AuthMode = "login" | "register";

function formatAuthError(message: string, provider: "email" | "google") {
  if (message.includes("auth/configuration-not-found") || message.includes("CONFIGURATION_NOT_FOUND")) {
    return provider === "google"
      ? "Firebase Authentication is not initialized for this project yet. In Firebase Console, open Authentication, click Get started, then enable Google as a sign-in provider."
      : "Firebase Authentication is not initialized for this project yet. In Firebase Console, open Authentication, click Get started, then enable Email/Password.";
  }

  if (message.includes("auth/api-key-not-valid") || message.includes("invalid-api-key")) {
    return "Firebase login needs valid Firebase web credentials. The current project config is loaded from frontend/.env.local.";
  }

  if (message.includes("auth/operation-not-allowed")) {
    return provider === "google"
      ? "Google login is configured in the app, but the Google provider is not enabled in Firebase Console."
      : "Email/password login is configured in the app, but Email/Password is not enabled in Firebase Console.";
  }

  return message;
}

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function getServerProfile() {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { profile?: UserProfile | null };
    return data.profile || null;
  }

  async function routeAfterLogin(uid: string) {
    let profile = await getServerProfile();
    try {
      if (!profile) {
        const { getUserProfile } = await import("@/lib/firestore");
        profile = await getUserProfile(uid);
      }
    } catch {
      profile = null;
    }
    if (!profile) {
      router.replace("/onboarding");
      return;
    }
    router.replace(next || (profile.role === "admin" ? "/admin" : profile.hasCompletedQuiz ? "/quiz/result" : "/quiz"));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = mode === "register"
        ? await registerWithEmail(name, identifier, password)
        : await loginWithEmail(identifier, password);
      await routeAfterLogin(user.uid);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setError(formatAuthError(message, "email"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      await routeAfterLogin(user.uid);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google login failed.";
      setError(formatAuthError(message, "google"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-white/10 bg-card/90 shadow-2xl">
      <CardHeader>
        <CardTitle>{mode === "login" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Access the external validation benchmark."
            : "Register as a doctor, then complete your research profile."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" ? (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="identifier">Email</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="identifier"
                type="email"
                className="pl-9"
                placeholder="doctor@example.edu"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                className="pl-9"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "login" ? 1 : 8}
                required
              />
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {mode === "login" ? "Sign in" : "Register"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={loading}>
          <Chrome className="h-4 w-4" />
          Continue with Gmail
        </Button>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {mode === "login" ? "New to the study?" : "Already registered?"}{" "}
          <Link className="text-primary hover:underline" href={mode === "login" ? "/register" : "/login"}>
            {mode === "login" ? "Create an account" : "Sign in"}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
