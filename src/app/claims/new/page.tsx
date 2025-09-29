"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function NewClaimWizard() {
  const router = useRouter();
  const [incidentAt, setIncidentAt] = useState<string>(() => new Date().toISOString().slice(0, 16));
  const [policeReportNo, setPoliceReportNo] = useState<string>("");
  const [locationText, setLocationText] = useState<string>("");
  const [locationLat, setLocationLat] = useState<string>("");
  const [locationLng, setLocationLng] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("1");
  const [insurerName, setInsurerName] = useState<string>("");
  const [severity, setSeverity] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    // Basic validation
    if (!incidentAt || !severity || !vehicleId || !locationLat || !locationLng) {
      setError("Please provide incident time, severity, vehicle, and location (lat/lng).");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("bearer_token") || "demo-token";
      const body = {
        incidentAt: new Date(incidentAt).getTime(),
        locationLat: Number(locationLat),
        locationLng: Number(locationLng),
        locationText: locationText || undefined,
        policeReportNo: policeReportNo || undefined,
        vehicleId: Number(vehicleId),
        insurerName: insurerName || undefined,
        severity: severity as "UNKNOWN" | "MINOR" | "MODERATE" | "MAJOR" | "FATALITY",
      };

      const res = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || `Failed to submit claim (${res.status})`);
      }

      if (data?.id) {
        router.push(`/claims/${data.id}`);
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
      <h1 className="text-2xl font-semibold tracking-tight">Report Accident</h1>
      <p className="text-sm text-muted-foreground mt-1">Step 1 of 4 — Incident details</p>

      <Card className="mt-4 rounded-2xl">
        <CardContent className="p-6 space-y-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="incidentAt">Incident time</Label>
              <Input id="incidentAt" type="datetime-local" value={incidentAt} onChange={(e) => setIncidentAt(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="police">Police report no. (optional)</Label>
              <Input id="police" placeholder="e.g., KL/2025/000123" value={policeReportNo} onChange={(e) => setPoliceReportNo(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location text (optional)</Label>
            <Input id="location" placeholder="Search or enter address (auto-detect soon)" value={locationText} onChange={(e) => setLocationText(e.target.value)} />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input id="lat" inputMode="decimal" placeholder="e.g. 3.139" value={locationLat} onChange={(e) => setLocationLat(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input id="lng" inputMode="decimal" placeholder="e.g. 101.6869" value={locationLng} onChange={(e) => setLocationLng(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input id="vehicleId" inputMode="numeric" placeholder="e.g. 1" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="insurer">Insurer (optional)</Label>
              <Input id="insurer" placeholder="e.g., Great Eastern" value={insurerName} onChange={(e) => setInsurerName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger id="severity" className="w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNKNOWN">Unknown</SelectItem>
                  <SelectItem value="MINOR">Minor</SelectItem>
                  <SelectItem value="MODERATE">Moderate</SelectItem>
                  <SelectItem value="MAJOR">Major</SelectItem>
                  <SelectItem value="FATALITY">Fatality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" className="rounded-full">Cancel</Button>
            <Button onClick={handleSubmit} disabled={submitting} className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
              {submitting ? "Submitting…" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}