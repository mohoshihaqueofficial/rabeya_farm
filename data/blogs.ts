export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  publishedLabel: string;
  readTime: string;
  coverImage: string;
  imagePosition?: string;
  featured?: boolean;
  active: boolean;
  content: BlogSection[];
};

// Demo records. This array can later be replaced by the admin/API response.
export const blogPosts: BlogPost[] = [
  {
    slug: "healthy-qurbani-cow-selection-guide",
    title: "সুস্থ কোরবানির গরু চেনার সহজ উপায়",
    excerpt: "গরুর চোখ, চলাফেরা, খাবারের আগ্রহ ও শারীরিক গঠন দেখে কীভাবে সুস্থ গরু নির্বাচন করবেন—জেনে নিন গুরুত্বপূর্ণ লক্ষণগুলো।",
    category: "গরু নির্বাচন",
    author: "রাবেয়া ফার্ম টিম",
    publishedAt: "2026-09-25",
    publishedLabel: "২৫ সেপ্টেম্বর ২০২৬",
    readTime: "৫ মিনিট পড়ুন",
    coverImage: "/Home/rabeya-cattle-optimized.jpg",
    imagePosition: "center",
    featured: true,
    active: true,
    content: [
      { heading: "চোখ ও আচরণ লক্ষ্য করুন", paragraphs: ["সুস্থ গরুর চোখ সাধারণত উজ্জ্বল ও পরিষ্কার থাকে। চোখ দিয়ে পানি পড়া, অতিরিক্ত অলসতা কিংবা চারপাশে সাড়া না দেওয়া অসুস্থতার লক্ষণ হতে পারে। গরুটি স্বাভাবিকভাবে দাঁড়াচ্ছে ও হাঁটছে কি না সেটিও দেখুন।", "খাবার সামনে দিলে আগ্রহ নিয়ে খাওয়া এবং স্বাভাবিকভাবে জাবর কাটা ভালো স্বাস্থ্যের ইতিবাচক লক্ষণ।"] },
      { heading: "শরীর ও ত্বক পরীক্ষা করুন", paragraphs: ["গরুর শরীরে অস্বাভাবিক ফোলা, ক্ষত কিংবা চামড়ায় সংক্রমণের চিহ্ন আছে কি না খেয়াল করুন। লোম মসৃণ হওয়া এবং নাক সামান্য ভেজা থাকা সাধারণত স্বাভাবিক।", "শুধু আকার দেখে সিদ্ধান্ত না নিয়ে বয়স, ওজন, দাঁত এবং সামগ্রিক শারীরিক অবস্থার তথ্য যাচাই করুন।"] },
      { heading: "বিশ্বস্ত উৎস থেকে কিনুন", paragraphs: ["গরুর খাবার, পরিচর্যা ও স্বাস্থ্য ইতিহাস সম্পর্কে পরিষ্কার তথ্য দেয়—এমন খামার বেছে নিন। অনলাইনে কিনলে সাম্প্রতিক ছবি, লাইভ ভিডিও এবং প্রয়োজনীয় তথ্য নিশ্চিত করে তারপর বুকিং সম্পন্ন করুন।"] },
    ],
  },
  {
    slug: "online-cow-order-home-delivery",
    title: "অনলাইনে গরু অর্ডার থেকে হোম ডেলিভারি—পুরো প্রক্রিয়া",
    excerpt: "পছন্দ, বুকিং, ঠিকানা নিশ্চিতকরণ এবং নিরাপদ ডেলিভারি—ঘরে বসে গরু কেনার প্রতিটি ধাপ এক নজরে দেখুন।",
    category: "অনলাইন বুকিং",
    author: "রাবেয়া ফার্ম টিম",
    publishedAt: "2026-09-20",
    publishedLabel: "২০ সেপ্টেম্বর ২০২৬",
    readTime: "৪ মিনিট পড়ুন",
    coverImage: "/Home/rabeya-home-delivery-optimized.jpg",
    imagePosition: "center",
    active: true,
    content: [
      { heading: "পছন্দের গরু নির্বাচন", paragraphs: ["ক্যাটালগে প্রতিটি গরুর ছবি, আইডি, ওজন, রঙ ও মূল্য দেওয়া থাকে। প্রয়োজন অনুযায়ী filter ব্যবহার করে তালিকা ছোট করুন এবং details page থেকে সম্পূর্ণ তথ্য দেখুন।"] },
      { heading: "বুকিং ও তথ্য নিশ্চিতকরণ", paragraphs: ["Partial অথবা full payment-এর উপযুক্ত option নির্বাচন করে গ্রাহকের নাম, মোবাইল নম্বর ও delivery address দিন। বুকিং জমা হলে order ID সংরক্ষণ করুন।"] },
      { heading: "নিজস্ব গাড়িতে নিরাপদ ডেলিভারি", paragraphs: ["ডেলিভারির সময় ও ঠিকানা ফোনে নিশ্চিত করার পর প্রশিক্ষিত কর্মী গরুটিকে যত্নসহকারে গাড়িতে পরিবহন করেন। পৌঁছানোর পর গরুর ID মিলিয়ে গ্রহণ করুন।"] },
    ],
  },
  {
    slug: "natural-feed-and-cattle-care",
    title: "প্রাকৃতিক খাবার ও নিয়মিত পরিচর্যা কেন জরুরি",
    excerpt: "সুষম খাবার, পরিষ্কার পানি ও পরিচ্ছন্ন পরিবেশ কীভাবে গরুর সুস্থ বৃদ্ধি নিশ্চিত করে—খামারের দৈনন্দিন যত্নের গল্প।",
    category: "খামার পরিচর্যা",
    author: "ফার্ম কেয়ার টিম",
    publishedAt: "2026-09-14",
    publishedLabel: "১৪ সেপ্টেম্বর ২০২৬",
    readTime: "৬ মিনিট পড়ুন",
    coverImage: "/Home/Homepage/2.jpg",
    imagePosition: "center 68%",
    active: true,
    content: [
      { heading: "সুষম খাবারের গুরুত্ব", paragraphs: ["গরুর বয়স ও শারীরিক অবস্থার সঙ্গে মিলিয়ে ঘাস, খড় এবং প্রয়োজনীয় পুষ্টিকর খাবারের সমন্বয় করা হয়। হঠাৎ খাদ্য পরিবর্তন না করে ধীরে ধীরে নতুন খাবারে অভ্যস্ত করা নিরাপদ।"] },
      { heading: "পানি ও পরিচ্ছন্ন পরিবেশ", paragraphs: ["পরিষ্কার পানি সবসময় সহজলভ্য রাখা এবং খাবারের পাত্র নিয়মিত পরিষ্কার করা জরুরি। শেডে পর্যাপ্ত বাতাস চলাচল, শুকনা মেঝে ও নিয়মিত বর্জ্য অপসারণ রোগের ঝুঁকি কমায়।"] },
      { heading: "নিয়মিত পর্যবেক্ষণ", paragraphs: ["প্রতিদিন খাবারের পরিমাণ, চলাফেরা ও আচরণ পর্যবেক্ষণ করলে অসুস্থতার প্রাথমিক পরিবর্তন দ্রুত ধরা যায়। প্রয়োজন হলে ভেটেরিনারি পরামর্শ নেওয়া হয়।"] },
    ],
  },
  {
    slug: "qurbani-meat-distribution-guideline",
    title: "কোরবানির মাংস সুষ্ঠুভাবে বিতরণের কিছু পরামর্শ",
    excerpt: "আত্মীয়, প্রতিবেশী ও অসহায় পরিবারের কাছে সম্মানজনকভাবে মাংস পৌঁছে দেওয়ার একটি সহজ পরিকল্পনা।",
    category: "কোরবানি প্রস্তুতি",
    author: "রাবেয়া ফার্ম টিম",
    publishedAt: "2026-09-08",
    publishedLabel: "৮ সেপ্টেম্বর ২০২৬",
    readTime: "৫ মিনিট পড়ুন",
    coverImage: "/Home/qurbani-donation-distribution-optimized.jpg",
    imagePosition: "center",
    active: true,
    content: [
      { heading: "আগে থেকেই তালিকা তৈরি করুন", paragraphs: ["পরিবার, আত্মীয়স্বজন, প্রতিবেশী এবং সহায়তা প্রয়োজন—এমন পরিবারের একটি তালিকা আগে থেকে প্রস্তুত রাখলে বিতরণে বিশৃঙ্খলা কমে।"] },
      { heading: "পরিচ্ছন্ন প্যাকেট ও সঠিক পরিমাণ", paragraphs: ["মাংস পরিষ্কারভাবে ভাগ করে food-grade প্যাকেটে রাখুন। প্রতিটি পরিবারের সদস্যসংখ্যা ও প্রয়োজন বিবেচনায় পরিমাণ নির্ধারণ করলে সুষ্ঠু বণ্টন সম্ভব হয়।"] },
      { heading: "সম্মান বজায় রেখে পৌঁছে দিন", paragraphs: ["সহায়তা গ্রহণকারী মানুষের ছবি বা পরিচয় প্রকাশ না করে ব্যক্তিগতভাবে মাংস পৌঁছে দেওয়া উত্তম। বিতরণের প্রতিটি ধাপে তাদের মর্যাদা ও গোপনীয়তা রক্ষা করুন।"] },
    ],
  },
  {
    slug: "prepare-home-before-cattle-delivery",
    title: "গরু বাড়িতে আসার আগে যেসব প্রস্তুতি নেবেন",
    excerpt: "নিরাপদ জায়গা, খাবার, পানি এবং গাড়ি প্রবেশের পথ—ডেলিভারির আগে ছোট একটি checklist দেখে নিন।",
    category: "ডেলিভারি প্রস্তুতি",
    author: "ডেলিভারি টিম",
    publishedAt: "2026-09-02",
    publishedLabel: "২ সেপ্টেম্বর ২০২৬",
    readTime: "৪ মিনিট পড়ুন",
    coverImage: "/Home/Homepage/1.jpg",
    imagePosition: "center",
    active: true,
    content: [
      { heading: "নিরাপদ জায়গা নির্ধারণ", paragraphs: ["গরু রাখার জায়গাটি সমতল, শুকনা এবং ছায়াযুক্ত রাখুন। ধারালো বস্তু, পিচ্ছিল মেঝে এবং বৈদ্যুতিক তারের মতো ঝুঁকি আগে থেকেই সরিয়ে ফেলুন।"] },
      { heading: "গাড়ির প্রবেশপথ পরিষ্কার রাখুন", paragraphs: ["ডেলিভারি গাড়ি কোথায় থামবে এবং গরুটি কোন পথে নামবে তা আগে ঠিক করুন। সরু রাস্তা বা বিশেষ নির্দেশনা থাকলে ডেলিভারি টিমকে আগে জানান।"] },
      { heading: "খাবার ও পানি প্রস্তুত রাখুন", paragraphs: ["পরিষ্কার পানির পাত্র এবং পরিচিত ধরনের ঘাস বা খড় প্রস্তুত রাখুন। দীর্ঘ যাত্রার পর গরুকে শান্ত পরিবেশে বিশ্রাম নেওয়ার সুযোগ দিন।"] },
    ],
  },
];

export const activeBlogPosts = blogPosts
  .filter(post => post.active)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getBlogPost(slug: string) {
  return activeBlogPosts.find(post => post.slug === slug);
}
