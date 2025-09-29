"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClaimsListPage() {
  const [claims, setClaims] = useState<Array<{ id: number; ref: string; status: string; updatedAt: number; plate: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("bearer_token") || "demo-token";
      const res = await fetch("/api/claims", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Failed to load claims (${res.status})`);
      }
      const data = await res.json();
      setClaims(data || []);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await fetchClaims();
      if (!isMounted) return;
    })();
    return () => {
      isMounted = false;
    };
  }, [tick, fetchClaims]);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Claims</h1>
        <Button asChild className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
          <Link href="/claims/new">Report Accident</Link>
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Loading your claims…</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border-destructive/30">
            <CardContent className="p-5">
              <p className="text-sm text-destructive">{error}</p>
              <div className="mt-3">
                <Button onClick={() => setTick((t) => t + 1)} variant="outline" className="rounded-full">Try again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && claims.length === 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">No claims yet.</p>
              <div className="mt-3">
                <Button asChild className="rounded-full">
                  <Link href="/claims/new">Start your first claim</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* List */}
      {!loading && !error && claims.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {claims.map((c) => (
            <Card key={c.id} className="rounded-2xl hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ref</p>
                    <p className="font-medium">{c.ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Plate</p>
                    <p className="font-medium">{c.plate}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs capitalize">
                    {c.status.replaceAll("_", " ").toLowerCase()}
                  </span>
                  <Link href={`/claims/${c.id}`} className="text-sm text-[var(--primary)] hover:underline">View</Link>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Updated {new Date(c.updatedAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}