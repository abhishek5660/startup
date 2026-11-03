import { z } from "zod";
import { budgetOptions, serviceOptions } from "./data";

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/** Shared by the browser form and the API route so the rules never drift apart. */
export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "Name must be 100 characters or fewer."),
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
      const digits = v.replace(/\D/g, "").length;
      return digits >= 7 && digits <= 15;
    }, "Enter a valid phone number with 7–15 digits."),
  company: z.string().trim().max(120, "Company name must be 120 characters or fewer.").optional().default(""),
  service: z.enum(serviceOptions as [string, ...string[]], { error: "Choose the service you need." }),
  budget: z
    .union([z.enum(budgetOptions as [string, ...string[]]), z.literal("")])
    .optional()
    .default(""),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters.")
    .max(5000, "Project details must be 5,000 characters or fewer."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

/** Fields that only exist for spam protection; never shown to people. */
export const antiSpamSchema = z.object({
  website: z.string().optional().default(""), // honeypot – must stay empty
  startedAt: z.coerce.number().optional(), // ms timestamp when the form was rendered
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
