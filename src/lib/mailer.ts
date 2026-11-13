import "server-only";
import nodemailer from "nodemailer";
import type { ContactData } from "./validation";
import type { BookingData } from "./booking";
import type { ApplicationData } from "./careers";
import { formatBookingDate } from "./booking";
import { site } from "./site";

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Strips CR/LF so user input can never inject extra mail headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function sendInquiryNotification(data: ContactData, reference: string, createdAt: Date) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!;

  const rows: [string, string][] = [
    ["Reference", reference],
    ["Name", data.fullName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Company", data.company || "—"],
    ["Service", data.service],
    ["Budget", data.budget || "—"],
    ["Received", createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],
  ];

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nProject details:\n${data.message}\n`;

  const html = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;color:#0A1033">
    <div style="background:linear-gradient(120deg,#1E6BFF,#8B2CF5);padding:20px 24px;border-radius:14px 14px 0 0">
      <h1 style="margin:0;font-size:18px;color:#fff">New website inquiry</h1>
      <p style="margin:4px 0 0;color:#e6ebff;font-size:13px">${escape(reference)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#F3F5FF">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 24px;font-size:13px;color:#5b6390;width:120px">${k}</td><td style="padding:10px 24px;font-size:14px">${escape(v)}</td></tr>`,
        )
        .join("")}
    </table>
    <div style="padding:20px 24px;background:#fff;border:1px solid #e3e7fb;border-top:0;border-radius:0 0 14px 14px">
      <p style="margin:0 0 8px;font-size:13px;color:#5b6390">Project details</p>
      <p style="margin:0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escape(data.message)}</p>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"${site.name} Website" <${from}>`,
    to,
    replyTo: `"${oneLine(data.fullName).replace(/"/g, "")}" <${data.email}>`,
    subject: oneLine(`New inquiry: ${data.service} — ${data.fullName} (${reference})`),
    text,
    html,
  });
}

export async function sendConsultationNotification(data: BookingData, reference: string, createdAt: Date) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!;
  const when = `${formatBookingDate(data.date)}, ${data.slot} IST`;
  const rows: [string, string][] = [
    ["Reference", reference],
    ["When", when],
    ["How", data.mode],
    ["Name", data.fullName],
    ["Phone", data.phone],
    ["Email", data.email || "—"],
    ["Topic", data.topic || "—"],
    ["Booked", createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;color:#0A1033">
    <div style="background:linear-gradient(120deg,#25d366,#1E6BFF);padding:20px 24px;border-radius:14px 14px 0 0">
      <h1 style="margin:0;font-size:18px;color:#fff">Free consultation booked</h1>
      <p style="margin:4px 0 0;color:#e6ffef;font-size:13px">${escape(when)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#F3F5FF;border-radius:0 0 14px 14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 24px;font-size:13px;color:#5b6390;width:120px">${k}</td><td style="padding:10px 24px;font-size:14px;white-space:pre-wrap">${escape(v)}</td></tr>`,
        )
        .join("")}
    </table>
  </div>`;
  await transporter.sendMail({
    from: `"${site.name} Website" <${from}>`,
    to,
    ...(data.email ? { replyTo: `"${oneLine(data.fullName).replace(/"/g, "")}" <${data.email}>` } : {}),
    subject: oneLine(`Consultation: ${when} — ${data.fullName} (${reference})`),
    text,
    html,
  });
}

export async function sendApplicationNotification(data: ApplicationData, reference: string, createdAt: Date) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const to = process.env.CONTACT_TO_EMAIL || site.email;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!;
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Role", data.role],
    ["Name", data.fullName],
    ["Email", data.email],
    ["Phone", data.phone],
    ["College", data.college || "—"],
    ["Resume", data.resumeUrl],
    ["Portfolio", data.portfolioUrl || "—"],
    ["Message", data.message],
    ["Received", createdAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:620px;margin:auto;color:#0A1033">
    <div style="background:linear-gradient(120deg,#8B2CF5,#1E6BFF);padding:20px 24px;border-radius:14px 14px 0 0">
      <h1 style="margin:0;font-size:18px;color:#fff">New career application</h1>
      <p style="margin:4px 0 0;color:#e8e9ff;font-size:13px">${escape(data.role)}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#F3F5FF;border-radius:0 0 14px 14px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:10px 24px;font-size:13px;color:#5b6390;width:120px;vertical-align:top">${k}</td><td style="padding:10px 24px;font-size:14px;white-space:pre-wrap">${
              /^https?:\/\//.test(v) ? `<a href="${escape(v)}" style="color:#1E6BFF">${escape(v)}</a>` : escape(v)
            }</td></tr>`,
        )
        .join("")}
    </table>
  </div>`;
  await transporter.sendMail({
    from: `"${site.name} Careers" <${from}>`,
    to,
    replyTo: `"${oneLine(data.fullName).replace(/"/g, "")}" <${data.email}>`,
    subject: oneLine(`Application: ${data.role} — ${data.fullName} (${reference})`),
    text,
    html,
  });
}
