/**
 * Blog posts. Add a new object to `posts` to publish an article.
 * Body blocks: { h2 }, { p }, { ul }, { tip }. Newest first is handled automatically.
 */
export type Block = { h2: string } | { p: string } | { ul: string[] } | { tip: string };

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  readMins: number;
  tags: string[];
  body: Block[];
};

const raw: Post[] = [
  {
    slug: "website-development-cost-faridabad",
    title: "How Much Does a Website Cost in Faridabad in 2026?",
    description:
      "A clear breakdown of website prices for small businesses in Faridabad and Delhi NCR — what you get at ₹5,000, ₹15,000 and ₹35,000+, and the hidden costs to ask about.",
    date: "2026-11-09",
    readMins: 6,
    tags: ["Pricing", "Small business"],
    body: [
      { p: "\"Website kitne ka banega?\" is the first question almost every business owner asks — and the honest answer is: it depends on what the website needs to do. A one-page site for a local shop and an online booking system for a clinic are very different projects. This guide explains what drives the price, so you can compare quotes with confidence." },
      { h2: "What decides the price of a website" },
      { ul: [
        "Number of pages — a single page is quicker than a 10-page site with separate service pages.",
        "Custom design vs. template — designing from scratch takes more time than adapting a theme.",
        "Features — login, payments, booking, admin panels and dashboards are real software and add cost.",
        "Content — whether you provide text and photos, or need them written and created.",
        "Animations and 3D — high-end motion and 3D visuals need extra design and development effort.",
        "Speed of delivery — rush timelines mean re-planning other work.",
      ] },
      { h2: "Typical price ranges at Nabhindu Technologies" },
      { p: "These are our own starting prices, to give you a realistic reference point. Every project gets a fixed quote after a short call." },
      { ul: [
        "From ₹5,000 — a professional one-page website: your services, photos, contact form, WhatsApp and call buttons, Google Maps and basic SEO.",
        "From ₹15,000 — a custom business website with up to six pages, your branding, animated sections and email alerts for enquiries.",
        "From ₹35,000 — a full-stack web application: user logins, a database, an admin dashboard, payments or booking.",
      ] },
      { tip: "Use our free project estimator on the homepage to see a starting price for your exact requirements in under a minute." },
      { h2: "Costs that are often not mentioned" },
      { p: "A low quote can become expensive if these items are not discussed up front. Always ask about them:" },
      { ul: [
        "Domain name — usually a yearly fee paid to a registrar (for example, for a .com or .in name).",
        "Hosting — some modern sites can be hosted very cheaply; applications with databases cost more.",
        "Business email — addresses like you@yourbusiness.com are a separate subscription.",
        "Maintenance — who fixes things, updates content or renews the domain after launch?",
        "Ownership — make sure the domain is registered in your name and that you receive the source code.",
      ] },
      { h2: "Cheap vs. good value" },
      { p: "A ₹2,000 template site can work for a very small need, but it often loads slowly, looks like hundreds of other sites, and is hard to change later. A good website pays for itself through enquiries — so judge it by speed, mobile experience, clarity and how easily customers can contact you, not price alone." },
      { h2: "Questions to ask any web developer" },
      { ul: [
        "Can I see websites you have built, live on the internet?",
        "Will the site work well on mobile phones, and how fast will it load?",
        "Is SEO included? Will you submit the sitemap to Google?",
        "Who owns the domain and code after the project?",
        "What happens if something breaks after launch?",
      ] },
      { p: "If you are in Faridabad or anywhere in Delhi NCR and want a straight answer for your project, book a free 15-minute call with us — no obligation, and you will leave with a clear plan and price." },
    ],
  },
  {
    slug: "why-small-business-needs-website",
    title: "Why Every Small Business in India Needs a Website (Not Just Instagram)",
    description:
      "Social media is rented space. Here is why a website is still the best digital investment for shops, clinics, coaching centres and service businesses in India.",
    date: "2026-11-05",
    readMins: 5,
    tags: ["Small business", "Growth"],
    body: [
      { p: "Many small businesses run entirely on Instagram, WhatsApp and a Google Maps listing — and that is a great start. But relying only on platforms you don't control has real limits. A website is the one place online that is fully yours." },
      { h2: "1. Customers search on Google first" },
      { p: "When someone needs a dentist, a caterer or an interior designer, they usually search on Google. A website with the right pages and keywords helps you appear in those searches — including searches like \"near me\" — and gives Google more reasons to trust and rank your business." },
      { h2: "2. It builds instant trust" },
      { p: "A professional website with your services, prices, photos, address and reviews makes you look established. Many customers quietly check for a website before calling, especially for higher-value services." },
      { h2: "3. You own it" },
      { p: "Social media accounts can be restricted, algorithms change, and reach drops. Your website and domain stay with you, and everything you publish there keeps working for you." },
      { h2: "4. It works 24×7" },
      { p: "A website answers common questions, shows your work and collects enquiries even while you sleep. Add WhatsApp chat, a booking form or a price calculator and it becomes a salesperson that never takes a day off." },
      { h2: "5. Everything in one link" },
      { p: "Instead of sending five messages with photos, location and rate cards, you share one link that has it all — and that link looks great on visiting cards, Instagram bios and Google Business Profile." },
      { tip: "Start small: a fast one-page website with your services, photos, WhatsApp button and location is enough for most local businesses — and can grow later." },
      { h2: "What a good small-business website includes" },
      { ul: [
        "A clear headline saying what you do and where",
        "Services or products, with prices or \"starting from\" ranges",
        "Photos of real work, your shop or your team",
        "WhatsApp, call and enquiry buttons on every screen",
        "Address, opening hours and Google Maps",
        "Fast loading on mobile phones",
      ] },
      { p: "Nabhindu Technologies builds websites like this for local businesses, starting at ₹5,000. If you would like to see what yours could look like, get in touch — we are happy to talk it through." },
    ],
  },
  {
    slug: "nextjs-vs-wordpress-for-business",
    title: "Next.js vs WordPress: Which Is Better for Your Business Website?",
    description:
      "A plain-language comparison of Next.js and WordPress — speed, security, cost, editing and SEO — to help you choose the right platform for your business website.",
    date: "2026-10-30",
    readMins: 6,
    tags: ["Technology", "Guides"],
    body: [
      { p: "WordPress powers a huge share of the web, and Next.js has become one of the most popular ways to build modern, fast websites. Both are good tools — they just suit different needs. Here is an honest comparison without the jargon." },
      { h2: "What they are" },
      { ul: [
        "WordPress is a content management system: you install it on a server, choose a theme, add plugins and edit pages in a dashboard.",
        "Next.js is a framework built on React. Developers build the site as code, and it can be pre-rendered into extremely fast pages and hosted cheaply.",
      ] },
      { h2: "Speed" },
      { p: "Next.js sites are usually faster out of the box because pages can be pre-built and served from a global network, with automatic image optimisation. WordPress can be fast too, but heavy themes and many plugins often slow it down, and it needs caching and tuning." },
      { h2: "Security and maintenance" },
      { p: "WordPress sites need regular updates to the core, theme and plugins; outdated plugins are a common cause of hacked websites. A Next.js marketing site has far fewer moving parts and no public admin login to attack, so routine maintenance is lighter." },
      { h2: "Editing content yourself" },
      { p: "This is WordPress's biggest strength — non-technical users can edit pages in a familiar dashboard. With Next.js, simple sites are often updated by the developer, or a headless CMS can be connected to give you an easy editor." },
      { h2: "Design freedom and features" },
      { p: "Next.js gives complete control over design, animation and 3D, and makes it natural to grow into a full web application with logins, dashboards and payments. WordPress is quicker for standard layouts, but highly custom designs often fight against the theme." },
      { h2: "SEO" },
      { p: "Both can rank well. WordPress has easy SEO plugins; Next.js offers excellent performance and full control over metadata and structured data. Speed and mobile experience — areas where Next.js shines — are important for search rankings." },
      { tip: "Rule of thumb: if you will publish lots of content yourself every week, WordPress (or Next.js with a CMS) makes sense. If you want a fast, unique, low-maintenance site that can grow into an application, choose Next.js." },
      { h2: "Our recommendation" },
      { p: "For most business websites and every web application we build, we use Next.js for its speed, security and flexibility — this very website is built with it. When a client needs to edit content often, we add a simple admin panel or CMS so they get the best of both." },
    ],
  },
];

export const posts = [...raw].sort((a, b) => b.date.localeCompare(a.date));
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug);

export function formatPostDate(ymd: string) {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
