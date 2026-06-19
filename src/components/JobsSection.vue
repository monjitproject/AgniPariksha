<script setup lang="ts">
import { ref, watch } from 'vue';
import { Briefcase, Calendar, Award, Shield, Search, ExternalLink, Bell, Landmark, CheckSquare } from 'lucide-vue-next';
import { JobPost } from '../types';
import { MOCK_JOBS } from '../data/mockData';

interface JobsSectionProps {
  activeJobId?: string | null;
}

const props = defineProps<JobsSectionProps>();

const emit = defineEmits<{
  (e: 'selectJob', jobId: string | null): void;
}>();

const jobList = ref<JobPost[]>(MOCK_JOBS);
const searchTerm = ref("");
const selectedCategory = ref("All");
const activeJob = ref<JobPost | null>(MOCK_JOBS[0]);
const isAlertSubscribed = ref(false);

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

watch(() => props.activeJobId, (newId) => {
  if (newId) {
    const match = jobList.value.find(j => j.id === newId || toSlug(j.title) === newId);
    if (match && (!activeJob.value || activeJob.value.id !== match.id)) {
      activeJob.value = match;
    }
  }
}, { immediate: true });

const categories = ["All", "Agniveer", "UPSC", "SSC", "Railway", "Police", "Banking"];

const handleSubscribe = () => {
  isAlertSubscribed.value = true;
  alert("Jai Hind! You have subscribed to daily Indian Armed Forces & State Jobs Alerts. You will receive immediate notifications of new vacancies.");
};

const triggerFakeDownload = (title: string) => {
  alert(`Simulated Download Triggered for ${title} PDF Guide. Please verify active vacancies details in the PDF Library tab.`);
};

const filteredJobs = () => {
  return jobList.value.filter(job => {
    const query = searchTerm.value.toLowerCase();
    const matchesSearch = job.title.toLowerCase().includes(query) || job.category.toLowerCase().includes(query);
    if (selectedCategory.value === "All") return matchesSearch;
    return job.category === selectedCategory.value && matchesSearch;
  });
};

const selectJob = (job: JobPost) => {
  activeJob.value = job;
  emit('selectJob', toSlug(job.title));
};

// --- Blog Publisher Form logic ---
const blogTitle = ref("");
const blogAuthor = ref("");
const blogCategory = ref("Exam Strategies");
const blogExcerpt = ref("");
const blogContent = ref("");

const getLocalBlogs = () => {
  try {
    const saved = localStorage.getItem("agnipariksha_blogs");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const localPublishedList = ref<any[]>(getLocalBlogs());

const handlePublish = (e: Event) => {
  e.preventDefault();
  if (!blogTitle.value.trim() || !blogAuthor.value.trim() || !blogContent.value.trim()) {
    alert("Missing information! Please provide Title, Author Name, and some post Content to publish.");
    return;
  }

  const newPost = {
    id: "blog-user-" + Date.now(),
    category: blogCategory.value,
    title: blogTitle.value.trim(),
    excerpt: blogExcerpt.value.trim() || (blogContent.value.trim().slice(0, 120) + "..."),
    content: blogContent.value.trim(),
    author: blogAuthor.value.trim(),
    date: new Date().toISOString().split("T")[0],
    readTime: `${Math.max(2, Math.ceil(blogContent.value.trim().split(/\s+/).length / 150))} min read`
  };

  const updatedList = [newPost, ...localPublishedList.value];
  localPublishedList.value = updatedList;
  localStorage.setItem("agnipariksha_blogs", JSON.stringify(updatedList));

  // Clear Form Fields
  blogTitle.value = "";
  blogAuthor.value = "";
  blogExcerpt.value = "";
  blogContent.value = "";

  alert(`success: Blog Post "${newPost.title}" was successfully compiled and published! Navigate to the 'Blog' tab in the header menu to read the live article.`);
};

const handleDeletePost = (id: string) => {
  if (!confirm("Are you sure you want to unpublish this blog post?")) return;
  const updated = localPublishedList.value.filter(item => item.id !== id);
  localPublishedList.value = updated;
  localStorage.setItem("agnipariksha_blogs", JSON.stringify(updated));
};
</script>

<template>
  <div class="space-y-6" id="jobs-section-viewport">
    
    <!-- Search Header Banner -->
    <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 class="text-xl font-black text-gray-900 flex items-center">
          <Briefcase class="h-6 w-6 text-[#000080] mr-2" />
          Active Indian Armed Forces & State Government Jobs Portal
        </h2>
        <p class="text-xs text-gray-500 mt-1 leading-relaxed">
          Monitor real-time military alerts, CISF constabulary entries, railway line operators, and NDA vacancy applications. Always updated.
        </p>
      </div>

      <!-- Subscribe Trigger -->
      <button
        id="btn-subscribe-job-alerts"
        @click="handleSubscribe"
        :class="[
          'px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center space-x-1 border cursor-pointer',
          isAlertSubscribed
            ? 'bg-[#138808]/10 text-[#138808] border-[#138808]/30'
            : 'bg-red-600 hover:bg-red-700 text-white border-transparent animate-pulse'
        ]"
      >
        <Bell class="h-4 w-4 fill-current" />
        <span>{{ isAlertSubscribed ? "Alerts Active" : "Get Job Alerts" }}</span>
      </button>
    </div>

    <!-- Category Selection Row -->
    <div class="flex flex-wrap items-center gap-2" id="jobs-categories-filter">
      <button
        v-for="cat in categories"
        :key="cat"
        :id="`job-cat-${cat}`"
        @click="selectedCategory = cat"
        :class="[
          'text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer',
          selectedCategory === cat
            ? 'bg-[#000080] text-white border-[#000080]'
            : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
        ]"
      >
        {{ cat === "All" ? "🌍 All Vacancies" : cat }}
      </button>
    </div>

    <!-- Main Two Column layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" id="jobs-dashboard-layout">
      
      <!-- Left Column Job Lists -->
      <div class="space-y-3 lg:col-span-1" id="jobs-catalog-aside">
        <!-- Quick Search -->
        <div class="relative mb-4">
          <input
            type="text"
            id="job-list-search"
            v-model="searchTerm"
            placeholder="Search active listings..."
            class="w-full text-xs font-bold p-3 pl-10 border border-gray-200 rounded-xl bg-white focus:outline-none"
          />
          <Search class="h-4.5 w-4.5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>

        <h4 class="font-bold text-xs uppercase text-gray-400 tracking-wider font-mono">Current Vacancies Index</h4>
        
        <div class="space-y-3 max-h-[550px] overflow-y-auto pr-1" id="jobs-index-scroller">
          <div
            v-for="job in filteredJobs()"
            :key="job.id"
            :id="`job-card-select-${job.id}`"
            @click="selectJob(job)"
            :class="[
              'p-4 rounded-xl border-2 cursor-pointer transition-all',
              activeJob?.id === job.id
                ? 'bg-white border-[#000080] shadow'
                : 'bg-white border-gray-100 hover:border-gray-200'
            ]"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-[8px] font-black uppercase text-white bg-[#FF9933] px-1.5 py-0.2 rounded font-mono">
                {{ job.category }}
              </span>
              <span class="text-[8px] text-gray-400 font-bold font-mono">Ends: {{ job.importantDates.end }}</span>
            </div>

            <h5 class="font-black text-xs text-gray-800 leading-snug">{{ job.title }}</h5>

            <div class="flex justify-between items-center text-[10px] text-gray-500 mt-4 border-t border-gray-50 pt-2">
              <span class="font-semibold text-green-700">{{ job.salary.split(" ")[0] }}</span>
              <span class="font-mono text-[9px]">Age: {{ job.ageLimit.split(" ")[0] }} Year</span>
            </div>
          </div>

          <div v-if="filteredJobs().length === 0" class="text-center py-10 bg-gray-50 rounded-xl">
            <p class="text-xs text-gray-500 italic">No recruitment found.</p>
          </div>
        </div>
      </div>

      <!-- Right Column Detailed Spec sheets -->
      <div class="lg:col-span-2 space-y-4" id="job-details-sheet">
        <div v-if="activeJob" class="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6" id="jobs-actual-content-sheet">
          
          <!-- Core summary Header of active sheet -->
          <div class="border-b border-gray-100 pb-5">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-black tracking-widest text-[#FF9933] uppercase bg-[#FF9933]/15 px-3 py-1 rounded">
                {{ activeJob.category }} recruitment notice
              </span>
              <span class="text-[10px] font-bold text-gray-400 font-mono">ID Reference: {{ activeJob.id }}</span>
            </div>

            <h1 class="text-lg sm:text-2xl font-black text-gray-900 leading-tight mt-2 italic">
              {{ activeJob.title }}
            </h1>
            
            <p class="text-[10px] text-[#000080] mt-1.5 font-bold uppercase tracking-wider">
              🎯 Notified by Ministry of Personnel & Recruiting Board division
            </p>
          </div>

          <!-- Recruitment parameters and values matrix -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans" id="job-parameter-matrix">
            
            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
              <span class="text-[9px] uppercase font-bold text-gray-400 block font-mono">1. Eligibility Criteria</span>
              <p class="font-black text-gray-800 leading-snug">{{ activeJob.eligibility }}</p>
            </div>

            <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1">
              <span class="text-[9px] uppercase font-bold text-gray-400 block font-mono">2. Mandatory Age Bracket</span>
              <p class="font-black text-gray-800 leading-snug">{{ activeJob.ageLimit }}</p>
            </div>

            <div class="bg-[#138808]/5 p-3 rounded-xl border border-[#138808]/15 space-y-1 font-sans">
              <span class="text-[9px] uppercase font-bold text-[#138808] block font-mono">3. Estimated Pay/Salary Band</span>
              <p class="font-black text-[#138808] leading-snug">{{ activeJob.salary }}</p>
            </div>

            <div class="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 space-y-1">
              <span class="text-[9px] uppercase font-bold text-[#000080] block font-mono">4. Basic Qualifications Required</span>
              <p class="font-black text-[#000080] leading-snug">{{ activeJob.qualification }}</p>
            </div>

          </div>

          <!-- Selection Process description -->
          <div class="bg-slate-50 p-5 rounded-xl border border-slate-100 text-left" id="selection-structure-box">
            <h4 class="font-black text-xs text-slate-800 uppercase tracking-wider mb-2 flex items-center">
              <CheckSquare class="h-4.5 w-4.5 text-[#000080] mr-1.5" />
              Detailed Assessment & Selection Process Hierarchy
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed font-sans">
              {{ activeJob.selectionProcess }}
            </p>
          </div>

          <!-- Timelines Dates segment -->
          <div class="border-t border-b border-gray-100 py-4" id="timetable-important-dates">
            <span class="text-[10px] uppercase font-bold font-mono text-gray-400 block mb-2">📢 Official Recruitment Schedule</span>
            
            <div class="grid grid-cols-3 gap-2 text-center text-[11px] font-bold" id="recruitment-dates-track">
              <div class="bg-green-50 p-2.5 rounded-lg border border-green-100">
                <span class="text-[9px] text-green-700 block uppercase">Registration Starts</span>
                <span class="text-gray-800 tracking-tight block mt-0.5">{{ activeJob.importantDates.start }}</span>
              </div>

              <div class="bg-red-50 p-2.5 rounded-lg border border-red-100">
                <span class="text-[9px] text-red-700 block uppercase">Registration Ends</span>
                <span class="text-gray-800 tracking-tight block mt-0.5">{{ activeJob.importantDates.end }}</span>
              </div>

              <div class="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <span class="text-[9px] text-amber-700 block uppercase">Expected Exam Date</span>
                <span class="text-gray-800 tracking-tight block mt-0.5">{{ activeJob.importantDates.exam }}</span>
              </div>
            </div>
          </div>

          <!-- CTA Apply redirect links -->
          <div class="pt-2 flex flex-col sm:flex-row gap-3" id="job-details-cta">
            <a
              :href="activeJob.applyLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 bg-[#000080] hover:bg-[#000060] text-white text-xs font-black py-3.5 px-6 rounded-lg text-center uppercase tracking-wider shadow duration-150 flex items-center justify-center space-x-1"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink class="h-4 w-4" />
            </a>

            <!-- Simulated notifications alerts trigger -->
            <button
              id="btn-fake-download-alert"
              @click="triggerFakeDownload(activeJob.title)"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black py-3 px-5 rounded-lg text-center uppercase transition-all cursor-pointer"
            >
              Official Syllabus Schema
            </button>
          </div>

          <!-- Disclaimer policy -->
          <p class="text-[9.5px] italic text-gray-400 text-center font-sans tracking-wide leading-relaxed">
            Note: Candidate registration requirements can change based on recent gazette announcements. Please double-check requirements on {{ activeJob.applyLink.replace("https://", "") }} carefully before depositing form fees.
          </p>

        </div>
        <div v-else class="bg-white p-12 rounded-2xl text-center shadow border" id="active-job-details-null">
          <Briefcase class="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p class="text-xs text-gray-500">Pick any recruitment card to view full specifications of limits, salaries, and exam calendars.</p>
        </div>
      </div>

    </div>

    <!-- Integrated Sub-component for clean modular layout -->
    <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#138808] mt-8 text-left" id="blog-publisher-hub">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-5 gap-3">
        <div>
          <h3 class="text-base font-black text-gray-900 tracking-tight flex items-center">
            <span class="bg-[#138808] text-white p-1 rounded-lg text-xs mr-2 font-mono" style="padding: 2px 6px;">LIVE</span>
            AgniPariksha Prep Blog Publisher Hub / सरकारी परीक्षा ब्लॉग प्रकाशन केंद्र
          </h3>
          <p class="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
            Write, review, and dispatch exam strategies, general knowledge tutorials, and syllabus guides directly to our public candidate forum.
          </p>
        </div>
        <span class="text-[10px] uppercase font-mono font-bold text-gray-400 bg-slate-150 px-2 py-0.5 rounded">
          Author Workspace Mode
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Form Container (7 spans on large) -->
        <form @submit="handlePublish" class="lg:col-span-7 space-y-4 font-sans text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Blog Article Title / लेख का शीर्षक *
              </label>
              <input
                type="text"
                required
                v-model="blogTitle"
                placeholder="e.g. Master Indian Polity in 15 Days"
                class="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Author Full Name / लेखक का नाम *
              </label>
              <input
                type="text"
                required
                v-model="blogAuthor"
                placeholder="e.g. Capt. Shailendra Dev"
                class="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Target Category / श्रेणी चुनें
              </label>
              <select
                v-model="blogCategory"
                class="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              >
                <option value="Exam Strategies">🎯 Exam Strategies</option>
                <option value="GK Articles">📚 GK Articles</option>
                <option value="Jobs Updates">📢 Jobs Updates</option>
                <option value="Study Tips">💡 Study Tips</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
                Short Excerpt / संक्षिप्त विवरण (Optional)
              </label>
              <input
                type="text"
                v-model="blogExcerpt"
                placeholder="Brief summary sentence..."
                class="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-700 tracking-wide mb-1">
              Article Body Content / लेख की विस्तृत विषयवस्तु *
            </label>
            <textarea
              required
              rows="6"
              v-model="blogContent"
              placeholder="Write your study tips, exam syllabi details, GK questions, or advice here. Supports both English and Hindi text..."
              class="w-full text-xs font-bold p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50 leading-relaxed font-sans"
            />
          </div>

          <div class="flex justify-end">
            <button
              type="submit"
              class="bg-[#138808] hover:bg-[#117706] text-white hover:shadow px-6 py-3 rounded-lg text-xs font-black tracking-wider uppercase transition-all duration-150 cursor-pointer"
            >
              🚀 Publish Live Article to Blog Section
            </button>
          </div>
        </form>

        <!-- Local Published posts lists (5 spans on large) -->
        <div class="lg:col-span-5 space-y-3" id="author-desk-catalogue">
          <h4 class="font-bold text-xs uppercase text-gray-400 tracking-wider font-mono text-left">
            Your Dispatched Publications ({{ localPublishedList.length }})
          </h4>

          <div class="space-y-3 max-h-[340px] overflow-y-auto pr-1" id="local-publications-list">
            <div v-for="post in localPublishedList" :key="post.id" class="p-3.5 bg-slate-50 border border-gray-200 rounded-xl text-xs space-y-2 text-left relative overflow-hidden">
              <div class="flex justify-between items-start">
                <span class="text-[9px] font-black uppercase text-[#FF9933] bg-[#FF9933]/10 px-1.5 py-0.2 rounded" style="padding: 1px 6px;">
                  {{ post.category }}
                </span>
                <button
                  @click="handleDeletePost(post.id)"
                  class="text-red-600 hover:text-red-900 font-bold transition-colors cursor-pointer text-[10px]"
                  title="Remove blog post"
                >
                  Unpublish
                </button>
              </div>

              <h5 class="font-black text-gray-800 leading-snug">{{ post.title }}</h5>
              <p class="text-[10px] text-gray-400 font-mono">
                By {{ post.author }} on {{ post.date }}
              </p>
              <p class="text-[10px] text-slate-500 font-sans line-clamp-2 italic">
                "{{ post.excerpt }}"
              </p>
            </div>

            <div v-if="localPublishedList.length === 0" class="text-center py-10 bg-slate-50 border border-dashed border-gray-200 rounded-xl text-gray-400 italic">
              No articles published yet in this session. Use the editor to compose and push your custom posts live.
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
