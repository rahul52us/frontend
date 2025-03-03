import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://www.metamindhealth.com"; // Tumhari website ka base URL

// ⚡ 1. STATIC PAGES (Sirf ye rahenge sitemap me)
const staticPages = [
  "/",
  "/home",
  "/therapist",
  "/contact-us",
  "/about-us",
  "/blogs"
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(
        (page) => `
    <url>
      <loc>${baseUrl}${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
      )
      .join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemap);
}
