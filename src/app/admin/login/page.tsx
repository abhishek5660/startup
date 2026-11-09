import { redirect } from "next/navigation";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm configured={isAdminConfigured()} />;
}
