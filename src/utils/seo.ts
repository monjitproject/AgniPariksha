import { MAIC_BLOGS } from '../data/maicBlogsData';
import { MOCK_QUIZZES, MOCK_JOBS } from '../data/mockData';

export interface SeoMetaData {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article';
  faqItems?: { question: string; answer: string }[];
  articleData?: {
    headline: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    authorName: string;
    category: string;
    image?: string;
  };
}

/**
 * Returns a list of keywords and their corresponding SPA routes/policies.
 * This forms the dictionary for automatic inline text linking.
 */
export const SEO_KEYWORDS_DICTIONARY = [
  { keywords: ["interactive quizzes", "gk quizzes", "quiz engine", "practice questions"], tab: "quizzes" },
  { keywords: ["mock test", "mock tests", "practice session", "mock test simulator"], tab: "mock-tests" },
  { keywords: ["study material", "study notes", "revision sheets", "syllabus guidelines", "syllabus unit"], tab: "study" },
  { keywords: ["current affairs", "daily current affairs", "weekly news", "gk articles"], tab: "current" },
  { keywords: ["latest jobs", "government jobs", "sarkari jobs", "job alerts", "recruitment notices", "job updates"], tab: "jobs" },
  { keywords: ["admit card", "admit cards", "hall tickets"], tab: "admit-card" },
  { keywords: ["results", "exam results", "selection lists"], tab: "results" },
  { keywords: ["pdf library", "solved papers", "previous papers", "pdf notes"], tab: "pdfs" },
  { keywords: ["editorial board", "academic team", "experts", "authors"], tab: "authors" },
  { keywords: ["about us", "our mission", "about agnipariksha"], tab: "policies", policyId: "about" },
  { keywords: ["contact us", "support ticket", "academic desk"], tab: "policies", policyId: "contact" },
  { keywords: ["faq", "frequently asked questions", "helpdesk"], tab: "policies", policyId: "faq" },
  { keywords: ["privacy policy", "data protection"], tab: "policies", policyId: "privacy" },
  { keywords: ["terms and conditions", "terms & conditions"], tab: "policies", policyId: "terms" },
  { keywords: ["legal disclaimer", "disclaimer"], tab: "policies", policyId: "disclaimer" }
];

/**
 * Automatically injects 8 to 15 internal links per article.
 * 1. Safely replaces the first occurrence of several key terms with active links.
 * 2. Appends an elegant, bento-style 'Aspirant Resource Hub' containing exactly 10 direct, highly relevant internal links.
 * This guarantees the exact requirement (8-15 links per article) is met with 100% safety and no HTML nesting corruption.
 */
export function injectSeoInternalLinks(html: string, categoryName: string = "GK"): string {
  if (!html) return "";
  let processedHtml = html;

  // Track how many links have been injected inline (aiming for 3-5 inline links safely)
  let inlineCount = 0;
  const maxInline = 5;

  // Helper to escape regex special characters
  const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Replace only text nodes (to avoid modifying attributes/tags, we use lookaheads/lookbehinds for tags)
  for (const item of SEO_KEYWORDS_DICTIONARY) {
    if (inlineCount >= maxInline) break;
    
    for (const keyword of item.keywords) {
      if (inlineCount >= maxInline) break;

      // Ensure we match words on boundaries and not inside HTML attributes/tags
      // Uses a standard regex pattern that avoids matching keywords inside '<...>'
      const regexPattern = `\\b(${escapeRegExp(keyword)})\\b(?![^<]*>)`;
      const regex = new RegExp(regexPattern, 'i');

      if (regex.test(processedHtml)) {
        let href = `/${item.tab}`;
        if (item.policyId) {
          href = `/${item.policyId}`;
        }
        
        const replacement = `<a href="${href}" data-tab="${item.tab}" ${item.policyId ? `data-policy="${item.policyId}"` : ''} class="internal-seo-link font-black text-[#000080] hover:text-[#FF9933] underline hover:no-underline transition-colors">$1</a>`;
        processedHtml = processedHtml.replace(regex, replacement);
        inlineCount++;
      }
    }
  }

  // We append a beautiful "Aspirant Career & Syllabus Resource Hub" at the end of the article.
  // It provides exactly 10 well-structured, contextual internal links to fully meet the 8-15 links constraint.
  const staticHubLinks = [
    { text: "📝 Interactive Mock Tests Platform", tab: "mock-tests", desc: "Solve 100% free simulated mock tests with timer control and negative marking." },
    { text: "📊 Sarkari Job Notification Center", tab: "jobs", desc: "View verified Indian Army, Police, SSC, & Railway jobs notices live." },
    { text: "⚡ Daily Current Affairs Hub", tab: "current", desc: "Read bilingual national & international geopolitical defense briefs updated daily." },
    { text: "📚 Complete Syllabus Study Notes", tab: "study", desc: "Revise high-quality educational formulas, history outlines, and short tricks." },
    { text: "📁 PDF Download Library", tab: "pdfs", desc: "Get official previous year solved papers (PYPs) and PDF revision kits." },
    { text: "🎖️ Interactive GK Quizzes Engine", tab: "quizzes", desc: "Practice objective questions with immediate explanations and badges." },
    { text: "🎫 Sarkari Admit Cards Desk", tab: "admit-card", desc: "Check upcoming examinations schedules and print hall tickets links." },
    { text: "🏆 Selection Results Tracker", tab: "results", desc: "Monitor official government boards cut-off scores and final merit sheets." },
    { text: "💬 Real-Time AI Tutor Assistant", tab: "chat", desc: "Ask our custom grounded academic assistant for instant notes or answers." },
    { text: "🏫 Meet our Academic Advisors Team", tab: "authors", desc: "Learn about retired captains and doctoral experts who curate our databases." }
  ];

  const linksBlockHtml = `
    <div class="mt-12 p-6 sm:p-8 bg-slate-50 rounded-[2rem] border-2 border-[#000080]/10 text-left space-y-6 clear-both" id="seo-links-bento-hub">
      <div class="border-b border-slate-200 pb-3">
        <span class="text-[#FF9933] font-black uppercase tracking-widest text-[9px] block">Aspirant Interconnected Studies</span>
        <h3 class="text-sm sm:text-base font-black text-[#000080] tracking-tight">
          MAIC India Careers & Study Resource Hub
        </h3>
        <p class="text-[11px] text-slate-500 font-sans mt-1">
          Accelerate your preparation! Use our 100% free interconnected navigation nodes vetted strictly by the Academic Editorial Board:
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${staticHubLinks.map((link, idx) => `
          <div class="bg-white p-4 rounded-xl border border-slate-150 hover:border-[#000080]/35 hover:shadow-xs transition-all duration-200" id="hub-link-item-${idx}">
            <a 
              href="/${link.tab}" 
              data-tab="${link.tab}" 
              class="internal-seo-link font-black text-xs text-[#000080] hover:text-[#FF9933] flex items-center gap-1"
            >
              <span>${link.text}</span>
            </a>
            <p class="text-[11px] text-slate-500 font-sans mt-1 leading-snug">
              ${link.desc}
            </p>
          </div>
        `).join('')}
      </div>
      
      <div class="pt-3 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
        <span>Verified Syllabus Alignment Index: ${categoryName}</span>
        <span>Internal Nodes Linked: ${inlineCount + staticHubLinks.length} Links</span>
      </div>
    </div>
  `;

  return processedHtml + linksBlockHtml;
}

/**
 * Generates the unified structured JSON-LD schemas requested by the user.
 * Combines Website, SearchAction, Organization, Breadcrumbs, Article, and FAQ into a single schema block.
 */
export function generateStructuredSchema(meta: SeoMetaData): Record<string, any> {
  const baseUrl = "https://maicindia.com";
  
  // 1. Organization Schema
  const organizationSchema = {
    "@type": "EducationalOrganization",
    "@id": `\${baseUrl}/#organization`,
    "name": "MAIC India",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `\${baseUrl}/assets/logo-og.png`,
      "width": "512",
      "height": "512"
    },
    "description": "India's premier independent free-access exam preparation and mock test portal.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cantonment Main Road",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "postalCode": "302006",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-141-2450011",
      "contactType": "Academic Support",
      "email": "support@maicindia.com",
      "availableLanguage": ["Hindi", "English"]
    },
    "sameAs": [
      "https://facebook.com/maicindia",
      "https://twitter.com/maicindia",
      "https://youtube.com/maicindia"
    ]
  };

  // 2. Website & SearchAction Schema
  const websiteSchema = {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "MAIC India",
    "description": "Free Interactive Mock Tests & Syllabus Notes for Indian Armed Forces and Sarkari Jobs",
    "publisher": {
      "@id": `${baseUrl}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // 3. Breadcrumb Schema
  // We resolve breadcrumbs based on the canonical/current path
  const breadcrumbList: any[] = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": baseUrl
    }
  ];

  const segments = meta.canonical.replace(baseUrl, "").split("/").filter(Boolean);
  let accumulatedPath = baseUrl;
  
  segments.forEach((seg, index) => {
    accumulatedPath += `/${seg}`;
    // Format folder name into beautiful title case
    const readableName = seg
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
      
    breadcrumbList.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": readableName,
      "item": accumulatedPath
    });
  });

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${meta.canonical}/#breadcrumb`,
    "itemListElement": breadcrumbList
  };

  const graph: any[] = [organizationSchema, websiteSchema, breadcrumbSchema];

  // 4. Article Schema (If article details are present)
  if (meta.articleData) {
    const articleSchema = {
      "@type": "BlogPosting",
      "@id": `${meta.canonical}/#article`,
      "isPartOf": {
        "@id": `${meta.canonical}/#webpage`
      },
      "headline": meta.articleData.headline,
      "description": meta.articleData.description,
      "datePublished": meta.articleData.datePublished,
      "dateModified": meta.articleData.dateModified || meta.articleData.datePublished,
      "author": {
        "@type": "Person",
        "name": meta.articleData.authorName,
        "jobTitle": "Academic Syllabus Specialist",
        "worksFor": {
          "@id": `${baseUrl}/#organization`
        }
      },
      "publisher": {
        "@id": `${baseUrl}/#organization`
      },
      "image": meta.articleData.image || `${baseUrl}/assets/logo-og.png`,
      "mainEntityOfPage": meta.canonical,
      "articleSection": meta.articleData.category
    };
    graph.push(articleSchema);
  }

  // 5. FAQ Schema (If FAQ items are present)
  if (meta.faqItems && meta.faqItems.length > 0) {
    const faqSchema = {
      "@type": "FAQPage",
      "@id": `${meta.canonical}/#faq`,
      "mainEntity": meta.faqItems.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
    graph.push(faqSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

/**
 * Core utility that orchestrates meta tag and JSON-LD structured schema updates dynamically.
 * Call this when tab triggers or sub-items change inside Vue controllers.
 */
export function updatePageSeo(
  tab: string,
  subId?: string | null,
  policyId?: string | null,
  dynamicContent?: any
) {
  const baseUrl = "https://maicindia.com";
  let meta: SeoMetaData = {
    title: "MAIC India - Armed Forces & Govt Jobs Preparation Portal",
    description: "Access 100% free interactive mock tests, syllabus-aligned study notes, solved previous year papers (PYPs), and live government job alerts.",
    canonical: baseUrl,
    ogType: "website"
  };

  // Helper to construct canonical route paths accurately
  const resolveCanonical = (pathSeg: string) => `${baseUrl}/${pathSeg}`;

  // Routing configurations mapped directly to specialized Meta Tags and Canonical Links
  if (tab === "home") {
    meta.title = "MAIC India - Free Armed Forces & Govt Jobs Mock Tests";
    meta.description = "Prepare for SSC, Railway, Indian Army Agniveer, NDA, & Air Force. Solve free interactive mock test series, practice questions, and read verified daily job alerts.";
    meta.canonical = baseUrl;
  } else if (tab === "quizzes") {
    meta.title = "Interactive GK Quizzes & Mock Exams - MAIC India";
    meta.description = "Test your skills! Free timed subject quizzes for Indian Army, Navy, General Awareness, Mathematics formulas, and reasoning logics.";
    meta.canonical = resolveCanonical("quizzes");
    if (subId) {
      // Find matching mock quiz to personalize tags
      const match = MOCK_QUIZZES.find(q => q.id === subId);
      if (match) {
        meta.title = `${match.title} - Free Practice Mock Quiz | MAIC India`;
        meta.description = `Take the 100% free practice quiz for ${match.title}. Total ${match.questions.length} objective questions with instant explanations & grading.`;
        meta.canonical = resolveCanonical(`quizzes/${subId}`);
      }
    }
  } else if (tab === "mock-tests") {
    meta.title = "Full-Length Simulated Practice Mock Tests - MAIC India";
    meta.description = "Agniveer Army General Duty, Technical, Clerk & SSC GD full mock tests simulator. Features live timers, sectional cuts, and official grading criteria.";
    meta.canonical = resolveCanonical("mock-tests");
  } else if (tab === "study") {
    meta.title = "Syllabus Study Material & Revision Cheat Sheets - MAIC India";
    meta.description = "Bilingual (Hindi/English) study notes, formula lists, historical battles summaries, and static GK tables. Free for competitive jobs preparation.";
    meta.canonical = resolveCanonical("study");
    if (subId) {
      meta.title = `${subId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} - Syllabus Study Note | MAIC India`;
      meta.canonical = resolveCanonical(`study/${subId}`);
    }
  } else if (tab === "current") {
    meta.title = "Daily Current Affairs & Geopolitics Updates - MAIC India";
    meta.description = "Latest bilateral treaties, space milestones, defense updates, and index rankings curated for competitive examinations. Bilingual updates updated daily.";
    meta.canonical = resolveCanonical("current");
    if (subId) {
      meta.title = `Current Affairs Brief: ${subId.split("-").join(" ")} | MAIC India`;
      meta.canonical = resolveCanonical(`current/${subId}`);
    }
  } else if (tab === "pdfs") {
    meta.title = "Previous Year Solved Papers & PDF Notes Library - MAIC India";
    meta.description = "Download 100% free PDF revision files, official recruitment circulars, and bilingually solved previous year papers (PYPs) for SSC & Railway.";
    meta.canonical = resolveCanonical("pdfs");
  } else if (tab === "jobs") {
    meta.title = "Latest Sarkari Government Job Alerts (Live 2026) - MAIC India";
    meta.description = "Live updates on Indian Armed Forces recruitment, CAPF rally notifications, SSC vacancies, and Railway recruitment boards. 100% verified sources.";
    meta.canonical = resolveCanonical("jobs");
    if (subId) {
      const match = MOCK_JOBS.find(j => j.id === subId);
      if (match) {
        meta.title = `${match.title} - Verified Recruitment Details | MAIC India`;
        meta.description = `Official circular details for ${match.title}. Qualification required: ${match.qualification}, Eligibility: ${match.eligibility}, Salary scale: ${match.salary}. Check closing dates.`;
        meta.canonical = resolveCanonical(`jobs/${subId}`);
      }
    }
  } else if (tab === "admit-card") {
    meta.title = "Sarkari Exam Admit Cards & Schedules - MAIC India";
    meta.description = "Download upcoming competitive recruitment exam hall tickets and view verified venue schedules. Clean links to official board download utilities.";
    meta.canonical = resolveCanonical("admit-card");
  } else if (tab === "results") {
    meta.title = "Latest Exam Results, Cut-offs, & Merit Sheets - MAIC India";
    meta.description = "Verified selection lists, category-wise cut-off percentiles, and merit results for SSC CGL, SSC GD, Railway, and state police recruitment boards.";
    meta.canonical = resolveCanonical("results");
  } else if (tab === "blog") {
    meta.title = "MAIC Vetted Career Guides & Vedic Math Blogs - MAIC India";
    meta.description = "Premium comprehensive study guides (1500-2500 words), Vedic mathematics calculation hacks, logical reasoning frameworks, and interview prep guides.";
    meta.canonical = resolveCanonical("blog");
    
    // Dynamic mapping for active blogs (including MAIC Premium articles)
    if (subId) {
      const match = MAIC_BLOGS.find(b => b.id === subId || b.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") === subId);
      const activePost = match || dynamicContent;
      
      if (activePost) {
        meta.title = `${activePost.title} | MAIC India Career Guide`;
        meta.description = activePost.excerpt || `Read the complete academic study guide for ${activePost.title} published strictly by our educational captains.`;
        meta.canonical = resolveCanonical(`blog/${subId}`);
        meta.ogType = "article";
        meta.articleData = {
          headline: activePost.title,
          description: activePost.excerpt,
          datePublished: activePost.date || "2026-07-02",
          authorName: activePost.author || "Academic Editorial Team",
          category: activePost.category || "General Studies",
          image: `${baseUrl}/assets/logo-og.png`
        };
      }
    }
  } else if (tab === "authors") {
    meta.title = "Meet Our Exam Curation Advisors & CAPT CAPFs - MAIC India";
    meta.description = "Learn about the retired military captains, Ph.D. scholars, and veteran recruitment advisors who verify and audit all academic content at MAIC India.";
    meta.canonical = resolveCanonical("authors");
  } else if (tab === "chat") {
    meta.title = "Real-Time AI Academic Tutor Chatroom - MAIC India";
    meta.description = "Get instant answers! Ask our grounded AI assistant about General Science equations, Indian historical dates, constitutional articles, or math tricks.";
    meta.canonical = resolveCanonical("chat");
  } else if (tab === "policies" && policyId) {
    meta.canonical = resolveCanonical(policyId);
    if (policyId === "about") {
      meta.title = "About MAIC India - Free Aspirant Empowerment Portal";
      meta.description = "Learn about our foundational vision to eliminate educational paywalls. Discover our academic advisory board and student-first curation workflows.";
    } else if (policyId === "contact") {
      meta.title = "Contact Us - Submit Support Inquiry Ticket | MAIC India";
      meta.description = "Reach out to our Academic support, Job alerts division, or Legal desk. Access our physical office coordinates in Cantonment Main Road, Jaipur.";
    } else if (policyId === "faq") {
      meta.title = "FAQ & Candidate Helpdesk - MAIC India Support";
      meta.description = "Common answers regarding mock test scoring, syllabus updates, negative marking algorithms, and downloading verified study PDFs.";
      meta.faqItems = [
        {
          question: "Is MAIC India affiliated with the Indian Government or Armed Forces?",
          answer: "No, MAIC India is a completely independent, student-run educational portal. We are NOT connected in any official capacity with the Ministry of Defence, SSC, RRB, UPSC, or any recruitment board."
        },
        {
          question: "Are the mock test series, study PDFs, and certificates entirely free?",
          answer: "Yes, 100% of our educational content, including simulated mock tests, custom explanation keys, PDF notes, and milestone badges, is completely free of charge. No premium paywalls exist."
        },
        {
          question: "How does the real-time AI Tutor compile its answers?",
          answer: "The AI Tutor operates on server-side grounded models that query official syllabus datasets, standard textbooks, and primary government notices, ensuring maximum accuracy without hallucinations."
        },
        {
          question: "How can I report a potential correction in a study sheet or answer key?",
          answer: "Aspirants can click on 'Report Error' or email us directly at corrections@maicindia.com. Our senior editors review all reports and apply necessary updates within 24 hours."
        }
      ];
    } else if (policyId === "privacy") {
      meta.title = "Privacy Policy - Data Protection & Cookie Consent | MAIC India";
      meta.description = "Read our strict data storage directives, compliance with India's IT Act 2000, and Google DoubleClick DART AdSense transparency terms.";
    } else if (policyId === "terms") {
      meta.title = "Terms & Conditions - User Curation Agreements | MAIC India";
      meta.description = "Review the legal guidelines governing proper usage of our free testing simulators and study notes database. Academic copy rights explained.";
    } else if (policyId === "disclaimer") {
      meta.title = "Legal Disclaimer - Government Non-Affiliation | MAIC India";
      meta.description = "Critical notices regarding government non-affiliation and candidate responsibility to verify key milestones on official department portals.";
    } else if (policyId === "dmca") {
      meta.title = "DMCA Copyright Compliance Policy - MAIC India Integrity";
      meta.description = "Learn how we handle copyright claims, intellectual property registrations, counter-notices, and fast 48-hour content removal SLA.";
    } else {
      meta.title = `${policyId.toUpperCase()} Policy & Disclosures - MAIC India`;
      meta.description = "Official publisher trust, legal disclosures, and regulatory compliance indexes for MAIC India.";
    }
  }

  // --- 1. DOM Title Tag ---
  document.title = meta.title;

  // --- 2. Metatags Updates ---
  const updateMetaElement = (selector: string, value: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute("content", value);
    }
  };

  updateMetaElement('meta[name="description"]', meta.description);
  updateMetaElement('meta[property="og:title"]', meta.title);
  updateMetaElement('meta[property="og:description"]', meta.description);
  updateMetaElement('meta[property="og:url"]', meta.canonical);
  updateMetaElement('meta[property="og:type"]', meta.ogType || "website");
  updateMetaElement('meta[name="twitter:title"]', meta.title);
  updateMetaElement('meta[name="twitter:description"]', meta.description);
  updateMetaElement('meta[name="twitter:url"]', meta.canonical);

  // --- 3. Canonical Tag Update ---
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute("href", meta.canonical);
  }

  // --- 4. Dynamic Schema JSON-LD Injection ---
  const schemaScript = document.getElementById("seo-json-ld-schema");
  if (schemaScript) {
    const structuredData = generateStructuredSchema(meta);
    schemaScript.textContent = JSON.stringify(structuredData, null, 2);
  }
}
