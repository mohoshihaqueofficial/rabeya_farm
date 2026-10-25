import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import { listAdminUsers, minPasswordLength, toPublicUser } from "@/lib/admin-users";
import UsersManager from "./users-manager";

export const metadata: Metadata = { title: "ইউজার" };

// Owner-only: create and manage who can log in to the admin panel.
export default async function AdminUsersPage() {
  const me = await requireAdminPage(["owner"]);
  const users = (await listAdminUsers()).map(toPublicUser);
  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> ইউজার</p><h1>অ্যাডমিন ইউজার</h1><p>কারা অ্যাডমিন প্যানেলে লগইন করতে পারবেন তা নিয়ন্ত্রণ করুন।</p></div></div>
    <UsersManager users={users} meId={me.id} minPasswordLength={minPasswordLength}/>
  </main>;
}
