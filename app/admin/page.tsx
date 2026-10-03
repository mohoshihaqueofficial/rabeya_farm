import Image from "next/image";
import Link from "next/link";
import { adminCattle, cowStatusLabels } from "@/data/admin-cattle";
import { bnNumber } from "@/data/cattle";
import { Icon } from "./components/icons";

const weekly = [42, 58, 48, 74, 61, 86, 67];

export default function AdminDashboard() {
  const available = adminCattle.filter(c => c.status === "available").length;
  return <main className="admin-page">
    <div className="admin-page-heading"><div><p className="admin-eyebrow"><span/> শুক্রবার, ২ অক্টোবর ২০২৬</p><h1>শুভ সকাল, রাবেয়া 👋</h1><p>আজকের খামার ও বিক্রয়ের সর্বশেষ অবস্থা এক নজরে দেখুন।</p></div><Link href="/admin/cows/new" className="admin-primary"><Icon name="plus"/> নতুন গরু যোগ করুন</Link></div>

    <section className="stat-grid" aria-label="আজকের সারাংশ">
      <article><span className="stat-icon green"><Icon name="cow"/></span><div><p>মোট গরু</p><strong>{bnNumber(adminCattle.length)}</strong><small className="positive">↑ ২টি এই মাসে</small></div><Icon name="more"/></article>
      <article><span className="stat-icon amber"><Icon name="check"/></span><div><p>বিক্রয়ের জন্য প্রস্তুত</p><strong>{bnNumber(available)}</strong><small>মোট স্টকের {bnNumber(Math.round(available / adminCattle.length * 100))}%</small></div><Icon name="more"/></article>
      <article><span className="stat-icon blue"><Icon name="cart"/></span><div><p>চলমান অর্ডার</p><strong>৮</strong><small className="positive">↑ ১২% গত সপ্তাহ থেকে</small></div><Icon name="more"/></article>
      <article><span className="stat-icon purple"><Icon name="money"/></span><div><p>এই মাসের বিক্রয়</p><strong>৳ ৮.৪২ লাখ</strong><small className="positive">↑ ১৮.২% গত মাস থেকে</small></div><Icon name="more"/></article>
    </section>

    <div className="dashboard-split">
      <section className="admin-card sales-chart-card"><div className="card-heading"><div><h2>বিক্রয়ের সারাংশ</h2><p>গত ৭ দিনের আয়</p></div><button><Icon name="calendar" size={16}/> এই সপ্তাহ <Icon name="chevron" size={13}/></button></div><div className="chart-total"><strong>৳ ২,৮৬,০০০</strong><span>+১৪.৫%</span></div><div className="bar-chart">{weekly.map((height, i) => <div key={i}><span style={{ height: `${height}%` }} className={i === 5 ? "active" : ""}/><small>{["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র"][i]}</small></div>)}</div></section>
      <section className="admin-card stock-card"><div className="card-heading"><div><h2>স্টক অবস্থা</h2><p>বর্তমান inventory</p></div><Link href="/admin/cows">সব দেখুন <Icon name="arrow" size={14}/></Link></div><div className="stock-ring"><div><strong>{adminCattle.length}</strong><span>মোট গরু</span></div></div><div className="stock-legend"><span><i className="available"/>প্রস্তুত <b>{available}</b></span><span><i className="reserved"/>রিজার্ভড <b>{adminCattle.filter(c=>c.status === "reserved").length}</b></span><span><i className="sold"/>বিক্রি <b>{adminCattle.filter(c=>c.status === "sold").length}</b></span><span><i className="draft"/>ড্রাফট <b>{adminCattle.filter(c=>c.status === "draft").length}</b></span></div></section>
    </div>

    <section className="admin-card recent-cattle"><div className="card-heading"><div><h2>সাম্প্রতিক গরু</h2><p>সর্বশেষ যোগ করা ও আপডেট করা তথ্য</p></div><Link href="/admin/cows">সব গরু দেখুন <Icon name="arrow" size={14}/></Link></div><div className="admin-table-wrap"><table><thead><tr><th>গরু</th><th>ওজন</th><th>মূল্য</th><th>অবস্থা</th><th>যোগ করা হয়েছে</th><th/></tr></thead><tbody>{adminCattle.slice(0, 5).map(cow => <tr key={cow.id}><td><Link href={`/admin/cows/${cow.id}`} className="cow-table-id"><span><Image src={cow.image} alt="" fill sizes="48px" style={{objectPosition:cow.position}}/></span><div><b>{cow.name}</b><small>{cow.id} · {cow.breed}</small></div></Link></td><td>{bnNumber(cow.weight)} কেজি</td><td><b>৳ {bnNumber(cow.price)}</b></td><td><span className={`status-pill ${cow.status}`}><i/>{cowStatusLabels[cow.status]}</span></td><td>{cow.addedAt}</td><td><Link className="table-action" href={`/admin/cows/${cow.id}`} aria-label={`${cow.id} খুলুন`}><Icon name="arrow" size={16}/></Link></td></tr>)}</tbody></table></div></section>
  </main>;
}

