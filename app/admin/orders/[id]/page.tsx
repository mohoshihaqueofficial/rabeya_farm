import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-auth";
import { getOrder, orderTransitions } from "@/lib/orders";
import { Icon } from "../../components/icons";
import OrderActions from "./order-actions";

export const metadata: Metadata = { title: "অর্ডারের বিস্তারিত" };
export const dynamic = "force-dynamic";

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  await requireAdminPage();
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return <main className="admin-page"><div className="empty-state"><Icon name="search" size={28}/><b>অর্ডারটি পাওয়া যায়নি</b><p><Link href="/admin/orders">অর্ডার তালিকায় ফিরে যান</Link></p></div></main>;
  return <OrderActions order={order} nextStatuses={orderTransitions[order.status]}/>;
}
