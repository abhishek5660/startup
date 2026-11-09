"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site, whatsappLink } from "@/lib/site";
import { formatINR, startingPrice } from "@/lib/data";

const WA_PATH =
  "M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.82 9.82 0 0 1-1.5-5.22c0-5.42 4.42-9.83 9.84-9.83a9.8 9.8 0 0 1 9.83 9.84c0 5.42-4.41 9.82-9.84 9.82Zm8.37-18.2A11.76 11.76 0 0 0 12.05.15C5.52.15.2 5.46.2 11.99c0 2.09.55 4.13 1.59 5.93L.1 24l6.23-1.63a11.8 11.8 0 0 0 5.71 1.46h.01c6.53 0 11.85-5.32 11.85-11.85 0-3.17-1.23-6.14-3.47-8.38Z";

/** Floating WhatsApp chat button with a one-time greeting bubble. */
export default function WhatsAppButton() {
  const [shown, setShown] = useState(false);
  const [bubble, setBubble] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShown(true), 2200);
    let seen = false;
    try {
      seen = sessionStorage.getItem("nt-wa-bubble") === "1";
    } catch {}
    let inContact = false;
    const t2 = seen ? undefined : setTimeout(() => !inContact && setBubble(true), 7000);
    // Auto-hide the greeting so it never sits over content for long.
    const t3 = seen ? undefined : setTimeout(() => setBubble(false), 19000);
    // Never cover the contact form.
    const contact = document.getElementById("contact");
    const io = contact ? new IntersectionObserver(([e]) => {
          inContact = e.isIntersecting;
          if (inContact) setBubble(false);
        }, { threshold: 0.1 }) : null;
    if (contact && io) io.observe(contact);
    return () => {
      clearTimeout(t1);
      if (t2) clearTimeout(t2);
      if (t3) clearTimeout(t3);
      io?.disconnect();
    };
  }, []);

  const closeBubble = () => {
    setBubble(false);
    try {
      sessionStorage.setItem("nt-wa-bubble", "1");
    } catch {}
  };

  const href = whatsappLink(`Hi ${site.shortName}! I'd like to discuss a website project.`);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 z-[90] flex items-end gap-3 sm:bottom-7 sm:right-7"
        >
          <AnimatePresence>
            {bubble && (
              <motion.div
                initial={{ opacity: 0, x: 16, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.9 }}
                className="relative mb-2 hidden max-w-[240px] rounded-2xl rounded-br-md bg-white p-4 pr-8 text-sm text-navy shadow-[0_20px_50px_-20px_rgba(10,16,51,0.55)] sm:block"
              >
                <button
                  type="button"
                  onClick={closeBubble}
                  aria-label="Dismiss message"
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-slate hover:bg-mist"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden>
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
                <p className="font-semibold">Namaste! 👋</p>
                <p className="mt-1 leading-snug text-slate">
                  Need a website? Chat with us on WhatsApp — projects start at {formatINR(startingPrice)}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            onClick={closeBubble}
            className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.75)] transition-transform duration-300 hover:scale-110"
          >
            <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25d366] opacity-30 [animation-duration:2.6s]" />
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="relative" aria-hidden>
              <path d={WA_PATH} />
            </svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
