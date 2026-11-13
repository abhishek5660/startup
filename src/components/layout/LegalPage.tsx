import PageShell, { PageHero, JsonLd } from "@/components/layout/PageShell";
import { site } from "@/lib/site";

/** Shared layout for the Privacy Policy and Terms pages. */
export default function LegalPage({
  title,
  path,
  lede,
  updated,
  children,
}: {
  title: string;
  path: string;
  lede: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: title,
          url: `${site.url}${path}`,
          publisher: { "@id": `${site.url}/#organization` },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
              { "@type": "ListItem", position: 2, name: title, item: `${site.url}${path}` },
            ],
          },
        }}
      />
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: title }]} title={title} lede={lede} />
      <section className="section-light py-16 sm:py-24">
        <div className="container-x">
          <article className="mx-auto max-w-3xl text-[1.02rem] leading-relaxed text-slate [&_a]:font-medium [&_a]:text-electric [&_a:hover]:underline [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-navy [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-navy [&_li]:mt-2 [&_p]:mt-4 [&_strong]:text-navy [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
            <p className="!mt-0 text-sm text-slate/80">Last updated: {updated}</p>
            {children}
          </article>
        </div>
      </section>
    </PageShell>
  );
}
