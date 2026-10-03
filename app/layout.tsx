import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import ScrollToTop from "./components/scroll-to-top";
import LanguageProvider from "./components/language-provider";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
  fallback: ["Nirmala UI", "Arial"],
});

export const metadata: Metadata = {
  title: "রাবেয়া ফার্ম | যত্নে বড়, বিশ্বাসে সেরা",
  description: "প্রাকৃতিক খাবার ও নিয়মিত যত্নে বেড়ে ওঠা সুস্থ কোরবানির গরুর বিশ্বস্ত ঠিকানা—রাবেয়া ফার্ম।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="bn" className={hindSiliguri.variable}><body><LanguageProvider>{children}</LanguageProvider><ScrollToTop/></body></html>;
}
