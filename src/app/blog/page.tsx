import type { Metadata } from "next";
import PageShell, { PageHero } from "@/components/layout/PageShell";
import { Reveal, TiltCard } from "@/components/ui/motion";
import { formatPostDate, posts } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog – Websites, Pricing & Growth Tips",
  description: `Practical guides on website costs, technology choices and growing your business online, from ${site.name} in Faridabad.`,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title: `Blog | ${site.name}`, images: ["/og-image.png"] },
};

export default function BlogIndex() {
  const [featured, ...rest] = posts;
  return (
    <PageShell>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        title="Insights & guides"
        lede="Straight answers on website costs, technology and getting more customers online — written for business owners, not developers."
      />
      <section className="section-light py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <a href={`/blog/${featured.slug}`} className="block">
              <TiltCard max={4} className="group relative grid overflow-hidden rounded-[2rem] bg-ink text-white shadow-[0_40px_90px_-45px_rgba(30,107,255,0.7)] lg:grid-cols-[1.1fr_1fr]">
                <div className="relative z-[2] p-8 sm:p-10">
                  <p className="text-sm text-white/55">
                    Featured · {formatPostDate(featured.date)} · {featured.readMins} min read
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">{featured.title}</h2>
                  <p className="mt-4 leading-relaxed text-haze">{featured.description}</p>
                  <span className="mt-7 inline-flex items-center gap-2 font-semibold text-sky">
                    Read article <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
                <PostArt seed={0} />
              </TiltCard>
            </a>
          </Reveal>

          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={i * 0.08}>
                <a href={`/blog/${p.slug}`} className="block h-full">
                  <TiltCard max={6} className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_24px_60px_-45px_rgba(10,16,51,0.6)]">
                    <PostArt seed={i + 1} small />
                    <div className="relative z-[2] flex flex-1 flex-col p-7">
                      <p className="text-sm text-slate">
                        {formatPostDate(p.date)} · {p.readMins} min read
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-navy">{p.title}</h2>
                      <p className="mt-3 leading-relaxed text-slate">{p.description}</p>
                      <div className="mt-auto flex flex-wrap gap-2 pt-6">
                        {p.tags.map((t) => (
                          <span key={t} className="chip bg-mist text-navy/75">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TiltCard>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}

/** Decorative 3D-style cube cluster in brand colours (no stock photos needed). */
function PostArt({ seed, small = false }: { seed: number; small?: boolean }) {
  const palettes = [
    ["#18b4ff", "#1e6bff", "#8b2cf5"],
    ["#1e6bff", "#5b33f0", "#18b4ff"],
    ["#8b2cf5", "#1e6bff", "#18b4ff"],
  ];
  const c = palettes[seed % palettes.length];
  return (
    <div aria-hidden className={`post-art relative overflow-hidden ${small ? "h-44" : "min-h-[240px]"}`} style={{ background: `linear-gradient(135deg, ${c[0]}33, ${c[2]}33), #0a1033` }}>
      <div className="floor-grid absolute inset-x-0 bottom-0 h-full opacity-70" />
      {[0, 1, 2].map((k) => (
        <span key={k} className="post-cube" style={{ "--c": c[k], "--x": `${28 + k * 22}%`, "--y": `${(k % 2 ? 30 : 48) - (small ? 6 : 0)}%`, "--s": `${small ? 34 + k * 8 : 48 + k * 12}px`, "--d": `${k * -2}s` } as React.CSSProperties}>
          <i />
          <i />
          <i />
        </span>
      ))}
    </div>
  );
}
