import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-primary">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">Human versus AI performance</h1>
        <p className="mt-2 text-muted-foreground">Question difficulty, participant distribution, confusion matrix, and timing analysis.</p>
      </div>
      <AnalyticsCharts />
    </div>
  );
}
