"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <main className="mx-auto max-w-md px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{mode === "login" ? "Sign in" : "Create account"}</h1>
      <p className="text-sm text-muted-foreground mt-1">Passwordless or email + password coming soon. This is a placeholder.</p>

      <Card className="mt-4 rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" className="rounded-full" onClick={() => setMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create account" : "Have an account? Sign in"}</Button>
            <Button className="rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">{mode === "login" ? "Sign in" : "Register"}</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}