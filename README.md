<<<<<<< HEAD
# Nabhindu Technologies — Website

**Innovate. Build. Grow.**

The official website of Nabhindu Technologies: a single-page, animated business site with a working contact form that saves every inquiry to PostgreSQL and emails a notification to `nabhindutechnologies@gmail.com`.

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, self-hosted Sora + Inter fonts |
| Animation | Framer Motion, GSAP ScrollTrigger, Lenis smooth scroll, canvas particles |
| Backend | Next.js Route Handler (`/api/contact`, Node.js runtime) |
| Database | PostgreSQL — Supabase recommended (any Postgres 13+ works) |
| Email | Nodemailer over SMTP (Gmail App Password) |

---

## 1. Run it on your computer

Requirements: **Node.js 20 or newer** (`node -v`).

```bash
npm install
cp .env.example .env.local      # Windows: copy .env.example .env.local
# fill in .env.local (see section 2)
npm run db:setup                # creates the inquiries table
npm run dev                     # http://localhost:3000
```

The site works without a database, but the contact form will tell visitors it is temporarily unavailable until `DATABASE_URL` is set. It never pretends to succeed.

## 2. Configure the database and email

### Database (Supabase, free tier is enough)

1. Create a project at <https://supabase.com> (choose the **Mumbai / ap-south-1** region).
2. **Project Settings → Database → Connection string → URI**. Use the **Transaction pooler** string (port `6543`) for Vercel.
3. Put it in `.env.local` as `DATABASE_URL=...` (replace `[YOUR-PASSWORD]`).
4. Run `npm run db:setup`, or paste `db/schema.sql` into the Supabase **SQL Editor** and press Run.

Row-Level Security is switched on for the table, so the public Supabase API cannot read inquiries. Only the server-side connection string can.

**View inquiries:** Supabase → **Table Editor → inquiries**. Each row has a `reference` (e.g. `NT-20261103-4AA622`), which the visitor also sees on screen, plus a `status` column (`new`, `contacted`, `in_progress`, `closed`, `spam`) you can update.

### Email notifications (Gmail)

1. Turn on **2-Step Verification** for `nabhindutechnologies@gmail.com`.
2. Go to <https://myaccount.google.com/apppasswords>, create an app password named "Website", copy the 16-character code.
3. In `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=nabhindutechnologies@gmail.com
   SMTP_PASS=the-16-character-app-password
   ```

Every inquiry is saved **before** the email is sent. If an email ever fails, the inquiry is still in the database and the error is written to its `email_error` column.

### All environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Your live URL, for SEO, sitemap and social previews |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `IP_HASH_SALT` | Yes | Any long random text; anonymises visitor IPs used for rate limiting |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | For email | SMTP credentials |
| `CONTACT_TO_EMAIL` | No | Where notifications go (default: nabhindutechnologies@gmail.com) |
| `CONTACT_FROM_EMAIL` | No | Sender address (default: `SMTP_USER`) |

All of these are read only on the server. None are exposed to the browser except `NEXT_PUBLIC_SITE_URL`, which is public by design.

## 3. Deploy to Vercel (recommended)

1. Push this folder to a **private** GitHub repository (`.env.local` is git-ignored, so keep it that way).
2. At <https://vercel.com/new>, import the repository. Vercel detects Next.js automatically.
3. Under **Environment Variables**, add every variable from the table above.
4. Click **Deploy**.
5. **Settings → Domains**: add your domain, then update `NEXT_PUBLIC_SITE_URL` to it and redeploy.
6. Submit `https://your-domain/sitemap.xml` in Google Search Console.

**Other hosts** (Netlify, Render, Railway, a VPS): run `npm run build`, then `npm start` (port 3000) with the same environment variables. Any Node 20+ host works.

## 4. Contact form security

| Protection | How |
|---|---|
| Validation | One Zod schema shared by the browser and the server (`src/lib/validation.ts`) |
| Honeypot | Hidden `website` field; bots that fill it get a silent fake success and nothing is stored |
| Time trap | Forms submitted under 3 seconds after loading are treated as bots |
| Rate limiting | 3 per 10 minutes per visitor (in memory) + 5 per hour (database-backed, works across servers) |
| Link spam | Messages with more than 3 links are rejected |
| Origin check | Only same-site submissions are accepted |
| Size limit | Request body capped at 20 KB; database CHECK constraints on every column |
| Injection | Parameterised SQL, HTML-escaped email body, CR/LF stripped from mail headers |
| Privacy | Visitor IPs are stored only as a salted SHA-256 hash |

Security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) are set in `next.config.ts`.

## 5. Editing content

| To change… | Edit |
|---|---|
| Phone, email, address, founder, **social media links** | `src/lib/site.ts` |
| Services, technologies, process steps, "Why choose us", budget options | `src/lib/data.ts` |
| **Portfolio projects** | `projects` in `src/lib/data.ts` |
| Colours and fonts | `@theme` block in `src/app/globals.css` |
| Logo files | `public/brand/` |

**Social links:** they are empty by default, so no icons appear. Add a URL (e.g. `linkedin: "https://www.linkedin.com/company/…"`) and the icon shows up in the footer.

**Portfolio:** the three projects are clearly labelled **Sample concept**. When you finish real work, replace an entry, set `isSample: false`, and set `liveUrl` to the live site. The "Live demo" button enables itself when `liveUrl` is set.

## 6. Project structure

```
src/
  app/
    api/contact/route.ts   ← contact form API (validate → spam checks → save → email)
    layout.tsx             ← metadata, Open Graph, JSON-LD, fonts
    page.tsx               ← the single page, section by section
    globals.css            ← design tokens, components, CSS animations
    sitemap.ts, robots.ts, manifest.ts, not-found.tsx
  components/
    layout/   Navbar, Footer, Loader, Cursor, SmoothScroll, Providers
    sections/ Hero, HeroVisual, About, Services, TechStack, Portfolio, Process, WhyUs, Contact, ContactForm
    ui/       motion helpers (Reveal, SplitWords, Magnetic, TiltCard, Pixels), PixelField, Counter, icons
  lib/
    site.ts, data.ts       ← all editable content
    validation.ts          ← shared form schema
    db.ts, mailer.ts       ← server-only database and email helpers
db/schema.sql              ← database table
scripts/db-setup.mjs       ← `npm run db:setup`
```

The site has no login or accounts, as requested. Database and form logic live in `src/lib`, so an admin dashboard (to view and update inquiries) can be added later as `src/app/admin` with authentication, without restructuring.

## 7. Accessibility and motion

- Respects **reduced motion**: the intro, parallax, particles, cursor and looping animations switch off.
- Custom cursor and tilt effects appear only on devices with a mouse.
- The intro animation plays once per browser session on tablets and desktops and is skipped on phones for a faster first paint.
- Keyboard: skip link, visible focus rings, Escape closes the menu and the project dialog, and focus stays inside the dialog while it is open.

## 8. Tested before delivery

- Production build and TypeScript: no errors.
- Every navigation link, the CTAs, service "Learn more" → "Discuss this service" (pre-selects the service in the form), and the portfolio dialog.
- Contact form end to end: browser → API → PostgreSQL row → email delivered to a test SMTP server with the correct To, Reply-To and subject.
- API: validation errors, honeypot, time trap, cross-origin rejection, rate limiting (HTTP 429), GET rejected.
- Layouts at 390 px (iPhone 13), 820 px (tablet) and 1440 px (desktop), with no horizontal overflow.
- No browser console errors.
- Lighthouse (local production build): Accessibility 100, Best Practices 100, SEO 100. Performance 88 on desktop and about 65–70 under Lighthouse's simulated slow-phone throttling. The measured mobile LCP is 1.3 s, CLS is about 0.
=======
# startup
>>>>>>> 87d208ab87939b1f1f36ad0a7453465b622a69a6
