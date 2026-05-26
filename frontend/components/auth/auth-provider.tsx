"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getUserProfile } from "@/lib/firestore";
import type { UserProfile } from "@/lib/types";

type AuthUser = Pick<User, "uid" | "email" | "displayName">;

type AuthContextValue = {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<UserProfile | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 4000) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Request timed out.")), timeoutMs);
      })
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function getCookieProfile() {
  try {
    const response = await fetch("/api/auth/me", { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { profile?: UserProfile | null };
    return data.profile || null;
  } catch {
    return null;
  }
}

async function refreshServerSession(user: User) {
  const token = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    if (auth.currentUser) {
      try {
        await refreshServerSession(auth.currentUser);
        const nextProfile = await withTimeout(getUserProfile(auth.currentUser.uid));
        if (nextProfile) {
          setProfile(nextProfile);
          return nextProfile;
        }
      } catch {
        // Fall back to the httpOnly session cookie for local admins and server-verified Firebase sessions.
      }
    }

    setProfile(null);
    return null;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setLoading(true);
      try {
        setUser(nextUser);
        if (nextUser) {
          try {
            await refreshServerSession(nextUser);
            const nextProfile = await withTimeout(getUserProfile(nextUser.uid));
            if (nextProfile) {
              setProfile(nextProfile);
              return;
            }
          } catch {
            const cookieProfile = await getCookieProfile();
            if (cookieProfile) {
              setProfile(cookieProfile);
              return;
            }
          }
        }

        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin: profile?.role === "admin",
      refreshProfile
    }),
    [loading, profile, refreshProfile, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
