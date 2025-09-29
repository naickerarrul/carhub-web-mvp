"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ClaimEvent {
  id: number;
  type: string;
  payload: string | null;
  actorType: string;
  actorId: number | null;
  createdAt: number;
}

interface MediaAsset {
  id: number;
  kind: string;
  url: string;
  mime: string;
  sizeBytes: number;
  checksum: string;
  createdAt: number;
}

interface VehicleInfo { plate: string | null; make: string | null; model: string | null }

interface ClaimDetail {
  id: number;
  ref: string;
  userId: number;
  vehicleId: number;
  incidentAt: number;
  locationLat: number;
  locationLng: number;
  locationText?: string | null;
  policeReportNo?: string | null;
  insurerName?: string | null;
  insurerRef?: string | null;
  status: string;
  severity: string;
  createdAt: number;
  updatedAt: number;
  events: ClaimEvent[];
  media: MediaAsset[];
  vehicle: VehicleInfo | null;
}

export default function ClaimDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ClaimDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("bearer_token") || "demo-token";
        const res = await fetch(`/api/claims/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body?.error || `Failed to load claim (${res.status})`);
        if (isMounted) setData(body as ClaimDetail);
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
          <h1 className="text-2xl font-semibold tracking-tight">Claim Detail</h1>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/claims">All Claims</Link>
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
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{data.vehicle?.plate || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <p className="font-medium capitalize">{data.severity.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Incident</p>
                  <p className="font-medium">{new Date(data.incidentAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{data.locationText || `${data.locationLat}, ${data.locationLng}`}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Insurer</p>
              <p className="font-medium">{data.insurerName || "—"}</p>
              <p className="text-sm text-muted-foreground mt-3">Police report</p>
              <p className="font-medium">{data.policeReportNo || "—"}</p>
              <p className="text-sm text-muted-foreground mt-3">Updated</p>
              <p className="font-medium">{new Date(data.updatedAt).toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl md:col-span-2">
            <CardContent className="p-5">
              <h2 className="font-semibold">Timeline</h2>
              <div className="mt-3 space-y-3">
                {data.events.length === 0 && (
                  <p className="text-sm text-muted-foreground">No events yet.</p>
                )}
                {data.events.map((ev) => (
                  <div key={ev.id} className="rounded-xl border p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{ev.type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(ev.createdAt).toLocaleString()}</span>
                    </div>
                    {ev.payload && (
                      <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground">{ev.payload}</pre>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <h2 className="font-semibold">Media</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {data.media.length === 0 && (
                  <p className="text-sm text-muted-foreground">No media uploaded.</p>
                )}
                {data.media.map((m) => (
                  <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="block rounded-lg border p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{m.kind}</span>
                      <span className="text-muted-foreground">{(m.sizeBytes / 1024).toFixed(0)} KB</span>
                    </div>
                    <div className="mt-1 text-muted-foreground truncate">{m.mime}</div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}