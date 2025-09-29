"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VehicleInfo { plate: string | null; make: string | null; model: string | null }
interface ProviderInfo { name: string | null; contact: string | null }

interface AssistanceDetail {
  id: number;
  ref: string;
  userId: number;
  vehicleId: number;
  service: string;
  lat: number;
  lng: number;
  notes?: string | null;
  status: string;
  providerId?: number | null;
  priceQuotedRm?: number | null;
  priceFinalRm?: number | null;
  createdAt: number;
  updatedAt: number;
  vehicle: VehicleInfo | null;
  provider: ProviderInfo | null;
}

export default function AssistanceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<AssistanceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("bearer_token") || "demo-token";
        const res = await fetch(`/api/assistance/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || `Failed to load request (${res.status})`);
        if (isMounted) setData(body as AssistanceDetail);
      } catch (e: any) {
        if (isMounted) setError(e.message || "Something went wrong");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full" onClick={() => router.back()}>Back</Button>
          <h1 className="text-2xl font-semibold tracking-tight">Assistance Detail</h1>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/">Home</Link>
        </Button>
      </div>

      {loading && (
        <div className="mt-6">
          <Card className="rounded-2xl"><CardContent className="p-5">Loading…</CardContent></Card>
        </div>
      )}

      {!loading && error && (
        <div className="mt-6">
          <Card className="rounded-2xl border-destructive/30">
            <CardContent className="p-5">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {!loading && !error && data && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl md:col-span-2">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="font-medium">{data.ref}</p>
                </div>
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs capitalize">
                  {data.status.replaceAll("_", " ").toLowerCase()}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-medium capitalize">{data.service.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{data.vehicle?.plate || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{data.lat}, {data.lng}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{data.notes || "—"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Provider</p>
              <p className="font-medium">{data.provider?.name || "Unassigned"}</p>
              {data.provider?.contact && (
                <>
                  <p className="text-sm text-muted-foreground mt-3">Contact</p>
                  <p className="font-medium">{data.provider.contact}</p>
                </>
              )}
              <p className="text-sm text-muted-foreground mt-3">Quoted Price</p>
              <p className="font-medium">{data.priceQuotedRm != null ? `RM ${data.priceQuotedRm}` : "—"}</p>
              <p className="text-sm text-muted-foreground mt-3">Updated</p>
              <p className="font-medium">{new Date(data.updatedAt).toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}