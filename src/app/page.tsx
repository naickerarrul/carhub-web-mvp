"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Camera, LifeBuoy } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-[100svh] w-full">
      <section className="relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
          alt="City highway at dusk"
          width={1600}
          height={900}
          priority
          className="h-[42svh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-end pb-8">
          <h1 className="text-white text-3xl sm:text-4xl font-semibold tracking-tight">CarHub</h1>
          <p className="text-white/90 mt-2 max-w-xl">Simple, fast help after a motor accident. File a claim, get roadside assistance, and track everything in one place.</p>
          <div className="mt-4 flex gap-3">
            <Button asChild className="rounded-full px-6 bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md">
              <Link href="/claims/new">Report Accident</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full px-6">
              <Link href="/assistance/new">Roadside Help</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--primary)] text-white grid place-items-center shadow-sm">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Report Accident</h3>
                  <p className="text-sm text-muted-foreground">Guided steps to submit a claim with photos.</p>
                </div>
              </div>
              <div className="mt-4">
                <Button asChild className="w-full rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <Link href="/claims/new">Start FNOL</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--primary)] text-white grid place-items-center shadow-sm">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Track My Claim</h3>
                  <p className="text-sm text-muted-foreground">See status updates and timeline events.</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" className="rounded-full w-full">
                  <Link href="/claims">View Claims</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[var(--primary)] text-white grid place-items-center shadow-sm">
                  <LifeBuoy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Roadside Help</h3>
                  <p className="text-sm text-muted-foreground">Tow, tyre, battery, fuel, or lockout.</p>
                </div>
              </div>
              <div className="mt-4">
                <Button asChild className="w-full rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <Link href="/assistance/new">Request Help</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-2 rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">What you can do</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>Submit a motor claim with 2–8 photos and documents</li>
              <li>Get roadside assistance with live status updates</li>
              <li>Track claims and receive gentle reminders for missing items</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold">Need help?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Email support@carhub.local. For emergencies, call local authorities.</p>
          </div>
        </div>
      </section>
    </main>
  );
}