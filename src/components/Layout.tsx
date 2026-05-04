import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/map", label: "Map" },
  { to: "/anomalies", label: "Anomalies" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/topology", label: "Topology" },
  { to: "/federated", label: "Federated" },
];

export default function Layout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-amber-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-sm font-bold text-white">MS</span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-stone-800">MeterSense AI</p>
              <p className="text-[10px] text-stone-500">BESCOM AT&C loss detection</p>
            </div>
          </div>
          <nav className="flex gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-amber-100 text-amber-900" : "text-stone-600 hover:text-amber-800"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
