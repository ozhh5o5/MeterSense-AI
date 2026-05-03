"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AnomalyActions({ id, status }: { id: string; status: string }) {
  const r = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  async function go(next: string) {
    setMsg(null);
    const res = await fetch(`/api/anomalies/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next, investigator: "demo-officer" }),
    });
    if (!res.ok) setMsg("Update failed");
    else {
      setMsg("Updated");
      r.refresh();
    }
  }
  const btn = "rounded-md px-3 py-1.5 text-sm font-medium transition-colors";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "OPEN" ? (
        <button type="button" className={`${btn} bg-amber-600 text-white hover:bg-amber-700`} onClick={() => go("ACKNOWLEDGED")}>
          Acknowledge
        </button>
      ) : null}
      <button type="button" className={`${btn} bg-stone-800 text-white hover:bg-stone-900`} onClick={() => go("INVESTIGATING")}>
        Investigate
      </button>
      <button type="button" className={`${btn} bg-green-600 text-white hover:bg-green-700`} onClick={() => go("RESOLVED")}>
        Resolve
      </button>
      <button type="button" className={`${btn} border border-stone-300 bg-white text-stone-600 hover:bg-stone-50`} onClick={() => go("FALSE_POSITIVE")}>
        False positive
      </button>
      {msg ? <span className="text-sm text-stone-500">{msg}</span> : null}
    </div>
  );
}
