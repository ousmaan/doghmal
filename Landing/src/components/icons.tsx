import { useId } from "react";

/* Doghmal mark — Toyota-style triple ellipse on Toyota red.
   Unique gradient id per instance so shared ids don’t break when an earlier
   copy lives inside a display:none subtree. */
export function DoghmalMark({ size = 40 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff2d3d" />
          <stop offset="0.5" stopColor="#eb0a1a" />
          <stop offset="1" stopColor="#a50511" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <ellipse cx="32" cy="32" rx="21" ry="13.5" fill="none" stroke="#fff" strokeWidth="3.6" />
      <ellipse cx="32" cy="32" rx="8.5" ry="13.5" fill="none" stroke="#fff" strokeWidth="3.6" />
      <ellipse cx="32" cy="26.5" rx="14.5" ry="4.6" fill="none" stroke="#fff" strokeWidth="3.2" />
    </svg>
  );
}
