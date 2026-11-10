import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import SeoDashboard from "@/components/admin/SeoDashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "SEO Dashboard" };

export default async function SeoPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <SeoDashboard />;
}
