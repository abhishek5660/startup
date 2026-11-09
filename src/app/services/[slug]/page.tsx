import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell, { JsonLd, PageHero } from "@/components/layout/PageShell";
import { Reveal, TiltCard } from "@/components/ui/motion";
import ServiceIcon from "@/components/ui/ServiceIcon";
import BookCallButton from "@/components/ui/BookCallButton";
import { formatINR, processSteps, services } from "@/lib/data";
import { servicePageBySlug, servicePages } from "@/lib/service-pages";
import { site, whatsappLink } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = servicePageBySlug((await params).slug);
  if (!page) return {};
  const url = `/services/${page.slug}`;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: `${page.metaTitle} | ${site.name}`, description: page.metaDescription, images: ["/og-image.png"] },
    twitter: { card: "summary_large_image", title: page.metaTitle, description: page.metaDescription, images: ["/og-image.png"] },
  };
}

export default async function ServicePage({ params }: Props) {
  const page = servicePageBySlug((await params).slug);
  if (!page) notFound();
  const service = services.find((s) => s.id === page.id)!;
  const others = servicePages.filter((p) => p.id !== page.id);
  const url = `${site.url}/services/${page.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: page.metaDescription,
      url,
      serviceType: service.title,
      areaServed: [{ "@type": "City", name: "Faridabad" }, { "@type": "Country", name: "India" }],
      provider: { "@type": "ProfessionalService", name: site.name, url: site.url, telephone: site.phone.replace(/\s/g, "") },
      offers: { "@type": "Offer", priceCurrency: "INR", price: page.startingPrice, description: `Starting at ${formatINR(page.startingPrice)}` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/#services` },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ],
    },
  ];

  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/#services" }, { label: service.title }]} title={service.title} lede={service.summary}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="/#contact" className="btn btn-primary">
            Get a quote
          </a>
          <BookCallButton />
          <span className="ml-1 text-sm text-white/65">
            Starting at <strong className="font-display text-base text-white">{formatINR(page.startingPrice)}</strong>
          </span>
        </div>
      </PageHero>

      <section className="section-light py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">What this service covers</h2>
            </Reveal>
            {page.intro.map((p, i) => (
              <Reveal key={i} delay={0.05 * i}>
                <p className="lede mt-5 text-slate">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.1}>
              <h3 className="mt-12 text-xl font-bold text-navy">What you get</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 rounded-2xl border border-line bg-mist/60 p-4 text-navy">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1e6bff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden>
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={0.1}>
              <TiltCard max={7} className="group relative overflow-hidden rounded-[2rem] bg-ink p-8 text-white shadow-[0_40px_90px_-40px_rgba(30,107,255,0.6)]">
                <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-electric/40 blur-[70px]" />
                <div className="relative z-[2]">
                  <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                    <ServiceIcon name={service.icon} />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">Ideal for</h3>
                  <ul className="mt-4 space-y-3">
                    {page.idealFor.map((x) => (
                      <li key={x} className="flex items-start gap-3 text-haze">
                        <span aria-hidden className="mt-2 h-2 w-2 shrink-0 rounded-[2px] bg-gradient-to-br from-sky to-violet" />
                        {x}
                      </li>
                    ))}
                  </ul>
                  {service.tech && (
                    <>
                      <h3 className="mt-8 text-sm font-semibold text-white/55">Technologies</h3>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {service.tech.map((t) => (
                          <li key={t} className="chip border border-white/10 bg-white/[0.06] text-white/85">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <a
                    href={whatsappLink(`Hi ${site.shortName}! I'm interested in ${service.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-8 w-full bg-[#25d366] text-white hover:brightness-110"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-mist py-20 sm:py-28">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">How we work</h2>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((s, i) => (
              <Reveal as="li" key={s.number} delay={i * 0.06} className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(10,16,51,0.5)]">
                <span className="font-display text-4xl font-extrabold text-gradient">{s.number}</span>
                <h3 className="mt-2 text-lg font-bold text-navy">{s.title}</h3>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-slate">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-light py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-slate">
              Something else on your mind?{" "}
              <a href="/#contact" className="font-semibold text-electric underline-offset-4 hover:underline">
                Ask us directly
              </a>
              .
            </p>
          </Reveal>
          <div className="space-y-3">
            {page.faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.05}>
                <details className="faq group rounded-2xl border border-line bg-white p-5 open:shadow-[0_20px_50px_-35px_rgba(10,16,51,0.5)]">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy">
                    {f.q}
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark py-20 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 sm:p-10 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to start your {service.title.toLowerCase()} project?</h2>
              <p className="mt-2 text-haze">Projects start at {formatINR(page.startingPrice)}. Get a fixed quote after a free 15-minute call.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/#estimate" className="btn btn-primary">
                Estimate my project
              </a>
              <BookCallButton />
            </div>
          </div>

          <h2 className="mt-16 text-sm font-semibold text-white/55">Other services</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => {
              const s = services.find((x) => x.id === o.id)!;
              return (
                <li key={o.slug}>
                  <a href={`/services/${o.slug}`} className="gradient-border group flex h-full items-center justify-between gap-3 rounded-2xl bg-white/[0.03] p-5 transition-colors hover:bg-white/[0.06]">
                    <span className="font-semibold">{s.title}</span>
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
