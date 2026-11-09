import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell, { JsonLd, PageHero } from "@/components/layout/PageShell";
import BookCallButton from "@/components/ui/BookCallButton";
import { formatPostDate, postBySlug, posts, type Block } from "@/lib/posts";
import { site } from "@/lib/site";
import { formatINR, startingPrice } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = postBySlug((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [site.founder],
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: ["/og-image.png"] },
  };
}

function render(b: Block, i: number) {
  if ("h2" in b) return <h2 key={i}>{b.h2}</h2>;
  if ("p" in b) return <p key={i}>{b.p}</p>;
  if ("ul" in b)
    return (
      <ul key={i}>
        {b.ul.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    );
  return (
    <aside key={i} className="not-prose my-8 flex gap-4 rounded-2xl border border-electric/20 bg-electric/[0.05] p-5 text-navy">
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "var(--brand-gradient)" }}>
        ✦
      </span>
      <p className="!mt-0 !text-[1rem] !leading-relaxed !text-navy">
        <strong>Tip: </strong>
        {b.tip}
      </p>
    </aside>
  );
}

export default async function PostPage({ params }: Props) {
  const post = postBySlug((await params).slug);
  if (!post) notFound();
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const url = `${site.url}/blog/${post.slug}`;

  return (
    <PageShell>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: url,
            image: `${site.url}/og-image.png`,
            author: { "@type": "Person", name: site.founder },
            publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/brand/icon-512.png` } },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ]}
      />
      <PageHero crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.tags[0] }]} title={post.title}>
        <p className="mt-6 text-sm text-white/60">
          By {site.founder} · {formatPostDate(post.date)} · {post.readMins} min read
        </p>
      </PageHero>

      <section className="section-light py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[minmax(0,720px)_1fr]">
          <article className="prose-nt">
            <p className="!text-[1.2rem] !leading-relaxed !text-navy">{post.description}</p>
            {post.body.map(render)}
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] bg-ink p-7 text-white shadow-[0_40px_90px_-45px_rgba(30,107,255,0.7)]">
              <p className="font-display text-xl font-bold">Need a website?</p>
              <p className="mt-2 text-sm leading-relaxed text-haze">
                Projects start at {formatINR(startingPrice)}. Get a fixed quote after a free 15-minute call.
              </p>
              <div className="mt-6 grid gap-3">
                <a href="/#estimate" className="btn btn-primary w-full">
                  Estimate my project
                </a>
                <BookCallButton className="btn btn-ghost-dark w-full" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section-mist py-16 sm:py-20">
          <div className="container-x">
            <h2 className="font-display text-2xl font-bold text-navy">Keep reading</h2>
            <ul className="mt-6 grid gap-5 md:grid-cols-2">
              {more.map((p) => (
                <li key={p.slug}>
                  <a href={`/blog/${p.slug}`} className="group block h-full rounded-[1.5rem] border border-line bg-white p-6 transition-shadow hover:shadow-[0_24px_60px_-40px_rgba(10,16,51,0.6)]">
                    <p className="text-sm text-slate">{formatPostDate(p.date)}</p>
                    <h3 className="mt-2 text-xl font-bold text-navy">{p.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-electric">
                      Read <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageShell>
  );
}
