"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { ConsultationRow, InquiryRow } from "@/lib/db";
import AdminCharts from "./AdminCharts";

type Tab = "inquiries" | "calls";
type Kind = "inquiry" | "consultation";

const INQ_STATUS: Record<InquiryRow["status"], { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-electric/10 text-electric" },
  contacted: { label: "Contacted", cls: "bg-amber-100 text-amber-800" },
  in_progress: { label: "Deal in progress", cls: "bg-violet/10 text-violet" },
  closed: { label: "Closed", cls: "bg-emerald-100 text-emerald-800" },
  spam: { label: "Spam", cls: "bg-slate/10 text-slate" },
};
const CALL_STATUS: Record<ConsultationRow["status"], { label: string; cls: string }> = {
  requested: { label: "Requested", cls: "bg-electric/10 text-electric" },
  confirmed: { label: "Confirmed", cls: "bg-amber-100 text-amber-800" },
  done: { label: "Done", cls: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Cancelled", cls: "bg-[#fde8e8] text-[#b42318]" },
  spam: { label: "Spam", cls: "bg-slate/10 text-slate" },
};

const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

function when(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}
function callDay(ymd: string) {
  return new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
/** wa.me needs the full international number; assume India for 10-digit numbers. */
function waNumber(phone: string) {
  const d = phone.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d.replace(/^0+/, "");
}

async function save(kind: Kind, id: string, patch: { status?: string; notes?: string }) {
  const res = await fetch("/api/admin/records", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, id, ...patch }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (res.status === 401) window.location.href = "/admin/login";
  if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't save.");
}

function Actions({ name, phone, email, context }: { name: string; phone: string; email?: string | null; context: string }) {
  const first = name.split(" ")[0];
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={`https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(`Hi ${first}, this is Nabhindu Technologies regarding your ${context}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn !px-4 !py-2 bg-[#25d366] text-sm text-white hover:brightness-110"
      >
        WhatsApp
      </a>
      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="btn btn-ghost-light !px-4 !py-2 text-sm">
        Call {phone}
      </a>
      {email && (
        <a href={`mailto:${email}?subject=${encodeURIComponent(`Your ${context} – Nabhindu Technologies`)}`} className="btn btn-ghost-light !px-4 !py-2 text-sm">
          Email
        </a>
      )}
    </div>
  );
}

function Notes({ kind, id, initial, onToast }: { kind: Kind; id: string; initial: string; onToast: (m: string, err?: boolean) => void }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [busy, setBusy] = useState(false);
  const dirty = value !== saved;
  const submit = async () => {
    setBusy(true);
    try {
      await save(kind, id, { notes: value });
      setSaved(value);
      onToast("Notes saved");
    } catch (e) {
      onToast((e as Error).message, true);
    }
    setBusy(false);
  };
  return (
    <div>
      <label htmlFor={`notes-${kind}-${id}`} className="text-sm font-semibold text-navy">
        Private notes
      </label>
      <textarea
        id={`notes-${kind}-${id}`}
        rows={3}
        className="field mt-1.5 resize-y"
        placeholder="e.g. Called on Monday, sending quote by Friday"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {dirty && (
        <button type="button" onClick={submit} disabled={busy} className="btn btn-primary mt-2 !px-4 !py-2 text-sm">
          {busy ? "Saving…" : "Save notes"}
        </button>
      )}
    </div>
  );
}

function StatusSelect<T extends string>({
  value,
  options,
  onChange,
  id,
}: {
  value: T;
  options: Record<T, { label: string }>;
  onChange: (v: T) => void;
  id: string;
}) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className="field !w-auto !py-2 pr-8 text-sm font-semibold" aria-label="Status">
      {(Object.keys(options) as T[]).map((k) => (
        <option key={k} value={k}>
          {options[k].label}
        </option>
      ))}
    </select>
  );
}

export default function AdminDashboard({ inquiries: inq0, calls: calls0, error }: { inquiries: InquiryRow[]; calls: ConsultationRow[]; error: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("inquiries");
  const [inquiries, setInquiries] = useState(inq0);
  const [calls, setCalls] = useState(calls0);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<{ m: string; err?: boolean } | null>(null);

  // ── Live data ───────────────────────────────────────────────
  // Every 30s (while this tab is visible) the server page re-reads the database,
  // so new inquiries/bookings appear and every chart recalculates on its own.
  const REFRESH_MS = 30_000;
  const [refreshing, startRefresh] = useTransition();
  const [updatedAt, setUpdatedAt] = useState(() => Date.now());
  const [, tick] = useState(0);
  const known = useRef({ inq: new Set(inq0.map((r) => r.id)), calls: new Set(calls0.map((r) => r.id)) });

  const refresh = () => startRefresh(() => router.refresh());

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
      tick((n) => n + 1); // keeps the "updated … ago" label current
    }, REFRESH_MS);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fresh rows from the server replace local state; announce anything new.
  useEffect(() => {
    setInquiries(inq0);
    setCalls(calls0);
    setUpdatedAt(Date.now());
    const newInq = inq0.filter((r) => !known.current.inq.has(r.id)).length;
    const newCalls = calls0.filter((r) => !known.current.calls.has(r.id)).length;
    known.current = { inq: new Set(inq0.map((r) => r.id)), calls: new Set(calls0.map((r) => r.id)) };
    if (newInq || newCalls) {
      const parts = [newInq && `${newInq} new inquir${newInq > 1 ? "ies" : "y"}`, newCalls && `${newCalls} new call booking${newCalls > 1 ? "s" : ""}`].filter(Boolean);
      showToast(`🎉 ${parts.join(" and ")}`, false, 8000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inq0, calls0]);

  const agoSec = Math.max(0, Math.round((Date.now() - updatedAt) / 1000));
  const ago = agoSec < 45 ? "just now" : `${Math.round(agoSec / 60)} min ago`;

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (m: string, err?: boolean, ms = 2600) => {
    setToast({ m, err });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  };

  const today = todayIST();

  const statusMap = tab === "inquiries" ? INQ_STATUS : CALL_STATUS;
  const rows = tab === "inquiries" ? inquiries : calls;
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    rows.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
    return c;
  }, [rows]);

  const needle = q.trim().toLowerCase();
  const match = (fields: (string | null)[]) => !needle || fields.some((f) => f?.toLowerCase().includes(needle));

  const visibleInq = inquiries.filter(
    (i) => (filter === "all" || i.status === filter) && match([i.full_name, i.email, i.phone, i.reference, i.company, i.message, i.service]),
  );
  const visibleCalls = calls
    .filter((c) => (filter === "all" || c.status === filter) && match([c.full_name, c.email, c.phone, c.reference, c.topic]))
    .sort((a, b) => {
      const au = a.call_date >= today, bu = b.call_date >= today;
      if (au !== bu) return au ? -1 : 1; // upcoming first
      return au ? a.call_date.localeCompare(b.call_date) : b.call_date.localeCompare(a.call_date);
    });

  const setInqStatus = async (id: string, status: InquiryRow["status"]) => {
    const prev = inquiries;
    setInquiries((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await save("inquiry", id, { status });
      showToast(`Marked as ${INQ_STATUS[status].label}`);
    } catch (e) {
      setInquiries(prev);
      showToast((e as Error).message, true);
    }
  };
  const setCallStatus = async (id: string, status: ConsultationRow["status"]) => {
    const prev = calls;
    setCalls((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await save("consultation", id, { status });
      showToast(`Marked as ${CALL_STATUS[status].label}`);
    } catch (e) {
      setCalls(prev);
      showToast((e as Error).message, true);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setFilter("all");
    setOpen(null);
  };

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
        <div className="container-x flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image src="/brand/nabhindu-mark.png" alt="" width={62} height={30} className="h-7 w-auto" />
            <span className="font-display font-bold text-navy">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 text-xs text-slate md:inline-flex" aria-live="polite">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${refreshing ? "animate-ping" : ""}`} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Live · updated {refreshing ? "now…" : ago}
            </span>
            <button type="button" onClick={refresh} disabled={refreshing} className="btn btn-ghost-light !px-3 !py-2 text-sm disabled:opacity-60" title="Load latest">
              {refreshing ? "Updating…" : "Refresh"}
            </button>
            <a href="/admin/seo" className="btn btn-ghost-light !px-3 !py-2 text-sm">
              SEO
            </a>
            <a href={`/api/admin/export?kind=${tab}`} className="btn btn-ghost-light hidden !px-3 !py-2 text-sm sm:inline-flex">
              Export CSV
            </a>
            <a href="/" className="btn btn-ghost-light hidden !px-3 !py-2 text-sm sm:inline-flex">
              View site
            </a>
            <button type="button" onClick={logout} className="btn !px-3 !py-2 bg-navy text-sm text-white">
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-x mt-8">
        {error && <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}

        <AdminCharts inquiries={inquiries} calls={calls} />

        <h2 className="mt-12 font-display text-2xl font-bold text-navy">All records</h2>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="tablist" className="inline-flex rounded-full bg-white p-1 shadow-[0_10px_30px_-24px_rgba(10,16,51,0.6)]">
            {(["inquiries", "calls"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => switchTab(t)}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? "text-white" : "text-navy/70 hover:text-navy"}`}
              >
                {tab === t && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-full" style={{ background: "var(--brand-gradient)" }} />}
                <span className="relative">
                  {t === "inquiries" ? "Inquiries" : "Call bookings"} ({t === "inquiries" ? inquiries.length : calls.length})
                </span>
              </button>
            ))}
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email, reference…"
            aria-label="Search"
            className="field lg:max-w-sm"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["all", ...Object.keys(statusMap)].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={filter === s}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${filter === s ? "bg-navy text-white" : "bg-white text-navy/70 hover:text-navy"}`}
            >
              {s === "all" ? "All" : statusMap[s as keyof typeof statusMap].label} <span className="opacity-60">{counts[s] || 0}</span>
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-3">
          {tab === "inquiries" &&
            visibleInq.map((r) => {
              const isOpen = open === `i${r.id}`;
              return (
                <li key={r.id} className="overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_-34px_rgba(10,16,51,0.7)]">
                  <button type="button" onClick={() => setOpen(isOpen ? null : `i${r.id}`)} aria-expanded={isOpen} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left sm:p-5">
                    <span className={`chip ${INQ_STATUS[r.status].cls}`}>{INQ_STATUS[r.status].label}</span>
                    <span className="font-semibold text-navy">{r.full_name}</span>
                    <span className="text-sm text-slate">
                      {r.service}
                      {r.budget ? ` · ${r.budget}` : ""}
                    </span>
                    <span className="ml-auto text-sm text-slate">{when(r.created_at)}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="grid gap-6 border-t border-line p-5 lg:grid-cols-[1.4fr_1fr]">
                          <div>
                            <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-sm">
                              <dt className="text-slate">Reference</dt>
                              <dd className="font-mono text-navy">{r.reference}</dd>
                              <dt className="text-slate">Email</dt>
                              <dd className="break-all text-navy">{r.email}</dd>
                              <dt className="text-slate">Phone</dt>
                              <dd className="text-navy">{r.phone}</dd>
                              {r.company && (
                                <>
                                  <dt className="text-slate">Company</dt>
                                  <dd className="text-navy">{r.company}</dd>
                                </>
                              )}
                              <dt className="text-slate">Email alert</dt>
                              <dd className="text-navy">{r.email_sent ? "Sent" : "Not sent"}</dd>
                            </dl>
                            <p className="mt-4 whitespace-pre-wrap rounded-xl bg-mist p-4 text-[0.95rem] leading-relaxed text-navy">{r.message}</p>
                            <div className="mt-4">
                              <Actions name={r.full_name} phone={r.phone} email={r.email} context="website inquiry" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor={`st-i${r.id}`} className="mr-3 text-sm font-semibold text-navy">
                                Status
                              </label>
                              <StatusSelect id={`st-i${r.id}`} value={r.status} options={INQ_STATUS} onChange={(v) => setInqStatus(r.id, v)} />
                            </div>
                            <Notes kind="inquiry" id={r.id} initial={r.notes || ""} onToast={showToast} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}

          {tab === "calls" &&
            visibleCalls.map((r) => {
              const isOpen = open === `c${r.id}`;
              const past = r.call_date < today;
              return (
                <li key={r.id} className={`overflow-hidden rounded-2xl bg-white shadow-[0_16px_40px_-34px_rgba(10,16,51,0.7)] ${past ? "opacity-75" : ""}`}>
                  <button type="button" onClick={() => setOpen(isOpen ? null : `c${r.id}`)} aria-expanded={isOpen} className="flex w-full flex-wrap items-center gap-x-4 gap-y-1 p-4 text-left sm:p-5">
                    <span className={`chip ${CALL_STATUS[r.status].cls}`}>{CALL_STATUS[r.status].label}</span>
                    <span className="font-display font-bold text-navy">
                      {r.call_date === today ? "Today" : callDay(r.call_date)} · {r.call_slot}
                    </span>
                    <span className="font-semibold text-navy">{r.full_name}</span>
                    <span className="text-sm text-slate">{r.mode}</span>
                    <span className="ml-auto text-sm text-slate">booked {when(r.created_at)}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="grid gap-6 border-t border-line p-5 lg:grid-cols-[1.4fr_1fr]">
                          <div>
                            <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-sm">
                              <dt className="text-slate">Reference</dt>
                              <dd className="font-mono text-navy">{r.reference}</dd>
                              <dt className="text-slate">Phone</dt>
                              <dd className="text-navy">{r.phone}</dd>
                              <dt className="text-slate">Email</dt>
                              <dd className="break-all text-navy">{r.email || "—"}</dd>
                              <dt className="text-slate">Connect via</dt>
                              <dd className="text-navy">{r.mode}</dd>
                            </dl>
                            {r.topic && <p className="mt-4 whitespace-pre-wrap rounded-xl bg-mist p-4 text-[0.95rem] leading-relaxed text-navy">{r.topic}</p>}
                            <div className="mt-4">
                              <Actions name={r.full_name} phone={r.phone} email={r.email} context={`consultation call on ${callDay(r.call_date)} at ${r.call_slot}`} />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor={`st-c${r.id}`} className="mr-3 text-sm font-semibold text-navy">
                                Status
                              </label>
                              <StatusSelect id={`st-c${r.id}`} value={r.status} options={CALL_STATUS} onChange={(v) => setCallStatus(r.id, v)} />
                            </div>
                            <Notes kind="consultation" id={r.id} initial={r.notes || ""} onToast={showToast} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
        </ul>

        {((tab === "inquiries" && !visibleInq.length) || (tab === "calls" && !visibleCalls.length)) && !error && (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-line p-10 text-center text-slate">
            {rows.length ? "Nothing matches this filter." : tab === "inquiries" ? "No inquiries yet." : "No call bookings yet."}
          </div>
        )}
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl ${toast.err ? "bg-[#d93036]" : "bg-navy"}`}
          >
            {toast.m}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
