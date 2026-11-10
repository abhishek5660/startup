import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { auditPage, isGscConfigured, pageSpeed, searchAnalytics } from "@/lib/seo";
import { site } from "@/lib/site";
import sitemap from "@/app/sitemap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // PageSpeed test me 20–40 second lag sakte hain

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return fail("Session expire ho gaya. Dobara login karein.", 401);

  const type = req.nextUrl.searchParams.get("type");
  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days")) || 28, 7), 90);

  try {
    if (type === "gsc") {
      if (!isGscConfigured()) return fail("Search Console abhi connect nahi hai. .env.local me GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY aur GSC_SITE_URL daalein.", 503);
      const [daily, queries, pages] = await Promise.all([
        searchAnalytics("date", days),
        searchAnalytics("query", days),
        searchAnalytics("page", days),
      ]);
      return NextResponse.json({ ok: true, daily, queries, pages });
    }

    if (type === "audit") {
      const urls = (await sitemap()).map((e) => e.url);
      const results = await Promise.all(urls.map(auditPage));
      return NextResponse.json({ ok: true, results });
    }

    if (type === "speed") {
      if (/localhost|127\.0\.0\.1/.test(site.url)) return fail("PageSpeed sirf live website pe chalta hai. NEXT_PUBLIC_SITE_URL me apna live domain daalein.", 400);
      const [mobile, desktop] = await Promise.all([pageSpeed(`${site.url}/`, "mobile"), pageSpeed(`${site.url}/`, "desktop")]);
      return NextResponse.json({ ok: true, results: [mobile, desktop] });
    }

    return fail("Unknown type.", 400);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[admin/seo]", msg);
    return fail(msg, 502);
  }
}
