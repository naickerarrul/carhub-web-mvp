"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PartnerHomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Partner Portal</h1>
      <p className="text-sm text-muted-foreground">Tow/workshop partners can manage jobs and assigned claims.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <h2 className="font-medium">Tow Jobs</h2>
            <p className="text-sm text-muted-foreground">Accept/decline jobs and update status.</p>
            <Button asChild className="rounded-full"><Link href="/partner/jobs">Go to Jobs</Link></Button>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <h2 className="font-medium">Workshop Claims</h2>
            <p className="text-sm text-muted-foreground">Upload estimates and progress updates.</p>
            <Button asChild className="rounded-full"><Link href="/partner/claims">Go to Claims</Link></Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}