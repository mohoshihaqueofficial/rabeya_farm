import type { Metadata } from "next";
import LoginForm from "./login-form";
import { safeAdminPath, sessionSecret } from "@/lib/admin-session";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import "../admin/admin.css";

export const metadata: Metadata = { title: "অ্যাডমিন লগইন | রাবেয়া ফার্ম", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin-login">) {
  const { next, reason } = await searchParams;
  if (await getCurrentAdmin()) redirect(safeAdminPath(next));
  return <main className="admin-app admin-login-page">
    <section className="admin-card admin-login-card">
      <h1>অ্যাডমিন লগইন</h1>
      <p>রাবেয়া ফার্মের অ্যাডমিন প্যানেলে প্রবেশ করতে ইউজারনেম ও পাসওয়ার্ড দিন।</p>
      {reason === "idle" && <p className="admin-login-notice" role="status">৩০ মিনিট কোনো কাজ না হওয়ায় নিরাপত্তার জন্য আপনাকে লগআউট করা হয়েছে। আবার লগইন করুন।</p>}
      {sessionSecret()
        ? <LoginForm next={safeAdminPath(next)}/>
        : <p className="admin-login-error" role="alert">অ্যাডমিন লগইন এখনো চালু করা হয়নি। সার্ভারে <code>ADMIN_SESSION_SECRET</code>, <code>ADMIN_USERNAME</code> ও <code>ADMIN_PASSWORD</code> সেট করুন।</p>}
    </section>
  </main>;
}
