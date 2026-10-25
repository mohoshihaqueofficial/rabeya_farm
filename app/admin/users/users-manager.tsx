"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { PublicAdminUser } from "@/lib/admin-users";
import { Icon } from "../components/icons";
import AdminToast from "../components/admin-toast";
import { useToast } from "../components/use-admin-blogs";
import { createAdminUser, deleteAdminUser, resetAdminPassword, setAdminUserActive, type UserActionResult } from "./actions";

const roleLabels = { owner: "Owner · সব কাজ + ইউজার", editor: "Editor · কনটেন্ট সম্পাদনা" } as const;

export default function UsersManager({ users, meId, minPasswordLength }: { users: PublicAdminUser[]; meId: string; minPasswordLength: number }) {
  const router = useRouter();
  const { toast, notify, close } = useToast();
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  function run(task: () => Promise<UserActionResult>, onSuccess?: () => void) {
    startTransition(async () => {
      try {
        const result = await task();
        notify(result.message, result.ok ? "success" : "error");
        if (result.ok) { onSuccess?.(); router.refresh(); }
      } catch { notify("কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।", "error"); }
    });
  }

  function resetPassword(user: PublicAdminUser) {
    const password = window.prompt(`"${user.username}"-এর নতুন পাসওয়ার্ড (কমপক্ষে ${minPasswordLength} অক্ষর):`);
    if (password === null) return;
    run(() => resetAdminPassword(user.id, password));
  }

  return <div className="partner-admin-layout">
    <section className="admin-card partner-upload-card"><div className="section-title"><div><h2>নতুন ইউজার তৈরি করুন</h2><p>ইউজারনেম ও পাসওয়ার্ড ব্যবহারকারীকে নিরাপদভাবে জানিয়ে দিন।</p></div><span><Icon name="users"/></span></div>
      <form ref={form} className="partner-form" action={formData => run(() => createAdminUser(formData), () => form.current?.reset())}>
        <label className="partner-input">নাম<input name="name" required placeholder="যেমন: করিম উদ্দিন"/></label>
        <label className="partner-input">ইউজারনেম<input name="username" required autoComplete="off" autoCapitalize="none" spellCheck={false} pattern="[a-z0-9_.]{3,30}" title="৩–৩০ অক্ষর: ছোট হাতের ইংরেজি অক্ষর, সংখ্যা, _ বা ." placeholder="যেমন: karim"/></label>
        <label className="partner-input">পাসওয়ার্ড<div className="password-field"><input name="password" type={showPassword ? "text" : "password"} required minLength={minPasswordLength} autoComplete="new-password" placeholder={`কমপক্ষে ${minPasswordLength} অক্ষর`}/><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "লুকান" : "দেখান"}</button></div></label>
        <label className="partner-input">ভূমিকা<select name="role" required defaultValue=""><option value="" disabled>নির্বাচন করুন</option><option value="editor">{roleLabels.editor}</option><option value="owner">{roleLabels.owner}</option></select></label>
        <button className="admin-primary" type="submit" disabled={pending}><Icon name="save"/> {pending ? "সংরক্ষণ হচ্ছে…" : "ইউজার তৈরি করুন"}</button>
      </form>
    </section>
    <section className="admin-card partner-records"><div className="section-title"><div><h2>সব ইউজার</h2><p>{users.length} জন · বন্ধ করা ইউজার লগইন করতে পারবেন না</p></div></div>
      <div className="faq-admin-list">{users.map(user => <article key={user.id} className={user.active ? "" : "is-hidden"}>
        <div className="faq-admin-copy"><h3>{user.name} {user.id === meId && <em className="featured-badge">আপনি</em>}</h3><p>@{user.username} · {roleLabels[user.role]}</p></div>
        <div className="collection-actions">
          <label className="publish-switch" title={user.id === meId ? "নিজের অ্যাকাউন্ট বন্ধ করা যাবে না" : undefined}><input type="checkbox" checked={user.active} disabled={pending || user.id === meId} onChange={event => run(() => setAdminUserActive(user.id, event.target.checked))}/><span/><b>{user.active ? "সক্রিয়" : "বন্ধ"}</b></label>
          <button type="button" className="admin-secondary user-reset" disabled={pending} onClick={() => resetPassword(user)}>পাসওয়ার্ড বদলান</button>
          {user.id !== meId && <button type="button" className="collection-delete" disabled={pending} aria-label={`${user.username} মুছে ফেলুন`} onClick={() => { if (window.confirm(`"${user.username}" মুছে ফেলবেন?`)) run(() => deleteAdminUser(user.id)); }}>×</button>}
        </div>
      </article>)}</div>
    </section>
    <AdminToast toast={toast} onClose={close}/>
  </div>;
}
