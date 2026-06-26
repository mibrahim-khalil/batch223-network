import { Link } from "react-router-dom";
import type { RecentlyUpdated } from "../features/dashboard/mockDashboard";

export default function RecentlyUpdatedCard({ u }: { u: RecentlyUpdated }) {
  return (
    <Link to={`/students/${u.id}`} className="block bg-canvas">
      <div className="bg-soft-cloud aspect-square overflow-hidden">
        <img
          src={u.avatarUrl}
          alt={u.fullName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-medium text-ink truncate">{u.fullName}</p>
          <span className="text-xs text-mute">{u.updatedAt}</span>
        </div>

        <p className="mt-1 text-sm text-charcoal truncate">
          {u.position} @ {u.company}
        </p>

        <p className="mt-1 text-xs text-mute tracking-widest uppercase truncate">
          {u.cityCountry}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {u.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="inline-flex items-center rounded-pill border border-hairline bg-canvas px-3 py-1 text-xs font-medium text-ink"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}