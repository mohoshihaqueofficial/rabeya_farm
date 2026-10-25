import type { Metadata } from "next";
import AdminShell from "./components/admin-shell";
import { requireAdminPage } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import "./admin.css";

export const metadata: Metadata = { title: { default: "অ্যাডমিন ড্যাশবোর্ড", template: "%s | রাবেয়া ফার্ম" }, robots: { index: false, follow: false } };

// Server-side check in addition to proxy.ts: valid signature AND the user still exists and is active.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdminPage();
  const pendingOrders = (await listOrders()).filter(order => order.status === "pending").length;
  return <AdminShell admin={{ name: admin.name, username: admin.username, role: admin.role }} pendingOrders={pendingOrders}>{children}</AdminShell>;
}
