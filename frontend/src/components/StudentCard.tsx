import { Link } from "react-router-dom";
import type { StudentCardModel } from "../features/directory/mockStudents";

export default function StudentCard({ student }: { student: StudentCardModel }) {
  return (
    <Link
      to={`/students/${student.id}`}
      className="block bg-canvas focus:outline-none"
      aria-label={`Open profile: ${student.fullName}`}
    >
      {/* image stage */}
      <div className="relative bg-soft-cloud aspect-square overflow-hidden">
        {student.registrationNumber?.trim() ? (
          <span className="absolute top-3 left-3 z-10 rounded-pill bg-canvas/90 border border-hairline px-3 py-1 text-[11px] font-medium tracking-widest uppercase text-ink">
            {student.registrationNumber}
          </span>
        ) : null}

        <img
          src={student.avatarUrl}
          alt={student.fullName}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* meta */}
      <div className="pt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-base font-medium text-ink truncate">
            {student.fullName}
          </p>

          {student.openToWork ? (
            <span className="shrink-0 rounded-pill bg-success/10 text-success px-3 py-1 text-[11px] font-medium tracking-widest uppercase">
              Open
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm text-charcoal truncate">
          {student.position} @ {student.company}
        </p>

        <p className="mt-1 text-xs text-mute tracking-widest uppercase truncate">
          {student.cityCountry}
        </p>

        {/* skills preview */}
        <div className="mt-3 flex flex-wrap gap-2">
          {(student.skills ?? []).slice(0, 3).map((s) => (
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