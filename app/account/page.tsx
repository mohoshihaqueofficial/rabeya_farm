import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import SiteFooter from "@/app/components/site-footer";
import MobileAuthForm from "./mobile-auth-form";
import "./account.css";

export const metadata: Metadata = { title: "লগইন / সাইন আপ | রাবেয়া ফার্ম", description: "শুধু মোবাইল নম্বর দিয়ে রাবেয়া ফার্মে লগইন বা সাইন আপ করুন।" };

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const { mode } = await searchParams;
  const initialMode = mode === "signup" ? "signup" : "login";
  return <main className="account-page"><SiteHeader active="account"/><div className="shell account-content"><div className="account-card"><span className="account-avatar" aria-hidden="true">♙</span><p className="account-kicker">স্বাগতম</p><h1>আপনার Account</h1><p className="account-copy">সহজে Login করুন অথবা নতুন Account তৈরি করুন। কোনো password লাগবে না।</p><MobileAuthForm initialMode={initialMode}/><Link className="account-back-link" href="/korbani-goru">← গরুর তালিকায় ফিরে যান</Link></div></div><SiteFooter/></main>;
}
