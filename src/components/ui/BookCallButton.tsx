"use client";

import { openBooking } from "@/lib/scroll";

export default function BookCallButton({ className = "btn btn-ghost-dark", children = "Book a free call" }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={openBooking} className={className}>
      {children}
    </button>
  );
}
