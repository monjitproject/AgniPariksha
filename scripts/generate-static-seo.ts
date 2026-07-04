import * as fs from "fs";
import * as path from "path";

// Load datasets using relative imports
import { MAIC_BLOGS } from "../src/data/maicBlogsData";
import { MOCK_QUIZZES, MOCK_JOBS, MOCK_NOTES, MOCK_PDFS, MOCK_BLOGS } from "../src/data/mockData";

const baseUrl = "https://maicindia.com";

// Helper to convert text to slug
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Ensure public directory exists
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log("Generating static SEO assets for Cloudflare & GitHub consistency...");

// -------------------------------------------------------------
// 1. Generate Robots.txt
// -------------------------------------------------------------
const robotsTxt = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Disallow: /login/
Disallow: /preview/
Disallow: /search
Disallow: /*?*
Disallow: /private/
Disallow: /draft/
Disallow: /tmp/
Disallow: /_next/

Sitemap: https://maicindia.com/sitemap_index.xml`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");
console.log("- Generated public/robots.txt successfully");

// -------------------------------------------------------------
// 2. Generate PWA Webmanifest
// -------------------------------------------------------------
const manifest = {
  "name": "MAIC India - Armed Forces & Govt Jobs Preparation Portal",
  "short_name": "MAIC India",
  "description": "Prepare for SSC, Railway, Indian Army Agniveer, NDA, & Air Force with free mock tests and job alerts.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "orientation": "portrait",
  "scope": "/",
  "lang": "en-IN",
  "icons": [
    {
      "src": "/assets/logo-og.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
};

fs.writeFileSync(path.join(publicDir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2), "utf8");
console.log("- Generated public/manifest.webmanifest successfully");

// -------------------------------------------------------------
// 3. Generate Browserconfig.xml for MS Tile Integration
// -------------------------------------------------------------
const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/assets/logo-og.png"/>
      <TileColor>#0f172a</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

fs.writeFileSync(path.join(publicDir, "browserconfig.xml"), browserconfig, "utf8");
console.log("- Generated public/browserconfig.xml successfully");

// -------------------------------------------------------------
// 4. Disable Cloudflare Pages Redirects File (_redirects)
// -------------------------------------------------------------
// We now use Cloudflare Pages Functions (/functions/[[path]].ts) for advanced routing and dynamic SEO.
// Leaving _redirects active would bypass our dynamic functions completely.
console.log("- Skipping _redirects generation in favor of /functions routing");

// -------------------------------------------------------------
// 5. Calculate Latest Dates for Sitemaps
// -------------------------------------------------------------
let latestPostDate = "2026-07-03";
const dates: string[] = [];

MAIC_BLOGS.forEach(b => { if (b.date) dates.push(b.date); });
MOCK_BLOGS.forEach(b => { if (b.date) dates.push(b.date); });
MOCK_JOBS.forEach(j => { if (j.importantDates?.start) dates.push(j.importantDates.start); });
MOCK_NOTES.forEach(n => { if (n.date) dates.push(n.date); });
MOCK_PDFS.forEach(p => { if (p.publishDate) dates.push(p.publishDate); });

if (dates.length > 0) {
  dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  latestPostDate = dates[0];
}

// -------------------------------------------------------------
// 6. Generate sitemap_index.xml
// -------------------------------------------------------------
let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
sitemapIndexXml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

sitemapIndexXml += `  <sitemap>\n`;
sitemapIndexXml += `    <loc>${baseUrl}/post-sitemap.xml</loc>\n`;
sitemapIndexXml += `    <lastmod>${latestPostDate}</lastmod>\n`;
sitemapIndexXml += `  </sitemap>\n`;

sitemapIndexXml += `  <sitemap>\n`;
sitemapIndexXml += `    <loc>${baseUrl}/category-sitemap.xml</loc>\n`;
sitemapIndexXml += `    <lastmod>${latestPostDate}</lastmod>\n`;
sitemapIndexXml += `  </sitemap>\n`;

sitemapIndexXml += `  <sitemap>\n`;
sitemapIndexXml += `    <loc>${baseUrl}/page-sitemap.xml</loc>\n`;
sitemapIndexXml += `    <lastmod>${latestPostDate}</lastmod>\n`;
sitemapIndexXml += `  </sitemap>\n`;

sitemapIndexXml += `</sitemapindex>`;

fs.writeFileSync(path.join(publicDir, "sitemap_index.xml"), sitemapIndexXml, "utf8");
console.log("- Generated public/sitemap_index.xml successfully");

// -------------------------------------------------------------
// 7. Generate post-sitemap.xml
// -------------------------------------------------------------
let postSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
postSitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. MAIC Premium Blogs
MAIC_BLOGS.forEach(blog => {
  const slug = toSlug(blog.title);
  postSitemapXml += `  <url>\n`;
  postSitemapXml += `    <loc>${baseUrl}/blog/${slug}</loc>\n`;
  postSitemapXml += `    <lastmod>${blog.date || "2026-07-03"}</lastmod>\n`;
  postSitemapXml += `    <changefreq>weekly</changefreq>\n`;
  postSitemapXml += `    <priority>0.9</priority>\n`;
  postSitemapXml += `  </url>\n`;
});

// 2. Mock Blogs
MOCK_BLOGS.forEach(blog => {
  postSitemapXml += `  <url>\n`;
  postSitemapXml += `    <loc>${baseUrl}/blog/${blog.id}</loc>\n`;
  postSitemapXml += `    <lastmod>${blog.date || "2026-07-03"}</lastmod>\n`;
  postSitemapXml += `    <changefreq>weekly</changefreq>\n`;
  postSitemapXml += `    <priority>0.9</priority>\n`;
  postSitemapXml += `  </url>\n`;
});

// 3. Dynamic Quizzes
MOCK_QUIZZES.forEach(quiz => {
  postSitemapXml += `  <url>\n`;
  postSitemapXml += `    <loc>${baseUrl}/quizzes/${quiz.id}</loc>\n`;
  postSitemapXml += `    <lastmod>2026-06-25</lastmod>\n`;
  postSitemapXml += `    <changefreq>weekly</changefreq>\n`;
  postSitemapXml += `    <priority>0.9</priority>\n`;
  postSitemapXml += `  </url>\n`;
});

// 4. Jobs
MOCK_JOBS.forEach(job => {
  postSitemapXml += `  <url>\n`;
  postSitemapXml += `    <loc>${baseUrl}/jobs/${job.id}</loc>\n`;
  postSitemapXml += `    <lastmod>${job.importantDates?.start || "2026-07-03"}</lastmod>\n`;
  postSitemapXml += `    <changefreq>daily</changefreq>\n`;
  postSitemapXml += `    <priority>0.9</priority>\n`;
  postSitemapXml += `  </url>\n`;
});

// 5. Study Notes
MOCK_NOTES.forEach(note => {
  postSitemapXml += `  <url>\n`;
  postSitemapXml += `    <loc>${baseUrl}/study/${note.id}</loc>\n`;
  postSitemapXml += `    <lastmod>${note.date || "2026-07-03"}</lastmod>\n`;
  postSitemapXml += `    <changefreq>weekly</changefreq>\n`;
  postSitemapXml += `    <priority>0.9</priority>\n`;
  postSitemapXml += `  </url>\n`;
});

// 6. PDF solved papers and notifications
MOCK_PDFS.forEach(pdf => {
  postSitemapXml += `  <url>\n`;
  postSitemapXml += `    <loc>${baseUrl}/pdfs/${pdf.id}</loc>\n`;
  postSitemapXml += `    <lastmod>${pdf.publishDate || "2026-07-03"}</lastmod>\n`;
  postSitemapXml += `    <changefreq>weekly</changefreq>\n`;
  postSitemapXml += `    <priority>0.9</priority>\n`;
  postSitemapXml += `  </url>\n`;
});

postSitemapXml += `</urlset>`;

fs.writeFileSync(path.join(publicDir, "post-sitemap.xml"), postSitemapXml, "utf8");
console.log("- Generated public/post-sitemap.xml successfully");

// -------------------------------------------------------------
// 8. Generate category-sitemap.xml
// -------------------------------------------------------------
const categories = [
  "government-jobs",
  "admit-card",
  "result",
  "answer-key",
  "admission",
  "syllabus",
  "current-affairs",
  "gk",
  "quiz",
  "state-wise-jobs",
  "qualification-wise-jobs",
  "department-wise-jobs"
];

let categorySitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
categorySitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

categories.forEach(cat => {
  categorySitemapXml += `  <url>\n`;
  categorySitemapXml += `    <loc>${baseUrl}/category/${cat}</loc>\n`;
  categorySitemapXml += `    <lastmod>2026-07-03</lastmod>\n`;
  categorySitemapXml += `    <changefreq>daily</changefreq>\n`;
  categorySitemapXml += `    <priority>0.8</priority>\n`;
  categorySitemapXml += `  </url>\n`;
});

categorySitemapXml += `</urlset>`;

fs.writeFileSync(path.join(publicDir, "category-sitemap.xml"), categorySitemapXml, "utf8");
console.log("- Generated public/category-sitemap.xml successfully");

// -------------------------------------------------------------
// 9. Generate page-sitemap.xml
// -------------------------------------------------------------
let pageSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
pageSitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Homepage (Priority 1.0)
pageSitemapXml += `  <url>\n`;
pageSitemapXml += `    <loc>${baseUrl}/</loc>\n`;
pageSitemapXml += `    <lastmod>2026-07-03</lastmod>\n`;
pageSitemapXml += `    <changefreq>daily</changefreq>\n`;
pageSitemapXml += `    <priority>1.0</priority>\n`;
pageSitemapXml += `  </url>\n`;

// 2. Static sub-tabs/routes (Priority 0.7)
const tabPages = ["quizzes", "mock-tests", "jobs", "study", "pdfs", "current-affairs", "admit-card", "results", "authors", "chat"];
tabPages.forEach(tab => {
  pageSitemapXml += `  <url>\n`;
  pageSitemapXml += `    <loc>${baseUrl}/${tab}</loc>\n`;
  pageSitemapXml += `    <lastmod>2026-07-03</lastmod>\n`;
  pageSitemapXml += `    <changefreq>daily</changefreq>\n`;
  pageSitemapXml += `    <priority>0.7</priority>\n`;
  pageSitemapXml += `  </url>\n`;
});

// 3. Policy Pages (Priority 0.7)
const policies = [
  "about", "contact", "faq", "careers", "privacy", "terms", "cookies", 
  "disclaimer", "dmca", "editorial", "factcheck", "refund", "sitemap-doc", "correction"
];

policies.forEach(policy => {
  pageSitemapXml += `  <url>\n`;
  pageSitemapXml += `    <loc>${baseUrl}/${policy}</loc>\n`;
  pageSitemapXml += `    <lastmod>2026-07-03</lastmod>\n`;
  pageSitemapXml += `    <changefreq>weekly</changefreq>\n`;
  pageSitemapXml += `    <priority>0.7</priority>\n`;
  pageSitemapXml += `  </url>\n`;
});

pageSitemapXml += `</urlset>`;

fs.writeFileSync(path.join(publicDir, "page-sitemap.xml"), pageSitemapXml, "utf8");
console.log("- Generated public/page-sitemap.xml successfully");

console.log("All static SEO assets generated successfully under /public!");
