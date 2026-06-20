<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
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
    
    const validPolicies = ["about", "contact", "faq", "careers", "privacy", "terms", "cookies", "disclaimer", "dmca", "editorial", "factcheck", "refund", "sitemap-doc"];
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
      "pdfs": "pdfs",
      "blog": "blog",
      "dashboard": "dashboard",
      "chat": "chat",
      "admin": "admin"
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
      "pdfs": "pdfs",
      "blog": "blog",
      "dashboard": "dashboard",
      "chat": "chat",
      "admin": "admin"
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
    const res = await fetch(`/api/daily-quiz${force ? "?force=true" : ""}`);
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
    const res = await fetch(`/api/latest-notifications${force ? "?force=true" : ""}`);
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
        
        <!-- A. Hero Banner Grid -->
        <div class="bg-gradient-to-br from-[#FF9933]/5 via-white to-[#138808]/5 rounded-[2rem] p-6 sm:p-10 border border-gray-150 shadow-sm relative overflow-hidden" id="hero-banner-sec">
          <div class="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#FF9933]/10 rounded-full blur-[100px] pointer-events-none" />
          <div class="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[#138808]/10 rounded-full blur-[100px] pointer-events-none" />

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full text-left">
            <!-- Left Side Content -->
            <div class="lg:col-span-7 space-y-6">
              <div class="inline-flex items-center space-x-1.5 border border-amber-300/60 bg-amber-50/60 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-850 tracking-wider">
                <span>✨</span>
                <span>100% FREE • COMPLIANCE GUARANTEED</span>
              </div>

              <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] tracking-tight leading-tight font-sans" id="hero-heading">
                India's Complete <br />
                <span class="bg-gradient-to-r from-[#FF9933] via-[#000080] to-[#138808] bg-clip-text text-transparent">Government</span> Exam <br />
                Preparation Platform
              </h1>

              <p class="text-xs sm:text-[14px] text-gray-550 font-sans leading-relaxed max-w-2xl">
                Practice GK Quizzes, Mock Tests, Current Affairs, Study Notes and Government Job Preparation Materials for the Indian Armed Forces, SSC, Railway, UPSC, Banking and more.
              </p>

              <!-- CTA Links Row -->
              <div class="flex flex-wrap gap-2.5 pt-2" id="hero-cta-group">
                <button
                  id="btn-quick-quiz"
                  @click="handleNavigation('quizzes')"
                  class="bg-[#FF9933] hover:bg-[#dd8822] text-[#000080] font-black text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer hover:scale-105 active:scale-95 border border-[#FF9933]/10 font-sans uppercase"
                >
                  <span>Start Practice Exam</span>
                  <span>➔</span>
                </button>

                <button
                  id="btn-quick-jobs"
                  @click="handleNavigation('jobs')"
                  class="bg-[#138808] hover:bg-[#117706] text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 font-sans"
                >
                  Govt Vacancies Alerts
                </button>

                <button
                  id="btn-quick-study"
                  @click="handleNavigation('study')"
                  class="border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 font-sans"
                >
                  Syllabus Materials
                </button>

                <button
                  id="btn-quick-current"
                  @click="handleNavigation('current')"
                  class="border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 font-sans"
                >
                  Current Affairs Hindi
                </button>
              </div>

              <!-- Metrics -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4">
                <div v-for="(metric, idx) in [
                  { icon: BookOpen, val: '30+', desc: 'Exam Tracks Index' },
                  { icon: FileText, val: '8K+ Docs', desc: 'Bilingual Question Pool' },
                  { icon: Briefcase, val: '500+ Alerts', desc: 'Verified Jobs Feeds' },
                  { icon: Award, val: '1L+ Prepared', desc: 'National Registered Merit' }
                ]" :key="idx" class="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div :class="[
                    'absolute top-0 left-0 right-0 h-[2.5px] opacity-80',
                    idx % 3 === 0 ? 'bg-[#FF9933]' : idx % 3 === 1 ? 'bg-[#000080]' : 'bg-[#138808]'
                  ]" />
                  <component :is="metric.icon" class="h-4.5 w-4.5 text-[#FF9933] mb-1" />
                  <p class="text-lg sm:text-xl font-black text-slate-900 leading-none">{{ metric.val }}</p>
                  <p class="text-[9px] text-gray-450 font-bold leading-tight pt-1 uppercase font-sans">{{ metric.desc }}</p>
                </div>
              </div>
            </div>

            <!-- Right Side Prev Paper widget -->
            <div class="lg:col-span-5 h-full" id="quiz-of-the-day-slot">
              <div class="bg-white rounded-[2rem] shadow-xl border border-gray-200 p-6 sm:p-7 space-y-5 relative overflow-hidden" id="quiz-of-day-card">
                <div class="absolute top-0 left-0 right-0 flex h-[4px]">
                  <div class="w-[45%] h-full bg-[#FF9933]" />
                  <div class="w-[10%] h-full bg-transparent" />
                  <div class="w-[45%] h-full bg-[#138808]" />
                </div>

                <div class="flex justify-between items-start pt-1.5">
                  <div class="space-y-1">
                    <span class="text-[10px] font-black tracking-widest text-[#FF9933] uppercase font-mono flex items-center">
                      <Flame class="h-4 w-4 mr-1 animate-pulse" />
                      LIVE FEED QUIZ
                    </span>
                    <h4 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight flex flex-wrap items-center gap-2">
                      <span>Agniveer Army GD Prep</span>
                      <button 
                        @click="fetchDailyQuiz(true)" 
                        class="text-xs text-[#000080] hover:text-[#2563EB] font-black font-mono transition-colors uppercase tracking-wider flex items-center gap-1 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-lg cursor-pointer select-none"
                        title="Click to fetch an entirely different, live quiz set from online websites feeds"
                        :disabled="isFetchingDaily"
                      >
                        <RefreshCw class="h-3 w-3" :class="{'animate-spin': isFetchingDaily}" />
                        <span class="text-[9px]">Fetch New Set</span>
                      </button>
                    </h4>
                  </div>
                  <Award class="h-8 w-8 text-[#FF9933] shrink-0" />
                </div>

                <!-- Live Loading State -->
                <div v-if="isFetchingDaily" class="flex flex-col items-center justify-center py-20 space-y-3" id="daily-quiz-loading-state">
                  <RefreshCw class="h-9 w-9 text-[#000080] animate-spin" />
                  <p class="text-xs font-black text-slate-600 uppercase tracking-widest font-sans animate-pulse">
                    Fetching dynamic questions...
                  </p>
                  <p class="text-[10.5px] text-gray-400 italic font-medium">
                    शैक्षणिक वेबसाइट फ़ीड्स से नए प्रश्न खोजे जा रहे हैं...
                  </p>
                </div>

                <!-- Finished state -->
                <div v-else-if="armyQuizFinished" class="space-y-5 text-center py-4 animate-fade-in" id="army-quiz-finished-view">
                  <div class="mx-auto w-16 h-16 bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center text-3xl shadow-sm mb-1 animate-bounce">
                    🏆
                  </div>
                  <h4 class="text-lg font-black text-[#138808]">Jai Hind! Practice Finished 🇮🇳</h4>
                  
                  <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl max-w-xs mx-auto">
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score / स्कोर</p>
                    <p class="text-3xl font-black text-slate-800 font-mono">{{ armyScore }} / {{ dailyQuestions.length }}</p>
                    <span class="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-3 py-1 rounded inline-block mt-1">
                      {{ Math.round((armyScore / dailyQuestions.length) * 100) }}% Accuracy Rate
                    </span>
                  </div>

                  <button
                    @click="async () => {
                      armyQuizIdx = 0;
                      selectedArmyOption = null;
                      armyAnswered = false;
                      armyScore = 0;
                      armyQuizFinished = false;
                      await fetchDailyQuiz(true);
                    }"
                    class="w-full bg-[#138808] hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow cursor-pointer font-sans uppercase flex items-center justify-center space-x-1.5"
                  >
                    <RefreshCw class="h-3.5 w-3.5" />
                    <span>Repeat with different questions (दोबारा अभ्यास)</span>
                  </button>
                </div>

                <!-- Active state -->
                <div v-else class="space-y-5" id="army-quiz-active-view">
                  <div class="flex items-center justify-between text-[11px] font-bold font-mono">
                    <span class="text-[#000080] bg-blue-50 px-2.5 py-1 rounded">BILINGUAL</span>
                    <span class="text-slate-500">Q. {{ armyQuizIdx + 1 }} of {{ dailyQuestions.length }}</span>
                  </div>

                  <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-[#FF9933] to-[#138808] h-full transition-all duration-300"
                      :style="{ width: `${((armyQuizIdx + 1) / dailyQuestions.length) * 100}%` }"
                    />
                  </div>

                  <div v-if="dailyQuestions[armyQuizIdx]" class="bg-slate-50 rounded-xl p-4 border border-slate-150 text-left space-y-1">
                    <p class="text-slate-900 text-sm font-black tracking-tight font-sans">
                      <span class="text-[#FF9933] font-mono mr-1">Q{{ armyQuizIdx + 1 }}.</span>
                      {{ dailyQuestions[armyQuizIdx].englishQ }}
                    </p>
                    <p class="text-[#138808] text-xs font-bold border-t border-dashed border-gray-200 pt-1">
                      🇮🇳 {{ dailyQuestions[armyQuizIdx].hindiQ }}
                    </p>
                  </div>

                  <div v-if="dailyQuestions[armyQuizIdx]" class="space-y-2 text-xs text-left">
                    <button
                      v-for="opt in dailyQuestions[armyQuizIdx].options"
                      :key="opt.key"
                      @click="() => {
                        if (armyAnswered) return;
                        selectedArmyOption = opt.key;
                        armyAnswered = true;
                        if (opt.isCorrect) armyScore++;
                      }"
                      :class="[
                        'w-full text-left p-3 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer',
                        armyAnswered 
                          ? opt.isCorrect 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold' 
                            : selectedArmyOption === opt.key 
                              ? 'border-red-500 bg-red-50 text-red-800 font-bold' 
                              : 'bg-slate-50 border-gray-100 text-slate-400 opacity-60'
                          : selectedArmyOption === opt.key 
                            ? 'border-[#000080] bg-blue-50 font-bold' 
                            : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50 font-medium'
                      ]"
                    >
                      <span>{{ opt.text }}</span>
                      <template v-if="armyAnswered">
                        <span v-if="opt.isCorrect" class="text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded font-black font-sans uppercase">CORRECT</span>
                        <span v-else-if="selectedArmyOption === opt.key" class="text-[9px] bg-red-100 px-1.5 py-0.5 rounded font-black font-sans uppercase">WRONG</span>
                      </template>
                    </button>
                  </div>

                  <!-- Explanation feedback card -->
                  <div v-if="armyAnswered && dailyQuestions[armyQuizIdx]" class="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-[11px] leading-relaxed text-left text-slate-700 space-y-1">
                    <strong class="text-amber-900 block border-b border-amber-200/50 pb-1 font-sans uppercase">💡 ANALYSIS / विश्लेषण:</strong>
                    <p><span class="font-bold">Eng:</span> {{ dailyQuestions[armyQuizIdx].explanationEng }}</p>
                    <p><span class="font-bold text-[#138808]">Hin:</span> {{ dailyQuestions[armyQuizIdx].explanationHin }}</p>
                  </div>

                  <!-- Next Action btn -->
                  <button
                    v-if="armyAnswered"
                    @click="() => {
                      if (armyQuizIdx === dailyQuestions.length - 1) {
                        armyQuizFinished = true;
                        triggerCelebration();
                      } else {
                        armyQuizIdx++;
                        selectedArmyOption = null;
                        armyAnswered = false;
                      }
                    }"
                    class="w-full bg-[#0f172a] hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 rounded-xl cursor-pointer font-sans"
                  >
                    {{ armyQuizIdx === dailyQuestions.length - 1 ? 'Finish & Check Results 🏆' : 'Next bilingual question (अगला प्रश्न) ➔' }}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- B. Mid columns grids -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-columns-split">
          
          <!-- Left info dashboard feed: Col span 2 -->
          <div class="lg:col-span-2 space-y-8" id="home-primary-feed">
            
            <div v-if="isAuthenticated" class="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left" id="home-student-card">
              <div class="flex items-center space-x-3">
                <div class="p-3 bg-indigo-50 text-[#000080] rounded-xl font-bold flex items-center justify-center">
                  <Award class="h-6 w-6 text-[#000080]" />
                </div>
                <div>
                  <h4 class="font-black text-sm text-gray-800">Aspirant Profile: {{ profile.name }}</h4>
                  <p class="text-[10px] text-gray-400 font-mono font-bold">POINTS ACCUMULATED: {{ profile.points }} Pts</p>
                </div>
              </div>

              <button
                @click="handleNavigation('dashboard')"
                class="text-xs font-black text-indigo-700 hover:text-indigo-900 tracking-wider uppercase flex items-center gap-1 cursor-pointer font-sans"
              >
                <span>Review Badges Desk</span>
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>

            <!-- PYQ Engine -->
            <div class="bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 relative overflow-hidden" id="pyq-hub-main-card">
              <div class="absolute top-0 left-0 right-0 h-1 flex">
                <div class="w-[33%] bg-[#FF9933]" />
                <div class="w-[34%] bg-white" />
                <div class="w-[33%] bg-[#138808]" />
              </div>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 text-left">
                <div class="space-y-1">
                  <div class="flex items-center space-x-2">
                    <span class="bg-slate-900 text-[#FF9933] text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full font-mono">
                      OFFICIAL PYQ ENGINE
                    </span>
                    <span class="bg-[#138808]/10 text-[#138808] border border-[#138808]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ★ 100% Genuine Solved Papers
                    </span>
                  </div>
                  <h4 class="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                    Previous Year Question Paper (Bilingual)
                  </h4>
                  <p class="text-[11px] font-bold text-gray-500">
                    🎯 विगत वर्षों के परीक्षाओं (2020-2025) में पूछे गए सबसे महत्वपूर्ण वास्तविक प्रश्न
                  </p>
                </div>

                <div class="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-sm shrink-0">
                  <p class="text-[9px] font-bold text-gray-400 font-mono uppercase tracking-wider">SUCCESS RATE</p>
                  <p class="text-sm font-black text-slate-800 font-mono">
                    {{ pyqAnswered || pyqFinished ? `${Math.round((pyqScore / (pyqFinished ? ARMY_PREV_QUESTIONS.length : Math.max(pyqQuizIdx, 1))) * 100)}%` : "0%" }}
                  </p>
                </div>
              </div>

              <!-- Finished state -->
              <div v-if="pyqFinished" class="py-6 text-center space-y-6 max-w-xl mx-auto" id="pyq-results-board">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-150 shadow-inner text-3xl animate-bounce">
                  🏆
                </div>
                
                <div class="space-y-1 text-center">
                  <h3 class="text-xl font-black text-[#138808]">जय हिन्द! Grand Congratulations!</h3>
                  <p class="text-xs text-gray-450 font-bold uppercase tracking-wider font-mono">
                    You completed the National Solved Paper simulator!
                  </p>
                </div>

                <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div class="grid grid-cols-2 gap-4 divide-x divide-slate-100">
                    <div class="text-center">
                      <p class="text-[10px] font-bold text-gray-400 font-mono uppercase">FINAL SCORE</p>
                      <p class="text-3xl font-black text-slate-800 font-mono pt-1">{{ pyqScore }} / {{ ARMY_PREV_QUESTIONS.length }}</p>
                    </div>
                    <div class="text-center">
                      <p class="text-[10px] font-bold text-gray-400 font-mono uppercase">ACCURACY</p>
                      <p class="text-3xl font-black text-[#138808] font-mono pt-1">{{ Math.round((pyqScore / ARMY_PREV_QUESTIONS.length) * 100) }}%</p>
                    </div>
                  </div>

                  <p class="text-[11px] text-gray-500 leading-relaxed font-semibold">
                    {{ pyqScore >= 4 ? "🎖️ Outstanding Command! Keep up with mock evaluations to score amazing ranks." : "📚 Practice creates perfect score rates. Try other mock tabs to boost confidence!" }}
                  </p>
                </div>

                <button
                  @click="() => {
                    pyqQuizIdx = 0;
                    pyqSelectedOption = null;
                    pyqAnswered = false;
                    pyqScore = 0;
                    pyqFinished = false;
                  }"
                  class="bg-[#138808] hover:bg-emerald-800 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow cursor-pointer font-sans uppercase"
                >
                  Restart Solved Simulator (दोबारा हल करें)
                </button>
              </div>

              <!-- Active state -->
              <div v-else class="space-y-5" id="pyq-quiz-active-interface">
                <div class="flex items-center justify-between text-xs font-mono font-bold">
                  <span class="text-[#000080] bg-blue-50 px-3 py-1 rounded-full">
                    Q. {{ pyqQuizIdx + 1 }} of {{ ARMY_PREV_QUESTIONS.length }}
                  </span>
                  <span class="text-slate-400">CATEGORY: MILITARY SCIENCE & GENERAL AWARENESS</span>
                </div>

                <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div 
                    v-for="(_, idx) in ARMY_PREV_QUESTIONS"
                    :key="idx"
                    :class="[
                      'h-full border-r border-white/50 last:border-0 transition-all flex-1',
                      idx < pyqQuizIdx ? 'bg-[#138808]' : idx === pyqQuizIdx ? 'bg-[#FF9933] animate-pulse' : 'bg-slate-200'
                    ]"
                  />
                </div>

                <div class="bg-gray-50 border border-slate-150 rounded-2xl p-5 space-y-3 text-left">
                  <p class="text-slate-900 text-sm sm:text-base font-extrabold leading-snug">
                    <span class="text-[#FF9933] font-mono mr-1.5">Q{{ pyqQuizIdx + 1 }}.</span>
                    {{ ARMY_PREV_QUESTIONS[pyqQuizIdx].englishQ }}
                  </p>
                  <p class="text-[#138808] text-xs sm:text-sm font-extrabold pb-1 leading-relaxed border-t border-dashed border-slate-200 pt-3">
                    🇮🇳 {{ ARMY_PREV_QUESTIONS[pyqQuizIdx].hindiQ }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="pyq-options-container">
                  <button
                    v-for="opt in ARMY_PREV_QUESTIONS[pyqQuizIdx].options"
                    :key="opt.key"
                    :disabled="pyqAnswered"
                    @click="() => {
                      pyqSelectedOption = opt.key;
                      pyqAnswered = true;
                      if (opt.isCorrect) pyqScore++;
                    }"
                    :class="[
                      'w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer text-xs sm:text-sm',
                      pyqAnswered 
                        ? opt.isCorrect 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold' 
                          : pyqSelectedOption === opt.key 
                            ? 'border-red-500 bg-red-50 text-red-800 font-bold' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                        : pyqSelectedOption === opt.key 
                          ? 'border-blue-500 bg-blue-50/60 font-semibold text-blue-900' 
                          : 'bg-white border-gray-200 text-slate-800 hover:bg-slate-50 font-medium'
                    ]"
                  >
                    <span>{{ opt.text }}</span>
                    <template v-if="pyqAnswered">
                      <span v-if="opt.isCorrect" class="text-[9px] bg-emerald-100 px-1 rounded font-sans uppercase">Correct✓</span>
                      <span v-else-if="pyqSelectedOption === opt.key" class="text-[9px] bg-red-100 px-1 rounded font-sans uppercase">Wrong✗</span>
                    </template>
                  </button>
                </div>

                <!-- Explanation block -->
                <div v-if="pyqAnswered" class="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl text-left space-y-2 text-xs leading-relaxed animate-fade-in" id="pyq-explanation-box">
                  <div class="font-bold text-amber-950 uppercase border-b border-amber-200/50 pb-1.5 font-sans">
                    💡 EXPLANATION / विश्लेषण :
                  </div>
                  <p class="text-slate-800 font-medium"><span class="font-bold">English:</span> {{ ARMY_PREV_QUESTIONS[pyqQuizIdx].explanationEng }}</p>
                  <p class="text-slate-600 font-medium"><span class="font-bold text-[#138808]">हिन्दी:</span> {{ ARMY_PREV_QUESTIONS[pyqQuizIdx].explanationHin }}</p>
                </div>

                <div v-if="pyqAnswered" class="pt-2 flex justify-end">
                  <button
                    @click="() => {
                      if (pyqQuizIdx === ARMY_PREV_QUESTIONS.length - 1) {
                        pyqFinished = true;
                        triggerCelebration();
                      } else {
                        pyqQuizIdx++;
                        pyqSelectedOption = null;
                        pyqAnswered = false;
                      }
                    }"
                    class="w-full sm:w-auto bg-[#0f172a] hover:bg-slate-900 text-white font-black text-xs sm:text-sm py-3 px-8 rounded-xl cursor-pointer font-sans uppercase"
                  >
                    {{ pyqQuizIdx === ARMY_PREV_QUESTIONS.length - 1 ? 'Finish solivng & View results' : 'Next Paper Question ➔' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Categories directory grid -->
            <div class="space-y-6 text-left" id="exam-catalog-sec">
              <h3 class="font-extrabold text-sm uppercase text-gray-500 tracking-wider font-mono">Exam Segments & Key Quizzes</h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="exam-segments-grid">
                <div
                  v-for="(seg, idx) in [
                    { emoji: '🪖', title: 'Indian Army GK', desc: 'Test your knowledge on the Indian Army\'s history, ranks and operations.', q: '10 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-amber-50/40', borderClass: 'border-amber-100 hover:border-amber-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '⚓', title: 'Indian Navy GK', desc: 'Naval history, vessels, ranks and operations of the Indian Navy.', q: '8 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-blue-50/40', borderClass: 'border-blue-100 hover:border-blue-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '✈️', title: 'Indian Air Force GK', desc: 'Aircraft, squadrons and history of the IAF.', q: '7 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-indigo-50/40', borderClass: 'border-indigo-100 hover:border-indigo-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '🏛️', title: 'Indian Constitution', desc: 'Articles, schedules and key provisions of the Constitution of India.', q: '8 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-purple-50/40', borderClass: 'border-purple-100 hover:border-purple-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '📜', title: 'Indian History', desc: 'Ancient, medieval and modern Indian history.', q: '7 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-orange-50/40', borderClass: 'border-orange-100 hover:border-orange-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '🗺️', title: 'Indian Geography', desc: 'Physical and economic geography of India.', q: '7 Qs', badge: 'Easy', gradient: 'bg-gradient-to-tr from-white via-white to-emerald-50/40', borderClass: 'border-emerald-100 hover:border-emerald-300', badgeBg: 'bg-[#DCFCE7] text-[#166534]' },
                    { emoji: '📰', title: 'Current Affairs', desc: 'Daily updates from India and the world.', q: '5 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-slate-100/50', borderClass: 'border-slate-200 hover:border-slate-350', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '🛡️', title: 'Agniveer Quiz', desc: 'Practice for Agniveer Army/Navy/Air Force.', q: '5 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-cyan-50/40', borderClass: 'border-cyan-100 hover:border-cyan-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '🎯', title: 'NDA Quiz', desc: 'Combined Defence Service entry.', q: '5 Qs', badge: 'Hard', gradient: 'bg-gradient-to-tr from-white via-white to-rose-50/40', borderClass: 'border-rose-105 hover:border-rose-300', badgeBg: 'bg-[#FEE2E2] text-[#991B1B]' },
                    { emoji: '🎖️', title: 'CDS Quiz', desc: 'Officer entry to IMA, INA, AFA, OTA.', q: '5 Qs', badge: 'Hard', gradient: 'bg-gradient-to-tr from-white via-white to-fuchsia-50/40', borderClass: 'border-fuchsia-105 hover:border-fuchsia-300', badgeBg: 'bg-[#FEE2E2] text-[#991B1B]' },
                    { emoji: '🛩️', title: 'AFCAT Quiz', desc: 'Air Force Common Admission Test.', q: '5 Qs', badge: 'Medium', gradient: 'bg-gradient-to-tr from-white via-white to-sky-50/40', borderClass: 'border-sky-100 hover:border-sky-300', badgeBg: 'bg-[#FEF08A] text-[#854D0E]' },
                    { emoji: '🧠', title: 'General Knowledge', desc: 'Mixed GK from every topic.', q: '5 Qs', badge: 'Easy', gradient: 'bg-gradient-to-tr from-white via-white to-pink-50/40', borderClass: 'border-pink-100 hover:border-pink-300', badgeBg: 'bg-[#DCFCE7] text-[#166534]' }
                  ]"
                  :key="idx"
                  @click="handleNavigation('quizzes')"
                  class="group relative cursor-pointer text-left p-6 rounded-[1.5rem] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 min-h-[220px]"
                  :class="[seg.gradient, seg.borderClass]"
                >
                  <div class="space-y-4">
                    <div class="text-3xl select-none mb-1">
                      {{ seg.emoji }}
                    </div>

                    <div class="space-y-1.5 text-left">
                      <h4 class="text-[17px] font-extrabold text-slate-800 group-hover:text-[#000080] font-sans transition-colors duration-150">
                        {{ seg.title }}
                      </h4>
                      <p class="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-sans line-clamp-3">
                        {{ seg.desc }}
                      </p>
                    </div>
                  </div>

                  <!-- Footer row -->
                  <div class="mt-6 pt-2 flex items-center justify-between text-xs font-sans">
                    <span class="text-[11px] font-mono font-bold text-slate-500 bg-slate-100/90 px-3 py-1 rounded-full">
                      {{ seg.q }}
                    </span>
                    <span :class="['text-[11px] font-bold uppercase px-3 py-1 rounded-full tracking-wider font-sans', seg.badgeBg]">
                      {{ seg.badge }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI teaser box -->
            <div class="bg-white rounded-2xl shadow-sm border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-[#138808] text-left" id="ai-teaser-banner">
              <div class="space-y-1">
                <span class="text-[9px] font-black tracking-widest text-[#138808] uppercase bg-[#138808]/10 px-2 py-0.5 rounded">Agni AI Tutor</span>
                <h4 class="font-black text-sm text-gray-900">Confused about commission ranks index or constitution laws?</h4>
                <p class="text-[11px] text-gray-550 leading-relaxed font-sans animate-pulse">Chat instantly with Agni AI, our highly calibrated study advisor.</p>
              </div>

              <button
                @click="handleNavigation('chat')"
                class="bg-[#000080] hover:bg-[#000060] text-white text-xs font-black py-2.5 px-5 rounded-lg shrink-0 uppercase tracking-widest shadow font-sans cursor-pointer whitespace-nowrap"
              >
                Launch Tutor
              </button>
            </div>

          </div>

          <!-- Right column selector with ads units -->
          <div class="space-y-6 lg:col-span-1" id="home-secondary-right-side">
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
        />
      </div>

      <!-- GK TRICKS BLOG -->
      <div v-if="currentTab === 'blog'" class="animate-fade-in">
        <BlogSection
          :activeBlogId="activeBlogId"
          @selectBlog="(blogId) => handleNavigation('blog', blogId)"
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
