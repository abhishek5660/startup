/**
 * Extra content for the individual service pages (/services/<slug>).
 * Each entry extends a service from data.ts. Edit the copy here.
 */
export type ServicePage = {
  id: string; // matches services[].id in data.ts
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string[];
  idealFor: string[];
  startingPrice: number;
  faqs: { q: string; a: string }[];
};

export const servicePages: ServicePage[] = [
  {
    id: "frontend",
    slug: "frontend-development",
    metaTitle: "Frontend Web Development in Faridabad",
    metaDescription:
      "Fast, responsive, beautifully animated websites built with React, Next.js and Tailwind CSS. Frontend development in Faridabad starting at ₹5,000.",
    keywords: ["frontend developer Faridabad", "React developer India", "Next.js website", "responsive website design", "landing page development"],
    intro: [
      "Your website's frontend is everything a visitor sees and touches — the layout, the typography, the animations, how quickly it loads on a phone over 4G. It is often the first impression of your business, and people decide in seconds whether to stay.",
      "We build frontends with modern tools like React, Next.js and Tailwind CSS, so pages load quickly, rank well on Google and feel smooth on every screen size. From a single landing page to a full multi-page marketing site, every layout is hand-built — no heavy page builders.",
    ],
    idealFor: ["Shops, clinics, cafés and local businesses", "Startups that need a launch or landing page", "Turning a Figma design into a live website", "Replacing a slow, outdated site"],
    startingPrice: 5000,
    faqs: [
      { q: "How long does a frontend website take?", a: "A one-page website usually takes about a week once we have your content. Multi-page sites take two to four weeks depending on the number of pages and animations." },
      { q: "Will my website work on mobile phones?", a: "Yes. Every layout is designed mobile-first and tested on phones, tablets, laptops and large screens before launch." },
      { q: "Can you build from my existing design?", a: "Yes. Share your Figma, Adobe XD or even a PDF/screenshot design and we will turn it into a pixel-accurate, responsive website." },
      { q: "Do I get the source code?", a: "Yes. After final payment the full source code is yours, and we can hand it over on GitHub." },
    ],
  },
  {
    id: "fullstack",
    slug: "full-stack-development",
    metaTitle: "Full-Stack Web Application Development",
    metaDescription:
      "Custom web applications with React, Next.js, Node.js and PostgreSQL — dashboards, portals, booking systems and more. Full-stack development by Nabhindu Technologies.",
    keywords: ["full stack developer India", "web application development", "Node.js developer", "custom dashboard development", "Next.js PostgreSQL"],
    intro: [
      "Some businesses need more than pages — they need software. A customer portal, an internal dashboard, a booking or inventory system, an app where users log in and manage their own data. That is full-stack development: the interface, the server, the database and everything connecting them.",
      "We design the data model, build secure REST APIs with Node.js, Express or Next.js, and connect them to a fast, modern frontend. The result is one application that is reliable today and structured so new features are easy to add as you grow.",
    ],
    idealFor: ["Admin dashboards and internal tools", "Customer or student portals with logins", "Booking, order and inventory systems", "MVPs for startup ideas"],
    startingPrice: 35000,
    faqs: [
      { q: "Which technologies do you use for full-stack projects?", a: "Usually React or Next.js on the frontend, Node.js/Express or Next.js API routes on the backend, and PostgreSQL, MySQL, MongoDB or Supabase for the database — chosen to fit your project." },
      { q: "Can you add online payments?", a: "Yes. We integrate payment gateways such as Razorpay or Stripe, including order records and payment confirmation emails." },
      { q: "Where will the application be hosted?", a: "We recommend and set up reliable hosting such as Vercel, a VPS, or your existing server, and walk you through the costs before anything is purchased." },
      { q: "Do you provide support after launch?", a: "Yes. We fix bugs found after launch and can continue with ongoing feature work or maintenance on a plan that suits you." },
    ],
  },
  {
    id: "custom",
    slug: "custom-website-development",
    metaTitle: "Custom Website Development for Businesses",
    metaDescription:
      "Websites built from scratch around your brand and business goals — not templates. Custom website development in Faridabad, Haryana, starting at ₹15,000.",
    keywords: ["custom website development", "business website Faridabad", "website company Haryana", "website for small business", "website design India"],
    intro: [
      "Templates look like templates. Your customers have seen the same layouts on hundreds of other sites, and they rarely fit the way your business actually works. A custom website starts from your goals instead: what visitors need to know, and what you want them to do next.",
      "We plan the structure with you, apply your brand consistently, and build the features you need — enquiry forms, galleries, maps, WhatsApp chat, booking, product listings. Everything is built from scratch so it stays fast and easy to grow.",
    ],
    idealFor: ["Businesses that want to stand out from competitors", "Brands with a specific look and feel", "Sites needing special features or integrations", "Companies outgrowing Wix or WordPress templates"],
    startingPrice: 15000,
    faqs: [
      { q: "What is the difference between a custom and a template website?", a: "A template site adapts your content to a pre-made layout. A custom site is designed and built around your content, brand and goals, so it looks unique and includes exactly the features you need." },
      { q: "Can I update the content myself?", a: "Yes. If you will update content often, we can add a simple admin panel or a headless CMS so you can edit text and images without code." },
      { q: "Do you write the content too?", a: "We help structure and polish your content and can write page copy for an additional charge. You know your business best, so we work from your inputs." },
      { q: "Is SEO included?", a: "Basic on-page SEO — page titles, descriptions, headings, fast loading and a sitemap — is included in every website." },
    ],
  },
  {
    id: "uiux",
    slug: "ui-ux-design",
    metaTitle: "UI/UX Design – Websites & Web Apps",
    metaDescription:
      "User flows, wireframes and high-fidelity UI design in Figma for websites and web applications. Clean, modern interfaces that make the next step obvious.",
    keywords: ["UI UX designer India", "Figma website design", "web app UI design", "wireframes and prototypes", "user experience design"],
    intro: [
      "Good design is not just colours and fonts — it is how easily someone can find what they need and take the next step. UI/UX design maps out how people move through your website or app, then shapes every screen so that path feels natural.",
      "We start with user flows and wireframes, agree the structure with you, then design high-fidelity screens and clickable prototypes in Figma. You see and test the experience before a single line of code is written, which saves time and money later.",
    ],
    idealFor: ["New products that need a clear interface", "Redesigning a confusing website or app", "Founders preparing an investor demo", "Teams who will build in-house but need designs"],
    startingPrice: 8000,
    faqs: [
      { q: "What do I receive at the end of a design project?", a: "Organised Figma files with all screens, a clickable prototype, and the colours, fonts and components used — ready for any developer to build." },
      { q: "Can you also build what you design?", a: "Yes. Most clients have us design and develop, which keeps the final website faithful to the design." },
      { q: "How many revisions are included?", a: "We agree the number of revision rounds up front in your quote, so there are no surprises." },
    ],
  },
  {
    id: "optimize",
    slug: "website-optimization",
    metaTitle: "Website Speed & SEO Optimization",
    metaDescription:
      "Make your existing website faster, mobile-friendly and easier to find on Google. Core Web Vitals fixes, responsive repairs and technical SEO.",
    keywords: ["website speed optimization", "Core Web Vitals fix", "technical SEO India", "make website mobile friendly", "slow website fix"],
    intro: [
      "A slow website quietly loses customers — people leave before the page finishes loading, and Google ranks slow, broken-on-mobile sites lower. Optimization fixes what you already have instead of starting over.",
      "We audit your site's speed, mobile layout and technical SEO, fix the issues — heavy images, render-blocking code, layout shifts, missing meta tags — and show you the before-and-after measurements so the improvement is clear.",
    ],
    idealFor: ["Sites that feel slow on phones", "Websites that look broken on mobile", "Businesses not showing up on Google", "Sites with poor Lighthouse / PageSpeed scores"],
    startingPrice: 4000,
    faqs: [
      { q: "Do you work on WordPress sites?", a: "Yes. We optimise WordPress, plain HTML and React/Next.js sites. For some platforms the possible improvement is limited, and we tell you that honestly after the audit." },
      { q: "How do I know it worked?", a: "We share before-and-after reports from Google PageSpeed Insights / Lighthouse, covering speed, accessibility and SEO scores." },
      { q: "Will optimization change my design?", a: "No, unless you want it to. We keep your design and content and fix what is underneath." },
    ],
  },
];

export const servicePageById = (id: string) => servicePages.find((s) => s.id === id);
export const servicePageBySlug = (slug: string) => servicePages.find((s) => s.slug === slug);
