import { useId } from "react";
import type { ReactNode } from "react";

/* Hand-tuned 24px stroke icons — consistent 1.8 weight, round caps */
const P: Record<string, ReactNode> = {
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></>,
  car: <><path d="M4 16v-4l1.7-4.6A2 2 0 0 1 7.6 6h8.8a2 2 0 0 1 1.9 1.4L20 12v4" /><path d="M4 12h16" /><path d="M3 16h18v3h-2.5" /><path d="M5.5 19H3v-3" /><circle cx="7.5" cy="17.5" r="1.6" /><circle cx="16.5" cy="17.5" r="1.6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" /><path d="m9.5 15.5 2 2 3.5-3.5" /></>,
  wrench: <><path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.7L3 17.7V21h3.3l5.7-5.7a4.5 4.5 0 0 0 5.7-6l-3 3-2.8-.9-.9-2.8 3.7-2.3Z" /></>,
  grid: <><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9S14.6 18.4 12 21c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3Z" /></>,
  chevL: <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  chevR: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  chevD: <path d="m6 9.5 6 6 6-6" />,
  phone: <path d="M6.8 3.5c.6 0 1.7 1.6 2.2 2.9.4 1-.1 1.8-.8 2.5-.5.5-.6 1.1-.2 1.8a12 12 0 0 0 5.3 5.3c.7.4 1.3.3 1.8-.2.7-.7 1.5-1.2 2.5-.8 1.3.5 2.9 1.6 2.9 2.2 0 1.9-1.6 3.4-3.5 3.1C10.5 19.3 4.7 13.5 3.7 7c-.3-1.9 1.2-3.5 3.1-3.5Z" />,
  star: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8L12 3Z" />,
  gauge: <><path d="M4.5 19a9.5 9.5 0 1 1 15 0" /><path d="m12 13.5 3.8-5" /><circle cx="12" cy="14.5" r="1.6" /></>,
  fuel: <><path d="M5 21V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15" /><path d="M4 21h11" /><path d="M14 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0v-8l-2.5-2.5" /><path d="M7.5 8h4" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8 13.5 5h-3L12 2.8ZM12 21.2 10.5 19h3L12 21.2ZM2.8 12 5 10.5v3L2.8 12ZM21.2 12 19 13.5v-3l2.2 1.5ZM5.5 5.5l2.6.9-2.1 2.1-.5-3ZM18.5 18.5l-2.6-.9 2.1-2.1.5 3ZM18.5 5.5l-.9 2.6-2.1-2.1 3-.5ZM5.5 18.5l.9-2.6 2.1 2.1-3 .5Z" /></>,
  shield: <><path d="M12 3 5 5.8v5.4c0 4.5 3 8.1 7 9.8 4-1.7 7-5.3 7-9.8V5.8L12 3Z" /><path d="m9 11.8 2.2 2.2L15.5 9.5" /></>,
  bell: <><path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5" /><path d="M10 18.5a2.1 2.1 0 0 0 4 0" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  copy: <><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" transform="translate(2 2)" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5.5l3.5 2" /></>,
  pin: <><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  sparkles: <><path d="M12 4.5 13.8 9l4.5 1.8-4.5 1.8L12 17l-1.8-4.4L5.7 10.8 10.2 9 12 4.5Z" /><path d="M19 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" /><path d="M5 3l.7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8L2.5 5.5l1.8-.7L5 3Z" /></>,
  drop: <><path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.7 12 3.5 12 3.5Z" /><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" /></>,
  zap: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />,
  steering: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2.6" /><path d="M3.2 10.5c3-1.3 14.6-1.3 17.6 0M12 14.6V21M9.5 13.8l-5.2 4M14.5 13.8l5.2 4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16.5 16.5 4.5 4.5" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="3" /><path d="M2.5 10h19M6 15h4" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5" /><circle cx="12" cy="7.8" r="0.4" fill="currentColor" /></>,
  logout: <><path d="M14 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" /><path d="m17 8.5 3.5 3.5-3.5 3.5M20 12H9.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5c1.2-3.5 4-5 7.5-5s6.3 1.5 7.5 5" /></>,
  refresh: <><path d="M20 12a8 8 0 1 1-2.5-5.8" /><path d="M20 3.5V7h-3.5" /></>,
  alert: <><path d="M12 3.5 2.5 20h19L12 3.5Z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.2" r="0.4" fill="currentColor" /></>,
  gift: <><rect x="3.5" y="8" width="17" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12" /><path d="M12 8c-4.5 0-5.5-4.5-2.5-4.5C11.5 3.5 12 8 12 8Zm0 0c4.5 0 5.5-4.5 2.5-4.5C12.5 3.5 12 8 12 8Z" /></>,
  users: <><circle cx="9" cy="8.5" r="3.5" /><path d="M2.8 19.5c1-3 3.4-4.5 6.2-4.5s5.2 1.5 6.2 4.5" /><path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.8M17.8 15.4c1.6.7 2.9 2 3.5 4.1" /></>,
  engine: <><path d="M7 5v3M4.5 6.5h5M12 8V6.5" /><path d="M6 8h9l2 3h2.5v6H17l-2 2H8l-2-3H3.5v-5H6V8Z" /><path d="M19.5 13H22" /></>,
  key: <><circle cx="8" cy="15.5" r="4.5" /><path d="m11.5 12 8-8M17 6.5l3 3M14.5 9l2 2" /></>,
  tag: <><path d="M3.5 11.5v-8h8L21 13l-8 8-9.5-9.5Z" /><circle cx="8" cy="8" r="1.3" /></>,
  arrow: <><path d="M7 17 17 7" /><path d="M9 7h8v8" /></>,
  camera: <><path d="M4 8h3l2-2.5h6L17 8h3a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 19V9.5A1.5 1.5 0 0 1 4 8Z" /><circle cx="12" cy="13.5" r="3.5" /></>,
  minus: <path d="M6 12h12" />,
  moon: <><path d="M20 13.5A8.5 8.5 0 0 1 10.5 4a8.5 8.5 0 1 0 9.5 9.5Z" /><path d="M17 4l.6 1.6L19.2 6l-1.6.6L17 8.2l-.6-1.6-1.6-.6 1.6-.4L17 4Z" /></>,
  chat: <><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 21l1.6-5.3A8.5 8.5 0 1 1 21 12Z" /><path d="M8.5 10.5h7M8.5 14h4.5" /></>,
  send: <><path d="M21 3 10.5 13.5" /><path d="M21 3 14 21l-3.5-7.5L3 10l18-7Z" /></>,
};

export function Icon({ name, size = 20, className = "", strokeWidth = 1.8, filled = false }: {
  name: string; size?: number; className?: string; strokeWidth?: number; filled?: boolean;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth={filled ? 0 : strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      {P[name] ?? P.sparkles}
    </svg>
  );
}

export function WhatsAppIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/* Doghmal mark — Toyota-style triple ellipse on Toyota red.
   Unique gradient id per instance: shared ids break when an earlier
   copy lives inside a display:none subtree (hidden desktop panel). */
export function DoghmalMark({ size = 40 }: { size?: number }) {
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff2d3d" /><stop offset="0.5" stopColor="#eb0a1a" /><stop offset="1" stopColor="#a50511" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${id})`} />
      <ellipse cx="32" cy="32" rx="21" ry="13.5" fill="none" stroke="#fff" strokeWidth="3.6" />
      <ellipse cx="32" cy="32" rx="8.5" ry="13.5" fill="none" stroke="#fff" strokeWidth="3.6" />
      <ellipse cx="32" cy="26.5" rx="14.5" ry="4.6" fill="none" stroke="#fff" strokeWidth="3.2" />
    </svg>
  );
}
