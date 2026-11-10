"use client";

import { Reveal, SplitWords, Pixels } from "@/components/ui/motion";
import { site, whatsappLink } from "@/lib/site";
import { openBooking } from "@/lib/scroll";
import ContactForm from "./ContactForm";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`;

const items = [
  {
    label: "Founder",
    value: site.founder,
    href: null,
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  },
  {
    label: "Phone",
    value: site.phone,
    href: site.phoneHref,
    icon: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z",
  },
  {
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 2-10 7L2 6",
  },
  {
    label: "Location",
    value: site.address.full,
    href: mapsUrl,
    icon: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-mist overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="grid-lines-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_60%)]" />
      <div aria-hidden className="absolute -right-40 top-20 h-[30rem] w-[30rem] rounded-full bg-violet/10 blur-[120px]" />
      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <Pixels className="mb-6 h-12 w-12" />
          <SplitWords text="Have an idea? Let's build it." className="display-lg max-w-[11ch] text-navy" />
          <Reveal delay={0.1}>
            <p className="lede mt-6 max-w-[44ch] text-slate">
              Tell us what you have in mind. Fill in the form, or call or email us directly — you&apos;ll hear back from the
              founder.
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {items.map((it, i) => {
              const content = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-electric shadow-[0_10px_30px_-18px_rgba(10,16,51,0.5)] transition-colors duration-300 group-hover:bg-electric group-hover:text-white">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d={it.icon} />
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-slate">{it.label}</span>
                    <span className="block break-words font-semibold text-navy [overflow-wrap:anywhere]">{it.value}</span>
                  </span>
                </>
              );
              return (
                <Reveal as="li" key={it.label} delay={0.1 + i * 0.07}>
                  {it.href ? (
                    <a
                      href={it.href}
                      {...(it.label === "Location" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/70"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="group flex items-center gap-4 p-2">{content}</div>
                  )}
                </Reveal>
              );
            })}
          </ul>

          <Reveal delay={0.35}>
            <div className="mt-8 rounded-3xl bg-ink p-6 text-white shadow-[0_30px_70px_-35px_rgba(30,107,255,0.7)]">
              <p className="font-display text-lg font-bold">Prefer to talk first?</p>
              <p className="mt-1.5 text-sm leading-relaxed text-haze">Book a free 15-minute call, or message us on WhatsApp.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={openBooking} className="btn btn-primary !py-2.5 text-sm">
                  Book a free call
                </button>
                <a
                  href={whatsappLink(`Hi ${site.shortName}! I'd like to discuss a website project.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn !py-2.5 bg-[#25d366] text-sm text-white hover:brightness-110"
                >
                  WhatsApp us
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} amount={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
