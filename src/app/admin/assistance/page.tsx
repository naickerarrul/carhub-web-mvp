"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminAssistancePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Assistance Dispatch</h1>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="font-medium">Live Map</h2>
        <p className="text-sm text-muted-foreground mt-2">Map and SLA timers coming soon.</p>
        <div className="mt-4 h-64 rounded-xl bg-muted" />
      </section>

      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="rounded-xl border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ref</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>AR-KL-202509-0003</TableCell>
                  <TableCell>TOW</TableCell>
                  <TableCell>EN_ROUTE</TableCell>
                  <TableCell>Acme Tow</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}