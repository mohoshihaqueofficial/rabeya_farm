import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import OrdersTable from "./orders-table";

export const metadata: Metadata = { title: "অর্ডার" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdminPage();
  const orders = (await listOrders()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> অর্ডার</p><h1>অর্ডার</h1><p>ক্রেতাদের বুকিং ও পেমেন্ট যাচাই করুন, ডেলিভারি পর্যন্ত অবস্থা হালনাগাদ রাখুন।</p></div></div>
    <OrdersTable orders={orders}/>
  </main>;
}
