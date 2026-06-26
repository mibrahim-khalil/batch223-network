export default function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-soft-cloud border border-hairline-soft ${className}`}
    />
  );
}