import { Link } from "react-router-dom";
import type { FeaturedAlumni } from "../features/dashboard/mockDashboard";

export default function FeaturedAlumniCard({ a }: { a: FeaturedAlumni }) {
  return (
    <Link to={`/students/${a.id}`} className="block bg-canvas">
      <div className="bg-soft-cloud aspect-square overflow-hidden">
        <img
          src={a.avatarUrl}
          alt={a.fullName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="pt-3">
        <p className="text-base font-medium text-ink truncate">{a.fullName}</p>
        <p className="mt-1 text-sm text-charcoal truncate">{a.headline}</p>
        <p className="mt-1 text-xs text-mute tracking-widest uppercase truncate">
          {a.cityCountry}
        </p>
      </div>
    </Link>
  );
}