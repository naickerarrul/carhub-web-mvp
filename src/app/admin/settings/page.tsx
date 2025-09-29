"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="insurer-email">Default Insurer Email</Label>
            <Input id="insurer-email" placeholder="claims@insurer.example" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ses-from">SES From Address</Label>
            <Input id="ses-from" placeholder="no-reply@carhub.local" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Feature Flags (comma separated)</Label>
            <Input id="features" placeholder="fraud_checks,whatsapp_stub" />
          </div>
          <div className="flex items-center justify-end">
            <Button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Save</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}