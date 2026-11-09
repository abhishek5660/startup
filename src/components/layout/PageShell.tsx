import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import BookingModal from "@/components/sections/BookingModal";

/** Shared chrome for inner pages (blog, service pages). */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BookingModal />
    </>
  );
}

/** Dark page header with breadcrumb, used at the top of inner pages. */
export function PageHero({
  crumbs,
  title,
  lede,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="section-dark relative isolate overflow-hidden pb-20 pt-36 sm:pb-24 sm:pt-44">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="absolute -left-[10%] -top-[30%] h-[40rem] w-[40rem] rounded-full bg-electric/25 blur-[130px]" />
        <div className="absolute -right-[10%] bottom-[-40%] h-[36rem] w-[36rem] rounded-full bg-violet/25 blur-[130px]" />
        <div className="floor-grid absolute inset-x-0 bottom-0 h-[50%] opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink" />
      </div>
      <div className="container-x">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-white/55">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {c.href ? (
                  <a href={c.href} className="transition-colors hover:text-white">
                    {c.label}
                  </a>
                ) : (
                  <span aria-current="page" className="text-white/85">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="display-lg mt-6 max-w-[18ch] text-sheen">{title}</h1>
        {lede && <p className="lede mt-6 max-w-[60ch] text-haze">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
