"use client";

import type Lenis from "lenis";

/** Fired by service cards to preselect a service in the contact form. */
export const SELECT_SERVICE_EVENT = "nt:select-service";

/** Fired by pricing cards to preselect a service and budget in the contact form. */
export const SELECT_PLAN_EVENT = "nt:select-plan";

/** Opens the free-consultation booking dialog from anywhere on the page. */
export const OPEN_BOOKING_EVENT = "nt:open-booking";

export function openBooking() {
  window.dispatchEvent(new Event(OPEN_BOOKING_EVENT));
}

let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smoothly scrolls to `#id` (or the top for `#home`), accounting for the fixed navbar. */
export function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  const el = id === "home" || id === "" ? document.body : document.getElementById(id);
  if (!el) return false;
  if (lenis) {
    // Lenis already honours the CSS `scroll-padding-top` set on <html>, which clears the navbar.
    lenis.scrollTo(id === "home" ? 0 : (el as HTMLElement), { duration: 1.3 });
  } else {
    const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY - pad;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
  if (history.replaceState) history.replaceState(null, "", id === "home" ? " " : `#${id}`);
  // Move focus for keyboard and screen-reader users without jumping the page.
  if (id !== "home" && el instanceof HTMLElement) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
  return true;
}
