export type Advisor = {
  id: string;
  name: string;
  role: string;
  summary: string;
  image: string;
  tone: "green" | "mint" | "blue" | "gold";
};

// নিচের নাম, প্রতিষ্ঠান ও পদবিগুলো demo data; আসল তথ্য পাওয়া গেলে এগুলো বদলাতে হবে।
export const advisors: Advisor[] = [
  {
    id: "strategy",
    name: "ড. মাহমুদুল হাসান",
    role: "ম্যানেজিং ডিরেক্টর · গ্রিন হারভেস্ট এগ্রো লিমিটেড",
    summary: "দীর্ঘমেয়াদি পরিকল্পনা ও রাবেয়া ফার্মের টেকসই অগ্রযাত্রায় দিকনির্দেশনা দেন।",
    image: "/advisors/advisor-01.jpg",
    tone: "green",
  },
  {
    id: "operations",
    name: "মো. রাশেদুল করিম",
    role: "চিফ এক্সিকিউটিভ অফিসার · বেঙ্গল লাইভস্টক সল্যুশনস",
    summary: "দায়িত্বশীল পরিচর্যা, কার্যকর পরিচালনা ও সেবার মান উন্নয়নে পরামর্শ দেন।",
    image: "/advisors/advisor-02.jpg",
    tone: "mint",
  },
  {
    id: "innovation",
    name: "আরিফ রহমান",
    role: "ফাউন্ডার ও সিইও · এগ্রিনোভা টেকনোলজিস",
    summary: "ডিজিটাল উদ্যোগ, নতুন সেবা এবং ভবিষ্যৎ প্রযুক্তি পরিকল্পনায় সহায়তা করেন।",
    image: "/advisors/advisor-03.jpg",
    tone: "blue",
  },
  {
    id: "community",
    name: "তানভীর আহমেদ",
    role: "ম্যানেজিং ডিরেক্টর · রুরাল গ্রোথ ফাউন্ডেশন",
    summary: "মানুষের সঙ্গে বিশ্বস্ত সম্পর্ক, সামাজিক প্রভাব ও ব্র্যান্ডের মূল্যবোধে কাজ করেন।",
    image: "/advisors/advisor-04.jpg",
    tone: "gold",
  },
];
