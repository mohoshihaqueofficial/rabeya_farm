"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { bnNumber } from "@/data/cattle";
import { markCowBooked, useIsCowBooked } from "../../booked-cows";
import { submitOrder } from "../../order-actions";

export default function PaymentForm({ amount, cowId, paymentType = "partial", unavailable = false }: { amount: number; cowId: string; paymentType?: "partial" | "full"; unavailable?: boolean }) {
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const bookedHere = useIsCowBooked(cowId);
  const isFullPayment = paymentType === "full";
  const paymentLabel = isFullPayment ? "পূর্ণ পেমেন্ট" : "আংশিক বুকিং";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const receipt = form.elements.namedItem("receipt") as HTMLInputElement;
    const file = receipt.files?.[0];

    // `required` accepts text made only of spaces; reject it here.
    const blank = ["customerName", "customerAddress", "deliveryAddress", "transactionId"].find(name => !String(new FormData(form).get(name) ?? "").trim());
    if (blank) {
      const field = form.elements.namedItem(blank) as HTMLInputElement;
      field.setCustomValidity("এই ঘরটি পূরণ করুন");
      field.reportValidity();
      field.addEventListener("input", () => field.setCustomValidity(""), { once: true });
      setSubmitted(false);
      return;
    }
    if (!file && !isFullPayment) {
      setFileError("পেমেন্টের রসিদ বা স্ক্রিনশট আপলোড করুন।");
      setSubmitted(false);
      return;
    }
    // `accept` only filters the file picker; check the real type too.
    if (file && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFileError("শুধু JPG, PNG বা WebP ছবি আপলোড করুন।");
      setSubmitted(false);
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setFileError("ফাইলের সাইজ ৫ MB-এর কম হতে হবে।");
      setSubmitted(false);
      return;
    }

    setFileError("");
    setFormError("");
    setSending(true);
    const result = await submitOrder(new FormData(form)).catch(() => null);
    setSending(false);
    if (!result || !result.ok) {
      const message = result?.message ?? "অর্ডার জমা দেওয়া যায়নি। আবার চেষ্টা করুন অথবা ফোন করুন।";
      if (result?.field === "receipt") setFileError(message); else setFormError(message);
      const field = result?.field ? form.elements.namedItem(result.field) : null;
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setOrderId(result.orderId);
    setCopied(false);
    setSubmitted(true);
    markCowBooked(cowId);
  }

  async function copyOrderId() {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  }

  // Once a payment is in, the cow can't be booked again. The page refreshes after a successful order
  // (the cow becomes "booked"), so the success modal must win over `unavailable` until it is closed.
  if (!submitted && (unavailable || bookedHere)) return <div className="payment-closed" role="status">
    <span aria-hidden="true">!</span>
    <h2>এই গরুটি আর বুকিংয়ের জন্য উপলব্ধ নয়</h2>
    <p><strong>{cowId}</strong> গরুটির পেমেন্ট ইতোমধ্যে সম্পন্ন হয়েছে। অন্য একটি গরু বেছে নিন।</p>
    <Link href="/korbani-goru">সব গরু দেখুন →</Link>
  </div>;

  return <form className="payment-form" onSubmit={handleSubmit}>
    <input type="hidden" name="cowId" value={cowId}/>
    <input type="hidden" name="paymentType" value={paymentType}/>
    <input type="hidden" name="checkoutMode" value="guest"/>
    {submitted && <div className="payment-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSubmitted(false); }}>
      <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-success-title">
        <button className="payment-modal-close" type="button" aria-label="পপআপ বন্ধ করুন" onClick={() => setSubmitted(false)}>×</button>
        <span className="payment-modal-icon" aria-hidden="true">✓</span>
        <h2 id="payment-success-title">অর্ডার সফলভাবে জমা হয়েছে</h2>
        <p><strong>{cowId}</strong> গরুর {paymentLabel} তথ্য আমরা পেয়েছি। পেমেন্ট যাচাই করে আমাদের টিম শীঘ্রই আপনাকে ফোন করবে।</p>
        <div className="payment-order-id"><span>আপনার Order ID</span><strong>{orderId}</strong><button type="button" onClick={copyOrderId}>{copied ? "কপি হয়েছে ✓" : "Order ID কপি করুন"}</button></div>
        <small>Order ID সংরক্ষণ করে রাখুন—যোগাযোগের সময় এটি লাগবে।</small>
        <button className="payment-modal-action" type="button" onClick={() => setSubmitted(false)}>ঠিক আছে</button>
      </section>
    </div>}
    <div className="guest-checkout-note"><span aria-hidden="true">✓</span><div><strong>Guest Checkout</strong><small>লগইন ছাড়াই প্রয়োজনীয় তথ্য দিয়ে checkout সম্পন্ন করুন।</small></div></div>
    <div className="payment-alert"><span aria-hidden="true">!</span><p>{isFullPayment ? "অর্ডারের সম্পূর্ণ মূল্য পরিশোধ করতে" : "আংশিক বুকিং নিশ্চিত করতে"} <strong>৳ {bnNumber(amount)}</strong> টাকা পাঠান এবং নিচের তথ্য দিন।</p></div>

    <fieldset className="payment-step">
      <legend><span>১</span> গ্রাহকের তথ্য</legend>
      <label>গ্রাহকের নাম <em>*</em><input required name="customerName" type="text" placeholder="আপনার নাম লিখুন" autoComplete="name"/></label>
      <label>গ্রাহকের ঠিকানা <em>*</em><textarea required name="customerAddress" placeholder="আপনার পূর্ণ ঠিকানা লিখুন" rows={3} autoComplete="street-address" value={customerAddress} onChange={event => { const address = event.target.value; setCustomerAddress(address); if (sameAddress) setDeliveryAddress(address); }}/></label>
      <label>মোবাইল নম্বর <em>*</em><input required name="customerPhone" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" pattern="(01|০১)[3-9৩-৯][0-9০-৯]{8}" title="১১ সংখ্যার মোবাইল নম্বর, যেমন 01712345678" autoComplete="tel" value={customerPhone} onChange={event => setCustomerPhone(event.target.value)}/></label>
    </fieldset>

    <fieldset className="payment-step">
      <legend><span>২</span> গরু ডেলিভারি দেওয়ার ঠিকানা</legend>
      <label className="same-address-control"><input type="checkbox" checked={sameAddress} onChange={event => { const checked = event.target.checked; setSameAddress(checked); if (checked) setDeliveryAddress(customerAddress); }}/> গ্রাহকের ঠিকানাই ডেলিভারি ঠিকানা</label>
      <label>ডেলিভারি ঠিকানা <em>*</em><textarea required name="deliveryAddress" placeholder="গরু ডেলিভারি দেওয়ার সম্পূর্ণ ঠিকানা লিখুন" rows={3} value={deliveryAddress} readOnly={sameAddress} onChange={event => setDeliveryAddress(event.target.value)}/></label>
      <label>মোবাইল নম্বর <em>*</em><input required name="deliveryPhone" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" pattern="(01|০১)[3-9৩-৯][0-9০-৯]{8}" title="১১ সংখ্যার মোবাইল নম্বর, যেমন 01712345678"/></label>
    </fieldset>

    <fieldset className="payment-step payment-details-step">
      <legend><span>৩</span> পেমেন্টের তথ্য</legend>
      <div className="payment-fields-grid">
        <label>ব্যাংকের নাম <em>*</em><select required name="bank" defaultValue=""><option value="" disabled>ব্যাংক নির্বাচন করুন</option><option>সোনালী ব্যাংক</option><option>ডাচ্-বাংলা ব্যাংক</option><option>ইসলামী ব্যাংক</option><option>ব্র্যাক ব্যাংক</option><option>অন্যান্য</option></select></label>
        <label>ট্রানজেকশন আইডি / রেফারেন্স নম্বর <em>*</em><input required name="transactionId" type="text" placeholder="যেমন: 9F8A3K7L2M"/></label>
        <label>পাঠানো টাকা (৳) <em>*</em><input name="amount" type="text" value={bnNumber(amount)} readOnly aria-readonly="true"/></label>
      </div>
      <label className="receipt-field">পেমেন্টের রসিদ {isFullPayment ? "(ঐচ্ছিক)" : "(আবশ্যক)"} {!isFullPayment && <em>*</em>}<input required={!isFullPayment} name="receipt" type="file" accept="image/jpeg,image/png,image/webp" onChange={() => setFileError("")}/><small>JPG, PNG বা WEBP ফাইল (সর্বোচ্চ ৫MB)</small></label>
      {fileError && <p className="file-error" role="alert">{fileError}</p>}
      <label className="payment-consent"><input required name="consent" type="checkbox"/> আমি নিশ্চিত যে, আমি উপরে দেওয়া তথ্য সঠিকভাবে প্রদান করেছি।</label>
      {formError && <p className="file-error" role="alert">{formError}</p>}
      <button className="payment-submit" type="submit" disabled={submitted || sending}>{sending ? "জমা দেওয়া হচ্ছে…" : isFullPayment ? "পেমেন্ট সম্পন্ন করুন" : "পেমেন্টের তথ্য জমা দিন"}</button>
    </fieldset>
  </form>;
}
