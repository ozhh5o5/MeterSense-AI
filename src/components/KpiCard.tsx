interface Props { label: string; value: string | number; sub?: string; color?: string; }

const COLORS: Record<string, string> = {
  amber: "border-t-amber-500", red: "border-t-red-500", blue: "border-t-blue-500",
  green: "border-t-emerald-500", stone: "border-t-stone-400", yellow: "border-t-yellow-400",
  purple: "border-t-purple-500",
};

export default function KpiCard({ label, value, sub, color = "amber" }: Props) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-white p-5 shadow-sm border-t-4 ${COLORS[color] ?? COLORS.amber}`}>
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-stone-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-stone-400">{sub}</p>}
    </div>
  );
}
