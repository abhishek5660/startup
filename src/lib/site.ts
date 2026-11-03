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
    linkedin: "",
    instagram: "",
    github: "",
    x: "",
    facebook: "",
  },
} as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Technologies", href: "#technologies" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
] as const;
