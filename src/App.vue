<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { updatePageSeo } from "./utils/seo";
import confetti from "canvas-confetti";
import { 
  Award, BookOpen, FileText, Briefcase, 
  LayoutDashboard, Bell, Clock, Flame, 
  ChevronRight, HelpCircle, RefreshCw, Search, ExternalLink
} from "lucide-vue-next";

// Import modular child components
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import AdSenseSidebar from "./components/AdSenseSidebar.vue";
import QuizEngine from "./components/QuizEngine.vue";
import StudyMaterial from "./components/StudyMaterial.vue";
import PdfLibrary from "./components/PdfLibrary.vue";
import JobsSection from "./components/JobsSection.vue";
import BlogSection from "./components/BlogSection.vue";
import CurrentAffairs from "./components/CurrentAffairs.vue";
import AiAssistant from "./components/AiAssistant.vue";
import Dashboard from "./components/Dashboard.vue";
import AdminPanel from "./components/AdminPanel.vue";
import SeoPages from "./components/SeoPages.vue";
import MockTest from "./components/MockTest.vue";
import HomeRedesign from "./components/HomeRedesign.vue";
import AdmitCardSection from "./components/AdmitCardSection.vue";
import ResultsSection from "./components/ResultsSection.vue";
import AuthorsSection from "./components/AuthorsSection.vue";

import { 
  UserProfile, Quiz, JobPost, QuizHistoryItem, UserCertificate 
} from "./types";
import { 
  MOCK_QUIZZES, MOCK_JOBS, ARMY_PREV_QUESTIONS
} from "./data/mockData";

// Core router tabs setup
const currentTab = ref<string>("home");
const selectedPolicyId = ref<string>("about");

// Router child item selected states
const selectedQuizId = ref<string | null>(null);
const selectedNoteId = ref<string | null>(null);
const activeBlogId = ref<string | null>(null);
const activeJobId = ref<string | null>(null);
const selectedNewsId = ref<string | null>(null);
const activeAuthorId = ref<string | null>(null);

// Helper to convert text to slug
const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Path Parsing logic
const parseLocation = () => {
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  
  if (segments.length === 0) {
    return { tab: "home" };
  }
  
  if (segments.length === 1) {
    const singleSegment = segments[0].toLowerCase();
    
    const validPolicies = ["about", "contact", "faq", "careers", "privacy", "terms", "cookies", "disclaimer", "dmca", "editorial", "factcheck", "refund", "sitemap-doc", "correction"];
    if (validPolicies.includes(singleSegment)) {
      return { tab: "policies", policyId: singleSegment };
    }
    
    const tabMap: Record<string, string> = {
      "home": "home",
      "quizzes": "quizzes",
      "quiz": "quizzes",
      "study": "study",
      "current": "current",
      "current-affairs": "current",
      "jobs": "jobs",
      "admit-card": "admit-card",
      "admit-cards": "admit-card",
      "results": "results",
      "result": "results",
      "pdfs": "pdfs",
      "blog": "blog",
      "authors": "authors",
      "author": "authors",
      "dashboard": "dashboard",
      "chat": "chat",
      "admin": "admin",
      "mock-tests": "mock-tests"
    };
    
    if (tabMap[singleSegment]) {
      return { tab: tabMap[singleSegment] };
    }
    
    return { tab: "home" };
  }
  
  if (segments.length === 2) {
    const category = segments[0].toLowerCase();
    const subItem = segments[1];
    
    if (category === "quizzes" || category === "quiz") {
      return { tab: "quizzes", subId: subItem };
    }
    if (category === "study") {
      return { tab: "study", subId: subItem };
    }
    if (category === "jobs") {
      return { tab: "jobs", subId: subItem };
    }
    if (category === "blog") {
      return { tab: "blog", subId: subItem };
    }
    if (category === "authors" || category === "author") {
      return { tab: "authors", subId: subItem };
    }
    if (category === "current" || category === "current-affairs") {
      return { tab: "current", subId: subItem };
    }
    if (category === "pdfs") {
      return { tab: "pdfs", subId: subItem };
    }
  }
  
  return { tab: "home" };
};

// PushState navigation helper
const navigateTo = (tab: string, subId?: string | null, policyId?: string | null, replace = false) => {
  let path = "/";
  if (tab === "home") {
    path = "/";
  } else if (tab === "policies" && policyId) {
    path = `/${policyId}`;
  } else {
    const catMap: Record<string, string> = {
      "quizzes": "quizzes",
      "study": "study",
      "current": "current",
      "jobs": "jobs",
      "admit-card": "admit-card",
      "results": "results",
      "pdfs": "pdfs",
      "blog": "blog",
      "dashboard": "dashboard",
      "chat": "chat",
      "admin": "admin",
      "mock-tests": "mock-tests"
    };
    const catPath = catMap[tab] || tab;
    if (subId) {
      path = `/${catPath}/${subId}`;
    } else {
      path = `/${catPath}`;
    }
  }
  
  try {
    if (replace) {
      window.history.replaceState({ tab, subId, policyId }, "", path);
    } else {
      window.history.pushState({ tab, subId, policyId }, "", path);
    }
  } catch (e) {
    console.warn("Could not modify location:", e);
  }
};

// Central Navigation Handler
const handleNavigation = (tab: string, subId?: string | null, policyId?: string | null) => {
  currentTab.value = tab;
  if (tab === "policies" && policyId) {
    selectedPolicyId.value = policyId;
  }
  selectedQuizId.value = subId || null;
  selectedNoteId.value = subId || null;
  activeBlogId.value = subId || null;
  activeJobId.value = subId || null;
  selectedNewsId.value = subId || null;
  activeAuthorId.value = subId || null;
  
  navigateTo(tab, subId, policyId);
};

// PopState sync
const handlePopState = () => {
  const parsed = parseLocation();
  currentTab.value = parsed.tab;
  if (parsed.tab === "policies" && parsed.policyId) {
    selectedPolicyId.value = parsed.policyId;
  }
  selectedQuizId.value = parsed.subId || null;
  selectedNoteId.value = parsed.subId || null;
  activeBlogId.value = parsed.subId || null;
  activeJobId.value = parsed.subId || null;
  selectedNewsId.value = parsed.subId || null;
  activeAuthorId.value = parsed.subId || null;
};

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
  handlePopState();
  fetchDailyQuiz(); // Load dynamic live educational feed questions on compile/session launch
  fetchNotifications(); // Fetch dynamic live job notifications and armed forces alerts
});

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});

// Student Profile state
const isAuthenticated = ref(true);
const profile = ref<UserProfile>({
  id: "ap-std-8822",
  name: "Vikram Singh",
  email: "vikram.agniveer@gmail.com",
  points: 1250,
  certificates: [
    {
      id: "CERT-99812",
      userName: "Vikram Singh",
      quizTitle: "Armed Forces GK - Battles and Regiments",
      scorePercentage: 90,
      date: "14/06/2026"
    }
  ],
  history: [
    {
      quizId: "quiz-1",
      quizTitle: "Armed Forces GK - Battles and Regiments",
      scorePercentage: 90,
      correctAnswers: 9,
      totalQuestions: 10,
      timeTaken: "2m 15s",
      date: "14/06/2026"
    }
  ],
  bookmarkedQuestionIds: ["q-pol-1"]
});

// Interactive Previous Army Paper states
const armyQuizIdx = ref<number>(0);
const selectedArmyOption = ref<string | null>(null);
const armyAnswered = ref<boolean>(false);
const armyScore = ref<number>(0);
const armyQuizFinished = ref<boolean>(false);

// Dynamic Quiz of the Day questions from online educational feeds
const dailyQuestions = ref<any[]>(ARMY_PREV_QUESTIONS);
const isFetchingDaily = ref<boolean>(false);

const fetchDailyQuiz = async (force = false) => {
  isFetchingDaily.value = true;
  try {
    const url = `/api/daily-quiz?_t=${Date.now()}${force ? "&force=true" : ""}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        dailyQuestions.value = data.questions;
      }
    }
  } catch (err) {
    console.error("Error fetching dynamic feed questions:", err);
  } finally {
    isFetchingDaily.value = false;
  }
};

// Detailed PYQs Feed states
const pyqQuizIdx = ref<number>(0);
const pyqSelectedOption = ref<string | null>(null);
const pyqAnswered = ref<boolean>(false);
const pyqScore = ref<number>(0);
const pyqFinished = ref<boolean>(false);

const triggerCelebration = () => {
  try {
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6, x: 0.35 }
      });
    }, 200);
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6, x: 0.65 }
      });
    }, 400);
  } catch (e) {
    console.error(e);
  }
};

// Notification alerts
const notificationDrawerOpen = ref(false);
const notifications = ref<any[]>([
  {
    id: 1,
    text: "Indian Air Force (IAF) Agniveervayu intake 02/2026 registration dates scheduled. Registrations open from July 8, 2026.",
    hindiText: "भारतीय वायु सेना (IAF) अग्निवीरवायु 02/2026 बैच के लिए पंजीकरण की तिथियां जारी। आवेदन 8 जुलाई 2026 से उपलब्ध।",
    type: "urgent",
    link: "https://agnipathvayu.cdac.in",
    date: "June 19, 2026"
  },
  {
    id: 2,
    text: "UPSC CDS-II & NDA-II examination notice out. Written test Scheduled on August 30, 2026 nationwide.",
    hindiText: "UPSC CDS-II और NDA-II परीक्षा सूचना जारी। लिखित परीक्षा 30 अगस्त 2026 को देश भर में होगी।",
    type: "new",
    link: "https://upsc.gov.in",
    date: "June 18, 2026"
  },
  {
    id: 3,
    text: "Weekly National General Knowledge test commences on Sunday.",
    hindiText: "साप्ताहिक राष्ट्रीय सामान्य ज्ञान परीक्षा रविवार को शुरू होगी।",
    type: "general",
    link: "#",
    date: "June 17, 2026"
  }
]);

const isFetchingNotifications = ref(false);
const notificationsFilter = ref("all");
const notificationsSearch = ref("");

const fetchNotifications = async (force = false) => {
  isFetchingNotifications.value = true;
  try {
    const url = `/api/latest-notifications?_t=${Date.now()}${force ? "&force=true" : ""}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.notifications && data.notifications.length > 0) {
        notifications.value = data.notifications;
      }
    }
  } catch (err) {
    console.error("Error fetching latest notifications:", err);
  } finally {
    isFetchingNotifications.value = false;
  }
};

const filteredNotifications = computed(() => {
  return notifications.value.filter(n => {
    // Search keyword match
    const textToMatch = `${n.text || ''} ${n.hindiText || ''} ${n.type || ''}`.toLowerCase();
    const query = notificationsSearch.value.trim().toLowerCase();
    if (query && !textToMatch.includes(query)) {
      return false;
    }
    
    // Type filter match
    if (notificationsFilter.value !== "all") {
      const normType = (n.type || '').toLowerCase();
      // Handle slight variations like "results" vs "result"
      if (notificationsFilter.value === "result") {
        return normType.includes("result");
      }
      return normType === notificationsFilter.value.toLowerCase();
    }
    
    return true;
  });
});

const activeQuizzes = ref<Quiz[]>(MOCK_QUIZZES);
const activeJobs = ref<JobPost[]>(MOCK_JOBS);

const handleLoginToggle = () => {
  isAuthenticated.value = !isAuthenticated.value;
};

const handleQuizCompleted = (hItem: QuizHistoryItem, cert?: UserCertificate) => {
  profile.value.history.unshift(hItem);
  if (cert) {
    profile.value.certificates.unshift(cert);
  }
  const pointAccr = hItem.scorePercentage >= 50 ? 150 : 50;
  profile.value.points += pointAccr;

  notifications.value.unshift({
    id: Date.now(),
    text: `Jai Hind! You completed ${hItem.quizTitle} mock test with ${hItem.scorePercentage}% score.`,
    type: "general"
  });
};

const toggleBookmark = (qId: string) => {
  const exists = profile.value.bookmarkedQuestionIds.includes(qId);
  if (exists) {
    profile.value.bookmarkedQuestionIds = profile.value.bookmarkedQuestionIds.filter(id => id !== qId);
  } else {
    profile.value.bookmarkedQuestionIds.push(qId);
  }
};

// Dynamic SEO synchronization watch
watch([currentTab, selectedQuizId, selectedNoteId, activeBlogId, activeJobId, selectedNewsId, selectedPolicyId], () => {
  let subId: string | null = null;
  if (currentTab.value === "quizzes") subId = selectedQuizId.value;
  else if (currentTab.value === "study") subId = selectedNoteId.value;
  else if (currentTab.value === "blog") subId = activeBlogId.value;
  else if (currentTab.value === "jobs") subId = activeJobId.value;
  else if (currentTab.value === "current") subId = selectedNewsId.value;
  
  updatePageSeo(
    currentTab.value,
    subId,
    currentTab.value === "policies" ? selectedPolicyId.value : null
  );
}, { immediate: true });

const handleAdminAddQuiz = (newQuiz: Quiz) => {
  activeQuizzes.value.unshift(newQuiz);
  MOCK_QUIZZES.unshift(newQuiz);
};

const handleAdminAddJob = (newJob: JobPost) => {
  activeJobs.value.unshift(newJob);
  MOCK_JOBS.unshift(newJob);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-between" id="app-root-container">
    
    <!-- 1. Flag-Inspired Navigation Header -->
    <Header
      :currentTab="currentTab"
      @setCurrentTab="(tab) => handleNavigation(tab)"
      :isAuthenticated="isAuthenticated"
      @loginClick="handleLoginToggle"
      @logoutClick="handleLoginToggle"
      :notificationCount="notifications.length"
      @setNotificationDrawerOpen="(val) => notificationDrawerOpen = val"
    />

    <!-- 2. Notice Ticker -->
    <div class="bg-[#FF9933]/10 border-b border-[#FF9933]/25 py-2 overflow-hidden" id="notice-alert-ticker">
      <div class="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-xs text-[#aa4400] font-sans font-bold">
        <span class="bg-[#FF9933] text-black px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-widest leading-none shrink-0 animate-pulse">Running alerts</span>
        <span class="truncate">🛡 Notification: Agniveer Army Navy Airforce Mock Portal is active in preparation. Register today to win verified academy badges.</span>
      </div>
    </div>

    <!-- 3. Main Workspace Area -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full" id="main-content-layout">
      
      <!-- LANDING HOMEPAGE LAYOUT -->
      <div v-if="currentTab === 'home'" class="space-y-8 animate-fade-in" id="home-view-container">
        
        <!-- BENTOGRID INTEGRATION: MAIN CONTENT COLUMNS + ADSENSE COMPLIANCE SIDEBAR -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div class="lg:col-span-3">
            <HomeRedesign 
              :dailyQuestions="dailyQuestions"
              :isFetchingDaily="isFetchingDaily"
              :profile="profile"
              :isAuthenticated="isAuthenticated"
              @navigate="handleNavigation"
              @triggerCelebration="triggerCelebration"
            />
          </div>
          <div class="lg:col-span-1">
            <AdSenseSidebar />
          </div>
        </div>

      </div>

      <!-- INTERACTIVE QUIZ ENGINE TAB -->
      <div v-if="currentTab === 'quizzes'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="quizzes-view-split">
        <div class="lg:col-span-2">
          <QuizEngine
            @quizCompleted="handleQuizCompleted"
            :userBookmarks="profile.bookmarkedQuestionIds"
            @toggleBookmark="toggleBookmark"
            :userName="profile.name"
            :selectedQuizId="selectedQuizId"
            @selectQuiz="(quizId) => handleNavigation('quizzes', quizId)"
          />
        </div>
        
        <div class="lg:col-span-1">
          <AdSenseSidebar />
        </div>
      </div>

      <!-- INTERACTIVE MOCK TEST BLOCK -->
      <div v-if="currentTab === 'mock-tests'" class="animate-fade-in text-left" id="mock-tests-viewport">
        <MockTest />
      </div>

      <!-- DETAILED SYLLABUS STUDY TRACKER -->
      <div v-if="currentTab === 'study'" class="animate-fade-in">
        <StudyMaterial
          :selectedNoteId="selectedNoteId"
          @selectNote="(noteId) => handleNavigation('study', noteId)"
        />
      </div>

      <!-- DAILY CURRENT AFFAIRS UNIT -->
      <div v-if="currentTab === 'current'" class="animate-fade-in">
        <CurrentAffairs
          :selectedNewsId="selectedNewsId"
          @selectNews="(newsId) => handleNavigation('current', newsId)"
        />
      </div>

      <!-- VERIFIED GOVERNMENT PDF CABINET -->
      <div v-if="currentTab === 'pdfs'" class="animate-fade-in">
        <PdfLibrary />
      </div>

      <!-- LATEST RALLIES VACANCIES SECTION -->
      <div v-if="currentTab === 'jobs'" class="animate-fade-in">
        <JobsSection
          :activeJobId="activeJobId"
          @selectJob="(jobId) => handleNavigation('jobs', jobId)"
          @navigate="handleNavigation"
        />
      </div>

      <!-- REDESIGNED COMPREHENSIVE ADMIT CARD SECTION -->
      <div v-if="currentTab === 'admit-card'" class="animate-fade-in">
        <AdmitCardSection />
      </div>

      <!-- REDESIGNED COMPREHENSIVE RESULTS SECTION -->
      <div v-if="currentTab === 'results'" class="animate-fade-in">
        <ResultsSection />
      </div>

      <!-- GK TRICKS BLOG -->
      <div v-if="currentTab === 'blog'" class="animate-fade-in">
        <BlogSection
          :activeBlogId="activeBlogId"
          @selectBlog="(blogId) => handleNavigation('blog', blogId)"
          @navigate="handleNavigation"
        />
      </div>

      <!-- DEDICATED AUTHORS SYSTEM -->
      <div v-if="currentTab === 'authors'" class="animate-fade-in">
        <AuthorsSection
          :activeAuthorId="activeAuthorId"
          @selectAuthor="(authorId) => handleNavigation('authors', authorId)"
          @navigate="handleNavigation"
        />
      </div>

      <!-- COMPLIANT DISCLOSURES -->
      <div v-if="currentTab === 'policies'" class="animate-fade-in">
        <SeoPages
          :initialPolicyId="selectedPolicyId"
          @selectPolicy="(policyId) => handleNavigation('policies', null, policyId)"
        />
      </div>

      <!-- CANDIDATE BADGES CENTER -->
      <div v-if="currentTab === 'dashboard'" class="animate-fade-in">
        <Dashboard 
          :profile="profile" 
          @setCurrentTab="(tab) => handleNavigation(tab)"
        />
      </div>

      <!-- SECRET OPERATION SYSTEM PANEL -->
      <div v-if="currentTab === 'admin'" class="animate-fade-in">
        <AdminPanel
          @addQuiz="handleAdminAddQuiz"
          @addJob="handleAdminAddJob"
          :quizzesCount="activeQuizzes.length"
          :jobsCount="activeJobs.length"
        />
      </div>

      <!-- REAL-TIME AI TUTOR CHAT ROOM -->
      <div v-if="currentTab === 'chat'" class="max-w-4xl mx-auto animate-fade-in" id="chat-tab-viewport">
        <AiAssistant />
      </div>

    </main>

    <!-- 4. Sarkari Jobs & Armed Forces Latest Notifications Dynamic Sidebar -->
    <div v-if="notificationDrawerOpen" class="fixed inset-0 z-50 overflow-hidden flex justify-end" id="activity-alert-drawer">
      <!-- Dark backdrop -->
      <div 
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity cursor-pointer" 
        @click="notificationDrawerOpen = false"
      />
 
      <!-- Slide-in Sidebar Panel -->
      <div class="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in-right border-l border-slate-200" id="activity-alert-sheet">
        
        <!-- Sidebar Header (Navy / Flag style inspired) -->
        <div class="p-5 border-b border-gray-200 bg-slate-900 text-white shrink-0">
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span class="font-mono text-[10px] font-bold text-emerald-400 tracking-wider uppercase">Live Grounding Active</span>
            </div>
            
            <button 
              @click="notificationDrawerOpen = false"
              class="text-xs font-bold text-gray-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1 rounded-xl cursor-pointer uppercase transition-colors"
            >
              Close ×
            </button>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 text-left">
            <div>
              <h3 class="font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 leading-none">
                <Bell class="h-5 w-5 text-[#FF9933]" />
                Latest Gov Job Alerts
              </h3>
              <p class="text-xs text-slate-300 font-sans mt-1">Indian Armed Forces & Recruitment Updates • 2026</p>
            </div>

            <!-- Manual live fetch button using Search Grounding -->
            <button 
              @click="fetchNotifications(true)" 
              class="flex items-center justify-center gap-1.5 bg-[#FF9933] hover:bg-amber-600 disabled:bg-slate-700 text-black disabled:text-slate-400 font-black text-[11px] uppercase px-3 py-2 rounded-xl transition-all cursor-pointer shadow-md select-none leading-none shrink-0"
              :disabled="isFetchingNotifications"
              title="Queries Gemini Search Grounding for live recruitment notifications in real-time"
            >
              <RefreshCw class="h-3.5 w-3.5" :class="{'animate-spin': isFetchingNotifications}" />
              <span>Refresh Live</span>
            </button>
          </div>
        </div>

        <!-- Sidebar Searching & Filters Controls -->
        <div class="p-4 bg-slate-50 border-b border-gray-200 shrink-0 space-y-3">
          <!-- Text search -->
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search class="h-4 w-4 text-slate-400" />
            </span>
            <input 
              v-model="notificationsSearch"
              type="text"
              placeholder="Search notifications (e.g. Army, SSC, Navy)..."
              class="w-full pl-9 pr-4 py-2 text-xs font-sans rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080] placeholder-slate-400 text-slate-800"
            />
            <button 
              v-if="notificationsSearch" 
              @click="notificationsSearch = ''"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-[10px] text-gray-400 hover:text-black font-black font-sans cursor-pointer"
            >
              CLEAR
            </button>
          </div>

          <!-- Quick category pills -->
          <div class="flex flex-wrap gap-1.5 items-center">
            <span class="text-[10px] font-black uppercase text-slate-500 mr-1.5 font-sans">Filter alerts:</span>
            <button 
              v-for="cat in ['all', 'urgent', 'new', 'result', 'general']"
              :key="cat"
              @click="notificationsFilter = cat"
              :class="[
                'text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg transition-all cursor-pointer',
                notificationsFilter === cat 
                  ? 'bg-[#000080] text-white shadow-xs' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              ]"
            >
              {{ cat === 'new' ? 'New Alerts' : cat === 'all' ? 'All Updates' : cat }}
            </button>
          </div>
        </div>

        <!-- Notification Cards Feed Container -->
        <div class="flex-1 p-5 overflow-y-auto space-y-4 text-left bg-slate-100/50" id="notification-entries">
          
          <!-- Fetching updates overlay -->
          <div v-if="isFetchingNotifications && filteredNotifications.length === 0" class="py-12 text-center text-slate-500 space-y-3">
            <RefreshCw class="h-8 w-8 text-[#000080] animate-spin mx-auto" />
            <p class="text-xs font-sans font-bold text-slate-700">Connecting to verified Indian recruitment portals...</p>
            <p class="text-[10px] text-slate-400 max-w-xs mx-auto">Gemini is searching official sources like JoindIndianArmy and UPSC via live search grounding.</p>
          </div>

          <!-- Empty search results -->
          <div v-else-if="filteredNotifications.length === 0" class="py-12 bg-white rounded-xl border border-dashed border-slate-200 text-center text-slate-400 p-6 space-y-2">
            <Bell class="h-8 w-8 text-slate-300 mx-auto" />
            <p class="text-xs font-black text-slate-700">No Job Alerts Found</p>
            <p class="text-[11px] font-sans max-w-xs mx-auto">No matching feeds found for current keyword filters. Clear searching tags to reload fallback databases.</p>
            <button 
              @click="() => { notificationsFilter = 'all'; notificationsSearch = ''; }"
              class="text-xs text-[#000080] font-bold border px-3 py-1 rounded-lg hover:bg-slate-50 cursor-pointer mt-1"
            >
              Reset Filters
            </button>
          </div>

          <!-- Dynamic Cards Loop -->
          <div 
            v-else
            v-for="n in filteredNotifications" 
            :key="n.id" 
            :id="`notif-${n.id}`"
            class="p-4 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 relative overflow-hidden"
          >
            <!-- Border badge accent depending on urgency -->
            <div :class="[
              'absolute top-0 left-0 bottom-0 w-1.5',
              n.type === 'urgent' ? 'bg-rose-500' :
              n.type === 'new' ? 'bg-emerald-500' :
              n.type === 'result' ? 'bg-purple-500' :
              'bg-blue-500'
            ]" />
            
            <div class="flex items-center justify-between flex-wrap gap-2">
              <span :class="[
                'text-[8px] font-black uppercase px-2 py-0.5 rounded-md border inline-block leading-none tracking-wide',
                n.type === 'urgent' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                n.type === 'new' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                n.type === 'result' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              ]">
                {{ n.type }}
              </span>
              
              <span class="text-[9px] font-mono text-slate-400 font-bold bg-slate-50 border px-1.5 py-0.5 rounded">
                {{ n.date }}
              </span>
            </div>

            <!-- Bilingual description sentences -->
            <div class="space-y-1.5">
              <p class="text-xs text-slate-800 leading-snug font-sans font-bold flex gap-1.5 items-start">
                <span class="text-slate-400 mt-0.5 font-mono">EN</span>
                <span>{{ n.text }}</span>
              </p>
              
              <div v-if="n.hindiText" class="border-t border-dashed border-slate-100 pt-1.5">
                <p class="text-xs text-emerald-800 leading-relaxed font-sans font-semibold flex gap-1.5 items-start">
                  <span class="text-emerald-400 mt-1 font-mono">🇮🇳 HI</span>
                  <span>{{ n.hindiText }}</span>
                </p>
              </div>
            </div>

            <!-- Action Link anchor targeting official website -->
            <div v-if="n.link && n.link !== '#'" class="pt-1.5 flex items-center justify-between border-t border-slate-100 flex-wrap gap-2 text-[11px]">
              <a 
                :href="n.link" 
                target="_blank" 
                rel="no-referrer"
                class="inline-flex items-center gap-1 text-[#000080] hover:text-[#0000cc] font-black transition-all hover:underline"
              >
                <span>Apply & View Circular</span>
                <ExternalLink class="h-3 w-3" />
              </a>
              <span class="text-[9px] text-slate-400 font-sans tracking-wide">Official Govt Portal</span>
            </div>
          </div>
        </div>

        <!-- Helpline & Info Support Footer -->
        <div class="p-4 bg-slate-50 border-t border-gray-200 shrink-0 text-center space-y-1">
          <p class="text-[10px] text-slate-500 font-sans font-bold">Helpline Candidate Support: +91 141 2450011</p>
          <p class="text-[8px] text-slate-400 font-mono">Updates sourced directly from Join Indian Army & official Sarkari announcements.</p>
        </div>
      </div>
    </div>

    <!-- 5. Footer and backlink -->
    <Footer 
      @setCurrentTab="(tab) => {
        handleNavigation(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }" 
      @setSelectedPolicy="(policyId) => handleNavigation('policies', null, policyId)"
    />

    <!-- Dev Desk humble key -->
    <div class="bg-gray-950 py-2 border-t border-gray-900 text-center text-[9px] text-gray-600 block shrink-0" id="developer-admin-anchor">
      <span>Admin desk access: </span>
      <button
        id="btn-goto-admin"
        @click="() => {
          handleNavigation('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }"
        class="text-[#FF9933] hover:underline hover:text-[#ffbb55] font-black tracking-widest uppercase cursor-pointer underline ml-1 font-sans"
      >
        [Launch Agni Operations Desk ⚙]
      </button>
    </div>

  </div>
</template>
