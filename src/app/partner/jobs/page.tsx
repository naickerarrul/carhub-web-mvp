"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PartnerJobsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Tow Jobs</h1>

      <div className="grid gap-4">
        {[1,2,3].map((id) => (
          <Card key={id} className="rounded-2xl">
            <CardContent className="p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Job #{id}</p>
                <p className="text-sm text-muted-foreground">Location: Jalan Ampang • ETA request now</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full">Decline</Button>
                <Button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Accept</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}