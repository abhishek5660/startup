import Image from "next/image";
import { site } from "@/lib/site";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Estimate your project", href: "/#estimate" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

const footerServices = [
  { label: "Frontend Development", href: "/services/frontend-development" },
  { label: "Full-Stack Development", href: "/services/full-stack-development" },
  { label: "Custom Websites", href: "/services/custom-website-development" },
  { label: "UI/UX Design", href: "/services/ui-ux-design" },
  { label: "Website Optimization", href: "/services/website-optimization" },
];

const socialIcons: Record<string, { label: string; d: string }> = {
  linkedin: {
    label: "LinkedIn",
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  },
  instagram: {
    label: "Instagram",
    d: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9 9.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4ZM17.5 6.5h.01",
  },
  github: {
    label: "GitHub",
    d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22",
  },
  x: { label: "X", d: "M4 4l16 16M20 4 4 20" },
  facebook: { label: "Facebook", d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" },
};

export default function Footer() {
  const socials = Object.entries(site.social).filter(([, url]) => Boolean(url));

  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-white">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px" style={{ background: "var(--brand-gradient)" }} />
      <div aria-hidden className="absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/20 blur-[120px]" />

      <div className="container-x relative grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.2fr]">
        <div>
          <a href="/" className="inline-flex items-center gap-3">
            <Image src="/brand/nabhindu-mark.png" alt="" width={82} height={40} className="h-10 w-auto" />
            <span className="font-display text-lg font-extrabold leading-tight tracking-wide">
              Nabhindu
              <span className="block text-[0.62rem] font-semibold tracking-[0.42em] text-white/55">TECHNOLOGIES</span>
            </span>
          </a>
          <p className="mt-5 font-display text-xl font-semibold text-gradient">{site.tagline}</p>
          <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-haze">
            Frontend and full-stack web development for businesses that want a modern, fast and reliable online presence.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2.5">
              {socials.map(([key, url]) => {
                const icon = socialIcons[key];
                if (!icon) return null;
                return (
                  <li key={key}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} on ${icon.label}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-transparent hover:bg-electric hover:text-white"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={icon.d} />
                      </svg>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-display text-sm font-semibold text-white/50">Quick links</h2>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-[0.95rem] text-white/80 transition-colors hover:text-sky">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold text-white/50">Services</h2>
          <ul className="mt-4 space-y-2.5">
            {footerServices.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="text-[0.95rem] text-white/80 transition-colors hover:text-sky">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold text-white/50">Contact</h2>
          <address className="mt-4 space-y-2.5 not-italic">
            <a href={site.phoneHref} className="block text-[0.95rem] text-white/80 transition-colors hover:text-sky">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="block break-all text-[0.95rem] text-white/80 transition-colors hover:text-sky">
              {site.email}
            </a>
            <p className="text-[0.95rem] text-white/80">{site.address.full}.</p>
          </address>
        </div>
      </div>

      {/* Oversized wordmark set in the brand typeface */}
      <div aria-hidden className="footer-watermark container-x relative select-none overflow-hidden" />

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Nabhindu Technologies. All Rights Reserved.</p>
          <div className="flex items-center gap-5">
            <a href="/admin" rel="nofollow" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              Admin
            </a>
            <a href="#top" className="transition-colors hover:text-white">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
