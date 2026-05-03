import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeterSense AI",
  description: "BESCOM smart meter intelligence with AT&C loss detection and explainable tampering alerts.",
};

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/map", label: "Map" },
  { href: "/anomalies", label: "Anomalies" },
  { href: "/maintenance", label: "Maintenance" },
  { href: "/topology", label: "Topology" },
  { href: "/federated", label: "Federated" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] text-stone-900">
        <header className="sticky top-0 z-20 border-b border-amber-200/60 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-sm font-bold text-white">
                MS
              </div>
              <div>
                <h1 className="text-lg font-semibold text-stone-900 leading-tight">MeterSense AI</h1>
                <p className="text-xs text-stone-500">
                  BESCOM AT&amp;C loss detection
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-1.5 text-sm font-medium text-stone-600 transition-colors hover:bg-amber-50 hover:text-amber-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
      </body>
    </html>
  );
}
