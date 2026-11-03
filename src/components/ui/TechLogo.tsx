import { iconColor, techIcons } from "@/lib/tech-icons";

/** Renders a real technology logo, or a neutral glyph for tools without a bundled mark. */
export default function TechLogo({
  icon,
  name,
  size = 28,
  onDark = false,
  className,
}: {
  icon: string | null;
  name: string;
  size?: number;
  onDark?: boolean;
  className?: string;
}) {
  const data = icon ? techIcons[icon] : null;
  if (data) {
    return (
      <svg role="img" aria-label={name} viewBox="0 0 24 24" width={size} height={size} className={className} fill={iconColor(data.hex, onDark)}>
        <path d={data.path} />
      </svg>
    );
  }
  // Generic glyphs (not brand logos): braces for REST APIs, a code window for an editor.
  const stroke = onDark ? "#ffffff" : "#1e6bff";
  return (
    <svg role="img" aria-label={name} viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke={stroke} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      {name === "REST APIs" ? (
        <>
          <path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1" />
          <path d="M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1" />
          <circle cx="12" cy="12" r="1.2" fill={stroke} />
        </>
      ) : (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 8h18" />
          <path d="m9 12-2.5 2.5L9 17M15 12l2.5 2.5L15 17" />
        </>
      )}
    </svg>
  );
}
