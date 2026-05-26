"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase/client";
import type { UserProfile } from "@/lib/types";

const specialties = [
  "General dentistry",
  "Oral radiology",
  "Endodontics",
  "Periodontics",
  "Prosthodontics",
  "Oral surgery",
  "Pediatric dentistry",
  "Orthodontics"
];

const academicStages = [
  "Student",
  "Graduate",
  "Intern",
  "Resident",
  "Specialist",
  "Consultant",
  "Faculty member"
];

const PROFILE_SAVE_TIMEOUT_MS = 15000;

async function withTimeout<T>(promise: Promise<T>, message: string) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), PROFILE_SAVE_TIMEOUT_MS);
      })
    ]);
  } finally {
    if (timer) {
      clearTimeout(timer);
    }
  }
}

async function saveDoctorProfile(input: Pick<
  UserProfile,
  "name" | "university" | "country" | "governorate" | "specialty" | "yearsExperience" | "academicStage"
>) {
  const token = await auth.currentUser?.getIdToken(true);
  if (!token) {
    throw new Error("Please sign in again with Gmail or email before saving your demographic profile.");
  }

  const response = await fetch("/api/onboarding/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      ...input
    })
  });
  const data = (await response.json()) as {
    error?: string;
    profile?: UserProfile;
  };

  if (!response.ok || !data.profile) {
    throw new Error(data.error || "Could not save demographic profile.");
  }

  return data.profile;
}

export function OnboardingForm() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || user?.displayName || "");
  const [university, setUniversity] = useState(profile?.university || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [governorate, setGovernorate] = useState(profile?.governorate || "");
  const [specialty, setSpecialty] = useState(profile?.specialty || specialties[0]);
  const [yearsExperience, setYearsExperience] = useState(profile?.yearsExperience?.toString() || "0");
  const [academicStage, setAcademicStage] = useState(profile?.academicStage || academicStages[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (profile?.role === "admin") {
      setError("Admin accounts cannot complete doctor onboarding. Sign out, then continue as a doctor with Gmail or email.");
      router.replace("/admin");
      return;
    }
    if (!user?.uid || !user.email) {
      setError("Please sign in with Gmail or email before saving your demographic profile.");
      router.replace("/login?next=/onboarding");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const savedProfile = await withTimeout(
        saveDoctorProfile({
          name,
          university,
          country,
          governorate,
          specialty,
          yearsExperience: Number(yearsExperience),
          academicStage
        }),
        "Saving your demographic profile timed out. Please check Firebase Authentication and Firestore access, then try again."
      );

      if (!savedProfile) {
        throw new Error("Your demographic profile was not saved. Please check Firebase Auth and Firestore permissions.");
      }

      await refreshProfile();
      router.replace("/quiz");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save onboarding profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl border-white/10 bg-card/95 shadow-2xl">
      <CardHeader>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Stethoscope className="h-5 w-5" />
        </div>
        <CardTitle>Complete your doctor profile</CardTitle>
        <CardDescription>
          These fields support subgroup analysis without exposing individual answer keys.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="university">University</Label>
            <Input id="university" value={university} onChange={(event) => setUniversity(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={country} onChange={(event) => setCountry(event.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="governorate">Governorate / government area</Label>
            <Input
              id="governorate"
              value={governorate}
              onChange={(event) => setGovernorate(event.target.value)}
              placeholder="Example: Cairo, Giza, Dakahlia"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Select id="specialty" value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
              {specialties.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="yearsExperience">Years of experience</Label>
            <Input
              id="yearsExperience"
              type="number"
              min="0"
              max="70"
              value={yearsExperience}
              onChange={(event) => setYearsExperience(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="academicStage">Student or graduate</Label>
            <Select id="academicStage" value={academicStage} onChange={(event) => setAcademicStage(event.target.value)}>
              {academicStages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
          {error ? <p className="text-sm text-destructive sm:col-span-2">{error}</p> : null}
          <div className="sm:col-span-2">
            <Button className="w-full sm:w-auto" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save profile and start validation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
