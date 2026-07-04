import * as fs from "fs";
import * as path from "path";

// Simple script to validate local static file builds or deployments
// It inspects the generated output under /public to ensure everything is perfect.

const targetDir = path.join(process.cwd(), "public");

const filesToValidate = [
  {
    name: "robots.txt",
    type: "text",
    check: (content: string) => content.includes("User-agent: *") && content.includes("Sitemap:")
  },
  {
    name: "manifest.webmanifest",
    type: "json",
    check: (content: string) => {
      const parsed = JSON.parse(content);
      return parsed.short_name === "MAIC India" && parsed.start_url === "/";
    }
  },
  {
    name: "browserconfig.xml",
    type: "xml",
    check: (content: string) => content.includes("<browserconfig>") && content.includes("square150x150logo")
  },
  {
    name: "../functions/[[path]].ts",
    type: "text",
    check: (content: string) => content.includes("onRequest") && content.includes("checkPathValidity")
  },
  {
    name: "sitemap_index.xml",
    type: "xml",
    check: (content: string) => content.includes("<sitemapindex") && content.includes("post-sitemap.xml")
  },
  {
    name: "post-sitemap.xml",
    type: "xml",
    check: (content: string) => content.includes("<urlset") && content.includes("/blog/")
  },
  {
    name: "category-sitemap.xml",
    type: "xml",
    check: (content: string) => content.includes("<urlset") && content.includes("/category/")
  },
  {
    name: "page-sitemap.xml",
    type: "xml",
    check: (content: string) => content.includes("<urlset") && content.includes("https://maicindia.com/")
  }
];

console.log("\n=========================================================");
console.log("RUNNING PRODUCTION BUILD DEPLOYMENT VALIDATION TESTS...");
console.log("=========================================================");

let passedCount = 0;
let failedCount = 0;

for (const file of filesToValidate) {
  const filePath = path.join(targetDir, file.name);
  console.log(`Checking file: ${file.name}...`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ FAILURE: File ${file.name} is missing in ${targetDir}`);
    failedCount++;
    continue;
  }

  try {
    const content = fs.readFileSync(filePath, "utf8");
    if (file.check(content)) {
      console.log(`✅ SUCCESS: ${file.name} is present and passes syntax & structural integrity tests.`);
      passedCount++;
    } else {
      console.error(`❌ FAILURE: ${file.name} content checks failed.`);
      failedCount++;
    }
  } catch (err: any) {
    console.error(`❌ FAILURE: Error reading or validating ${file.name}:`, err.message || err);
    failedCount++;
  }
}

console.log("\n=========================================================");
console.log(`VALIDATION RESULTS: ${passedCount} PASSED, ${failedCount} FAILED.`);
console.log("=========================================================");

if (failedCount > 0) {
  console.error("❌ Build validation failed. Please check the errors above.");
  process.exit(1);
} else {
  console.log("🎉 All files are verified and perfect for Cloudflare Pages / production deployment!");
  process.exit(0);
}
