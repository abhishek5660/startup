import type { Metadata } from "next";
import PageShell, { PageHero, JsonLd } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/motion";
import BookCallButton from "@/components/ui/BookCallButton";
import { values } from "@/lib/data";
import { founder, site } from "@/lib/site";

export const metadata: Metadata = {
  title: `About ${site.name} – Founded by ${founder.name}`,
  description: `${site.name} is a web development company in Faridabad, Haryana, founded by ${founder.name}, a graduate of ${founder.university}.`,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    url: "/about",
    title: `About ${site.name} – Founded by ${founder.name}`,
    description: `Meet ${founder.name}, founder of ${site.name} and a ${founder.university} graduate.`,
    images: ["/og-image.png"],
  },
};

const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${site.url}/about`,
  name: `About ${site.name}`,
  about: { "@id": `${site.url}/#organization` },
  mainEntity: { "@id": `${site.url}/about#founder` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${site.url}/about` },
    ],
  },
};

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd data={aboutLd} />
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title={`About ${site.name}`}
        lede={`A Faridabad-based web development company founded by ${founder.name}, a graduate of ${founder.university}.`}
      />

      <section className="section-light py-20 sm:py-28">
        <div className="container-x max-w-4xl">

          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-electric">Meet the founder</p>
              <h2 className="mt-3 font-display text-4xl font-bold text-navy sm:text-5xl">{founder.name}</h2>
              <p className="mt-2 text-lg text-slate">
                {founder.jobTitle}, {site.name} · {founder.university} graduate
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede mt-7 max-w-[60ch] text-slate">{founder.bio}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-[60ch] leading-relaxed text-slate">
                At {site.name} we build frontend websites, full-stack web applications, custom business websites, UI/UX
                designs and performance optimisation for existing sites. Every project is planned around what the business
                actually needs, and clients work directly with the founder from the first call to launch.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <BookCallButton />
                {(founder.linkedin || site.social.linkedin) && (
                  <a
                    href={founder.linkedin || site.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-electric hover:underline"
                  >
                    Connect on LinkedIn →
                  </a>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-light pb-24">
        <div className="container-x">
          <h2 className="font-display text-3xl font-bold text-navy">What we stand for</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-line bg-white p-7">
                  <h3 className="text-2xl font-bold text-navy">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
