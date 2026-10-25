"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { bnNumber } from "@/data/cattle";
import type { Order, OrderStatus } from "@/lib/orders";
import { Icon } from "../../components/icons";
import AdminToast from "../../components/admin-toast";
import { useToast } from "../../components/use-admin-blogs";
import { formatDate, statusLabels, typeLabels } from "../orders-table";
import { changeOrderStatus, saveOrderNote } from "../actions";

const actionLabels: Record<OrderStatus, string> = { verified: "✓ পেমেন্ট নিশ্চিত করুন", delivered: "ডেলিভারি সম্পন্ন", rejected: "পেমেন্ট ভুল — বাতিল", cancelled: "অর্ডার বাতিল", pending: "আবার যাচাইয়ে পাঠান" };
const actionStyle: Record<OrderStatus, string> = { verified: "admin-primary", delivered: "admin-primary", pending: "admin-secondary", rejected: "admin-secondary danger-button", cancelled: "admin-secondary danger-button" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="order-row"><dt>{label}</dt><dd>{children}</dd></div>;
}

export default function OrderActions({ order, nextStatuses }: { order: Order; nextStatuses: OrderStatus[] }) {
  const router = useRouter();
  const { toast, notify, close } = useToast();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState("");
  const [adminNote, setAdminNote] = useState(order.adminNote);

  function run(task: () => Promise<{ ok: boolean; message: string }>, after?: () => void) {
    startTransition(async () => {
      try {
        const result = await task();
        notify(result.message, result.ok ? "success" : "error");
        if (result.ok) { after?.(); router.refresh(); }
      } catch { notify("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।", "error"); }
    });
  }
  function changeStatus(status: OrderStatus) {
    if ((status === "rejected" || status === "cancelled") && !window.confirm(`অর্ডারটি "${statusLabels[status]}" করবেন?`)) return;
    run(() => changeOrderStatus(order.id, status, note), () => setNote(""));
  }

  return <main className="admin-page">
    <div className="editor-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span><Link href="/admin/orders">অর্ডার</Link><span>/</span>{order.id}</p><div className="editor-title-row"><h1>{order.id}</h1><span className={`status-pill order-${order.status}`}><i/>{statusLabels[order.status]}</span></div><p>{formatDate(order.createdAt)} · {typeLabels[order.paymentType]}</p></div><div className="editor-actions"><Link href={`/korbani-goru/${order.cowId}`} target="_blank" className="admin-secondary"><Icon name="eye"/> গরুর পেজ</Link></div></div>

    <div className="order-layout">
      <div className="order-main">
        <section className="admin-card order-card"><h2>১. গ্রাহকের তথ্য</h2><dl>
          <Row label="নাম">{order.customerName}</Row>
          <Row label="মোবাইল"><a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a></Row>
          <Row label="ঠিকানা">{order.customerAddress}</Row>
        </dl></section>
        <section className="admin-card order-card"><h2>২. ডেলিভারির তথ্য</h2><dl>
          <Row label="ঠিকানা">{order.deliveryAddress}</Row>
          <Row label="মোবাইল"><a href={`tel:${order.deliveryPhone}`}>{order.deliveryPhone}</a></Row>
        </dl></section>
        <section className="admin-card order-card"><h2>৩. পেমেন্টের তথ্য</h2><dl>
          <Row label="গরু"><Link href={`/admin/cows/${order.cowId}`}>{order.cowId}</Link> · {order.cowName}</Row>
          <Row label="ধরন">{typeLabels[order.paymentType]}</Row>
          <Row label="টাকা"><b>৳ {bnNumber(order.amount)}</b></Row>
          <Row label="ব্যাংক">{order.bank}</Row>
          <Row label="ট্রানজেকশন আইডি"><code>{order.transactionId}</code></Row>
          <Row label="রসিদ">{order.receipt ? <a href={`/admin/orders/${order.id}/receipt`} target="_blank" rel="noopener noreferrer">বড় করে দেখুন ↗</a> : "দেওয়া হয়নি"}</Row>
        </dl>
          {order.receipt && <a className="order-receipt" href={`/admin/orders/${order.id}/receipt`} target="_blank" rel="noopener noreferrer"><Image src={`/admin/orders/${order.id}/receipt`} alt={`${order.id}-এর পেমেন্টের রসিদ`} fill unoptimized sizes="420px"/></a>}
        </section>
      </div>

      <aside className="order-side">
        <section className="admin-card order-card"><h2>অবস্থা পরিবর্তন</h2>
          {nextStatuses.length ? <>
            <label className="form-field"><span>নোট {nextStatuses.some(s => s === "rejected" || s === "cancelled") && <small>(বাতিলের ক্ষেত্রে আবশ্যক)</small>}</span><textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="যেমন: ব্যাংক স্টেটমেন্টে টাকা পাওয়া গেছে"/></label>
            <div className="order-status-buttons">{nextStatuses.map(status => <button key={status} type="button" className={order.status === "delivered" ? "admin-secondary" : actionStyle[status]} disabled={pending} onClick={() => changeStatus(status)}>{order.status === "delivered" && status === "verified" ? "ডেলিভারি বাতিল করুন" : actionLabels[status]}</button>)}</div>
          </> : <p className="order-final">এই অর্ডারটি সম্পন্ন — আর পরিবর্তন করা যাবে না।</p>}
          <p className="order-hint">টাকা ব্যাংকে এসেছে কি না যাচাই করে তবেই নিশ্চিত করুন।</p>
        </section>
        <section className="admin-card order-card"><h2>টিমের নোট</h2><p className="order-hint">শুধু অ্যাডমিনরা দেখবেন।</p>
          <textarea className="order-note" rows={4} value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="যেমন: শুক্রবার সকালে ডেলিভারি"/>
          <button type="button" className="admin-secondary" disabled={pending || adminNote === order.adminNote} onClick={() => run(() => saveOrderNote(order.id, adminNote))}><Icon name="save"/> নোট সংরক্ষণ</button>
        </section>
        <section className="admin-card order-card"><h2>ইতিহাস</h2><ol className="order-history">{[...order.history].reverse().map((event, index) => <li key={index}><b>{statusLabels[event.status]}</b><small>{formatDate(event.at)} · {event.by === "customer" ? "ক্রেতা" : `@${event.by}`}</small>{event.note && <p>{event.note}</p>}</li>)}</ol></section>
      </aside>
    </div>
    <AdminToast toast={toast} onClose={close}/>
  </main>;
}
