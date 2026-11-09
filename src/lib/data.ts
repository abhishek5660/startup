/**
 * Website content. Everything shown in the Services, Technologies,
 * Portfolio, Process and Why-Us sections comes from this file.
 */

export type ServiceIconName = "frontend" | "fullstack" | "custom" | "uiux" | "optimize";

export type Service = {
  id: string;
  number: string;
  title: string;
  summary: string;
  details: string;
  deliverables: string[];
  tech?: string[];
  icon: ServiceIconName;
};

export const services: Service[] = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend Web Development",
    summary: "Beautiful, responsive, high-performance websites with outstanding user interfaces.",
    details:
      "We turn designs into fast, accessible interfaces that feel great on every screen — from a single landing page to a multi-page marketing site.",
    deliverables: ["Pixel-accurate responsive layouts", "Smooth, purposeful animation", "Accessibility and SEO built in"],
    tech: ["HTML5", "CSS3", "JavaScript", "React.js", "Next.js", "Tailwind CSS"],
    icon: "frontend",
  },
  {
    id: "fullstack",
    number: "02",
    title: "Full-Stack Web Development",
    summary: "Complete web applications with powerful backend architecture and modern frontend experiences.",
    details:
      "From database design to APIs to the interface people use every day, we build the whole application and connect every layer properly.",
    deliverables: ["REST API design and build", "Database modelling and integration", "Secure forms, auth-ready architecture"],
    tech: ["React.js", "Next.js", "Node.js", "Express.js", "Python", "REST APIs", "Database Integration"],
    icon: "fullstack",
  },
  {
    id: "custom",
    number: "03",
    title: "Custom Website Development",
    summary: "Websites built around your business requirements, branding and functionality.",
    details:
      "No templates bent out of shape. We plan the structure around what your business needs to say and do, then build it from scratch.",
    deliverables: ["Structure planned around your goals", "Your brand applied consistently", "Features built for how you work"],
    icon: "custom",
  },
  {
    id: "uiux",
    number: "04",
    title: "UI/UX Design",
    summary: "Modern, intuitive, user-friendly interfaces and professional digital experiences.",
    details:
      "We map how people will move through your product, then design screens that make the next step obvious and the brand memorable.",
    deliverables: ["User flows and wireframes", "High-fidelity interface design", "Clickable prototypes in Figma"],
    icon: "uiux",
  },
  {
    id: "optimize",
    number: "05",
    title: "Website Optimization",
    summary: "Improve performance, responsiveness, loading speed and SEO of an existing website.",
    details:
      "We audit what is slowing your site down or hiding it from search, fix it, and show you the before-and-after measurements.",
    deliverables: ["Core Web Vitals audit and fixes", "Mobile responsiveness repair", "Technical SEO improvements"],
    icon: "optimize",
  },
];

export type TechCategory = "Frontend" | "Backend" | "Database" | "Tools";

export type Tech = {
  name: string;
  /** Key from the `simple-icons` package, or null to use a built-in glyph. */
  icon: string | null;
  category: TechCategory;
};

export const techStack: Tech[] = [
  { name: "React", icon: "siReact", category: "Frontend" },
  { name: "Next.js", icon: "siNextdotjs", category: "Frontend" },
  { name: "HTML5", icon: "siHtml5", category: "Frontend" },
  { name: "CSS3", icon: "siCss", category: "Frontend" },
  { name: "JavaScript", icon: "siJavascript", category: "Frontend" },
  { name: "Tailwind CSS", icon: "siTailwindcss", category: "Frontend" },
  { name: "Node.js", icon: "siNodedotjs", category: "Backend" },
  { name: "Express.js", icon: "siExpress", category: "Backend" },
  { name: "Python", icon: "siPython", category: "Backend" },
  { name: "REST APIs", icon: null, category: "Backend" },
  { name: "PostgreSQL", icon: "siPostgresql", category: "Database" },
  { name: "MySQL", icon: "siMysql", category: "Database" },
  { name: "MongoDB", icon: "siMongodb", category: "Database" },
  { name: "Supabase", icon: "siSupabase", category: "Database" },
  { name: "Git", icon: "siGit", category: "Tools" },
  { name: "GitHub", icon: "siGithub", category: "Tools" },
  { name: "VS Code", icon: null, category: "Tools" },
  { name: "Figma", icon: "siFigma", category: "Tools" },
];

export type Project = {
  id: string;
  title: string;
  kind: string;
  description: string;
  features: string[];
  tech: string[];
  preview: "restaurant" | "dashboard" | "realestate";
  /** Set to a real URL once the project is live; null disables the button. */
  liveUrl: string | null;
  /** true = clearly labelled sample concept, not client work. */
  isSample: boolean;
};

/**
 * SAMPLE CONCEPTS ONLY.
 * These are demonstration concepts, not client work. Replace them with real
 * projects (and set isSample: false) as you complete them.
 */
export const projects: Project[] = [
  {
    id: "sample-restaurant",
    title: "Café & restaurant website",
    kind: "Frontend concept",
    description:
      "A warm, image-led website for a neighbourhood café with an online menu, table booking enquiry and location map.",
    features: ["Animated menu with categories", "Booking enquiry form", "Mobile-first layout", "Local SEO setup"],
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    preview: "restaurant",
    liveUrl: null,
    isSample: true,
  },
  {
    id: "sample-dashboard",
    title: "Team task dashboard",
    kind: "Full-stack concept",
    description:
      "A project tracker where small teams create tasks, assign owners and follow progress on a live board backed by a REST API.",
    features: ["Kanban board with drag and drop", "REST API with Express", "PostgreSQL data model", "Role-ready architecture"],
    tech: ["React", "Node.js", "Express.js", "PostgreSQL"],
    preview: "dashboard",
    liveUrl: null,
    isSample: true,
  },
  {
    id: "sample-realestate",
    title: "Property listings platform",
    kind: "Full-stack concept",
    description:
      "A searchable property catalogue with filters, saved searches and an enquiry flow that routes leads to the right agent.",
    features: ["Filterable listings grid", "Property detail pages", "Lead capture to database", "Image optimisation"],
    tech: ["Next.js", "Supabase", "Tailwind CSS"],
    preview: "realestate",
    liveUrl: null,
    isSample: true,
  },
];

export const processSteps = [
  { number: "01", title: "Discover", text: "Understand the client's idea and requirements." },
  { number: "02", title: "Design", text: "Create the visual experience and user interface." },
  { number: "03", title: "Develop", text: "Build the frontend and backend." },
  { number: "04", title: "Test", text: "Test responsiveness, performance and functionality." },
  { number: "05", title: "Launch", text: "Deploy the completed website." },
];

export const reasons = [
  { title: "Modern technology", text: "We build on current, well-supported tools like Next.js, React and Node.js — not outdated page builders." },
  { title: "Creative design", text: "Every site gets its own visual direction based on your brand, not a recycled template." },
  { title: "Responsive development", text: "Layouts are designed and tested for phones, tablets, laptops and large screens." },
  { title: "Performance focused", text: "Optimised images, lean code and fast hosting so pages load quickly." },
  { title: "Scalable architecture", text: "Clean, structured code that is ready for new features as your business grows." },
  { title: "Reliable solutions", text: "Secure forms, validated data and tested releases you can depend on." },
];

export const values = [
  { title: "Innovation", text: "Turning creative ideas into digital reality." },
  { title: "Quality", text: "Building reliable and scalable solutions." },
  { title: "Growth", text: "Helping businesses grow through technology." },
];

export const serviceOptions = services.map((s) => s.title).concat(["Something else"]);

export const budgetOptions = [
  "₹5,000 – ₹15,000",
  "₹15,000 – ₹35,000",
  "₹35,000 – ₹75,000",
  "₹75,000 – ₹1,50,000",
  "Above ₹1,50,000",
  "Not sure yet",
];

export type PricingPlan = {
  id: string;
  name: string;
  /** Starting price in rupees. */
  price: number;
  tagline: string;
  features: string[];
  /** Service preselected in the contact form when this plan is chosen. */
  service: string;
  /** Budget preselected in the contact form (must match a budgetOptions entry). */
  budget: string;
  popular?: boolean;
};

/**
 * PRICING — "starting at" prices. Edit freely; the first plan sets the
 * "projects starting at ₹…" line shown in the hero.
 */
export const pricingPlans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 5000,
    tagline: "A clean, professional one-page website to get your business online.",
    features: [
      "Single-page responsive website",
      "Up to 5 content sections",
      "Contact form and WhatsApp / call buttons",
      "Basic on-page SEO",
      "Mobile, tablet and desktop tested",
    ],
    service: "Frontend Web Development",
    budget: "₹5,000 – ₹15,000",
  },
  {
    id: "business",
    name: "Business",
    price: 15000,
    tagline: "A multi-page website designed around your brand, with motion and 3D touches.",
    features: [
      "Up to 6 custom-designed pages",
      "Animated / 3D hero section",
      "Contact form with email alerts",
      "Speed and SEO optimisation",
      "Google Maps and social links",
    ],
    service: "Custom Website Development",
    budget: "₹15,000 – ₹35,000",
    popular: true,
  },
  {
    id: "fullstack",
    name: "Full-Stack App",
    price: 35000,
    tagline: "A complete web application with a database, API and admin area.",
    features: [
      "Custom frontend and backend",
      "Database design and REST API",
      "Admin dashboard",
      "Auth-ready, scalable architecture",
      "Deployment and handover",
    ],
    service: "Full-Stack Web Development",
    budget: "₹35,000 – ₹75,000",
  },
];

export const startingPrice = Math.min(...pricingPlans.map((p) => p.price));

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
