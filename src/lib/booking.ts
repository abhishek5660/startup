import { z } from "zod";
import { consultation } from "./data";

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

/** YYYY-MM-DD for a Date, in India time. */
export function istDate(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

/** Bookable days: from tomorrow (IST), skipping Sundays. */
export function bookableDates(now = new Date()): string[] {
  const out: string[] = [];
  const today = istDate(now);
  const base = new Date(`${today}T12:00:00Z`);
  for (let i = 1; out.length < consultation.daysAhead && i < 30; i++) {
    const d = new Date(base.getTime() + i * 86_400_000);
    if (d.getUTCDay() === 0) continue; // Sunday
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function formatBookingDate(ymd: string) {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name.").max(100, "Name must be 100 characters or fewer."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a valid phone number with 7–15 digits.")
    .refine((v) => {
      const n = v.replace(/\D/g, "").length;
      return n >= 7 && n <= 15;
    }, "Enter a valid phone number with 7–15 digits."),
  email: z
    .union([z.literal(""), z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address."))])
    .optional()
    .default(""),
  date: z.string().refine((d) => bookableDates().includes(d), "Choose one of the available days."),
  slot: z.enum(consultation.slots as unknown as [string, ...string[]], { error: "Choose a time slot." }),
  mode: z.enum(consultation.modes, { error: "Choose how we should call you." }),
  topic: z.string().trim().max(1000, "Keep it under 1,000 characters.").optional().default(""),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;
