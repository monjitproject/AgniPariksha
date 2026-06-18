import React, { useState } from "react";
import { Globe, User, Clock, ArrowRight, ArrowLeft, PenTool, Flame, Newspaper } from "lucide-react";
import { BlogPost } from "../types";
import { MOCK_BLOGS } from "../data/mockData";

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  React.useEffect(() => {
    let localPublished: BlogPost[] = [];
    try {
      const saved = localStorage.getItem("agnipariksha_blogs");
      if (saved) {
        localPublished = JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }

    fetch("/api/get-automated-content")
      .then((res) => res.json())
      .then((data) => {
        const automatedBlogs = data && data.blogs ? data.blogs : [];
        setBlogs([...localPublished, ...automatedBlogs, ...MOCK_BLOGS]);
      })
      .catch((err) => {
        console.error("Error loading server-based blogs:", err);
        setBlogs([...localPublished, ...MOCK_BLOGS]);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(blogs.map(b => b.category)))].filter(Boolean);

  const filteredBlogs = blogs.filter(b => {
    if (activeCategory === "All") return true;
    return b.category === activeCategory;
  });

  return (
    <div className="space-y-6" id="blog-section-viewport">
      
      {/* Blog index list view */}
      {!activeBlog ? (
        <div className="space-y-6" id="blog-index-container">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center">
                <Newspaper className="h-6 w-6 text-[#000080] mr-2" />
                AgniPariksha Exam Strategies & Defense GK Blog
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Gain competitive advantages using tactics compiled directly from veteran captains and decorated study analysts.
              </p>
            </div>
            
            <div className="bg-[#138808]/15 text-[#138808] text-xs font-bold px-3 py-1.5 rounded-full border border-[#138808]/20 flex items-center shrink-0">
              <Flame className="h-4.5 w-4.5 text-[#FF9933] mr-1 animate-bounce" />
              <span>Aspirants' Choice Blog</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2" id="blog-categories-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  activeCategory === cat
                    ? "bg-[#000080] text-white border-[#000080]"
                    : "bg-white text-gray-700 border-gray-100 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="blogs-grid">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                id={`blog-card-${blog.id}`}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow flex flex-col justify-between cursor-pointer"
                onClick={() => {
                  setActiveBlog(blog);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 font-bold">
                    <span className="text-[#FF9933] uppercase bg-[#FF9933]/15 px-2 py-0.5 rounded font-black">
                      {blog.category}
                    </span>
                    <span>{blog.date}</span>
                  </div>

                  <h3 className="text-base font-black text-gray-900 hover:text-[#000080] transition-colors leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                {/* Footer specs */}
                <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-mono text-gray-400">
                  <span className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1 text-[#000080]" />
                    <span>{blog.author.split(" ")[1] || blog.author}</span>
                  </span>
                  
                  <span className="flex items-center text-[#138808] font-bold uppercase tracking-wider">
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Blog deep reader view */
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6" id="blog-reader-view">
          
          {/* Back button */}
          <button
            id="back-to-blogs-list"
            onClick={() => setActiveBlog(null)}
            className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-gray-900 font-bold cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back to Articles</span>
          </button>

          {/* Title & Author segment */}
          <div className="border-b border-gray-100 pb-4">
            <span className="text-[10px] font-black uppercase text-[#FF9933] bg-[#FF9933]/15 px-2.5 py-1 rounded">
              {activeBlog.category} category
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight mt-3">
              {activeBlog.title}
            </h1>

            <div className="flex flex-wrap gap-4 items-center text-xs font-mono text-gray-400 mt-4">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1 text-[#000080]" fill="currentColor" />
                <strong className="text-gray-600 font-sans">{activeBlog.author}</strong>
              </span>

              <span>•</span>
              <span>Published: {activeBlog.date}</span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-[#000080]" />
                <span>{activeBlog.readTime}</span>
              </span>
            </div>
          </div>

          {/* Deep Content block */}
          <div className="text-xs sm:text-sm font-sans leading-relaxed text-gray-805 whitespace-pre-wrap max-w-4xl" id="blog-document-content">
            {activeBlog.content}
          </div>

          {/* Patriotic editorial disclaimer seal */}
          <div className="bg-[#138808]/5 p-4 rounded-xl border border-[#138808]/15 text-xs text-green-950 flex items-center space-x-3 mt-8">
            <PenTool className="h-8 w-8 text-[#138808] shrink-0" />
            <div>
              <p className="font-bold">AgniPariksha Editorial Guarantee:</p>
              <p className="text-[11px] text-green-950/80 leading-snug mt-0.5">
                Our editorial team verifies recruitment alerts against gazette printouts from official employment news sheets. Study keys are crafted to aid conceptual memory layouts.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
