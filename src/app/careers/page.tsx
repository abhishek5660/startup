import type { Metadata } from "next";
import PageShell, { PageHero, JsonLd } from "@/components/layout/PageShell";
import { Reveal } from "@/components/ui/motion";
import CareersForm, { ApplyButton } from "@/components/sections/CareersForm";
import { hiringSteps, openRoles, perks } from "@/lib/careers";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Careers & Internships",
  description: `Join ${site.name} in Faridabad. Internships in frontend development, full-stack development and UI/UX design — work on real client projects.`,
  alternates: { canonical: "/careers" },
  openGraph: { type: "website", url: "/careers", title: `Careers & Internships | ${site.name}`, images: ["/og-image.png"] },
};

/** Google for Jobs listings for each open role. */
const jobsLd = openRoles.map((r) => ({
  "@context": "https://schema.org",
  "@type": "JobPosting",
  title: r.title,
  description: `<p>${r.summary}</p><p><strong>What you'll do:</strong></p><ul>${r.responsibilities.map((x) => `<li>${x}</li>`).join("")}</ul><p><strong>Skills:</strong></p><ul>${r.skills.map((x) => `<li>${x}</li>`).join("")}</ul>`,
  datePosted: "2026-11-13",
  employmentType: r.type === "Internship" ? "INTERN" : r.type === "Full-time" ? "FULL_TIME" : r.type === "Part-time" ? "PART_TIME" : "CONTRACTOR",
  hiringOrganization: { "@type": "Organization", name: site.name, sameAs: site.url, logo: `${site.url}/brand/icon-512.png` },
  jobLocation: {
    "@type": "Place",
    address: { "@type": "PostalAddress", addressLocality: "Faridabad", addressRegion: "Haryana", addressCountry: "IN" },
  },
  ...(r.location.toLowerCase().includes("remote")
    ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "India" } }
    : {}),
  directApply: true,
}));

export default function CareersPage() {
  return (
    <PageShell>
      {jobsLd.map((j) => (
        <JsonLd key={j.title} data={j} />
      ))}
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        title="Build the web with us"
        lede={`${site.name} is a growing web development studio in Faridabad. If you love building beautiful, fast websites, we'd like to hear from you.`}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#roles" className="btn btn-primary">
            See open roles
          </a>
          <a href="#apply" className="btn btn-ghost-dark">
            Apply now
          </a>
        </div>
      </PageHero>

      {/* Why join */}
      <section className="section-light py-20 sm:py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">Why intern with us</h2>
            <p className="mt-3 max-w-[60ch] text-slate">A small team means you build real things from day one — and learn faster.</p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-line bg-white p-7">
                  <span className="font-display text-sm font-bold text-electric">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-xl font-bold text-navy">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" className="section-light scroll-mt-24 pb-20 sm:pb-24">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">Open roles</h2>
          </Reveal>
          {openRoles.length ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {openRoles.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08}>
                  <article className="flex h-full flex-col rounded-[1.75rem] border border-line bg-white p-7 shadow-[0_24px_60px_-45px_rgba(10,16,51,0.6)]">
                    <div className="flex flex-wrap gap-2">
                      <span className="chip bg-mist text-navy/80">{r.type}</span>
                      <span className="chip bg-mist text-navy/80">{r.location}</span>
                      <span className="chip bg-mist text-navy/80">{r.duration}</span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-navy">{r.title}</h3>
                    <p className="mt-2 leading-relaxed text-slate">{r.summary}</p>
                    {r.stipend && <p className="mt-3 text-sm font-semibold text-navy">Stipend: {r.stipend}</p>}
                    <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-navy">What you&rsquo;ll do</h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.95rem] text-slate">
                      {r.responsibilities.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <h4 className="mt-5 text-sm font-semibold uppercase tracking-wide text-navy">Skills</h4>
                    <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[0.95rem] text-slate">
                      {r.skills.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-7">
                      <ApplyButton role={r.title} className="btn btn-primary w-full" />
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-[60ch] text-slate">
              There are no open roles right now, but we&rsquo;re always happy to hear from talented people. Send a general
              application below.
            </p>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="section-light pb-20 sm:pb-24">
        <div className="container-x">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">How hiring works</h2>
          </Reveal>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {hiringSteps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06}>
                <div className="h-full rounded-3xl bg-navy p-6 text-white">
                  <span className="font-display text-3xl font-extrabold text-gradient">{i + 1}</span>
                  <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-haze">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Apply */}
      <section id="apply" className="section-light scroll-mt-24 pb-24 sm:pb-32">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">Ready to apply?</h2>
            <p className="mt-4 max-w-[45ch] leading-relaxed text-slate">
              Fill in the form with a link to your resume. Don&rsquo;t see a role that fits? Choose &ldquo;General
              application&rdquo; and tell us what you&rsquo;re good at.
            </p>
            <p className="mt-6 text-sm text-slate">
              Questions? Email{" "}
              <a href={`mailto:${site.email}?subject=Careers`} className="font-medium text-electric hover:underline">
                {site.email}
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <CareersForm />
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
