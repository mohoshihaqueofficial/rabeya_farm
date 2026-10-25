import type { MetadataRoute } from "next";

// Keep the admin panel and its login out of search engines.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/admin-login"] } };
}
