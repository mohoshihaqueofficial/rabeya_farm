// Shown on /faq (all active) and on the homepage (active + homepage). Managed from admin → হোমপেজ → জিজ্ঞাসা.
export type Faq = { id: string; question: string; answer: string; homepage: boolean; active: boolean };

export const faqStorageKey = "rabeya-farm:faqs";
export const maxHomepageFaqs = 4;

export const faqs: Faq[] = [
  { id: "booking", question: "কোরবানির জন্য গরু কীভাবে বুক করব?", answer: "পছন্দের গরুর কোড জানিয়ে ফোন বা WhatsApp-এ যোগাযোগ করুন। আমাদের টিম বুকিং ও পেমেন্টের পুরো প্রক্রিয়াটি বুঝিয়ে দেবে।", homepage: true, active: true },
  { id: "live-video", question: "গরুর লাইভ ভিডিও দেখা যাবে?", answer: "জি, অনুরোধ করলে নির্ধারিত সময়ে ভিডিও কল বা হালনাগাদ ভিডিওর ব্যবস্থা করা হবে।", homepage: true, active: true },
  { id: "outside-dhaka", question: "ঢাকার বাইরে ডেলিভারি আছে?", answer: "অবশ্যই। দূরত্ব ও পরিবহন সুবিধা অনুযায়ী দেশের বিভিন্ন জেলায় নিরাপদ ডেলিভারি দেওয়া হয়।", homepage: true, active: true },
  { id: "health-check", question: "গরুর স্বাস্থ্য পরীক্ষা করা হয় কি?", answer: "প্রতিটি গরু নিয়মিত পর্যবেক্ষণে থাকে এবং প্রয়োজন অনুযায়ী ভেটেরিনারি চেকআপ করা হয়।", homepage: true, active: true },
  { id: "partial-booking", question: "আংশিক বুকিং কীভাবে কাজ করে?", answer: "পছন্দের গরুটি রিজার্ভ করতে আংশিক বুকিংয়ের টাকা পাঠিয়ে পেমেন্টের তথ্য জমা দিন। বাকি টাকা পরিশোধের সময় ও নিয়ম টিম নিশ্চিত করবে।", homepage: false, active: true },
  { id: "refund", question: "বুকিংয়ের টাকা ফেরতযোগ্য কি?", answer: "বাতিলকরণ ও টাকা ফেরতের নিয়ম আমাদের Refund Policy পেজে বিস্তারিত দেওয়া আছে। টাকা পাঠানোর আগে নিয়মগুলো দেখে নিন।", homepage: false, active: true },
  { id: "pickup", question: "গরু কখন নিতে পারব?", answer: "খামার থেকে সংগ্রহ বা ডেলিভারির সম্ভাব্য তারিখ বুকিংয়ের সময় নির্ধারণ করা হয়।", homepage: false, active: true },
  { id: "farm-visit", question: "খামারে এসে গরু দেখা যাবে?", answer: "অবশ্যই। আগে থেকে ফোন করে সময় ঠিক করে নিলে খামারে এসে সরাসরি গরু দেখতে পারবেন।", homepage: false, active: true },
];
