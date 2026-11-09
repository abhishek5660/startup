"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contactSchema, fieldErrors, type ContactInput } from "@/lib/validation";
import { budgetOptions, serviceOptions } from "@/lib/data";
import { SELECT_PLAN_EVENT, SELECT_SERVICE_EVENT } from "@/lib/scroll";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactInput = { fullName: "", email: "", phone: "", company: "", service: "", budget: "", message: "" };

function Field({
  id,
  label,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
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

export default function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
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
    const onSelect = (e: Event) => {
      const service = (e as CustomEvent<string>).detail;
      if (serviceOptions.includes(service)) {
        setValues((v) => ({ ...v, service }));
        setErrors((er) => ({ ...er, service: "" }));
      }
    };
    const onPlan = (e: Event) => {
      const { service, budget, message } = (e as CustomEvent<{ service: string; budget: string; message?: string }>).detail;
      setValues((v) => ({
        ...v,
        service: serviceOptions.includes(service) ? service : v.service,
        budget: budgetOptions.includes(budget) ? budget : v.budget,
        message: message ?? v.message,
      }));
      setErrors((er) => ({ ...er, service: "", budget: "", ...(message ? { message: "" } : {}) }));
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    window.addEventListener(SELECT_PLAN_EVENT, onPlan);
    return () => {
      window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
      window.removeEventListener(SELECT_PLAN_EVENT, onPlan);
    };
  }, []);

  const validate = (v: ContactInput) => {
    const r = contactSchema.safeParse(v);
    return r.success ? {} : fieldErrors(r.error);
  };

  const update = (name: keyof ContactInput, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) setErrors((e) => ({ ...e, [name]: validate(next)[name] || "" }));
  };

  const blur = (name: keyof ContactInput) => {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
        reference?: string | null;
      };
      if (!res.ok || !data.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error || "Something went wrong while sending your inquiry. Try again in a minute.");
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

  const input = (name: keyof ContactInput) => ({
    id: `cf-${name}`,
    name,
    value: values[name] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => update(name, e.target.value),
    onBlur: () => blur(name),
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `cf-${name}-error` : undefined,
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
            className="flex min-h-[520px] flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-[0_20px_40px_-12px_rgba(30,107,255,0.7)]"
              style={{ background: "var(--brand-gradient)" }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <motion.path d="M5 12.5 10 17 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.5 }} />
              </svg>
            </motion.div>
            <h3 className="mt-7 text-3xl font-bold text-navy">Inquiry submitted</h3>
            <p className="mt-3 max-w-[40ch] leading-relaxed text-slate">
              Thanks, {values.fullName.split(" ")[0]}. Your inquiry has been saved and our team will reply to{" "}
              <strong className="text-navy">{values.email}</strong>.
            </p>
            {reference && (
              <p className="mt-5 rounded-full bg-mist px-4 py-2 text-sm text-navy">
                Reference: <span className="font-semibold">{reference}</span>
              </p>
            )}
            <button type="button" onClick={reset} className="btn btn-ghost-light mt-8 text-sm">
              Send another inquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            aria-describedby={serverError ? "cf-server-error" : undefined}
          >
            <h3 className="text-2xl font-bold text-navy">Tell us about your project</h3>
            <p className="mt-1.5 text-[0.95rem] text-slate">Fields without an “Optional” label are required.</p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Field id="cf-fullName" label="Full name" error={errors.fullName}>
                <input {...input("fullName")} type="text" autoComplete="name" placeholder="Your full name" className="field" maxLength={100} />
              </Field>
              <Field id="cf-email" label="Email address" error={errors.email}>
                <input {...input("email")} type="email" autoComplete="email" inputMode="email" placeholder="you@company.com" className="field" maxLength={254} />
              </Field>
              <Field id="cf-phone" label="Phone number" error={errors.phone}>
                <input {...input("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210" className="field" maxLength={20} />
              </Field>
              <Field id="cf-company" label="Company name" optional error={errors.company}>
                <input {...input("company")} type="text" autoComplete="organization" placeholder="Your business" className="field" maxLength={120} />
              </Field>
              <Field id="cf-service" label="Service required" error={errors.service}>
                <div className="relative">
                  <select {...input("service")} className="field appearance-none pr-10">
                    <option value="" disabled>
                      Choose a service
                    </option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </Field>
              <Field id="cf-budget" label="Project budget" optional error={errors.budget}>
                <div className="relative">
                  <select {...input("budget")} className="field appearance-none pr-10">
                    <option value="">Select a range</option>
                    {budgetOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <Chevron />
                </div>
              </Field>
              <Field id="cf-message" label="Project details" error={errors.message} className="sm:col-span-2">
                <textarea
                  {...input("message")}
                  rows={5}
                  placeholder="What do you want to build? Share goals, pages or features you need, and any deadline."
                  className="field resize-y"
                  maxLength={5000}
                />
                <p className="mt-1 text-right text-xs text-slate">{(values.message ?? "").length} / 5000</p>
              </Field>
            </div>

            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="cf-website">Website</label>
              <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
            </div>

            <AnimatePresence>
              {serverError && (
                <motion.div
                  id="cf-server-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex gap-3 rounded-xl border border-[#f3c4c6] bg-[#fff4f4] p-4 text-sm text-[#a3242a]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0" aria-hidden>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-7 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-slate sm:max-w-[34ch]">
                We use your details only to reply to this inquiry. We never share them.
              </p>
              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary group min-w-[200px] disabled:cursor-wait disabled:opacity-90"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === "submitting" ? (
                    <motion.span key="loading" className="flex items-center gap-2.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                      Sending inquiry…
                    </motion.span>
                  ) : (
                    <motion.span key="idle" className="flex items-center gap-2.5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      Submit Inquiry
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" aria-hidden>
                        <path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
            <p className="sr-only" aria-live="polite">
              {status === "submitting" ? "Sending your inquiry" : ""}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Chevron() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5b6390" strokeWidth="2" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
