"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { BrainCircuit, Clock, Sigma, Users } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSnapshot } from "@/lib/functions";
import { demoAnalytics } from "@/lib/mock-data";
import type { AnalyticsSnapshot } from "@/lib/types";

const matrixColors = ["#4cd7f6", "#34d399", "#f59e0b", "#fb7185", "#a78bfa"];

export function AnalyticsCharts() {
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot>(demoAnalytics);
  const [usingDemoData, setUsingDemoData] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const snapshot = await getAnalyticsSnapshot();
        if (!cancelled) {
          setAnalytics(snapshot);
          setUsingDemoData(false);
        }
      } catch {
        if (!cancelled) {
          setAnalytics(demoAnalytics);
          setUsingDemoData(true);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Participants" value={String(analytics.totalParticipants)} icon={Users} />
        <StatCard label="Avg human score" value={analytics.averageHumanScore.toFixed(1)} icon={Sigma} tone="emerald" />
        <StatCard label="Avg AI score" value={analytics.averageAiScore.toFixed(1)} icon={BrainCircuit} />
        <StatCard label="Top doctor" value={String(analytics.topDoctorScore)} icon={Clock} tone="amber" />
      </div>

      {usingDemoData ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Showing demo analytics until Cloud Functions are deployed and attempts exist.
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Accuracy distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.accuracyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,147,151,0.35)" />
                <XAxis dataKey="bucket" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4cd7f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.timeAnalysis}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,147,151,0.35)" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="seconds" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Confusion matrix events</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.confusionMatrix}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(134,147,151,0.35)" />
              <XAxis dataKey={(value) => `${value.actual} -> ${value.predicted}`} interval={0} angle={-15} height={70} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {analytics.confusionMatrix.map((_, index) => (
                  <Cell key={index} fill={matrixColors[index % matrixColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hardest question</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {analytics.hardestQuestion?.questionId || "n/a"} at {Math.round((analytics.hardestQuestion?.accuracy || 0) * 100)}% accuracy.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Easiest question</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            {analytics.easiestQuestion?.questionId || "n/a"} at {Math.round((analytics.easiestQuestion?.accuracy || 0) * 100)}% accuracy.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
