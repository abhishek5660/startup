"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { consultation } from "@/lib/data";
import { bookingSchema, formatBookingDate, type BookingInput } from "@/lib/booking";
import { fieldErrors } from "@/lib/validation";
import { getLenis, OPEN_BOOKING_EVENT } from "@/lib/scroll";
import { site, whatsappLink } from "@/lib/site";

type Slots = { dates: string[]; booked: { date: string; slot: string }[]; online: boolean };

const EMPTY: BookingInput = { fullName: "", phone: "", email: "", date: "", slot: "", mode: "WhatsApp call", topic: "" };

function Dialog({ onClose }: { onClose: () => void }) {
  const [slots, setSlots] = useState<Slots | null>(null);
  const [values, setValues] = useState<BookingInput>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(Date.now());
  const closeRef = useRef<HTMLButtonElement>(null);

  const load = useCallback(() => {
    fetch("/api/consultation", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Slots) => {
        setSlots(d);
        setValues((v) => (v.date ? v : { ...v, date: d.dates[0] ?? "" }));
      })
      .catch(() => setSlots({ dates: [], booked: [], online: false }));
  }, []);

  useEffect(() => {
    load();
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = document.querySelectorAll<HTMLElement>("#booking-dialog button:not([disabled]), #booking-dialog input, #booking-dialog textarea, #booking-dialog a[href]");
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      getLenis()?.start();
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [load, onClose]);

  const set = (k: keyof BookingInput, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const isBooked = (date: string, slot: string) => !!slots?.booked.some((b) => b.date === date && b.slot === slot);

  const waText = () =>
    [
      `Hi ${site.shortName}, I'd like to book a free ${consultation.durationMinutes}-min consultation.`,
      values.date && values.slot ? `When: ${formatBookingDate(values.date)}, ${values.slot}` : "",
      values.fullName ? `Name: ${values.fullName}` : "",
      values.topic ? `About: ${values.topic}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;
    setServerError("");
    const r = bookingSchema.safeParse(values);
    if (!r.success) {
      setErrors(fieldErrors(r.error));
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Record<string, string>; reference?: string | null };
      if (!res.ok || !data.ok) {
        if (data.fields) setErrors(data.fields);
        setServerError(data.error || "Couldn't book right now. Try again, or WhatsApp us.");
        setStatus("error");
        if (res.status === 409) load();
        return;
      }
      setReference(data.reference ?? null);
      setStatus("success");
    } catch {
      setServerError("Couldn't reach our server. Check your connection, or book on WhatsApp instead.");
      setStatus("error");
    }
  };

  const err = (k: string) =>
    errors[k] ? (
      <p id={`bk-${k}-error`} className="mt-1.5 text-sm text-[#d93036]">
        {errors[k]}
      </p>
    ) : null;

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-ink/70 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        id="booking-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        data-lenis-prevent
        className="relative max-h-[94svh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white p-6 text-navy shadow-2xl sm:rounded-[2rem] sm:p-9"
        initial={{ y: 60, opacity: 0, rotateX: 12, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformPerspective: 1200 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-1" style={{ background: "var(--brand-gradient)" }} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close booking"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-mist transition-colors hover:bg-line"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 14 }}
              className="flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-[0_20px_40px_-12px_rgba(30,107,255,0.7)]"
              style={{ background: "var(--brand-gradient)", transformPerspective: 600 }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                <path d="M5 12.5 10 17 19 7" />
              </svg>
            </motion.div>
            <h2 className="mt-7 text-3xl font-bold">Call booked!</h2>
            <p className="mt-3 max-w-[42ch] leading-relaxed text-slate">
              Thanks, {values.fullName.split(" ")[0]}. We&apos;ll {values.mode === "Google Meet" ? "send a Meet link and call you" : "call you"} on{" "}
              <strong className="text-navy">
                {formatBookingDate(values.date)} at {values.slot}
              </strong>{" "}
              ({values.mode}).
            </p>
            {reference && (
              <p className="mt-5 rounded-full bg-mist px-4 py-2 text-sm">
                Reference: <span className="font-semibold">{reference}</span>
              </p>
            )}
            <button type="button" onClick={onClose} className="btn btn-primary mt-8">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className="text-sm font-semibold text-electric">Free · {consultation.durationMinutes} minutes · No obligation</p>
            <h2 id="booking-title" className="mt-2 pr-10 text-2xl font-bold sm:text-3xl">
              Book a free consultation call
            </h2>
            <p className="mt-2 text-slate">Tell us about your idea — we&apos;ll suggest the right approach and a fair price.</p>

            <fieldset className="mt-7">
              <legend className="text-sm font-semibold">Pick a day</legend>
              {!slots ? (
                <div className="mt-3 h-[68px] animate-pulse rounded-2xl bg-mist" />
              ) : (
                <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2" data-lenis-prevent>
                  {slots.dates.map((d) => {
                    const dt = new Date(`${d}T12:00:00Z`);
                    const wd = dt.toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" });
                    const mon = dt.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" });
                    const on = values.date === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          set("date", d);
                          if (values.slot && isBooked(d, values.slot)) set("slot", "");
                        }}
                        className={`flex w-[60px] shrink-0 flex-col items-center rounded-2xl border-2 py-2 transition-all ${
                          on ? "border-transparent text-white shadow-[0_12px_24px_-12px_rgba(30,107,255,0.8)]" : "border-line hover:border-electric/40"
                        }`}
                        style={on ? { background: "var(--brand-gradient)" } : undefined}
                      >
                        <span className={`text-xs ${on ? "text-white/80" : "text-slate"}`}>{wd}</span>
                        <span className="font-display text-xl font-bold leading-tight">{dt.getUTCDate()}</span>
                        <span className={`text-[11px] ${on ? "text-white/80" : "text-slate"}`}>{mon}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {err("date")}
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Pick a time (IST)</legend>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {consultation.slots.map((s) => {
                  const taken = values.date ? isBooked(values.date, s) : false;
                  const on = values.slot === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={taken}
                      aria-pressed={on}
                      onClick={() => set("slot", s)}
                      className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition-all ${
                        taken
                          ? "cursor-not-allowed border-line text-slate/40 line-through"
                          : on
                            ? "border-electric bg-electric/[0.07] text-electric"
                            : "border-line hover:border-electric/40"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {err("slot")}
            </fieldset>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">How should we connect?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {consultation.modes.map((m) => {
                  const on = values.mode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("mode", m)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-navy text-white" : "bg-mist text-navy/75 hover:text-navy"}`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="bk-name" className="text-sm font-semibold">
                  Your name
                </label>
                <input
                  id="bk-name"
                  className="field mt-1.5"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  aria-invalid={errors.fullName ? true : undefined}
                  aria-describedby={errors.fullName ? "bk-fullName-error" : undefined}
                />
                {err("fullName")}
              </div>
              <div>
                <label htmlFor="bk-phone" className="text-sm font-semibold">
                  Phone / WhatsApp
                </label>
                <input
                  id="bk-phone"
                  type="tel"
                  className="field mt-1.5"
                  autoComplete="tel"
                  placeholder="+91"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "bk-phone-error" : undefined}
                />
                {err("phone")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bk-email" className="text-sm font-semibold">
                  Email <span className="font-normal text-slate">(optional)</span>
                </label>
                <input
                  id="bk-email"
                  type="email"
                  className="field mt-1.5"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "bk-email-error" : undefined}
                />
                {err("email")}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="bk-topic" className="text-sm font-semibold">
                  What would you like to discuss? <span className="font-normal text-slate">(optional)</span>
                </label>
                <textarea
                  id="bk-topic"
                  rows={3}
                  className="field mt-1.5 resize-none"
                  placeholder="e.g. A website for my restaurant with online menu"
                  value={values.topic}
                  onChange={(e) => set("topic", e.target.value)}
                />
                {err("topic")}
              </div>
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {serverError && (
              <div role="alert" className="mt-5 rounded-xl border border-[#f3c4c6] bg-[#fff5f5] p-4 text-sm text-[#a3262b]">
                {serverError}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={status === "submitting"} className="btn btn-primary flex-1 disabled:opacity-70">
                {status === "submitting" ? "Booking…" : "Confirm free call"}
              </button>
              <a href={whatsappLink(waText())} target="_blank" rel="noopener noreferrer" className="btn border border-[#25d366]/40 text-[#128c4b] hover:bg-[#25d366]/10">
                Book on WhatsApp instead
              </a>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Global booking dialog; open it with `openBooking()` from anywhere. */
export default function BookingModal() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(OPEN_BOOKING_EVENT, on);
    return () => window.removeEventListener(OPEN_BOOKING_EVENT, on);
  }, []);
  return <AnimatePresence>{open && <Dialog onClose={close} />}</AnimatePresence>;
}
