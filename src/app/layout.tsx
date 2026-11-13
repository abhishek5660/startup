import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora";
import "@fontsource-variable/inter";
import "./globals.css";
import { site, founder } from "@/lib/site";
import { services } from "@/lib/data";
import Providers from "@/components/layout/Providers";
import { loaderScript } from "@/lib/loader-script";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Frontend & Full-Stack Web Development`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.founder }],
  creator: site.name,
  keywords: [
    "Nabhindu Technologies",
    "web development Faridabad",
    "website development company Haryana",
    "frontend development",
    "full-stack web development",
    "Next.js developer India",
    "React developer",
    "UI/UX design",
    "website optimization",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${site.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#060a24",
  width: "device-width",
  initialScale: 1,
};

const sameAs = Object.values(site.social).filter(Boolean);

const founderLd = {
  "@type": "Person",
  "@id": `${site.url}/about#founder`,
  name: founder.name,
  jobTitle: founder.jobTitle,
  image: `${site.url}${founder.photo}`,
  url: `${site.url}/about`,
  description: founder.bio,
  alumniOf: { "@type": "CollegeOrUniversity", name: founder.university, url: founder.universityUrl },
  worksFor: { "@id": `${site.url}/#organization` },
  ...(founder.linkedin ? { sameAs: [founder.linkedin] } : {}),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  alternateName: "Nabhindu",
  url: site.url,
  logo: `${site.url}/brand/icon-512.png`,
  image: `${site.url}/og-image.png`,
  description: site.description,
  slogan: site.tagline,
  email: site.email,
  telephone: site.phone.replace(/\s/g, ""),
  founder: founderLd,
  ...(sameAs.length ? { sameAs } : {}),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sector 88",
    addressLocality: "Faridabad",
    addressRegion: "Haryana",
    addressCountry: "IN",
  },
  areaServed: "IN",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Web development services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.summary },
    })),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
