import { useEffect, useRef } from "react";
import L from "leaflet";
import { DATA } from "@/data/mock-data";

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([12.9352, 77.6245], 12);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    DATA.substations.forEach((s) => {
      const color = s.avgLoss > 20 ? "#ef4444" : s.avgLoss > 10 ? "#f59e0b" : "#10b981";
      const marker = L.circleMarker([s.lat, s.lng], {
        radius: 10, fillColor: color, color: "#fff", weight: 2, opacity: 1, fillOpacity: 0.85,
      }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;font-size:13px">
          <strong>${s.name}</strong><br/>
          <span style="color:#78716c">Code: ${s.code}</span><br/>
          <span style="color:#78716c">Division: ${s.division}</span><br/>
          <span style="color:#78716c">Feeders: ${s.feederCount}</span><br/>
          <span style="color:${color};font-weight:600">Avg Loss: ${s.avgLoss}%</span>
        </div>
      `);
    });

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-amber-900">Substation Map</h1>
        <p className="text-stone-500">Interactive Leaflet + OpenStreetMap view of BESCOM substations. Color indicates AT&C loss severity.</p>
      </div>
      <div className="flex gap-4 text-sm text-stone-600">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-emerald-500" /> &lt;10% loss</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-amber-500" /> 10–20% loss</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-red-500" /> &gt;20% loss</span>
      </div>
      <div ref={mapRef} className="h-[500px] rounded-xl border border-stone-200 shadow-sm" />
    </div>
  );
}
