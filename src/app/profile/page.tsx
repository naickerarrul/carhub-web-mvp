"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>

      <Card className="rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" placeholder="e.g., +60 12-345 6789" />
          </div>
          <div className="flex items-center justify-end">
            <Button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Save</Button>
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-semibold">Vehicles</h2>
        <Card className="mt-3 rounded-2xl">
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="plate">Plate</Label>
                <Input id="plate" value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="e.g., WXY 1234" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insurer">Insurer (optional)</Label>
                <Input id="insurer" placeholder="e.g., ABC Insurance" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="e.g., Perodua" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="e.g., Myvi" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" placeholder="e.g., 2019" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" className="rounded-full">Cancel</Button>
              <Button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">Add Vehicle</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}