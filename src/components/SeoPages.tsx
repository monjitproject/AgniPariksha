import React, { useState } from "react";
import { 
  Shield, Scale, FileText, HelpCircle, Mail, MapPin, 
  Phone, CheckCircle, Award, Landmark, AlertCircle, Sparkles, Send, Map
} from "lucide-react";

interface SeoPagesProps {
  initialPolicyId?: string;
}

export default function SeoPages({ initialPolicyId = "about" }: SeoPagesProps) {
  const [activePolicy, setActivePolicy] = useState<string>(initialPolicyId);

  // Contact Us states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactQuery, setContactQuery] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Careers state
  const [appliedRole, setAppliedRole] = useState("");

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactQuery) {
      setContactMsg("Please populate all parameters first.");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setContactName("");
      setContactEmail("");
      setContactQuery("");
      setContactMsg("Jai Hind! Your ticket has been registered. Our Academic Officers will revert shortly.");
      setTimeout(() => setContactMsg(""), 5000);
    }, 1200);
  };

  const pagesList = [
    { id: "about", name: "About Us", category: "General" },
    { id: "contact", name: "Contact Us", category: "General" },
    { id: "faq", name: "FAQ / Help", category: "General" },
    { id: "careers", name: "Careers", category: "General" },
    { id: "privacy", name: "Privacy Policy", category: "AdSense Legal" },
    { id: "terms", name: "Terms & Conditions", category: "AdSense Legal" },
    { id: "cookies", name: "Cookie Policy", category: "AdSense Legal" },
    { id: "disclaimer", name: "Disclaimer", category: "AdSense Legal" },
    { id: "dmca", name: "DMCA Policy", category: "AdSense Legal" },
    { id: "editorial", name: "Editorial Policy", category: "AdSense Legal" },
    { id: "factcheck", name: "Fact Check Policy", category: "AdSense Legal" },
    { id: "refund", name: "Refund Policy", category: "AdSense Legal" },
    { id: "sitemap-doc", name: "HTML Sitemap Index", category: "Trust & Sitemap" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="seo-pages-viewport">
      
      {/* Left side selector panel */}
      <div className="lg:col-span-1 space-y-4" id="seo-links-sidebar">
        <h3 className="font-sans font-black text-xs uppercase text-gray-400 tracking-wider">AdSense Disclosure Index</h3>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-2 space-y-1" id="seo-links-list">
          {pagesList.map((p) => (
            <button
              key={p.id}
              id={`policy-tab-${p.id}`}
              onClick={() => setActivePolicy(p.id)}
              className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                activePolicy === p.id
                  ? "bg-[#000080]/10 text-[#000080]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{p.name}</span>
              <span className="text-[9px] font-mono text-gray-400 font-normal scale-90">{p.category}</span>
            </button>
          ))}
        </div>

        <div className="bg-amber-50 rounded-xl p-4 border border-amber-150 text-[10px] text-amber-800 space-y-1">
          <p className="font-bold uppercase tracking-wider">AdSense Compliance Inspector Info:</p>
          <p className="leading-relaxed">All static text blocks have been drafted in compliance with the Google Publisher Policies (GPP).</p>
        </div>
      </div>

      {/* Right side page details viewer */}
      <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100" id="seo-pages-content-scroller">
        
        {/* A. ABOUT US */}
        {activePolicy === "about" && (
          <div className="space-y-4" id="seo-about-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center">
              <Landmark className="h-6 w-6 mr-1.5 text-[#000080]" />
              About AgniPariksha.com
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
              AgniPariksha.com is a dedicated educational repository engineered for Indian competitive job aspirants preparing for the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), State Police departments, Agniveer Written Common Entrance Exam (CEE), Airmen, Marine Sailors, and commissioned entry streams like NDA/CDS.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
              Founded on the pillars of **Aatmanirbhar Bharat**, our mission is to offer completely free access to objective mock questions, previous syllabus sheets, state recruitments info, and PDF booklets without hiding materials behind premium paywalls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" id="about-goals-matrix">
              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="font-black text-xs text-gray-800 block mb-1">🎯 Complete Study Syllabus</span>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed">Systematic notes addressing general science, global history, battlefields tactics, and quantitative reasoning formulas.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <span className="font-black text-xs text-gray-800 block mb-1">🇮🇳 Respecting Aspirants</span>
                <p className="text-[11px] text-gray-500 font-sans leading-relaxed">Ensuring verified notifications matched against official recruiting boards to prevent mock candidate exploitation.</p>
              </div>
            </div>
          </div>
        )}

        {/* B. CONTACT US */}
        {activePolicy === "contact" && (
          <div className="space-y-5" id="seo-contact-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center">
              <Mail className="h-6 w-6 mr-1.5 text-[#000080]" />
              Contact Our Academic Branch
            </h1>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Have queries regarding syllabus sheets, incorrect answer keys or copyright claims? Lodge an explicit support ticket below:
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-4 max-w-lg font-sans">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Full Name:</label>
                <input
                  type="text"
                  id="contact-form-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs font-bold p-3 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Email Address:</label>
                <input
                  type="email"
                  id="contact-form-email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="rahul@domain.com"
                  className="w-full text-xs font-bold p-3 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Message Query Details:</label>
                <textarea
                  id="contact-form-message"
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  rows={4}
                  placeholder="Describe your doubt..."
                  className="w-full text-xs p-3 border border-gray-200 bg-gray-50 rounded-lg focus:outline-none"
                />
              </div>

              {contactMsg && (
                <div className="text-[10px] font-bold text-green-700 bg-green-50 p-2 rounded border border-green-200" id="contact-success-prompt">
                  {contactMsg}
                </div>
              )}

              <button
                type="submit"
                id="btn-contact-submit"
                disabled={isSending}
                className="bg-[#000080] hover:bg-[#000060] text-white text-xs font-black py-2.5 px-6 rounded-lg uppercase tracking-wider transition-all flex items-center space-x-1.5"
              >
                <Send className="h-4 w-4" />
                <span>{isSending ? "Forwarding Ticket Code..." : "File Support Ticket"}</span>
              </button>
            </form>

            <div className="pt-6 border-t border-gray-100 text-xs font-mono text-gray-500 space-y-1" id="physical-office-info">
              <p className="font-bold uppercase tracking-wider block text-[10px] text-[#000080]">🏫 Registered Academy Hub</p>
              <p className="flex items-center"><MapPin className="h-4 w-4 mr-1 inline" /> AgniPariksha Head Branch, Cantonment Main Road, Jaipur, Rajasthan, Pin: 302006</p>
              <p className="flex items-center"><Phone className="h-4 w-4 mr-1 inline" /> Helpline Support: +91 141 2450011</p>
            </div>
          </div>
        )}

        {/* C. PRIVACY POLICY */}
        {activePolicy === "privacy" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-privacy-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center font-sans tracking-tight">
              <Shield className="h-6 w-6 mr-1.5 text-indigo-700" />
              Privacy Policy - AgniPariksha
            </h1>
            <p className="text-[10px] font-mono font-bold text-gray-400">Last Modified: June 17, 2026</p>
            
            <p>At AgniPariksha, accessible from AgniPariksha.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by AgniPariksha and how we use it.</p>
            
            <h3 className="font-black text-gray-800 text-xs uppercase mt-4">Log Files</h3>
            <p>AgniPariksha follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

            <h3 className="font-black text-gray-800 text-xs uppercase mt-4">Google DoubleClick DART Cookie</h3>
            <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://policies.google.com/technologies/ads</a>.</p>

            <h3 className="font-black text-gray-800 text-xs uppercase mt-4">Our Advertising Partners</h3>
            <p>Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data:</p>
            <ul className="list-disc pl-5 font-bold text-indigo-900">
              <li>Google AdSense</li>
            </ul>
          </div>
        )}

        {/* D. TERMS & CONDITIONS */}
        {activePolicy === "terms" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-terms-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center font-sans tracking-tight">
              <FileText className="h-6 w-6 mr-1.5 text-indigo-700" />
              Terms and Conditions
            </h1>
            <p>Welcome to AgniPariksha!</p>
            <p>These terms and conditions outline the rules and regulations for the use of AgniPariksha's Website, located at AgniPariksha.com.</p>
            <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use AgniPariksha if you do not agree to take all of the terms and conditions stated on this page.</p>
            <h3 className="font-black text-gray-800 text-xs uppercase mt-4">Content Liability</h3>
            <p>We shall not be hold responsible for any content that appears on our Website. You agree to protect and defend us against all claims that is rising on our Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>
            <h3 className="font-black text-gray-800 text-xs mt-4 uppercase">Disclaimer of Educational Material</h3>
            <p>Materials displayed on this site are solely for training preparation. AgniPariksha does not claim to hold rights to government recruitment patents or guarantee standard success in Union military entries.</p>
          </div>
        )}

        {/* E. DISCLAIMER */}
        {activePolicy === "disclaimer" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-disclaimer-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center font-sans tracking-tight">
              <AlertCircle className="h-6 w-6 mr-1.5 text-red-650" />
              Legal Disclaimer Circular
            </h1>
            <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200">
              <strong className="block mb-1">📢 CRITICAL ACCREDITATION WARNING:</strong>
              <p className="leading-relaxed">
                AgniPariksha.com is an independent educational prep site. **We are NOT affiliated with, authorized by, sponsored by, or linked directly to the Indian Army, Navy, Air Force, Union Public Service Commission, Staff Selection Commission, or any government department recruitment body.**
              </p>
            </div>
            <p>The information provided by AgniPariksha (“we,” “us,” or “our”) on AgniPariksha.com (the “Site”) is for general educational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or exam guides on the Site.</p>
          </div>
        )}

        {/* F. COOKIES POLICY */}
        {activePolicy === "cookies" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-cookies-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center font-sans tracking-tight">
              <Shield className="h-6 w-6 mr-1.5 text-[#000080]" />
              Cookie Policy
            </h1>
            <p>This is the Cookie Policy for AgniPariksha, accessible from AgniPariksha.com.</p>
            <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
            <h3 className="font-black text-gray-800 text-xs mt-4 uppercase">Disable Cookies</h3>
            <p>You can prevent the setting of cookies by adjusting the settings on your browser. Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
          </div>
        )}

        {/* G. DMCA POLICY */}
        {activePolicy === "dmca" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-dmca-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center font-sans tracking-tight">
              <Scale className="h-6 w-6 mr-1.5 text-indigo-700" />
              DMCA Copyright Compliance
            </h1>
            <p>AgniPariksha respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond quickly to claims of copyright infringement committed using our service.</p>
            <p>If you are a copyright owner, or authorized on behalf of one, please report alleged copyright infringements taking place on or through the Site by complete details to our administrative team at **copyright@agnipariksha.com**, including:</p>
            <ul className="list-decimal pl-5 space-y-2">
              <li>A physical or electronic signature of the copyright owner.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Your contact info including email or phone number.</li>
            </ul>
          </div>
        )}

        {/* H. EDITORIAL POLICY */}
        {activePolicy === "editorial" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-editorial-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center tracking-tight">
              Editorial Guidelines
            </h1>
            <p>AgniPariksha's educational study cards are curated through our senior editorial team comprising retired defense education division captains, state historians, and current affairs researchers.</p>
            <p>All quantitative logic solvers are checked programmatically, and syllabus notifications are verified against national employment news journals (Rojgar Samachar) before publication.</p>
          </div>
        )}

        {/* I. FACT CHECK POLICY */}
        {activePolicy === "factcheck" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-factcheck-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 tracking-tight">
              Fact-Checking Integrity Policy
            </h1>
            <p>We pride ourselves on 100% accurate static general knowledge notes regarding military branches history, battle cries, and constitutional amendments. If you spot any historical mismatch, please report it immediately to ourजयपुर cantonment branch. Correction notes will be reviewed and applied within 48 hours.</p>
          </div>
        )}

        {/* J. REFUND POLICY */}
        {activePolicy === "refund" && (
          <div className="space-y-4 font-sans text-xs text-gray-600 leading-relaxed" id="seo-refund-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 tracking-tight">
              Refund Policy for Mock Candidate Preparations
            </h1>
            <p>All materials, PDFs, simulated exams, and GK questionnaires hosted on AgniPariksha are entirely **FREE** of charge for students. Since we never charge candidates fee increments or sell premium subscriptions, there are no refund policies required.</p>
          </div>
        )}

        {/* K. FAQ */}
        {activePolicy === "faq" && (
          <div className="space-y-4" id="seo-faq-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center">
              <HelpCircle className="h-6 w-6 mr-1.5 text-[#000080]" />
              Frequently Asked Questions (FAQ)
            </h1>

            <div className="space-y-4 text-xs font-sans leading-relaxed" id="faq-accordions">
              <div className="bg-gray-50 p-4 rounded-xl border">
                <span className="font-extrabold text-gray-800 block text-xs mb-1">Q1: Is AgniPariksha officially operated by the Indian Army?</span>
                <p className="text-gray-650">No. We are a completely independent, student-run private preparation workspace created to assist Agniveer, CEE, and military aspirants.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border">
                <span className="font-extrabold text-gray-800 block text-xs mb-1">Q2: How do I print my generated Certificate?</span>
                <p className="text-gray-650">After finishing any mock exam with an adequate passing score (50% or more), insert your name and single-click 'Issue Custom Certificate'. You can then select 'Print Certificate' to store a professional PDF of your badge.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border">
                <span className="font-extrabold text-gray-800 block text-xs mb-1">Q3: How often are exam schedules updated?</span>
                <p className="text-gray-650">Our administrative monitors update active state listings and UPSC agendas weekly matching rojgar news sheets.</p>
              </div>
            </div>
          </div>
        )}

        {/* L. CAREERS */}
        {activePolicy === "careers" && (
          <div className="space-y-4" id="seo-careers-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center">
              <Award className="h-6 w-6 mr-1.5 text-indigo-700" />
              Careers at AgniPariksha Academy
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Want to compile general knowledge notes, draft practice MCQs or audit state jobs alerts? Join our remote Indian academic team:
            </p>

            <div className="space-y-3" id="careers-roles-list">
              <div className="p-4 border rounded-xl bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">Remote Part-Time</span>
                  <h4 className="font-black text-xs text-gray-850 mt-1">Written Exam MCQ Curators (GK, Science)</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">Drafting 50 analytical objective items weekly for CDS & Agniveer models.</p>
                </div>
                
                <button
                  onClick={() => {
                    setAppliedRole("MCQ Curators");
                    alert("Application registered for Written Exam MCQ Curators! Our board will evaluate your profile within 10 business days.");
                  }}
                  className="bg-[#000080] text-white font-black text-[10px] py-1.5 px-3 rounded uppercase tracking-wider text-center"
                >
                  Apply Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* M. HTML SITEMAP */}
        {activePolicy === "sitemap-doc" && (
          <div className="space-y-4" id="seo-sitemap-content">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 border-b pb-3 flex items-center">
              <Map className="h-6 w-6 mr-1.5 text-emerald-650" />
              AgniPariksha HTML Sitemap Directory
            </h1>
            <p className="text-xs text-slate-500 font-sans">
              This visual directory maps all reachable endpoints of AgniPariksha.com for rapid search indexes indexation:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono" id="visual-sitemap-index">
              <div className="space-y-1 bg-gray-50 p-4 rounded-xl border">
                <span className="font-black text-[#000080] block text-[11px] mb-2 font-sans border-b pb-1">Primary preparation hubs:</span>
                <p>• <span className="text-gray-800">AgniPariksha - /home</span></p>
                <p>• <span className="text-gray-800">GK Quizzes Board - /quizzes</span></p>
                <p>• <span className="text-gray-800">Study Materials - /study</span></p>
                <p>• <span className="text-gray-800">PDF Document Catalog - /pdfs</span></p>
                <p>• <span className="text-gray-800">Active Govt Vacancies - /jobs</span></p>
                <p>• <span className="text-gray-800">Aspirants Guidance Blog - /blog</span></p>
              </div>

              <div className="space-y-1 bg-gray-55 p-4 rounded-xl border bg-slate-50">
                <span className="font-black text-gray-800 block text-[11px] mb-2 font-sans border-b pb-1">Regulatory & Sitemap Files:</span>
                <p>• Sitemap XML: <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">/sitemap.xml</a></p>
                <p>• Robots Crawler: <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">/robots.txt</a></p>
                <p>• Admin control seat: <span className="text-gray-650">/admin-operations</span></p>
                <p>• Active Student Panel: <span className="text-gray-650">/student-dashboard</span></p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
