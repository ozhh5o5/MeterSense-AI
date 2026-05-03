"use client";

import { useState } from "react";

export function RunDetectButton() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setMsg(null);
          const r = await fetch("/api/detect/run", { method: "POST" });
          const j = (await r.json()) as { newAnomalies?: number };
          setMsg(`Done — ${j.newAnomalies ?? 0} new anomalies found`);
          setLoading(false);
        }}
        className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Running…" : "Run detection"}
      </button>
      {msg ? <p className="text-sm text-stone-600">{msg}</p> : null}
    </div>
  );
}
