"use client";

import { useState, type FormEvent } from "react";

type AuthMode = "login" | "signup";
type AuthStage = "details" | "otp" | "success";

export default function MobileAuthForm({ initialMode }: { initialMode: AuthMode }) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [stage, setStage] = useState<AuthStage>("details");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [provider, setProvider] = useState<"mobile" | "google">("mobile");

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setStage("details");
    setProvider("mobile");
  }

  function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProvider("mobile");
    setStage("otp");
  }

  if (stage === "success") return <div className="auth-success" role="status"><span>✓</span><h2>{mode === "signup" ? "Account তৈরির demo সম্পন্ন" : "Login demo সম্পন্ন"}</h2><p>{provider === "google" ? "Google account দিয়ে Sign Up" : `${mobile} নম্বরটি OTP দিয়ে যাচাই`} করার interface প্রস্তুত হয়েছে।</p><small>প্রকৃত account/session তৈরি করতে authentication backend সংযোগ প্রয়োজন।</small><button type="button" onClick={() => setStage("details")}>ঠিক আছে</button></div>;

  if (stage === "otp") return <form className="mobile-auth-form otp-form" onSubmit={event => { event.preventDefault(); setStage("success"); }}>
    <div className="otp-icon">•••</div><h2>OTP যাচাই করুন</h2><p><strong>{mobile}</strong> নম্বরে পাঠানো ৬ সংখ্যার OTP লিখুন।</p>
    <label>OTP কোড<input required name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" placeholder="••••••" pattern="[0-9]{6}" maxLength={6}/></label>
    <button type="submit">{mode === "signup" ? "Account তৈরি করুন" : "লগইন করুন"}</button>
    <button className="auth-text-button" type="button" onClick={() => setStage("details")}>← মোবাইল নম্বর পরিবর্তন করুন</button>
  </form>;

  return <>
    <div className="auth-tabs" role="tablist" aria-label="Account option"><button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")}>লগইন</button><button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => changeMode("signup")}>সাইন আপ</button></div>
    <form className="mobile-auth-form" onSubmit={requestOtp}>
      {mode === "signup" && <label>আপনার নাম<input required name="name" type="text" autoComplete="name" placeholder="পূর্ণ নাম লিখুন" value={name} onChange={event => setName(event.target.value)}/></label>}
      <label>মোবাইল নম্বর<input required name="mobile" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" pattern="01[3-9][0-9]{8}" value={mobile} onChange={event => setMobile(event.target.value)}/></label>
      <button type="submit">OTP পাঠান</button>
    </form>
    <div className="auth-divider"><span>অথবা</span></div>
    <button className="google-auth-button" type="button" onClick={() => { setProvider("google"); setMode("signup"); setStage("success"); }}><span>G</span> Google দিয়ে {mode === "signup" ? "সাইন আপ" : "চালিয়ে যান"}</button>
    <p className="auth-helper">Password বা email form পূরণ করতে হবে না। মোবাইল OTP অথবা Google account ব্যবহার করুন।</p>
  </>;
}
