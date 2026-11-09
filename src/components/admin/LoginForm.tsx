"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed.");
        setBusy(false);
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Couldn't reach the server.");
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink px-4">
      <div aria-hidden className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-electric/30 blur-[120px]" />
      <div aria-hidden className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-violet/30 blur-[120px]" />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-[2rem]" style={{ background: "var(--brand-gradient)" }} />
        <Image src="/brand/nabhindu-mark.png" alt="Nabhindu Technologies" width={62} height={30} className="h-8 w-auto" />
        <h1 className="mt-6 text-2xl font-bold text-navy">Admin login</h1>
        <p className="mt-1 text-sm text-slate">Inquiries and call bookings dashboard.</p>
        {!configured && (
          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
            Set <code className="font-mono">ADMIN_PASSWORD</code> (8+ characters) in <code className="font-mono">.env.local</code> and restart the server.
          </p>
        )}
        <label htmlFor="admin-password" className="mt-6 block text-sm font-semibold text-navy">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          className="field mt-1.5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={error ? true : undefined}
        />
        {error && (
          <p role="alert" className="mt-2 text-sm text-[#d93036]">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy || !password} className="btn btn-primary mt-6 w-full disabled:opacity-60">
          {busy ? "Checking…" : "Log in"}
        </button>
        <a href="/" className="mt-5 block text-center text-sm text-slate hover:text-navy">
          ← Back to website
        </a>
      </form>
    </div>
  );
}
