import { MAIC_BLOGS } from "../data/maicBlogsData";
import { MOCK_QUIZZES, MOCK_JOBS, MOCK_NOTES, MOCK_PDFS, MOCK_BLOGS } from "../data/mockData";

export const baseUrl = "https://maicindia.com";

// Helper to convert text to slug
export const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Check if a given requested URL path is theoretically valid
export function checkPathValidity(pathStr: string): boolean {
  if (pathStr === "/" || pathStr === "") return true;
  const segments = pathStr.split("/").filter(Boolean);
  if (segments.length === 0) return true;
  
  const primary = segments[0].toLowerCase();
  const subId = segments[1];
  
  const validPolicies = ["about", "contact", "faq", "careers", "privacy", "terms", "cookies", "disclaimer", "dmca", "editorial", "factcheck", "refund", "sitemap-doc", "correction"];
  if (validPolicies.includes(primary)) {
    return segments.length === 1;
  }
  
  const validSingleRoutes = [
    "quizzes", "study", "current-affairs", "jobs", "admit-card", "results", "pdfs", "blog", "authors", "dashboard", "chat", "admin", "mock-tests"
  ];
  if (validSingleRoutes.includes(primary)) {
    if (segments.length === 1) return true;
    if (segments.length === 2) {
      if (primary === "blog") {
        return MAIC_BLOGS.some(b => b.id === subId || toSlug(b.title) === subId);
      }
      if (primary === "quizzes") {
        return MOCK_QUIZZES.some(q => q.id === subId);
      }
      if (primary === "jobs") {
        return MOCK_JOBS.some(j => j.id === subId);
      }
      return true; // Other subIDs (like study note slugs, current affairs, etc.) are allowed dynamically
    }
  }
  
  if (primary === "category") {
    return segments.length === 2;
  }
  
  return false;
}

// Helper to generate dynamic SEO page data for server-side HTML injection
export function getPageSeoData(pathStr: string) {
  let title = "MAIC India - Armed Forces & Govt Jobs Preparation Portal";
  let description = "Access 100% free interactive mock tests, syllabus-aligned study notes, solved previous year papers (PYPs), and live government job alerts.";
  let canonical = `${baseUrl}${pathStr}`;
  let ogType = "website";
  let jsonLd: any[] = [];
  
  // Default values for Robots and Keywords
  let robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  let keywords = "sarkari naukri, government jobs, indian army agniveer, ssc gd mock test, ssc cgl preparation, railway rrb ntpc, defense exam gk, free previous year papers, pyps pdf, general knowledge quiz";

  // Prevent indexing on administrative, search, preview, login, and draft paths
  const noIndexPaths = ["/admin", "/dashboard", "/login", "/preview", "/search", "/private", "/draft", "/tmp", "/_next"];
  const isNoIndex = noIndexPaths.some(p => pathStr.toLowerCase().startsWith(p)) || pathStr.includes("?");
  if (isNoIndex) {
    robots = "noindex, nofollow";
  }

  // 1. Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${baseUrl}/#organization`,
    "name": "MAIC India",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/assets/logo-og.png`,
      "width": "512",
      "height": "512"
    },
    "description": "India's premier independent free-access exam preparation and mock test portal.",
    "sameAs": [
      "https://facebook.com/maicindia",
      "https://twitter.com/maicindia",
      "https://linkedin.com/company/maicindia",
      "https://telegram.me/maicindia_official"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-141-XXXXXXX",
      "contactType": "customer support",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi"]
    }
  };
  
  // 2. Website SearchAction Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "MAIC India",
    "alternateName": "MAIC Govt Exam Prep",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  jsonLd.push(organizationSchema, websiteSchema);

  // Parse path segments
  const segments = pathStr.split("/").filter(Boolean);
  
  // 3. Breadcrumb list schema
  const breadcrumbList = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl }
  ];
  let currentAccumulated = baseUrl;
  segments.forEach((seg, index) => {
    currentAccumulated += `/${seg}`;
    const readableName = seg.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    breadcrumbList.push({
      "@type": "ListItem",
      "position": index + 2,
      "name": readableName,
      "item": currentAccumulated
    });
  });
  
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbList
  };
  jsonLd.push(breadcrumbSchema);

  // Calculate dynamic Open Graph SVG image URL
  let ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&category=Preparation%20Portal`;

  if (segments.length === 0) {
    title = "MAIC India - Free Armed Forces & Govt Jobs Mock Tests";
    description = "Prepare for SSC, Railway, Indian Army Agniveer, NDA, & Air Force. Solve free interactive mock test series, practice questions, and read verified daily job alerts.";
    ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Free Armed Forces & Govt Jobs Mock Tests")}&category=Exam%20Portal`;
  } else {
    const primary = segments[0].toLowerCase();
    const subId = segments[1];

    if (primary === "quizzes") {
      title = "Interactive GK Quizzes & Mock Exams - MAIC India";
      description = "Test your skills! Free timed subject quizzes for Indian Army, Navy, General Awareness, Mathematics formulas, and reasoning logics.";
      keywords = "gk quizzes, free mock test, general awareness quiz, army agniveer exam questions, dynamic quiz simulator, math formula testing";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Interactive GK Quizzes & Mock Exams")}&category=GK%20Quizzes`;
      
      if (subId) {
        const quiz = MOCK_QUIZZES.find(q => q.id === subId);
        if (quiz) {
          title = `${quiz.title} - Free Practice Mock Quiz | MAIC India`;
          description = `Take the 100% free practice quiz for ${quiz.title}. Total ${quiz.questions.length} objective questions with instant explanations & grading.`;
          keywords = `${quiz.title.toLowerCase()}, free mock quiz, ${quiz.category.toLowerCase()}, test prep question answers, interactive exam`;
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(quiz.title)}&category=${encodeURIComponent(quiz.category)}`;
          
          const quizSchema = {
            "@context": "https://schema.org",
            "@type": "Quiz",
            "name": quiz.title,
            "description": description,
            "learningResourceType": "Quiz",
            "educationalUse": "Practice",
            "educationalAlignment": {
              "@type": "AlignmentObject",
              "alignmentType": "educationalLevel",
              "educationalFramework": "Competitive Exams",
              "targetName": "Government Job Exam Preparation"
            },
            "author": {
              "@type": "Organization",
              "name": "MAIC India Academic Council"
            }
          };
          jsonLd.push(quizSchema);
        }
      }
    } else if (primary === "mock-tests") {
      title = "Full-Length Simulated Practice Mock Tests - MAIC India";
      description = "Agniveer Army General Duty, Technical, Clerk & SSC GD full mock tests simulator. Features live timers, sectional cuts, and official grading criteria.";
      keywords = "full-length mock tests, exam simulator online, free practice mock papers, timed test dashboard, ssc gd practice papers";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Full-Length Simulated Practice Mock Tests")}&category=Mock%20Tests`;
    } else if (primary === "study") {
      title = "Syllabus Study Material & Revision Cheat Sheets - MAIC India";
      description = "Bilingual (Hindi/English) study notes, formula lists, historical battles summaries, and static GK tables. Free for competitive jobs preparation.";
      keywords = "syllabus study notes, revision cheat sheets, exam reference manuals, static gk syllabus, defense physics formulas, historical events hindi";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Syllabus Study Material & Revision Guides")}&category=Study%20Notes`;
      
      if (subId) {
        const noteName = subId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        title = `${noteName} - Syllabus Study Note | MAIC India`;
        keywords = `${subId.split("-").join(", ")}, free exam study notes, revision handbook pdf`;
        ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(noteName)}&category=Study%20Note`;
        
        const note = MOCK_NOTES.find(n => n.id === subId);
        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": noteName,
          "description": description,
          "image": ogImage,
          "datePublished": note?.date || "2026-07-03",
          "inLanguage": "en-IN",
          "author": {
            "@type": "Person",
            "name": note?.author || "MAIC Academic Advisor"
          },
          "publisher": {
            "@type": "Organization",
            "name": "MAIC India",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/assets/logo-og.png`
            }
          },
          "wordCount": 1420,
          "timeRequired": "PT6M"
        };
        jsonLd.push(articleSchema);
      }
    } else if (primary === "current-affairs") {
      title = "Daily Current Affairs & Geopolitics Updates - MAIC India";
      description = "Latest bilateral treaties, space milestones, defense updates, and index rankings curated for competitive examinations. Bilingual updates updated daily.";
      keywords = "daily current affairs, defense news updates, latest treaties, international rankings 2026, general awareness daily, current affairs hindi english";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Daily Current Affairs & Geopolitics")}&category=Current%20Affairs`;
      
      if (subId) {
        const caTitle = subId.split("-").join(" ");
        const noteName = subId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        title = `Current Affairs Brief: ${noteName} | MAIC India`;
        keywords = `${caTitle}, current affairs brief, daily defence notifications, general awareness update`;
        ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Brief: " + noteName)}&category=Current%20Affairs`;
        
        const newsSchema = {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": `Current Affairs Brief: ${noteName}`,
          "description": description,
          "image": ogImage,
          "datePublished": "2026-07-03",
          "author": {
            "@type": "Person",
            "name": "Defense Editor"
          },
          "publisher": {
            "@type": "Organization",
            "name": "MAIC India",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/assets/logo-og.png`
            }
          }
        };
        jsonLd.push(newsSchema);
      }
    } else if (primary === "pdfs") {
      title = "Previous Year Solved Papers & PDF Notes Library - MAIC India";
      description = "Download 100% free PDF revision files, official recruitment circulars, and bilingually solved previous year papers (PYPs) for SSC & Railway.";
      keywords = "previous year papers, solved exam pyps pdf, official recruitment circulars download, ssc gd question answers pdf, download revision notes";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Previous Year Solved Papers & PDF Library")}&category=PDF%20Library`;
      
      if (subId) {
        const pdf = MOCK_PDFS.find(p => p.id === subId);
        if (pdf) {
          title = `Download Solved PYP: ${pdf.title} | MAIC India`;
          description = `Free PDF download file for ${pdf.title}. Category: ${pdf.category}, total size: ${pdf.size}. Practice solved answers for real-time exam advantages.`;
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(pdf.title)}&category=PDF%20Download`;
          
          const collectionPageSchema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": pdf.title,
            "description": description,
            "url": canonical,
            "publisher": {
              "@type": "Organization",
              "name": "MAIC India"
            }
          };
          jsonLd.push(collectionPageSchema);
        }
      }
    } else if (primary === "jobs") {
      title = "Latest Sarkari Government Job Alerts (Live 2026) - MAIC India";
      description = "Live updates on Indian Armed Forces recruitment, CAPF rally notifications, SSC vacancies, and Railway recruitment boards. 100% verified sources.";
      keywords = "sarkari job alerts, live government vacancy 2026, armed forces rally schedules, capf recruitment circular, ssc vacancy registration online";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Latest Sarkari Government Job Alerts")}&category=Job%20Alerts`;
      
      if (subId) {
        const job = MOCK_JOBS.find(j => j.id === subId);
        if (job) {
          title = `${job.title} - Verified Recruitment Details | MAIC India`;
          description = `Official circular details for ${job.title}. Qualification required: ${job.qualification}, Eligibility: ${job.eligibility}, Salary scale: ${job.salary}. Check closing dates.`;
          keywords = `${job.title.toLowerCase()}, govt recruitment application link, vacancy qualification, ${job.category.toLowerCase()} job alert`;
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(job.title)}&category=${encodeURIComponent(job.category)}`;
          
          // Google JobPosting Schema - EXTREMELY advanced structured indexing
          const jobPostingSchema = {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            "title": job.title,
            "description": `Official recruitment details for ${job.title}. Eligibility criteria: ${job.eligibility}. Educational Qualification: ${job.qualification}. Selection criteria/process: ${job.selectionProcess}. Basic salary parameters: ${job.salary}.`,
            "datePosted": job.importantDates?.start || "2026-06-01",
            "validThrough": job.importantDates?.end || "2026-12-31",
            "employmentType": "FULL_TIME",
            "hiringOrganization": {
              "@type": "Organization",
              "name": "MAIC India",
              "sameAs": baseUrl,
              "logo": `${baseUrl}/assets/logo-og.png`
            },
            "jobLocation": {
              "@type": "Place",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jaipur",
                "addressRegion": "Rajasthan",
                "addressCountry": "IN"
              }
            },
            "baseSalary": {
              "@type": "MonetaryAmount",
              "currency": "INR",
              "value": {
                "@type": "QuantitativeValue",
                "value": job.salary.includes("21,700") ? 21700 : (job.salary.includes("19,900") ? 19900 : 30000),
                "unitText": "MONTH"
              }
            }
          };
          jsonLd.push(jobPostingSchema);
        }
      }
    } else if (primary === "admit-card") {
      title = "Sarkari Exam Admit Cards & Schedules - MAIC India";
      description = "Download upcoming competitive recruitment exam hall tickets and view verified venue schedules. Clean links to official board download utilities.";
      keywords = "admit card download, upcoming exam schedules, roll number hall ticket download, ssc gd exam venue details, govt recruitment call letter";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Sarkari Exam Admit Cards & Hall Tickets")}&category=Admit%20Cards`;
    } else if (primary === "results") {
      title = "Latest Exam Results, Cut-offs, & Merit Sheets - MAIC India";
      description = "Verified selection lists, category-wise cut-off percentiles, and merit results for SSC CGL, SSC GD, Railway, and state police recruitment boards.";
      keywords = "exam results download, merit cut-off scores, official selection lists pdf, ssc gd result direct link, competitive exam qualifying marks";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Latest Exam Results & Cut-off Sheets")}&category=Results`;
    } else if (primary === "authors") {
      title = "Meet Our Exam Curation Advisors & CAPT CAPFs - MAIC India";
      description = "Learn about the retired military captains, Ph.D. scholars, and veteran recruitment advisors who verify and audit all academic content at MAIC India.";
      keywords = "academic advisory board, military captains advisors, exam verification team, professional content curators";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Academic Content Advisory Board")}&category=Advisory%20Board`;
    } else if (primary === "chat") {
      title = "Real-Time AI Academic Tutor Chatroom - MAIC India";
      description = "Get instant answers! Ask our grounded AI assistant about General Science equations, Indian historical dates, constitutional articles, or math tricks.";
      keywords = "ai academic tutor, free math chatbot, defense exam chat help, live educational ai tool, general science answers";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Real-Time AI Academic Tutor Chat")}&category=AI%20Tutor`;
    } else if (primary === "category") {
      const categoryName = subId ? subId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "All";
      title = `${categoryName} Categories - Govt Jobs & Exam Preparation | MAIC India`;
      description = `Access our curated mock tests, exam notes, solved papers, and live job alerts for ${categoryName} category on MAIC India.`;
      keywords = `${categoryName.toLowerCase()}, exam categories, subcategory preparation files, custom exam mockups`;
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(categoryName + " Category Resources")}&category=Category%20Guide`;
      
      const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${categoryName} Resources`,
        "description": description,
        "url": canonical
      };
      jsonLd.push(collectionSchema);
    } else if (primary === "blog") {
      title = "MAIC Vetted Career Guides & Vedic Math Blogs - MAIC India";
      description = "Premium comprehensive study guides (1500-2500 words), Vedic mathematics calculation hacks, logical reasoning frameworks, and interview prep guides.";
      keywords = "vedic math calculations, quick reasoning hacks, comprehensive career guides, job interview preparatives, professional recruitment guides";
      ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Premium Vetted Career Guides & Blogs")}&category=Career%20Guides`;
      
      if (subId) {
        ogType = "article";
        const blog = MAIC_BLOGS.find(b => b.id === subId || toSlug(b.title) === subId) || MOCK_BLOGS.find(b => b.id === subId);
        if (blog) {
          title = `${blog.title} | MAIC India Career Guide`;
          description = blog.excerpt;
          keywords = `${blog.title.toLowerCase()}, career guide pdf download, vedic computation hacks, recruitment blog`;
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(blog.title)}&category=Career%20Guide`;
          
          // Article / BlogPosting Schema
          const articleSchema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "datePublished": blog.date || "2026-07-03",
            "dateModified": blog.date || "2026-07-03",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": canonical
            },
            "author": {
              "@type": "Person",
              "name": blog.author || "MAIC Senior Editor"
            },
            "publisher": {
              "@type": "Organization",
              "name": "MAIC India",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/assets/logo-og.png`
              }
            },
            "image": ogImage,
            "wordCount": 1820,
            "timeRequired": "PT9M"
          };
          jsonLd.push(articleSchema);
        }
      }
    } else {
      // Policies
      const validPolicies = ["about", "contact", "faq", "careers", "privacy", "terms", "cookies", "disclaimer", "dmca", "editorial", "factcheck", "refund", "sitemap-doc", "correction"];
      if (validPolicies.includes(primary)) {
        if (primary === "about") {
          title = "About maicindia.com - Free Aspirant Empowerment Portal";
          description = "Learn about our foundational vision to eliminate educational paywalls. Discover our academic advisory board and student-first curation workflows.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("About Our Academic Mission")}&category=About%20Us`;
        } else if (primary === "contact") {
          title = "Contact Us - Submit Support Inquiry Ticket | MAIC India";
          description = "Reach out to our Academic support, Job alerts division, or Legal desk. Access our physical office coordinates in Cantonment Main Road, Jaipur.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Contact Customer Support")}&category=Contact%20Us`;
        } else if (primary === "faq") {
          title = "FAQ & Candidate Helpdesk - MAIC India Support";
          description = "Common answers regarding mock test scoring, syllabus updates, negative marking algorithms, and downloading verified study PDFs.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Frequently Asked Questions")}&category=FAQ`;
          
          // FAQ Schema
          const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Is MAIC India affiliated with the Indian Government or Armed Forces?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, maicindia.com is a completely independent, student-run educational portal. We are NOT connected in any official capacity with the Ministry of Defence, SSC, RRB, UPSC, or any recruitment board."
                }
              },
              {
                "@type": "Question",
                "name": "Are the mock test series, study PDFs, and certificates entirely free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, 100% of our educational content, including simulated mock tests, custom explanation keys, PDF notes, and milestone badges, is completely free of charge. No premium paywalls exist."
                }
              }
            ]
          };
          jsonLd.push(faqSchema);
        } else if (primary === "privacy") {
          title = "Privacy Policy - Data Protection & Cookie Consent | MAIC India";
          description = "Read our strict data storage directives, compliance with India's IT Act 2000, and Google DoubleClick DART AdSense transparency terms.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Privacy & Data Protection Policy")}&category=Legal`;
        } else if (primary === "terms") {
          title = "Terms & Conditions - User Curation Agreements | MAIC India";
          description = "Review the legal guidelines governing proper usage of our free testing simulators and study notes database. Academic copy rights explained.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Terms of Service Agreements")}&category=Legal`;
        } else if (primary === "disclaimer") {
          title = "Legal Disclaimer - Government Non-Affiliation | MAIC India";
          description = "Critical notices regarding government non-affiliation and candidate responsibility to verify key milestones on official department portals.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("Government Non-Affiliation Disclaimer")}&category=Legal`;
        } else if (primary === "dmca") {
          title = "DMCA Copyright Compliance Policy - MAIC India Integrity";
          description = "Learn how we handle copyright claims, intellectual property registrations, counter-notices, and fast 48-hour content removal SLA.";
          ogImage = `${baseUrl}/api/og?title=${encodeURIComponent("DMCA Copyright Compliance Policy")}&category=Legal`;
        }
      }
    }
  }

  return { title, description, canonical, ogType, jsonLd, keywords, robots, ogImage };
}

// Function to inject server-side computed metadata into index.html
export function injectMetadata(html: string, pageData: any): string {
  let modifiedHtml = html;

  // 1. Replace Title
  const titleRegex = /<title>[^<]*<\/title>/i;
  const newTitleTag = `<title>${pageData.title}</title>`;
  if (titleRegex.test(modifiedHtml)) {
    modifiedHtml = modifiedHtml.replace(titleRegex, newTitleTag);
  } else {
    modifiedHtml = modifiedHtml.replace("</head>", `${newTitleTag}\n</head>`);
  }

  // Helper to replace or add meta/link tags safely
  const replaceOrAddMeta = (nameAttr: string, value: string, isProperty = false) => {
    const attr = isProperty ? "property" : "name";
    const regex = new RegExp(`<meta\\s+[^>]*${attr}=["']${nameAttr}["'][^>]*>`, 'i');
    const newTag = `<meta ${attr}="${nameAttr}" content="${value}" />`;
    if (regex.test(modifiedHtml)) {
      modifiedHtml = modifiedHtml.replace(regex, newTag);
    } else {
      modifiedHtml = modifiedHtml.replace("</head>", `${newTag}\n</head>`);
    }
  };

  // 2. Replace Description
  replaceOrAddMeta("description", pageData.description);

  // 3. Robots metadata
  replaceOrAddMeta("robots", pageData.robots);

  // 4. Keywords metadata
  replaceOrAddMeta("keywords", pageData.keywords);

  // 5. Theme color
  replaceOrAddMeta("theme-color", "#0f172a");

  // 6. Microsoft Tiles for Win8/Win10
  replaceOrAddMeta("msapplication-TileColor", "#0f172a");
  
  const msConfigRegex = /<meta\s+[^>]*name=["']msapplication-config["'][^>]*>/i;
  const msConfigTag = `<meta name="msapplication-config" content="/browserconfig.xml" />`;
  if (msConfigRegex.test(modifiedHtml)) {
    modifiedHtml = modifiedHtml.replace(msConfigRegex, msConfigTag);
  } else {
    modifiedHtml = modifiedHtml.replace("</head>", `${msConfigTag}\n</head>`);
  }

  // 7. PWA Webmanifest tag
  const manifestRegex = /<link\s+[^>]*rel=["']manifest["'][^>]*>/i;
  const manifestTag = `<link rel="manifest" href="/manifest.webmanifest" />`;
  if (manifestRegex.test(modifiedHtml)) {
    modifiedHtml = modifiedHtml.replace(manifestRegex, manifestTag);
  } else {
    modifiedHtml = modifiedHtml.replace("</head>", `${manifestTag}\n</head>`);
  }

  // 8. Open Graph Tags
  replaceOrAddMeta("og:title", pageData.title, true);
  replaceOrAddMeta("og:description", pageData.description, true);
  replaceOrAddMeta("og:url", pageData.canonical, true);
  replaceOrAddMeta("og:type", pageData.ogType, true);
  replaceOrAddMeta("og:image", pageData.ogImage, true);
  replaceOrAddMeta("og:site_name", "MAIC India", true);
  replaceOrAddMeta("og:locale", "en_IN", true);

  // 9. Twitter Cards
  replaceOrAddMeta("twitter:card", "summary_large_image");
  replaceOrAddMeta("twitter:title", pageData.title);
  replaceOrAddMeta("twitter:description", pageData.description);
  replaceOrAddMeta("twitter:url", pageData.canonical);
  replaceOrAddMeta("twitter:image", pageData.ogImage);
  replaceOrAddMeta("twitter:site", "@maicindia");
  replaceOrAddMeta("twitter:creator", "@maicindia");

  // 10. Canonical Link Tag
  const canonicalRegex = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  const canonicalTag = `<link rel="canonical" href="${pageData.canonical}" />`;
  if (canonicalRegex.test(modifiedHtml)) {
    modifiedHtml = modifiedHtml.replace(canonicalRegex, canonicalTag);
  } else {
    modifiedHtml = modifiedHtml.replace("</head>", `${canonicalTag}\n</head>`);
  }

  // 11. Hreflang Tags (Multi-language readiness)
  const hreflangRegex = /<link\s+[^>]*hreflang=["'][^"']*["'][^>]*>/gi;
  // Remove old ones first to prevent duplicates
  modifiedHtml = modifiedHtml.replace(hreflangRegex, "");
  const hreflangs = [
    `<link rel="alternate" hreflang="en-IN" href="${pageData.canonical}" />`,
    `<link rel="alternate" hreflang="hi-IN" href="${pageData.canonical}" />`,
    `<link rel="alternate" hreflang="x-default" href="${pageData.canonical}" />`
  ].join("\n");
  modifiedHtml = modifiedHtml.replace("</head>", `${hreflangs}\n</head>`);

  // 12. JSON-LD Schema Script Tag with @graph support
  const schemaScriptRegex = /<script\s+[^>]*id=["']seo-json-ld-schema["'][^>]*>[\s\S]*?<\/script>/i;
  const formattedSchema = {
    "@context": "https://schema.org",
    "@graph": pageData.jsonLd
  };
  const newSchemaScript = `<script type="application/ld+json" id="seo-json-ld-schema">\n${JSON.stringify(formattedSchema, null, 2)}\n</script>`;
  if (schemaScriptRegex.test(modifiedHtml)) {
    modifiedHtml = modifiedHtml.replace(schemaScriptRegex, newSchemaScript);
  } else {
    modifiedHtml = modifiedHtml.replace("</head>", `${newSchemaScript}\n</head>`);
  }

  return modifiedHtml;
}
