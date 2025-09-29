import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CarHub Web MVP",
  description: "Roadside + Claims Intake sitting above Merimen",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-background text-foreground">
        <ErrorReporter />
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--primary)" }} />
              <span className="font-semibold tracking-tight">CarHub</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/claims" className="hover:underline">Claims</Link>
              <Link href="/assistance/new" className="hover:underline">Roadside</Link>
              <Link href="/profile" className="hover:underline">Profile</Link>
              <Link href="/auth" className="rounded-full border px-3 py-1.5 hover:bg-secondary">Sign in</Link>
            </nav>
          </div>
        </header>
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "CarHub", "version": "0.1.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}