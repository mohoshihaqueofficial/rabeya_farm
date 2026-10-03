"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { adminCattle, cowStatusLabels, type CowStatus } from "@/data/admin-cattle";
import { bnNumber } from "@/data/cattle";
import { Icon } from "../components/icons";

export default function CattleManagementPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | CowStatus>("all");
  const rows = useMemo(() => adminCattle.filter(cow => (status === "all" || cow.status === status) && `${cow.id} ${cow.name} ${cow.breed}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim())), [query, status]);
  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-breadcrumb"><Link href="/admin">ড্যাশবোর্ড</Link><span>/</span> গরুর তালিকা</p><h1>গরুর তালিকা</h1><p>খামারের সব গরুর তথ্য, অবস্থা এবং মূল্য পরিচালনা করুন।</p></div><Link href="/admin/cows/new" className="admin-primary"><Icon name="plus"/> নতুন গরু যোগ করুন</Link></div>
    <section className="admin-card cattle-manager">
      <div className="manager-toolbar"><label><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="আইডি, নাম বা জাত দিয়ে খুঁজুন"/></label><div className="filter-tabs">{(["all","available","reserved","sold","draft"] as const).map(item => <button key={item} className={status === item ? "active" : ""} onClick={()=>setStatus(item)}>{item === "all" ? "সব" : cowStatusLabels[item]}{item === "all" && <span>{adminCattle.length}</span>}</button>)}</div></div>
      <div className="admin-table-wrap"><table><thead><tr><th>গরু</th><th>জাত ও অবস্থান</th><th>ওজন</th><th>বিক্রয় মূল্য</th><th>অবস্থা</th><th>ইনকোয়ারি</th><th/></tr></thead><tbody>{rows.map(cow => <tr key={cow.id}><td><Link href={`/admin/cows/${cow.id}`} className="cow-table-id"><span><Image src={cow.image} alt="" fill sizes="52px" style={{objectPosition:cow.position}}/></span><div><b>{cow.name}</b><small>{cow.id}</small></div></Link></td><td><b>{cow.breed}</b><small className="table-subtext">{cow.shed}</small></td><td>{bnNumber(cow.weight)} কেজি</td><td><b>৳ {bnNumber(cow.price)}</b></td><td><span className={`status-pill ${cow.status}`}><i/>{cowStatusLabels[cow.status]}</span></td><td>{bnNumber(cow.inquiries)} জন</td><td><Link className="table-action" href={`/admin/cows/${cow.id}`} aria-label={`${cow.id} সম্পাদনা করুন`}><Icon name="edit" size={16}/></Link></td></tr>)}</tbody></table>{rows.length === 0 && <div className="empty-state"><Icon name="search" size={28}/><b>কোনো গরু পাওয়া যায়নি</b><p>অন্য শব্দ বা filter দিয়ে চেষ্টা করুন।</p></div>}</div>
      <footer className="table-footer"><span>{rows.length}টির মধ্যে {rows.length}টি দেখানো হচ্ছে</span><div><button disabled>‹</button><button className="active">১</button><button>২</button><button>৩</button><button>›</button></div></footer>
    </section>
  </main>;
}

