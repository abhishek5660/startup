/**
 * Central business configuration.
 * Edit this file to change contact details, navigation or social links.
 */
export const site = {
  name: "Nabhindu Technologies",
  shortName: "Nabhindu",
  tagline: "Innovate. Build. Grow.",
  description:
    "Nabhindu Technologies builds modern, fast and reliable websites and web applications — from beautiful frontend experiences to full-stack products. Based in Faridabad, Haryana.",
  // Set NEXT_PUBLIC_SITE_URL in your environment once your domain is live.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  founder: "Abhishek Katoch",
  email: "nabhindutechnologies@gmail.com",
  phone: "+91 8219472136",
  phoneHref: "tel:+918219472136",
  /** WhatsApp number in international format, digits only. */
  whatsapp: "918219472136",
  address: {
    line: "Sector 88, Faridabad",
    region: "Haryana",
    country: "India",
    full: "Sector 88, Faridabad, Haryana, India",
  },
  /**
   * Social profiles. Leave a value empty ("") to hide that icon.
   * Only add URLs for profiles that actually exist.
   */
  social: {
    linkedin: "https://www.linkedin.com/company/nabhindu-technologies/",
    instagram: "",
    github: "",
    x: "",
    facebook: "",
  },
} as const;

/** Founder details — shown on the About section, /about page and in Google structured data. */
export const founder = {
  name: "Abhishek Katoch",
  jobTitle: "Founder",
  university: "Chitkara University",
  universityUrl: "https://www.chitkara.edu.in/",
  photo: "/brand/founder.jpg",
  /** Add your personal LinkedIn profile URL here when you have one (e.g. https://www.linkedin.com/in/...). */
  linkedin: "",
  bio: "Abhishek Katoch is the founder of Nabhindu Technologies. A graduate of Chitkara University, he started Nabhindu in Faridabad, Haryana to help businesses get modern, fast and reliable websites and web applications — built from scratch, with the founder involved in every project.",
} as const;

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Technologies", href: "/#technologies" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Builds a WhatsApp chat link with a pre-filled message. */
export function whatsappLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
