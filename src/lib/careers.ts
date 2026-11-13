import { z } from "zod";

/**
 * CAREERS — edit this file to change the roles shown on /careers.
 * Set `open: false` to hide a role without deleting it. If no role is open,
 * the page still accepts general applications.
 */

export type Role = {
  id: string;
  title: string;
  type: "Internship" | "Full-time" | "Part-time" | "Freelance";
  location: string;
  duration: string;
  /** Leave empty ("") to hide the stipend line. */
  stipend: string;
  summary: string;
  responsibilities: string[];
  skills: string[];
  open: boolean;
};

export const roles: Role[] = [
  {
    id: "frontend-intern",
    title: "Frontend Developer Intern",
    type: "Internship",
    location: "Remote / Faridabad",
    duration: "3 months",
    stipend: "",
    summary: "Build responsive, animated client websites with React, Next.js and Tailwind CSS.",
    responsibilities: [
      "Turn Figma designs into pixel-accurate, responsive pages",
      "Build reusable React components and smooth animations",
      "Test sites on phones, tablets and desktops before launch",
    ],
    skills: ["HTML, CSS, JavaScript", "React or Next.js basics", "Tailwind CSS (nice to have)", "Git and GitHub"],
    open: true,
  },
  {
    id: "fullstack-intern",
    title: "Full-Stack Developer Intern",
    type: "Internship",
    location: "Remote / Faridabad",
    duration: "3 months",
    stipend: "",
    summary: "Work across the stack — APIs, databases and the interfaces that use them.",
    responsibilities: [
      "Build REST APIs with Node.js / Next.js route handlers",
      "Design tables and queries in PostgreSQL",
      "Connect forms, dashboards and admin areas to the backend",
    ],
    skills: ["JavaScript / TypeScript", "Node.js or Express", "SQL (PostgreSQL or MySQL)", "React basics"],
    open: true,
  },
  {
    id: "uiux-intern",
    title: "UI/UX Design Intern",
    type: "Internship",
    location: "Remote / Faridabad",
    duration: "3 months",
    stipend: "",
    summary: "Design clean, modern website and app interfaces for real client projects.",
    responsibilities: [
      "Create wireframes, user flows and high-fidelity screens in Figma",
      "Build clickable prototypes for client reviews",
      "Keep layouts consistent with each client's brand",
    ],
    skills: ["Figma", "Typography, colour and layout basics", "A portfolio of design work (college projects count)"],
    open: true,
  },
];

export const openRoles = roles.filter((r) => r.open);

export const GENERAL_APPLICATION = "General application";
export const roleOptions = [...openRoles.map((r) => r.title), GENERAL_APPLICATION];

/** Why work with us — shown on /careers. */
export const perks = [
  { title: "Real client projects", text: "Work on live websites for real businesses, not dummy assignments." },
  { title: "Learn from the founder", text: "Get direct code and design reviews, and learn how projects are planned and delivered." },
  { title: "Modern stack", text: "Next.js, React, Tailwind, Node.js, PostgreSQL and Figma — tools companies actually hire for." },
  { title: "Certificate & recommendation", text: "Internship certificate on completion, and a letter of recommendation for strong performers." },
  { title: "Flexible & remote-friendly", text: "Work remotely or from Faridabad, with hours that fit around college." },
  { title: "Your work in your portfolio", text: "Show the projects you helped build when you apply for your next role." },
];

/** Hiring steps — shown on /careers. */
export const hiringSteps = [
  { title: "Apply", text: "Send the form below with your resume and any portfolio or GitHub link." },
  { title: "Review", text: "We go through every application and reply within 7 working days." },
  { title: "Short task", text: "Shortlisted candidates get a small, practical task related to the role." },
  { title: "Call", text: "A friendly video call to discuss your work and answer your questions." },
  { title: "Offer", text: "Selected candidates receive an internship offer and start date." },
];

/* ── Application form ───────────────────────────────────────────── */

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

const url = (msg: string) =>
  z
    .string()
    .trim()
    .max(500, "Link must be 500 characters or fewer.")
    .refine((v) => /^https?:\/\/\S+\.\S+/i.test(v), msg);

/** Shared by the browser form and the API route. */
export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100, "Name must be 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Email is too long.")
    .pipe(z.email("Enter a valid email address, like name@example.com.")),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid phone number with 7–15 digits.")
    .refine((v) => {
      const n = v.replace(/\D/g, "").length;
      return n >= 7 && n <= 15;
    }, "Enter a valid phone number with 7–15 digits."),
  role: z.enum(roleOptions as [string, ...string[]], { error: "Choose the role you're applying for." }),
  college: z.string().trim().max(150, "Must be 150 characters or fewer.").optional().default(""),
  resumeUrl: url("Paste a link to your resume (Google Drive, Dropbox, etc.) starting with https://"),
  portfolioUrl: z.union([z.literal(""), url("Enter a full link starting with https://")]).optional().default(""),
  message: z
    .string()
    .trim()
    .min(30, "Tell us a little more — at least 30 characters.")
    .max(3000, "Must be 3,000 characters or fewer."),
});

export type ApplicationInput = z.input<typeof applicationSchema>;
export type ApplicationData = z.output<typeof applicationSchema>;
