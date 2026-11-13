"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fieldErrors } from "@/lib/validation";
import { applicationSchema, roleOptions, type ApplicationInput } from "@/lib/careers";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ApplicationInput = { fullName: "", email: "", phone: "", role: "", college: "", resumeUrl: "", portfolioUrl: "", message: "" };

/** Opens the form with a role preselected (fired by the "Apply" buttons on role cards). */
export const SELECT_ROLE_EVENT = "nt:select-role";

function Field({
  id,
  label,
  error,
  optional,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-navy">
        {label}
        {optional && <span className="text-xs font-normal text-slate">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.8rem] text-slate">{hint}</p>}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-[0.82rem] text-[#d93036]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareersForm() {
  const [values, setValues] = useState<ApplicationInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const onRole = (e: Event) => {
      const role = (e as CustomEvent<string>).detail;
      if (roleOptions.includes(role)) {
        setValues((v) => ({ ...v, role }));
        setErrors((er) => ({ ...er, role: "" }));
      }
    };
    window.addEventListener(SELECT_ROLE_EVENT, onRole);
    return () => window.removeEventListener(SELECT_ROLE_EVENT, onRole);
  }, []);

  const validate = (v: ApplicationInput) => {
    const r = applicationSchema.safeParse(v);
    return r.success ? {} : fieldErrors(r.error);
  };

  const update = (name: keyof ApplicationInput, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validate(next)[name] || "" }));
  };

  const blur = (name: keyof ApplicationInput) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validate(values)[name] || "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError("");

    const errs = validate(values);
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(EMPTY).find((k) => errs[k]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string>; reference?: string | null };
      if (!res.ok || !data.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error || "Something went wrong while sending your application. Try again in a minute.");
        setStatus("error");
        return;
      }
      setReference(data.reference ?? null);
      setStatus("success");
    } catch {
      setServerError(`Couldn't reach our server. Check your internet connection and try again, or email ${site.email}.`);
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setReference(null);
    setStatus("idle");
    startedAt.current = Date.now();
  };

  const input = (name: keyof ApplicationInput) => ({
    id: `ap-${name}`,
    name,
    value: values[name] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => update(name, e.target.value),
    onBlur: () => blur(name),
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `ap-${name}-error` : undefined,
    disabled: status === "submitting",
  });

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-[0_40px_100px_-50px_rgba(10,16,51,0.5)] sm:p-9">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--brand-gradient)" }} />
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl text-white" style={{ background: "var(--brand-gradient)" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <motion.path d="M5 12.5 10 17 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
              </svg>
            </div>
            <h3 className="mt-7 text-3xl font-bold text-navy">Application received</h3>
            <p className="mt-3 max-w-[42ch] leading-relaxed text-slate">
              Thanks, {values.fullName.split(" ")[0]}. We review every application and will reply to{" "}
              <strong className="text-navy">{values.email}</strong> within 7 working days.
            </p>
            {reference && (
              <p className="mt-5 rounded-full bg-mist px-4 py-2 text-sm text-navy">
                Reference: <span className="font-semibold">{reference}</span>
              </p>
            )}
            <button type="button" onClick={reset} className="btn btn-ghost-light mt-8 text-sm">
              Apply for another role
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" ref={formRef} onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
            <h3 className="text-2xl font-bold text-navy">Apply now</h3>
            <p className="mt-1.5 text-[0.95rem] text-slate">Fields without an “Optional” label are required.</p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field id="ap-fullName" label="Full name" error={errors.fullName}>
                <input {...input("fullName")} type="text" autoComplete="name" placeholder="Your full name" className="field" maxLength={100} />
              </Field>
              <Field id="ap-email" label="Email address" error={errors.email}>
                <input {...input("email")} type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" className="field" maxLength={254} />
              </Field>
              <Field id="ap-phone" label="Phone number" error={errors.phone}>
                <input {...input("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" className="field" maxLength={20} />
              </Field>
              <Field id="ap-role" label="Role" error={errors.role}>
                <div className="relative">
                  <select {...input("role")} className="field appearance-none pr-10">
                    <option value="" disabled>
                      Choose a role
                    </option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b6390" strokeWidth="2" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </Field>
              <Field id="ap-college" label="College / University" optional error={errors.college} className="sm:col-span-2">
                <input {...input("college")} type="text" placeholder="e.g. B.Tech CSE, 3rd year — Your College" className="field" maxLength={150} />
              </Field>
              <Field
                id="ap-resumeUrl"
                label="Resume link"
                error={errors.resumeUrl}
                hint="Upload your resume to Google Drive and paste a link that anyone can view."
              >
                <input {...input("resumeUrl")} type="url" inputMode="url" placeholder="https://drive.google.com/…" className="field" maxLength={500} />
              </Field>
              <Field id="ap-portfolioUrl" label="Portfolio / GitHub / LinkedIn" optional error={errors.portfolioUrl}>
                <input {...input("portfolioUrl")} type="url" inputMode="url" placeholder="https://github.com/yourname" className="field" maxLength={500} />
              </Field>
              <Field id="ap-message" label="Why do you want to join us?" error={errors.message} className="sm:col-span-2">
                <textarea
                  {...input("message")}
                  rows={5}
                  placeholder="Tell us about yourself, projects you've built and what you want to learn."
                  className="field resize-y"
                  maxLength={3000}
                />
              </Field>
            </div>

            {/* Honeypot: hidden from people, tempting for bots. */}
            <div aria-hidden className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="ap-website">Website</label>
              <input id="ap-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            {serverError && (
              <div role="alert" className="mt-5 rounded-xl border border-[#f3c4c6] bg-[#fff5f5] p-4 text-sm text-[#a3262b]">
                {serverError}
              </div>
            )}

            <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-slate sm:max-w-[36ch]">
                We use your details only to review your application. By applying, you agree to our{" "}
                <a href="/privacy-policy" target="_blank" className="font-medium text-electric hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <button type="submit" disabled={status === "submitting"} className="btn btn-primary min-w-[200px] disabled:cursor-wait disabled:opacity-80">
                {status === "submitting" ? "Sending…" : "Submit application"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

/** "Apply" button on a role card: preselects the role and scrolls to the form. */
export function ApplyButton({ role, className = "btn btn-primary" }: { role: string; className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_ROLE_EVENT, { detail: role }));
        document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      Apply for this role
    </button>
  );
}
