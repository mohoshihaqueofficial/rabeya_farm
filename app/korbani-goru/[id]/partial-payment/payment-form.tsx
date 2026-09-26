"use client";

import { useState, type FormEvent } from "react";
import { bnNumber } from "@/data/cattle";

export default function PaymentForm({ amount, cowId, paymentType = "partial" }: { amount: number; cowId: string; paymentType?: "partial" | "full" }) {
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const [customerAddress, setCustomerAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const isFullPayment = paymentType === "full";
  const paymentLabel = isFullPayment ? "পূর্ণ পেমেন্ট" : "আংশিক বুকিং";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const receipt = form.elements.namedItem("receipt") as HTMLInputElement;
    const file = receipt.files?.[0];

    if (!file && !isFullPayment) {
      setFileError("পেমেন্টের রসিদ বা স্ক্রিনশট আপলোড করুন।");
      setSubmitted(false);
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setFileError("ফাইলের সাইজ ৫ MB-এর কম হতে হবে।");
      setSubmitted(false);
      return;
    }

    setFileError("");
    const datePart = new Date().toISOString().slice(2, 10).replaceAll("-", "");
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    setOrderId(`RF-${isFullPayment ? "F" : "P"}-${datePart}-${randomPart}`);
    setCopied(false);
    setSubmitted(true);
  }

  async function copyOrderId() {
    await navigator.clipboard.writeText(orderId);
    setCopied(true);
  }

  return <form className="payment-form" onSubmit={handleSubmit}>
    <input type="hidden" name="cowId" value={cowId}/>
    <input type="hidden" name="paymentType" value={paymentType}/>
    <input type="hidden" name="checkoutMode" value="guest"/>
    {submitted && <div className="payment-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSubmitted(false); }}>
      <section className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-success-title">
        <button className="payment-modal-close" type="button" aria-label="পপআপ বন্ধ করুন" onClick={() => setSubmitted(false)}>×</button>
        <span className="payment-modal-icon" aria-hidden="true">✓</span>
        <h2 id="payment-success-title">অর্ডার সফলভাবে জমা হয়েছে</h2>
        <p><strong>{cowId}</strong> গরুর {paymentLabel} তথ্য গ্রহণের ডেমো সম্পন্ন হয়েছে।</p>
        <div className="payment-order-id"><span>আপনার Order ID</span><strong>{orderId}</strong><button type="button" onClick={copyOrderId}>{copied ? "কপি হয়েছে ✓" : "Order ID কপি করুন"}</button></div>
        <small>এটি একটি demo submission—কোনো টাকা কাটা বা তথ্য সংরক্ষণ করা হয়নি।</small>
        <button className="payment-modal-action" type="button" onClick={() => setSubmitted(false)}>ঠিক আছে</button>
      </section>
    </div>}
    <div className="guest-checkout-note"><span aria-hidden="true">✓</span><div><strong>Guest Checkout</strong><small>লগইন ছাড়াই প্রয়োজনীয় তথ্য দিয়ে checkout সম্পন্ন করুন।</small></div></div>
    <div className="payment-alert"><span aria-hidden="true">!</span><p>{isFullPayment ? "অর্ডারের সম্পূর্ণ মূল্য পরিশোধ করতে" : "আংশিক বুকিং নিশ্চিত করতে"} <strong>৳ {bnNumber(amount)}</strong> টাকা পাঠান এবং নিচের তথ্য দিন।</p></div>

    <fieldset className="payment-step">
      <legend><span>১</span> গ্রাহকের তথ্য</legend>
      <label>গ্রাহকের নাম <em>*</em><input required name="customerName" type="text" placeholder="আপনার নাম লিখুন" autoComplete="name"/></label>
      <label>গ্রাহকের ঠিকানা <em>*</em><textarea required name="customerAddress" placeholder="আপনার পূর্ণ ঠিকানা লিখুন" rows={3} autoComplete="street-address" value={customerAddress} onChange={event => { const address = event.target.value; setCustomerAddress(address); if (sameAddress) setDeliveryAddress(address); }}/></label>
      <label>মোবাইল নম্বর <em>*</em><input required name="customerPhone" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" pattern="01[3-9][0-9]{8}" autoComplete="tel" value={customerPhone} onChange={event => setCustomerPhone(event.target.value)}/></label>
    </fieldset>

    <fieldset className="payment-step">
      <legend><span>২</span> গরু ডেলিভারি দেওয়ার ঠিকানা</legend>
      <label className="same-address-control"><input type="checkbox" checked={sameAddress} onChange={event => { const checked = event.target.checked; setSameAddress(checked); if (checked) setDeliveryAddress(customerAddress); }}/> গ্রাহকের ঠিকানাই ডেলিভারি ঠিকানা</label>
      <label>ডেলিভারি ঠিকানা <em>*</em><textarea required name="deliveryAddress" placeholder="গরু ডেলিভারি দেওয়ার সম্পূর্ণ ঠিকানা লিখুন" rows={3} value={deliveryAddress} readOnly={sameAddress} onChange={event => setDeliveryAddress(event.target.value)}/></label>
      <label>মোবাইল নম্বর <em>*</em><input required name="deliveryPhone" type="tel" inputMode="tel" placeholder="01XXXXXXXXX" pattern="01[3-9][0-9]{8}"/></label>
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
      <button className="payment-submit" type="submit">{isFullPayment ? "পেমেন্ট সম্পন্ন করুন" : "পেমেন্টের তথ্য জমা দিন"}</button>
    </fieldset>
  </form>;
}
