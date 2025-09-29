"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function NewAssistancePage() {
  const router = useRouter();
  const [service, setService] = useState<string>("");
  const [lat, setLat] = useState<string>("");
  const [lng, setLng] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("1");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    // Basic validation
    if (!service || !lat || !lng || !vehicleId) {
      setError("Please select a service and provide location and vehicle.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token") || "demo-token";
      const res = await fetch("/api/assistance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service, // enum: TOW|TYRE|BATTERY|FUEL|LOCKOUT
          lat: Number(lat),
          lng: Number(lng),
          notes: notes || undefined,
          vehicleId: Number(vehicleId),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      // Navigate to detail page
      if (data?.id) {
        router.push(`/assistance/${data.id}`);
      } else {
        setError("Unexpected response from server");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Request Roadside Help</h1>
      <p className="text-sm text-muted-foreground mt-1">Tow, tyre, battery, fuel, or lockout — we will dispatch the nearest partner.</p>

      <Card className="mt-4 rounded-2xl">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="service">Service type</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger id="service" className="w-full">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOW">Tow</SelectItem>
                <SelectItem value="TYRE">Tyre</SelectItem>
                <SelectItem value="BATTERY">Battery</SelectItem>
                <SelectItem value="FUEL">Fuel</SelectItem>
                <SelectItem value="LOCKOUT">Lockout</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" inputMode="decimal" placeholder="e.g. 3.139" value={lat} onChange={(e) => setLat(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" inputMode="decimal" placeholder="e.g. 101.6869" value={lng} onChange={(e) => setLng(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input id="vehicleId" inputMode="numeric" placeholder="e.g. 1" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input id="notes" placeholder="Any landmarks or details to help the driver" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-end">
            <Button onClick={handleSubmit} disabled={submitting} className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
              {submitting ? "Requesting…" : "Request Help"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}