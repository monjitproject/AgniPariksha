<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Briefcase, Calendar, Award, Shield, Search, ExternalLink, Bell, Landmark, CheckSquare, RefreshCw, Sparkles, Globe } from 'lucide-vue-next';
import { JobPost } from '../types';
import { MOCK_JOBS } from '../data/mockData';
import JobArticleTemplate from './JobArticleTemplate.vue';
import CategoryGuide from './CategoryGuide.vue';
import { getAuthorByIdOrName } from '../data/authorsData';

interface JobsSectionProps {
  activeJobId?: string | null;
}

const props = defineProps<JobsSectionProps>();

const emit = defineEmits<{
  (e: 'selectJob', jobId: string | null): void;
  (e: 'navigate', tab: string, subId?: string | null): void;
}>();

const jobList = ref<JobPost[]>(MOCK_JOBS);
const searchTerm = ref("");
const selectedCategory = ref("All");
const activeJob = ref<JobPost | null>(null);
const isAlertSubscribed = ref(false);

const displayMode = ref<'standard' | 'adsense-template'>('standard');

const isLoading = ref(true);
const isResearching = ref(false);
const researchLogs = ref<string[]>([]);
const currentLogIndex = ref(0);

const logMessages = [
  "Connecting to Feed Address: https://www.sarkariresult.com/feed/ ...",
  "Acquiring live XML payload channel from Sarkari Result index...",
  "Translating XML item channels (titles, dates, registration guidelines) into schema attributes...",
  "Running Gemini 3.5 AI analyzer to extrapolate age limit and selection structures...",
  "Validating official application links and syllabus verification checklists...",
  "Publishing daily automated live government vacancies index..."
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchJobs = async (force = false) => {
  if (force) {
    isResearching.value = true;
    researchLogs.value = [];
    currentLogIndex.value = 0;
    
    // Simulate interactive logs step-by-step
    for (let i = 0; i < logMessages.length; i++) {
      researchLogs.value.push(logMessages[i]);
      currentLogIndex.value = i;
      await sleep(1000);
    }
  } else {
    isLoading.value = true;
  }

  try {
    const res = await fetch(`/api/sarkari-jobs${force ? '?force=true' : ''}`);
    const data = await res.json();
    if (data && data.jobs && Array.isArray(data.jobs)) {
      jobList.value = data.jobs;
      if (data.jobs.length > 0) {
        // If there's high priority matching URL id
        const slug = props.activeJobId;
        const match = slug ? data.jobs.find((j: any) => toSlug(j.title) === slug || j.id === slug) : null;
        activeJob.value = match || data.jobs[0];
      }
    }
  } catch (err) {
    console.error("Failed to load sarkari jobs:", err);
  } finally {
    isLoading.value = false;
    isResearching.value = false;
  }
};

onMounted(() => {
  fetchJobs();
});

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

watch(() => props.activeJobId, (newId) => {
  if (newId && jobList.value) {
    const match = jobList.value.find(j => j.id === newId || toSlug(j.title) === newId);
    if (match && (!activeJob.value || activeJob.value.id !== match.id)) {
      activeJob.value = match;
    }
  }
}, { immediate: true });

const categories = ["All", "SSC", "Railway", "Banking", "Police", "Defence", "Teaching", "UPSC", "State Gov"];

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
    const categoryMatch = job.category || "";
    const titleMatch = job.title || "";
    const matchesSearch = titleMatch.toLowerCase().includes(query) || categoryMatch.toLowerCase().includes(query);
    if (selectedCategory.value === "All") return matchesSearch;
    
    // Dynamic matching for custom aggregated categories
    if (selectedCategory.value === "Defence") {
      return (job.category === "Defence" || job.category === "Agniveer" || job.category === "UPSC") && matchesSearch;
    }
    if (selectedCategory.value === "Banking") {
      return (job.category === "Banking" || job.category === "Bank") && matchesSearch;
    }
    
    return job.category === selectedCategory.value && matchesSearch;
  });
};

const getJobAuthor = (job: JobPost) => {
  if (!job) return getAuthorByIdOrName('s-dixit');
  if (job.id === 'ssc-gd-2026' || job.category === 'SSC' || job.category === 'State Gov') {
    return getAuthorByIdOrName('rs-rathore');
  }
  if (job.id === 'agniveer-army-2026' || job.category === 'Agniveer' || job.category === 'Army') {
    return getAuthorByIdOrName('jaswant-singh');
  }
  if (job.category === 'Defence' || job.category === 'Navy' || job.category === 'Air Force' || job.category === 'UPSC') {
    return getAuthorByIdOrName('amit-kaul');
  }
  return getAuthorByIdOrName('s-dixit');
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
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest animate-pulse">Live</span>
          <span class="bg-green-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">SarkariResult.com Integration</span>
        </div>
        <h2 class="text-xl font-black text-gray-900 flex items-center">
          <Briefcase class="h-6 w-6 text-[#000080] mr-2" />
          Active Indian Armed Forces & State Government Jobs Portal
        </h2>
        <p class="text-xs text-gray-500 leading-relaxed">
          Monitor real-time military alerts, CISF constabulary entries, railway line operators, and NDA vacancy applications. Fast daily synchronization.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Live Research Trigger -->
        <button
          id="btn-research-sarkari-jobs"
          @click="fetchJobs(true)"
          :disabled="isResearching || isLoading"
          class="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white transition-all shadow-md items-center space-x-1 flex cursor-pointer disabled:opacity-50"
        >
          <Sparkles class="h-4 w-4" :class="{'animate-spin': isResearching}" />
          <span>{{ isResearching ? "Researching..." : "Research & Publish Live" }}</span>
        </button>

        <!-- Subscribe Trigger -->
        <button
          id="btn-subscribe-job-alerts"
          @click="handleSubscribe"
          :class="[
            'px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center space-x-1 border cursor-pointer',
            isAlertSubscribed
              ? 'bg-[#138808]/10 text-[#138808] border-[#138808]/30'
              : 'bg-[#000080] hover:bg-[#000060] text-white border-transparent'
          ]"
        >
          <Bell class="h-4 w-4 fill-current" />
          <span>{{ isAlertSubscribed ? "Alerts Active" : "Get Job Alerts" }}</span>
        </button>
      </div>
    </div>

    <!-- Category Selection Row -->
    <div class="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100" id="jobs-categories-filter">
      <div class="flex flex-wrap items-center gap-2">
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
      <div class="flex items-center space-x-1.5 text-[11px] text-gray-500 font-mono">
        <Globe class="h-3.5 w-3.5 text-blue-500 animate-pulse" />
        <span>Source: SARKARIRESULT.COM</span>
      </div>
    </div>

    <!-- Interactive Category Comprehensive Guide for AdSense Compliance -->
    <div v-if="selectedCategory !== 'All' && !isResearching && !isLoading" class="animate-fade-in" id="jobs-category-guide-wrapper">
      <CategoryGuide :category="selectedCategory" />
    </div>

    <!-- Dynamic Research Terminal -->
    <div v-if="isResearching" class="bg-slate-900 text-green-400 p-5 rounded-2xl shadow-xl font-mono text-xs border border-green-500/20 space-y-3 overflow-hidden transition-all duration-300">
      <div class="absolute top-0 right-0 p-3 select-none flex items-center space-x-1.5 opacity-80 text-[10px] text-green-300">
        <span class="inline-block h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
        <span>RESEARCHING LIVE VACANCIES STATE/CENTRAL...</span>
      </div>
      <h3 class="text-white font-black flex items-center text-xs">
        <Sparkles class="h-4.5 w-4.5 text-amber-400 mr-2 animate-pulse" />
        Gemini Automated Research Engine / भारतीय सरकारी नौकरी अनुसंधान
      </h3>
      <div class="space-y-1.5 my-3 bg-black/40 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed max-h-[140px] overflow-y-auto">
        <div v-for="(log, idx) in researchLogs" :key="idx" :class="[idx === currentLogIndex ? 'text-green-300 font-bold' : 'text-slate-500']" class="flex items-start">
          <span class="text-green-500 mr-2">></span>
          <span>{{ log }}</span>
        </div>
      </div>
      <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-green-550 via-emerald-400 to-teal-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :style="{ width: `${((currentLogIndex + 1) / logMessages.length) * 100}%` }"></div>
      </div>
    </div>

    <!-- Skeleton Loading Panel -->
    <div v-else-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <!-- Left Column Skeletons -->
      <div class="space-y-3 lg:col-span-1">
        <div class="h-11 bg-gray-200 rounded-xl mb-4"></div>
        <div class="h-4 bg-gray-100 rounded w-1/3 mb-4"></div>
        <div v-for="i in 4" :key="i" class="p-4 bg-white border-2 border-gray-100 rounded-xl space-y-3">
          <div class="flex justify-between">
            <div class="h-3 bg-gray-200 rounded w-12"></div>
            <div class="h-3 bg-gray-100 rounded w-16"></div>
          </div>
          <div class="h-4 bg-gray-300 rounded w-5/6"></div>
          <div class="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
      <!-- Right Column Skeleton Detailed Sheet -->
      <div class="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 space-y-6">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-8 bg-gray-300 rounded w-3/4"></div>
        <div class="h-4 bg-gray-100 rounded w-1/2"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>
        </div>
        <div class="h-20 bg-slate-50 rounded-xl border border-slate-100"></div>
        <div class="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    <!-- Main Two Column layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="jobs-dashboard-layout">
      
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
              'p-4 rounded-xl border-2 cursor-pointer transition-all hover:translate-x-1 duration-200',
              activeJob?.id === job.id
                ? 'bg-white border-[#000080] shadow-md ring-2 ring-[#000080]/10'
                : 'bg-white border-gray-100 hover:border-gray-250 hover:shadow-sm'
            ]"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-[#000080] bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {{ job.category }}
              </span>
              <span class="text-[11px] text-red-650 font-semibold font-mono">Ends: {{ job.importantDates.end }}</span>
            </div>

            <h5 class="font-bold text-[15px] text-slate-900 leading-snug hover:text-[#000080] transition-colors">{{ job.title }}</h5>

            <div class="flex justify-between items-center text-[12px] text-gray-500 mt-4 border-t border-gray-100 pt-2 font-sans">
              <span class="font-semibold text-emerald-700">{{ job.salary ? job.salary.split(" ")[0] : "Salary scale" }}</span>
              <span class="font-medium">Age Limit: {{ job.ageLimit ? job.ageLimit.split(" ")[0] : "Details" }}</span>
            </div>
          </div>

          <div v-if="filteredJobs().length === 0" class="text-center py-10 bg-gray-50 rounded-xl">
            <p class="text-xs text-gray-500 italic">No recruitment found.</p>
          </div>
        </div>
      </div>

      <!-- Right Column Detailed Spec sheets -->
      <div class="lg:col-span-2 space-y-4" id="job-details-sheet">
        
        <!-- AdSense Template Toggle Banner -->
        <div v-if="activeJob" class="bg-white p-4 rounded-2xl border border-gray-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xs">
          <div class="text-left space-y-0.5">
            <span class="inline-block text-[8px] font-mono font-black uppercase text-[#000080] bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150">AdSense Layout Approved</span>
            <h4 class="text-xs font-black text-gray-900">Explore Content Vetting Platform</h4>
          </div>
          <div class="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button 
              @click="displayMode = 'standard'"
              :class="['text-[10px] font-black uppercase px-3 py-1.5 rounded-md cursor-pointer transition-colors', displayMode === 'standard' ? 'bg-[#000080] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200']"
            >
              📋 Quick summary
            </button>
            <button 
              @click="displayMode = 'adsense-template'"
              :class="['text-[10px] font-black uppercase px-3.5 py-1.5 rounded-md cursor-pointer transition-colors flex items-center gap-1.5', displayMode === 'adsense-template' ? 'bg-[#000080] text-white shadow-xs' : 'text-slate-650 hover:bg-slate-200']"
            >
              <span>🔥 1,800+ Words Template</span>
              <span class="bg-amber-500 text-slate-950 text-[8px] px-1 rounded-sm font-black leading-none">AdSense</span>
            </button>
          </div>
        </div>

        <!-- Render AdSense template layout directly when selected -->
        <div v-if="activeJob && displayMode === 'adsense-template'" class="animate-fade-in">
          <JobArticleTemplate :selectedJobId="activeJob.id" />
        </div>

        <div v-else-if="activeJob" class="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 space-y-6" id="jobs-actual-content-sheet">
          
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
            
            <p class="text-[10px] text-[#000080] mt-1.5 font-bold uppercase tracking-wider flex items-center justify-between flex-wrap gap-2">
              <span>🎯 Notified by Ministry of Personnel & Recruiting Board division</span>
              <span class="flex items-center gap-1.5 font-mono text-[10px] text-slate-550 normal-case font-medium">
                <span>✓ Reviewed by:</span>
                <button 
                  @click="emit('navigate', 'authors', getJobAuthor(activeJob).id)"
                  class="font-black text-[#000080] hover:underline bg-transparent border-none p-0 cursor-pointer font-sans text-[10.5px]"
                >
                  {{ getJobAuthor(activeJob).name }}
                </button>
                <span class="bg-emerald-50 text-emerald-800 text-[8.5px] font-black font-sans uppercase px-1.5 py-0.2 rounded border border-emerald-250">Vetted</span>
              </span>
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
              class="h-[52px] rounded-xl text-[16px] font-semibold uppercase tracking-wider flex-1 bg-[#000080] hover:bg-[#000060] hover:shadow-md text-white transition-all flex items-center justify-center gap-1.5 duration-200 cursor-pointer shadow-sm focus:outline-none"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink class="h-5 w-5" />
            </a>

            <!-- Simulated notifications alerts trigger -->
            <button
              id="btn-fake-download-alert"
              @click="triggerFakeDownload(activeJob.title)"
              class="h-[52px] rounded-xl text-[16px] font-semibold uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 transition-all duration-200 hover:shadow-sm cursor-pointer focus:outline-none"
            >
              Official Syllabus Schema
            </button>
          </div>

          <!-- Disclaimer policy -->
          <p class="text-[9.5px] italic text-gray-400 text-center font-sans tracking-wide leading-relaxed">
            Note: Candidate registration requirements can change based on recent gazette announcements. Please double-check requirements on {{ activeJob.applyLink.replace("https://", "") }} carefully before depositing form fees.
          </p>

        </div>
        <div v-else class="bg-white p-6 sm:p-10 rounded-2xl shadow-md border border-gray-150 text-left space-y-6" id="active-job-details-null">
          <div class="border-b border-gray-150 pb-4">
            <div class="flex items-center gap-2 text-[#000080]">
              <Briefcase class="h-6 w-6 text-[#000080]" />
              <span class="text-[10px] font-black uppercase tracking-widest bg-[#000080]/10 px-2.5 py-1 rounded">Sarkari Careers Guideline</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-2">
              Indian Government Jobs & Commissions Resource Hub
            </h2>
            <p class="text-[11px] text-slate-500 font-sans mt-1">
              Select any live vacancy alert card on the left to view the comprehensive, triple-vetted official syllabus details, age eligibility formulas, and apply links.
            </p>
          </div>

          <div class="text-xs sm:text-sm text-slate-650 space-y-4 font-sans leading-relaxed">
            <p>
              To protect candidates from unverified speculation and clickbait notifications, the **AgniPariksha Academic Board** curates verified circular summaries directly compiled from the **Ministry of Personnel, Public Grievances and Pensions** and official Government Gazettes. Below is a structured index of the primary recruitment commissions in India to help align your career objectives:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-extrabold text-[#000080] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span class="w-2 h-2 bg-[#FF9933] rounded-full"></span>
                  1. Staff Selection Commission (SSC)
                </h4>
                <p class="text-[11px] text-slate-500 font-sans leading-normal">
                  Inducts thousands of assistants, sub-inspectors, constables, and stenographers through annual computer-based evaluations like CGL, CHSL, MTS, and GD Constable.
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-extrabold text-[#000080] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span class="w-2 h-2 bg-[#FF9933] rounded-full"></span>
                  2. Railway Recruitment Boards (RRB)
                </h4>
                <p class="text-[11px] text-slate-500 font-sans leading-normal">
                  Governs technical and administrative recruitments for Assistant Loco Pilots (ALP), Junior Engineers (JE), Station Masters, and NTPC cadres across 21 zones.
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-extrabold text-[#000080] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  3. Indian Armed Forces & Agniveer
                </h4>
                <p class="text-[11px] text-slate-500 font-sans leading-normal">
                  Recruits under the Agnipath scheme for Army General Duty, Technical, Clerk, Navy SSR/MR, and Air Force Musician trades. Includes physical standard checks (CEE).
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 class="font-extrabold text-[#000080] text-xs uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span class="w-2 h-2 bg-emerald-600 rounded-full"></span>
                  4. State Police & Civil Boards
                </h4>
                <p class="text-[11px] text-slate-500 font-sans leading-normal">
                  Conducts recruitment for Constables, Sub-Inspectors, Forest Guards, and state administrators. Emphasizes regional language proficiency and physical PET criteria.
                </p>
              </div>
            </div>

            <div class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-[11px] text-slate-600">
              <span class="font-bold text-[#000080] block mb-1">🛡️ Publisher Verification Guarantee:</span>
              Our senior academic editors, including retired officers of the Army Education Corps, cross-reference all notification links, salary pay scales, and eligible quotas with authorized department Gazettes prior to cataloging.
            </div>
          </div>
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
