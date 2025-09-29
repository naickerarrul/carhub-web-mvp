"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">FNOL Today</p>
            <p className="mt-1 text-3xl font-semibold">3</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Avg Time To First Response</p>
            <p className="mt-1 text-3xl font-semibold">12m</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Open Claims</p>
            <p className="mt-1 text-3xl font-semibold">18</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Live Assistance</p>
            <p className="mt-1 text-3xl font-semibold">5</p>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-medium">Incident Heatmap</h2>
        <p className="text-sm text-muted-foreground mt-2">Map integration coming soon.</p>
        <div className="mt-4 h-56 rounded-xl bg-muted" />
      </section>
    </main>
  );
}