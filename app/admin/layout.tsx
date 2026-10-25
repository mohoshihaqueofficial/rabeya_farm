import type { Metadata } from "next";
import AdminShell from "./components/admin-shell";
import { requireAdminPage } from "@/lib/admin-auth";
import "./admin.css";

export const metadata: Metadata = { title: { default: "অ্যাডমিন ড্যাশবোর্ড", template: "%s | রাবেয়া ফার্ম" }, robots: { index: false, follow: false } };

// Server-side check in addition to proxy.ts: valid signature AND the user still exists and is active.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  return <AdminShell admin={{ name: admin.name, username: admin.username, role: admin.role }}>{children}</AdminShell>;
}
