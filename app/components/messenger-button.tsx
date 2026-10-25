"use client";

import { usePathname } from "next/navigation";

// Same Facebook page as the social icons (facebook.com/rabeyafarm); m.me opens Messenger (app on phones, web on desktop).
const messengerUrl = "https://m.me/rabeyafarm";

// Floating chat button, bottom-right on every public page (not in the admin panel).
export default function MessengerButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <a className="messenger-button" href={messengerUrl} target="_blank" rel="noopener noreferrer" aria-label="Messenger-এ রাবেয়া ফার্মের সঙ্গে চ্যাট করুন">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.24 0 0 4.95 0 11.64c0 3.5 1.43 6.52 3.77 8.61.2.17.31.42.32.68l.06 2.13a.96.96 0 0 0 1.35.85l2.38-1.05a.96.96 0 0 1 .64-.05c1.09.3 2.26.46 3.48.46 6.76 0 12-4.95 12-11.64S18.76 0 12 0Zm7.2 8.96-3.52 5.59a1.8 1.8 0 0 1-2.6.48l-2.8-2.1a.72.72 0 0 0-.87 0l-3.78 2.87c-.5.38-1.16-.22-.83-.76l3.52-5.59a1.8 1.8 0 0 1 2.6-.48l2.8 2.1c.26.2.61.2.87 0l3.78-2.87c.5-.38 1.16.22.83.76Z"/></svg>
    <span className="messenger-label">মেসেজ করুন</span>
  </a>;
}
