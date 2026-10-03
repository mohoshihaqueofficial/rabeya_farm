import type { Metadata } from "next";
import AdminShell from "./components/admin-shell";
import "./admin.css";

export const metadata: Metadata = { title: { default: "অ্যাডমিন ড্যাশবোর্ড", template: "%s | রাবেয়া ফার্ম" }, robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}

