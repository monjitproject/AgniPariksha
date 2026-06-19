<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import confetti from "canvas-confetti";
import { 
  Award, BookOpen, FileText, Briefcase, 
  LayoutDashboard, Bell, Clock, Flame, 
  ChevronRight, HelpCircle
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
const notifications = ref([
  { id: 1, text: "Agniveer Army Rally 2026 written exam hall tickets are active.", type: "urgent" },
  { id: 2, text: "Indian Navy Marine Commando CEE syllabus update released.", type: "new" },
  { id: 3, text: "Weekly National General Knowledge test commences on Sunday.", type: "general" }
]);

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
                      PREVIOUS PAPER QUIZ
                    </span>
                    <h4 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                      Agniveer Army GD Prep
                    </h4>
                  </div>
                  <Award class="h-8 w-8 text-[#FF9933] shrink-0" />
                </div>

                <!-- Finished state -->
                <div v-if="armyQuizFinished" class="space-y-5 text-center py-4 animate-fade-in" id="army-quiz-finished-view">
                  <div class="mx-auto w-16 h-16 bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center text-3xl shadow-sm mb-1 animate-bounce">
                    🏆
                  </div>
                  <h4 class="text-lg font-black text-[#138808]">Jai Hind! Practice Finished 🇮🇳</h4>
                  
                  <div class="bg-slate-50 border border-slate-100 p-4 rounded-xl max-w-xs mx-auto">
                    <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score / स्कोर</p>
                    <p class="text-3xl font-black text-slate-800 font-mono">{{ armyScore }} / {{ ARMY_PREV_QUESTIONS.length }}</p>
                    <span class="text-[10px] bg-amber-50 text-amber-800 font-extrabold px-3 py-1 rounded inline-block mt-1">
                      {{ Math.round((armyScore / ARMY_PREV_QUESTIONS.length) * 100) }}% Accuracy Rate
                    </span>
                  </div>

                  <button
                    @click="() => {
                      armyQuizIdx = 0;
                      selectedArmyOption = null;
                      armyAnswered = false;
                      armyScore = 0;
                      armyQuizFinished = false;
                    }"
                    class="w-full bg-[#138808] hover:bg-emerald-800 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow cursor-pointer font-sans uppercase"
                  >
                    Repeat practice (दोबारा अभ्यास करें)
                  </button>
                </div>

                <!-- Active state -->
                <div v-else class="space-y-5" id="army-quiz-active-view">
                  <div class="flex items-center justify-between text-[11px] font-bold font-mono">
                    <span class="text-[#000080] bg-blue-50 px-2.5 py-1 rounded">BILINGUAL</span>
                    <span class="text-slate-500">Q. {{ armyQuizIdx + 1 }} of {{ ARMY_PREV_QUESTIONS.length }}</span>
                  </div>

                  <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      class="bg-gradient-to-r from-[#FF9933] to-[#138808] h-full transition-all duration-300"
                      :style="{ width: `${((armyQuizIdx + 1) / ARMY_PREV_QUESTIONS.length) * 100}%` }"
                    />
                  </div>

                  <div class="bg-slate-50 rounded-xl p-4 border border-slate-150 text-left space-y-1">
                    <p class="text-slate-900 text-sm font-black tracking-tight font-sans">
                      <span class="text-[#FF9933] font-mono mr-1">Q{{ armyQuizIdx + 1 }}.</span>
                      {{ ARMY_PREV_QUESTIONS[armyQuizIdx].englishQ }}
                    </p>
                    <p class="text-[#138808] text-xs font-bold border-t border-dashed border-gray-200 pt-1">
                      🇮🇳 {{ ARMY_PREV_QUESTIONS[armyQuizIdx].hindiQ }}
                    </p>
                  </div>

                  <div class="space-y-2 text-xs text-left">
                    <button
                      v-for="opt in ARMY_PREV_QUESTIONS[armyQuizIdx].options"
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
                  <div v-if="armyAnswered" class="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-[11px] leading-relaxed text-left text-slate-700 space-y-1">
                    <strong class="text-amber-900 block border-b border-amber-200/50 pb-1 font-sans uppercase">💡 ANALYSIS / विश्लेषण:</strong>
                    <p><span class="font-bold">Eng:</span> {{ ARMY_PREV_QUESTIONS[armyQuizIdx].explanationEng }}</p>
                    <p><span class="font-bold text-[#138808]">Hin:</span> {{ ARMY_PREV_QUESTIONS[armyQuizIdx].explanationHin }}</p>
                  </div>

                  <!-- Next Action btn -->
                  <button
                    v-if="armyAnswered"
                    @click="() => {
                      if (armyQuizIdx === ARMY_PREV_QUESTIONS.length - 1) {
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
                    {{ armyQuizIdx === ARMY_PREV_QUESTIONS.length - 1 ? 'Finish & Check Results 🏆' : 'Next bilingual question (अगला प्रश्न) ➔' }}
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
              
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="exam-segments-grid">
                <div
                  v-for="(seg, idx) in [
                    { emoji: '🪖', title: 'Indian Army GK', desc: 'Armed forces battles, regimental values & commissions.', q: '10 Qs', badge: 'Active', color: 'amber' },
                    { emoji: '⚓', title: 'Indian Navy GK', desc: 'Naval tactical warfare codes, vessels, and entries.', q: '8 Qs', badge: 'New', color: 'blue' },
                    { emoji: '✈️', title: 'Indian Air Force GK', desc: 'Aviation systems history and general awareness.', q: '7 Qs', badge: 'Hot', color: 'sky' },
                    { emoji: '🏛️', title: 'Constitution GK', desc: 'Indian political systems, articles, and councils.', q: '8 Qs', badge: 'Core', color: 'purple' },
                    { emoji: '📜', title: 'Indian History', desc: 'Ancient events, independence acts & landmarks.', q: '7 Qs', badge: 'Standard', color: 'orange' },
                    { emoji: '🧠', title: 'General Science', desc: 'Physics formulas, chemistry variables and biology.', q: '5 Qs', badge: 'Popular', color: 'teal' }
                  ]"
                  :key="idx"
                  @click="handleNavigation('quizzes')"
                  class="group relative cursor-pointer text-left bg-white p-5 rounded-2xl border border-gray-150 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                >
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl select-none shadow-inner">
                        {{ seg.emoji }}
                      </div>
                      <span class="text-[9px] font-mono font-black uppercase text-[#000080] bg-blue-50/60 px-2 py-0.5 rounded border">
                        {{ seg.q }}
                      </span>
                    </div>

                    <div class="space-y-1">
                      <h4 class="text-xs font-black text-gray-900 group-hover:text-[#000080] font-sans">
                        {{ seg.title }}
                      </h4>
                      <p class="text-[10px] text-gray-450 leading-relaxed font-sans line-clamp-2">
                        {{ seg.desc }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] font-black text-[#000080] uppercase tracking-wider font-sans">
                    <span>Practice Board</span>
                    <span>➔</span>
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

    <!-- 4. Active Notification popup drawer -->
    <div v-if="notificationDrawerOpen" class="fixed inset-0 z-50 overflow-hidden flex justify-end" id="activity-alert-drawer">
      <div 
        class="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity cursor-pointer" 
        @click="notificationDrawerOpen = false"
      />

      <div class="relative w-full max-w-sm bg-white h-full shadow-22 flex flex-col justify-between" id="activity-alert-sheet">
        <div class="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50 shrink-0 text-left">
          <div class="flex items-center space-x-2">
            <Bell class="h-5 w-5 text-[#000080]" />
            <span class="font-extrabold text-xs uppercase tracking-wider text-gray-800">Student Live Alerts</span>
          </div>

          <button 
            @click="notificationDrawerOpen = false"
            class="text-[11px] font-black text-gray-500 hover:text-black border px-2 py-0.5 rounded cursor-pointer uppercase font-sans"
          >
            Close ×
          </button>
        </div>

        <!-- Notification List -->
        <div class="flex-1 p-5 overflow-y-auto space-y-3.5 text-left" id="notification-entries">
          <div 
            v-for="n in notifications" 
            :key="n.id" 
            :id="`notif-${n.id}`"
            class="p-3.5 bg-gray-50 border border-gray-150 rounded-xl space-y-1.5"
          >
            <span :class="[
              'text-[8px] font-black uppercase px-2 py-0.5 rounded inline-block',
              n.type === 'urgent' ? 'bg-red-50 text-red-700 border border-red-200' :
              n.type === 'new' ? 'bg-green-50 text-green-700 border border-green-200' :
              'bg-[#000080]/10 text-[#000080]'
            ]">
              {{ n.type }}
            </span>
            <p class="text-xs text-gray-800 leading-snug font-sans font-medium">{{ n.text }}</p>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t text-[10px] text-gray-400 font-mono text-center shrink-0">
          Helpline support: +91 141 2450011
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
