import React, { useState } from "react";
import { Briefcase, Calendar, Award, Shield, Search, ExternalLink, Bell, Landmark, CheckSquare } from "lucide-react";
import { JobPost } from "../types";
import { MOCK_JOBS } from "../data/mockData";

export default function JobsSection() {
  const [jobList, setJobList] = useState<JobPost[]>(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeJob, setActiveJob] = useState<JobPost | null>(MOCK_JOBS[0]);
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);

  const categories = ["All", "Agniveer", "UPSC", "SSC", "Railway", "Police", "Banking"];

  const handleSubscribe = () => {
    setIsAlertSubscribed(true);
    alert("Jai Hind! You have subscribed to daily Indian Armed Forces & State Jobs Alerts. You will receive immediate notifications of new vacancies.");
  };

  const filteredJobs = jobList.filter(job => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = job.title.toLowerCase().includes(query) || job.category.toLowerCase().includes(query);
    if (selectedCategory === "All") return matchesSearch;
    return job.category === selectedCategory && matchesSearch;
  });

  return (
    <div className="space-y-6" id="jobs-section-viewport">
      
      {/* Search Header Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center">
            <Briefcase className="h-6 w-6 text-[#000080] mr-2" />
            Active Indian Armed Forces & State Government Jobs Portal
          </h2>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Monitor real-time military alerts, CISF constabulary entries, railway line operators, and NDA vacancy applications. Always updated.
          </p>
        </div>

        {/* Subscribe Trigger */}
        <button
          id="btn-subscribe-job-alerts"
          onClick={handleSubscribe}
          className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center space-x-1 border ${
            isAlertSubscribed
              ? "bg-[#138808]/10 text-[#138808] border-[#138808]/30 cursor-default"
              : "bg-red-600 hover:bg-red-700 text-white border-transparent animate-pulse"
          }`}
        >
          <Bell className="h-4 w-4 fill-current" />
          <span>{isAlertSubscribed ? "Alerts Active" : "Get Job Alerts"}</span>
        </button>
      </div>

      {/* Category Selection Row */}
      <div className="flex flex-wrap items-center gap-2" id="jobs-categories-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`job-cat-${cat}`}
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
              selectedCategory === cat
                ? "bg-[#000080] text-white border-[#000080]"
                : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
            }`}
          >
            {cat === "All" ? "🌍 All Vacancies" : cat}
          </button>
        ))}
      </div>

      {/* Main Two Column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="jobs-dashboard-layout">
        
        {/* Left Column Job Lists */}
        <div className="space-y-3 lg:col-span-1" id="jobs-catalog-aside">
          {/* Quick Search */}
          <div className="relative mb-4">
            <input
              type="text"
              id="job-list-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search active listings..."
              className="w-full text-xs font-bold p-3 pl-10 border border-gray-200 rounded-xl bg-white"
            />
            <Search className="h-4.5 w-4.5 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider font-mono">Current Vacancies Index</h4>
          
          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1" id="jobs-index-scroller">
            {filteredJobs.map((job) => {
              const isActive = activeJob?.id === job.id;
              
              return (
                <div
                  key={job.id}
                  id={`job-card-select-${job.id}`}
                  onClick={() => setActiveJob(job)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isActive
                      ? "bg-white border-[#000080] shadow"
                      : "bg-white border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[8px] font-black uppercase text-white bg-[#FF9933] px-1.5 py-0.2 rounded font-mono">
                      {job.category}
                    </span>
                    <span className="text-[8px] text-gray-400 font-bold font-mono">Ends: {job.importantDates.end}</span>
                  </div>

                  <h5 className="font-black text-xs text-gray-800 leading-snug">{job.title}</h5>

                  <div className="flex justify-between items-center text-[10px] text-gray-500 mt-4 border-t border-gray-50 pt-2">
                    <span className="font-semibold text-green-700">{job.salary.split(" ")[0]}</span>
                    <span className="font-mono text-[9px]">Age: {job.ageLimit.split(" ")[0]} Year</span>
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 italic">No recruitment found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column Detailed Spec sheets */}
        <div className="lg:col-span-2 space-y-4" id="job-details-sheet">
          {activeJob ? (
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6" id="jobs-actual-content-sheet">
              
              {/* Core summary Header of active sheet */}
              <div className="border-b border-gray-100 pb-5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black tracking-widest text-[#FF9933] uppercase bg-[#FF9933]/15 px-3 py-1 rounded">
                    {activeJob.category} recruitment notice
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 font-mono">ID Reference: {activeJob.id}</span>
                </div>

                <h1 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight mt-2 italic">
                  {activeJob.title}
                </h1>
                
                <p className="text-[10px] text-[#000080] mt-1.5 font-bold uppercase tracking-wider">
                  🎯 Notified by Ministry of Personnel & Recruiting Board division
                </p>
              </div>

              {/* Recruitment parameters and values matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans" id="job-parameter-matrix">
                
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">1. Eligibility Criteria</span>
                  <p className="font-black text-gray-800 leading-snug">{activeJob.eligibility}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-gray-400 block font-mono">2. Mandatory Age Bracket</span>
                  <p className="font-black text-gray-800 leading-snug">{activeJob.ageLimit}</p>
                </div>

                <div className="bg-[#138808]/5 p-3 rounded-xl border border-[#138808]/15 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#138808] block font-mono">3. Estimated Pay/Salary Band</span>
                  <p className="font-black text-[#138808] leading-snug">{activeJob.salary}</p>
                </div>

                <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-[#000080] block font-mono">4. Basic Qualifications Required</span>
                  <p className="font-black text-[#000080] leading-snug">{activeJob.qualification}</p>
                </div>

              </div>

              {/* Selection Process description */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100" id="selection-structure-box">
                <h4 className="font-black text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center">
                  <CheckSquare className="h-4.5 w-4.5 text-[#000080] mr-1.5" />
                  Detailed Assessment & Selection Process Hierarchy
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {activeJob.selectionProcess}
                </p>
              </div>

              {/* Timelines Dates segment */}
              <div className="border-t border-b border-gray-100 py-4" id="timetable-important-dates">
                <span className="text-[10px] uppercase font-bold font-mono text-gray-400 block mb-2">📢 Official Recruitment Schedule</span>
                
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold" id="recruitment-dates-track">
                  <div className="bg-green-50 p-2.5 rounded-lg border border-green-100">
                    <span className="text-[9px] text-green-700 block uppercase">Registration Starts</span>
                    <span className="text-gray-800 tracking-tight block mt-0.5">{activeJob.importantDates.start}</span>
                  </div>

                  <div className="bg-red-50 p-2.5 rounded-lg border border-red-100">
                    <span className="text-[9px] text-red-700 block uppercase">Registration Ends</span>
                    <span className="text-gray-800 tracking-tight block mt-0.5">{activeJob.importantDates.end}</span>
                  </div>

                  <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                    <span className="text-[9px] text-amber-700 block uppercase">Expected Exam Date</span>
                    <span className="text-gray-800 tracking-tight block mt-0.5">{activeJob.importantDates.exam}</span>
                  </div>
                </div>
              </div>

              {/* CTA Apply redirect links */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3" id="job-details-cta">
                <a
                  href={activeJob.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#000080] hover:bg-[#000060] text-white text-xs font-black py-3.5 px-6 rounded-lg text-center uppercase tracking-wider shadow duration-150 flex items-center justify-center space-x-1"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="h-4 w-4" />
                </a>

                {/* Simulated notifications alerts trigger */}
                <button
                  id="btn-fake-download-alert"
                  onClick={() => alert(`Simulated Download Triggered for ${activeJob.title} PDF Guide. Please verify active vacancies details in the PDF Library tab.`)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black py-3 px-5 rounded-lg text-center uppercase transition-all"
                >
                  Official Syllabus Schema
                </button>
              </div>

              {/* Disclaimer policy */}
              <p className="text-[9.5px] italic text-gray-400 text-center font-sans tracking-wide leading-relaxed">
                Note: Candidate registration requirements can change based on recent gazette announcements. Please double-check requirements on {activeJob.applyLink.replace("https://", "")} carefully before depositing form fees.
              </p>

            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl text-center shadow border" id="active-job-details-null">
              <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Pick any recruitment card to view full specifications of limits, salaries, and exam calendars.</p>
            </div>
          )}
        </div>

      </div>

      {/* NEW SECTION: AgniPariksha Prep Blog Publisher Hub */}
      <BlogPublisherForm />

    </div>
  );
}

// Integrated Sub-component for clean modular layout
function BlogPublisherForm() {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogCategory, setBlogCategory] = useState("Exam Strategies");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [localPublishedList, setLocalPublishedList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("agnipariksha_blogs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogAuthor.trim() || !blogContent.trim()) {
      alert("Missing information! Please provide Title, Author Name, and some post Content to publish.");
      return;
    }

    const newPost = {
      id: "blog-user-" + Date.now(),
      category: blogCategory,
      title: blogTitle.trim(),
      excerpt: blogExcerpt.trim() || (blogContent.trim().slice(0, 120) + "..."),
      content: blogContent.trim(),
      author: blogAuthor.trim(),
      date: new Date().toISOString().split("T")[0],
      readTime: `${Math.max(2, Math.ceil(blogContent.trim().split(/\s+/).length / 150))} min read`
    };

    const updatedList = [newPost, ...localPublishedList];
    setLocalPublishedList(updatedList);
    localStorage.setItem("agnipariksha_blogs", JSON.stringify(updatedList));

    // Clear Form Fields
    setBlogTitle("");
    setBlogAuthor("");
    setBlogExcerpt("");
    setBlogContent("");

    alert(`success: Blog Post "${newPost.title}" was successfully compiled and published! Navigate to the 'Blog' tab in the header menu to read the live article.`);
  };

  const handleDeletePost = (id: string) => {
    if (!confirm("Are you sure you want to unpublish this blog post?")) return;
    const updated = localPublishedList.filter(item => item.id !== id);
    setLocalPublishedList(updated);
    localStorage.setItem("agnipariksha_blogs", JSON.stringify(updated));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#138808] mt-8 text-left" id="blog-publisher-hub">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-5 gap-3">
        <div>
          <h3 className="text-base font-black text-gray-900 tracking-tight flex items-center">
            <span className="bg-[#138808] text-white p-1 rounded-lg text-xs mr-2 font-mono">LIVE</span>
            AgniPariksha Prep Blog Publisher Hub / सरकारी परीक्षा ब्लॉग प्रकाशन केंद्र
          </h3>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
            Write, review, and dispatch exam strategies, general knowledge tutorials, and syllabus guides directly to our public candidate forum.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-gray-400 bg-slate-150 px-2 py-0.5 rounded">
          Author Workspace Mode
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Container (9 spans on large) */}
        <form onSubmit={handlePublish} className="lg:col-span-7 space-y-4 font-sans text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Blog Article Title / लेख का शीर्षक *
              </label>
              <input
                type="text"
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="e.g. Master Indian Polity in 15 Days"
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Author Full Name / लेखक का नाम *
              </label>
              <input
                type="text"
                required
                value={blogAuthor}
                onChange={(e) => setBlogAuthor(e.target.value)}
                placeholder="e.g. Capt. Shailendra Dev"
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Target Category / श्रेणी चुनें
              </label>
              <select
                value={blogCategory}
                onChange={(e) => setBlogCategory(e.target.value)}
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              >
                <option value="Exam Strategies">🎯 Exam Strategies</option>
                <option value="GK Articles">📚 GK Articles</option>
                <option value="Jobs Updates">📢 Jobs Updates</option>
                <option value="Study Tips">💡 Study Tips</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Short Excerpt / संक्षिप्त विवरण (Optional)
              </label>
              <input
                type="text"
                value={blogExcerpt}
                onChange={(e) => setBlogExcerpt(e.target.value)}
                placeholder="Brief summary sentence..."
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
              Article Body Content / लेख की विस्तृत विषयवस्तु *
            </label>
            <textarea
              required
              rows={6}
              value={blogContent}
              onChange={(e) => setBlogContent(e.target.value)}
              placeholder="Write your study tips, exam syllabi details, GK questions, or advice here. Supports both English and Hindi text..."
              className="w-full text-xs font-bold p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50 leading-relaxed font-sans"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#138808] hover:bg-[#117706] text-white hover:shadow px-6 py-3 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-150 cursor-pointer"
            >
              🚀 Publish Live Article to Blog Section
            </button>
          </div>
        </form>

        {/* Local Published posts lists (5 spans on large) */}
        <div className="lg:col-span-5 space-y-3" id="author-desk-catalogue">
          <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider font-mono">
            Your Dispatched Publications ({localPublishedList.length})
          </h4>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1" id="local-publications-list">
            {localPublishedList.map((post) => (
              <div key={post.id} className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-xs space-y-2 text-left relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black uppercase text-[#FF9933] bg-[#FF9933]/10 px-1.5 py-0.2 rounded">
                    {post.category}
                  </span>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-600 hover:text-red-900 font-bold transition-colors cursor-pointer text-[10px]"
                    title="Remove blog post"
                  >
                    Unpublish
                  </button>
                </div>

                <h5 className="font-black text-gray-800 leading-snug">{post.title}</h5>
                <p className="text-[10px] text-gray-400 font-mono">
                  By {post.author} on {post.date}
                </p>
                <p className="text-[10px] text-slate-500 font-sans line-clamp-2 italic">
                  "{post.excerpt}"
                </p>
              </div>
            ))}

            {localPublishedList.length === 0 && (
              <div className="text-center py-10 bg-slate-50 border border-dashed border-gray-200 rounded-xl text-gray-400 italic">
                No articles published yet in this session. Use the editor to compose and push your custom posts live.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
