"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AdminClaimDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Claim {params.id}</h1>
        <div className="flex items-center gap-2">
          <Badge className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">IN_REVIEW</Badge>
          <Button variant="outline" className="rounded-full">Request Docs</Button>
          <Button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Change Status</Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-medium">Timeline</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>2025-09-29 10:14 — Claim submitted</li>
              <li>2025-09-29 10:18 — Media uploaded (6)</li>
              <li>2025-09-29 10:30 — Status changed to IN_REVIEW</li>
            </ul>
            <Separator />
            <h3 className="font-medium">Media</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3].map((i) => (
                <div key={i} className="aspect-video w-full rounded-lg bg-muted" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6 space-y-3">
            <h2 className="font-medium">Actions</h2>
            <Button className="w-full rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Build Packet</Button>
            <Button variant="outline" className="w-full rounded-full">Send to Insurer</Button>
            <Separator className="my-2" />
            <h3 className="text-sm font-medium">Insurer</h3>
            <p className="text-sm text-muted-foreground">ABC Insurance • Ref: —</p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}