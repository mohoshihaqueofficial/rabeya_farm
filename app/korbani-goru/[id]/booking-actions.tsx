"use client";

import Link from "next/link";
import { useIsCowBooked } from "../booked-cows";

export default function BookingActions({ cowId, unavailable }: { cowId: string; unavailable: boolean }) {
  const bookedHere = useIsCowBooked(cowId);
  if (unavailable || bookedHere) return <>
    <button className="button button-dark" type="button" disabled>আংশিক বুকিং করুন</button>
    <button className="details-outline-button" type="button" disabled>পূর্ণ পেমেন্ট করুন</button>
    <p className="booking-closed" role="status">এই গরুটির পেমেন্ট ইতোমধ্যে সম্পন্ন হয়েছে, তাই নতুন বুকিং নেওয়া হচ্ছে না।</p>
  </>;
  return <>
    <Link className="button button-dark" href={`/korbani-goru/${cowId}/partial-payment`}>আংশিক বুকিং করুন</Link>
    <Link className="details-outline-button" href={`/korbani-goru/${cowId}/full-payment`}>পূর্ণ পেমেন্ট করুন</Link>
  </>;
}
