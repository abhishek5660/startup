import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { isDatabaseConfigured, listConsultations, listInquiries, type ConsultationRow, type InquiryRow } from "@/lib/db";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  let inquiries: InquiryRow[] = [];
  let calls: ConsultationRow[] = [];
  let error = "";
  if (!isDatabaseConfigured()) {
    error = "DATABASE_URL is not set, so there is nothing to show yet. Add it to .env.local and run npm run db:setup.";
  } else {
    try {
      [inquiries, calls] = await Promise.all([listInquiries(), listConsultations()]);
    } catch (err) {
      console.error("[admin] load failed:", err instanceof Error ? err.message : err);
      error = "Couldn't load data from the database. If you just updated the site, run npm run db:setup to add the new tables/columns.";
    }
  }
  return <AdminDashboard inquiries={inquiries} calls={calls} error={error} />;
}
