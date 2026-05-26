import Image from "next/image";
import { BarChart3, BrainCircuit, ShieldCheck, Stethoscope, Trophy } from "lucide-react";
import { HomeSessionPanel } from "@/components/common/home-session-panel";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/common/mode-toggle";
import { StatCard } from "@/components/common/stat-card";
import { MODEL_METRICS } from "@/lib/constants";
import { localSimulationQuestions } from "@/lib/local-simulation-questions";
import { formatPercent } from "@/lib/utils";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="fixed right-4 top-4 z-50 rounded-md border bg-background/80 backdrop-blur">
        <ModeToggle />
      </div>
      <section className="relative flex min-h-[84vh] items-center overflow-hidden bg-[#101415] text-white">
        <Image
          src="/static/radiographs/sample-1.jpg"
          alt="Dental radiograph used in AI validation"
          fill
          priority
          className="object-cover opacity-35 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101415] via-[#101415]/82 to-[#101415]/45" />
        <div className="clinical-grid absolute inset-0 opacity-60" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20">
          <div className="max-w-3xl">
            <Badge className="mb-6 border-primary/30 bg-primary/10 text-primary" variant="outline">
              External validation benchmark
            </Badge>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-6xl">
              Dental AI External Validation
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              A secure benchmark for comparing dentist diagnostic performance against a DeiT + CoAtNet
              cross-attention model on a dental radiograph validation set.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <HomeSessionPanel />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 md:grid-cols-4">
        <StatCard label="Validation cases" value={String(localSimulationQuestions.length)} hint="Randomized once per doctor" icon={Stethoscope} />
        <StatCard label="AI accuracy" value={formatPercent(MODEL_METRICS.accuracy)} hint="Full hybrid model" icon={BrainCircuit} tone="emerald" />
        <StatCard label="AUC" value={MODEL_METRICS.auc.toFixed(3)} hint="Ablation winner" icon={BarChart3} tone="amber" />
        <StatCard label="Leaderboard" value="Live" hint="Human and AI ranked together" icon={Trophy} />
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Research protocol</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">AI versus human diagnostic agreement</h2>
            <p className="mt-4 text-muted-foreground">
              The study model combines data-efficient image transformers and CoAtNet convolution-attention
              features through cross-attention fusion, then uses a stacking classifier for disease classification.
              This platform converts that work into a controlled external validation workflow.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Server-side scoring", "Correct answers stay in protected Firestore documents."],
              ["One attempt", "Doctors complete the benchmark once per dataset version."],
              ["Confidence capture", "Each answer stores confidence and time spent."],
              ["Audit trail", "Admin actions and exports can be logged for protocol review."]
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border bg-background p-5">
                <ShieldCheck className="mb-4 h-5 w-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
