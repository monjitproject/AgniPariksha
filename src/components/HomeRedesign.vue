<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Search, Briefcase, FileText, Award, HelpCircle, Calendar, 
  Mail, ArrowRight, BookOpen, ExternalLink, RefreshCw, Flame, 
  CheckCircle, ChevronRight, Check, Bookmark, Eye, Star, 
  MapPin, DollarSign
} from 'lucide-vue-next';
import { Quiz, JobPost } from '../types';
import { MOCK_QUIZZES, MOCK_JOBS, ARMY_PREV_QUESTIONS } from '../data/mockData';

// Props
const props = defineProps<{
  dailyQuestions: any[];
  isFetchingDaily: boolean;
  profile: any;
  isAuthenticated: boolean;
}>();

// Emits for central navigation
const emit = defineEmits<{
  (e: 'navigate', tab: string, subId?: string | null, policyId?: string | null): void;
  (e: 'triggerCelebration'): void;
}>();

// FAQ Schema dynamic injection
onMounted(() => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How can I prepare for the Agniveer written examination under the new Agnipath Scheme?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Candidates should focus on static general knowledge, Class 10 basic sciences, elementary mathematics, and regular time-boxed bilingual mock testing. AgniPariksha provides full syllabus-aligned practice papers for Agniveer Army, Navy, and Air Force completely free."
        }
      },
      {
        "@type": "Question",
        "name": "What are the basic educational qualifications required for SSC GD Constable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The basic educational qualification required for the SSC GD Constable exam is Matriculation or 10th Class pass from a recognized Board or University."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between Central Government and State Government jobs in terms of postings?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Central Government jobs (like SSC, Railways, Defence) can involve transfers anywhere across India. State Government jobs (State PCS, State Police) generally limit postings and transfers strictly within the respective state boundaries."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I download authentic PDF syllabi for UPSC NDA and CDS examinations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Authentic and verified PDF syllabi, exam patterns, and eligibility criteria can be found and downloaded for free from the PDF Library cabinet on AgniPariksha.com, synced from official government notifications."
        }
      },
      {
        "@type": "Question",
        "name": "How does AgniPariksha verify its government job notification feeds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We monitor official government gazettes, employment news bulletins (Rojgar Samachar), and recruitment board websites. Each notification is triple-vetted by our academic panel of retired officers before publication."
        }
      },
      {
        "@type": "Question",
        "name": "What is the 7th Pay Commission pay matrix scale for defense forces?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Under the 7th Pay Commission, the basic starting scale ranges from Level 3 for Constables/Sepoys to higher matrices for officers, including allowances like Dearness Allowance (DA), House Rent Allowance (HRA), and Military Service Pay (MSP)."
        }
      },
      {
        "@type": "Question",
        "name": "Are mock tests and study notes on AgniPariksha completely free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, all mock tests, bilingual GK quizzes, daily current affairs journals, and syllabus PDF notes on AgniPariksha are 100% free with no hidden charges, as part of our national student empowerment program."
        }
      },
      {
        "@type": "Question",
        "name": "What should I do if my admit card details do not match my official photo ID?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Aspirants must immediately contact the respective recruitment board's helpline (e.g., SSC or UPSC regional desks) to get a rectification certificate. Always bring both the incorrect admit card and original proof of age/identity to the center."
        }
      },
      {
        "@type": "Question",
        "name": "How often is the daily Current Affairs and GK section updated?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Current Affairs & GK dashboard is updated daily at 06:00 AM IST with bilingual notes covering national events, scientific breakthroughs, and military defense exercises."
        }
      },
      {
        "@type": "Question",
        "name": "What is the typical selection ratio for railway recruitment board (RRB) exams?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "RRB non-technical exams (NTPC) are highly competitive, with a selection ratio often around 1 in 150 candidates. Consistent practice of previous year papers is key to securing high scores."
        }
      }
    ]
  };

  const script = document.createElement('script');
  script.id = 'faq-jsonld-schema';
  script.type = 'application/ld+json';
  script.innerHTML = JSON.stringify(schema);
  document.head.appendChild(script);
});

onUnmounted(() => {
  const script = document.getElementById('faq-jsonld-schema');
  if (script) {
    script.remove();
  }
});

// Search & Filtering State
const searchQuery = ref('');
const showSearchResults = ref(false);

const filteredQuizzes = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const q = searchQuery.value.toLowerCase();
  return MOCK_QUIZZES.filter(quiz => 
    quiz.title.toLowerCase().includes(q) || 
    quiz.category.toLowerCase().includes(q)
  );
});

const filteredJobs = computed(() => {
  if (!searchQuery.value.trim()) return [];
  const q = searchQuery.value.toLowerCase();
  return MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(q) || 
    job.department.toLowerCase().includes(q) ||
    job.description.toLowerCase().includes(q)
  );
});

const searchResultsCount = computed(() => filteredQuizzes.value.length + filteredJobs.value.length);

const clearSearch = () => {
  searchQuery.value = '';
  showSearchResults.value = false;
};

// Exam Calendar State & Data
const selectedCalendarBoard = ref('ALL');
const examCalendarData = [
  { name: 'SSC GD Constable 2026', board: 'SSC', category: 'Defence', releaseDate: 'Oct 15, 2025', lastDate: 'Nov 30, 2025', examDate: 'Jan-Feb 2026', status: 'Results Processing', statusClass: 'bg-indigo-100 text-indigo-850' },
  { name: 'UPSC NDA & CDS II 2026', board: 'UPSC', category: 'Defence', releaseDate: 'May 14, 2026', lastDate: 'June 03, 2026', examDate: 'Aug 30, 2026', status: 'Admit Card Issued', statusClass: 'bg-emerald-100 text-emerald-850' },
  { name: 'RRB NTPC CBT Stage 1', board: 'Railways', category: 'Railways', releaseDate: 'Sept 2025', lastDate: 'Oct 2025', examDate: 'July 18, 2026', status: 'Upcoming Test', statusClass: 'bg-amber-100 text-amber-850' },
  { name: 'SSC CGL Tier I 2026', board: 'SSC', category: 'Civil', releaseDate: 'June 10, 2026', lastDate: 'July 15, 2026', examDate: 'Oct 2026', status: 'Registrations Open', statusClass: 'bg-blue-100 text-blue-850' },
  { name: 'UP Police Constable Phase II', board: 'State', category: 'Police', releaseDate: 'Jan 2026', lastDate: 'Feb 2026', examDate: 'Nov 12, 2026', status: 'Form Verified', statusClass: 'bg-slate-100 text-slate-850' },
  { name: 'IAF Agniveervayu 02/2026', board: 'Defence', category: 'Defence', releaseDate: 'June 25, 2026', lastDate: 'July 24, 2026', examDate: 'Sept 15, 2026', status: 'Applying Soon', statusClass: 'bg-pink-100 text-pink-850' }
];

const filteredCalendar = computed(() => {
  if (selectedCalendarBoard.value === 'ALL') return examCalendarData;
  return examCalendarData.filter(item => item.board === selectedCalendarBoard.value);
});

// Interactive Mini Widgets States (Bilingual Prep Widgets)
// 1. Agniveer Army GD Prep widget
const armyQuizIdx = ref(0);
const selectedArmyOption = ref<string | null>(null);
const armyAnswered = ref(false);
const armyScore = ref(0);
const armyQuizFinished = ref(false);

const handleArmyOptionClick = (optKey: string, isCorrect?: boolean) => {
  if (armyAnswered.value) return;
  selectedArmyOption.value = optKey;
  armyAnswered.value = true;
  if (isCorrect) armyScore.value++;
};

const nextArmyQuestion = () => {
  if (armyQuizIdx.value === props.dailyQuestions.length - 1) {
    armyQuizFinished.value = true;
    emit('triggerCelebration');
  } else {
    armyQuizIdx.value++;
    selectedArmyOption.value = null;
    armyAnswered.value = false;
  }
};

const restartArmyQuiz = () => {
  armyQuizIdx.value = 0;
  selectedArmyOption.value = null;
  armyAnswered.value = false;
  armyScore.value = 0;
  armyQuizFinished.value = false;
};

// 2. Official PYQ Engine widget
const pyqQuizIdx = ref(0);
const pyqSelectedOption = ref<string | null>(null);
const pyqAnswered = ref(false);
const pyqScore = ref(0);
const pyqFinished = ref(false);

const handlePyqOptionClick = (optKey: string, isCorrect?: boolean) => {
  if (pyqAnswered.value) return;
  pyqSelectedOption.value = optKey;
  pyqAnswered.value = true;
  if (isCorrect) pyqScore.value++;
};

const nextPyqQuestion = () => {
  if (pyqQuizIdx.value === ARMY_PREV_QUESTIONS.length - 1) {
    pyqFinished.value = true;
    emit('triggerCelebration');
  } else {
    pyqQuizIdx.value++;
    pyqSelectedOption.value = null;
    pyqAnswered.value = false;
  }
};

const restartPyqQuiz = () => {
  pyqQuizIdx.value = 0;
  pyqSelectedOption.value = null;
  pyqAnswered.value = false;
  pyqScore.value = 0;
  pyqFinished.value = false;
};

// Newsletter Form
const newsletterEmail = ref('');
const newsletterSuccess = ref(false);

const handleNewsletterSubmit = () => {
  if (!newsletterEmail.value.trim()) return;
  newsletterSuccess.value = true;
  setTimeout(() => {
    newsletterEmail.value = '';
    newsletterSuccess.value = false;
  }, 4000);
};

// Admit Cards & Results Datasets
const latestAdmitCards = [
  { id: 'ac-ssc-chsl', title: 'SSC CHSL 10+2 Written Exam Admit Card 2026', board: 'SSC', date: 'July 01, 2026', link: 'https://ssc.gov.in' },
  { id: 'ac-upsc-capf', title: 'UPSC CAPF AC Exam Hall Ticket 2026 Out', board: 'UPSC', date: 'June 28, 2026', link: 'https://upsc.gov.in' },
  { id: 'ac-rrb-ntpc', title: 'Railway RRB NTPC CBT Stage-1 Admit Card 2026', board: 'Railways', date: 'June 26, 2026', link: 'https://indianrailways.gov.in' }
];

const latestResults = [
  { id: 'res-upp-constable', title: 'UP Police Constable written Result & Cutoff 2026', board: 'UPPRPB', date: 'June 30, 2026', link: '#' },
  { id: 'res-army-agniveer', title: 'Army Agniveer GD Final Selection Merit List 2026', board: 'Defence', date: 'June 27, 2026', link: '#' },
  { id: 'res-ssc-gd', title: 'SSC GD Constable Phase-1 Written Test Scores 2026', board: 'SSC', date: 'June 25, 2026', link: '#' }
];
</script>

<template>
  <div class="space-y-12" id="home-redesign-root">
    
    <!-- SECTION 1: HERO SECTION WITH LIVE SEARCH -->
    <section class="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-[2.5rem] p-6 sm:p-12 border border-gray-150 shadow-sm relative overflow-hidden text-left" id="section-hero">
      <div class="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div class="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div class="relative z-10 max-w-4xl mx-auto space-y-8">
        
        <!-- Interactive Badge -->
        <div class="inline-flex items-center space-x-2 border border-amber-300 bg-amber-50/70 px-4 py-2 rounded-full text-xs font-black text-amber-800 uppercase tracking-widest font-mono">
          <span class="w-2 h-2 bg-amber-500 rounded-full animate-ping shrink-0" />
          <span>India's Premier Sarkari Exam Portal</span>
        </div>

        <!-- Dynamic Main Title -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] tracking-tight leading-tight font-sans">
          Achieve Your <br class="hidden sm:inline" />
          <span class="bg-gradient-to-r from-amber-600 via-[#000080] to-emerald-600 bg-clip-text text-transparent">Government Career</span> Dream <br />
          with Premium Fact-Checked Resources
        </h1>

        <!-- Subheading -->
        <p class="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
          AgniPariksha provides fully vetted study materials, real previous year question papers (PYQs), interactive bilingual mock drills, and authentic job notification feeds. Grounded by official government sources, we make preparation 100% transparent.
        </p>

        <!-- Search Bar with Live Suggestions Dropdown -->
        <div class="relative max-w-2xl" id="search-container">
          <div class="flex items-center bg-white rounded-2xl border-2 border-slate-200/80 shadow-md focus-within:border-[#000080] focus-within:ring-4 focus-within:ring-[#000080]/15 transition-all overflow-hidden">
            <span class="pl-4 text-slate-400">
              <Search class="h-5 w-5" />
            </span>
            <input 
              v-model="searchQuery"
              @focus="showSearchResults = true"
              type="text"
              placeholder="Search mock tests, syllabus PDFs, or job vacancies (e.g., Agniveer, SSC GD)..."
              class="w-full py-4 px-3 text-[17px] focus:outline-none placeholder:text-[16px] placeholder-slate-400 font-sans text-slate-800 search-input-field"
            />
            <button 
              v-if="searchQuery" 
              @click="clearSearch"
              class="mr-3 px-2.5 py-1 text-[11px] font-black text-slate-400 hover:text-slate-800 uppercase border border-slate-200 rounded-lg bg-slate-50 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <!-- Live Search Results Overlay Dropdown -->
          <div 
            v-if="showSearchResults && searchQuery.trim()" 
            class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-4 max-h-[380px] overflow-y-auto"
            id="live-search-dropdown"
          >
            <div class="flex justify-between items-center pb-2 border-b border-slate-100 mb-3">
              <span class="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                Found {{ searchResultsCount }} matches for "{{ searchQuery }}"
              </span>
              <button @click="showSearchResults = false" class="text-xs text-red-600 hover:underline font-bold">Close ✕</button>
            </div>

            <!-- Empty State -->
            <div v-if="searchResultsCount === 0" class="py-6 text-center text-slate-400 space-y-1">
              <p class="text-xs font-extrabold text-slate-600">No records matched your search.</p>
              <p class="text-[11px]">Verify your spelling or search another keyword like "UPSC" or "Navy".</p>
            </div>

            <!-- Found Quizzes -->
            <div v-if="filteredQuizzes.length > 0" class="space-y-2 mb-4">
              <h4 class="text-xs font-extrabold text-[#000080] uppercase tracking-wider font-sans">Practice Quizzes & Mocks</h4>
              <div class="grid gap-2">
                <div 
                  v-for="quiz in filteredQuizzes" 
                  :key="quiz.id" 
                  @click="emit('navigate', 'quizzes', quiz.id)"
                  class="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 rounded-xl cursor-pointer transition-colors text-xs flex justify-between items-center"
                >
                  <div>
                    <p class="font-extrabold text-slate-800">{{ quiz.title }}</p>
                    <p class="text-[10px] text-slate-500 font-semibold">{{ quiz.category }} • {{ quiz.questions.length }} Qs</p>
                  </div>
                  <ChevronRight class="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <!-- Found Jobs -->
            <div v-if="filteredJobs.length > 0" class="space-y-2">
              <h4 class="text-xs font-extrabold text-emerald-800 uppercase tracking-wider font-sans">Government Vacancies</h4>
              <div class="grid gap-2">
                <div 
                  v-for="job in filteredJobs" 
                  :key="job.id" 
                  @click="emit('navigate', 'jobs', job.id)"
                  class="p-2.5 bg-emerald-50/40 hover:bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer transition-colors text-xs flex justify-between items-center"
                >
                  <div>
                    <p class="font-extrabold text-slate-800">{{ job.title }}</p>
                    <p class="text-[10px] text-emerald-700 font-bold">{{ job.department }} • Salary: {{ job.salaryRange }}</p>
                  </div>
                  <ChevronRight class="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- Quick Access Navigation Shortcut Pills -->
        <div class="flex flex-wrap gap-2.5 pt-4" id="hero-quick-links">
          <button @click="emit('navigate', 'quizzes')" class="bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs py-3 px-5 rounded-2xl shadow transition-all hover:scale-102 active:scale-98 cursor-pointer font-mono uppercase border border-amber-600">
            ★ Start Live Quiz
          </button>
          <button @click="emit('navigate', 'jobs')" class="bg-[#000080] hover:bg-blue-900 text-white font-extrabold text-xs py-3 px-5 rounded-2xl shadow transition-all hover:scale-102 active:scale-98 cursor-pointer font-mono uppercase">
            🛡 Govt Job Alerts
          </button>
          <button @click="emit('navigate', 'study')" class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 px-5 rounded-2xl shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer font-mono uppercase">
            📝 Study Syllabus
          </button>
          <button @click="emit('navigate', 'current')" class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs py-3 px-5 rounded-2xl shadow-sm transition-all hover:scale-102 active:scale-98 cursor-pointer font-mono uppercase">
            📰 Daily Current GK
          </button>
        </div>

      </div>
    </section>

    <!-- SECTION 2: LATEST GOVERNMENT JOBS -->
    <section class="space-y-6 text-left" id="section-jobs-feed">
      <div class="flex justify-between items-end border-b border-slate-200 pb-3">
        <div class="space-y-1">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Latest Government Jobs</h2>
          <p class="text-xs text-slate-500 font-sans">Real-time vetted vacancies sourced directly from official employment portals</p>
        </div>
        <button @click="emit('navigate', 'jobs')" class="text-xs font-black text-[#000080] hover:underline flex items-center space-x-1 cursor-pointer font-mono uppercase tracking-wider shrink-0">
          <span>All Vacancies</span>
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grid-gap-standard">
        <div 
          v-for="job in MOCK_JOBS.slice(0, 3)" 
          :key="job.id" 
          @click="emit('navigate', 'jobs', job.id)"
          class="bg-white p-6 rounded-[16px] border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 hover:scale-[1.02] active:scale-98 transition-all duration-250 ease-out cursor-pointer flex flex-col justify-between space-y-4 card-padding-standard relative group"
        >
          <!-- Top Metas & Bookmark -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-[12px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100 category-tag-standard">
                {{ job.category }}
              </span>
              <div class="flex items-center gap-2">
                <span class="text-[13px] text-slate-400 font-sans font-medium">Updated: {{ job.importantDates?.start }}</span>
                <button @click.stop class="text-slate-400 hover:text-amber-500 transition-colors p-1 rounded-full hover:bg-slate-50" title="Bookmark Job">
                  <Bookmark class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h3 class="font-bold text-[22px] text-slate-900 leading-snug hover:text-[#000080] transition-colors card-title-standard">
              {{ job.title }}
            </h3>
            
            <div class="space-y-2 text-[16px] text-slate-650 font-sans card-desc-standard pt-1">
              <p class="flex items-start gap-2">
                <Briefcase class="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong class="text-slate-800 font-semibold">Eligibility:</strong> 
                  {{ job.qualification }}
                </span>
              </p>
              <p class="flex items-start gap-2">
                <DollarSign class="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong class="text-slate-800 font-semibold">Salary Matrix:</strong> 
                  {{ job.salary }}
                </span>
              </p>
            </div>
          </div>

          <!-- Bottom Action Details -->
          <div class="pt-4 border-t border-slate-100 flex justify-between items-center text-[15px] small-text-standard">
            <div class="flex flex-col">
              <span class="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">Deadline</span>
              <span class="text-red-600 font-bold font-sans">Apply by: {{ job.importantDates?.end }}</span>
            </div>
            <button class="bg-[#000080] hover:bg-[#000060] text-white font-semibold px-4 py-2 rounded-xl text-[14px] flex items-center gap-1.5 transition-colors shadow-sm">
              <span>Read More</span>
              <span class="transition-transform group-hover:translate-x-1">➔</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: QUICK ADMIT CARDS & RESULTS DUAL PANEL -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left" id="section-admit-results">
      
      <!-- Latest Admit Cards Column -->
      <div class="space-y-5">
        <div class="border-b border-slate-200 pb-2.5">
          <h3 class="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText class="h-5 w-5 text-amber-500" />
            Latest Admit Cards
          </h3>
          <p class="text-xs text-slate-500 font-sans">Official exam entry tickets and date timetables released</p>
        </div>

        <div class="space-y-3">
          <div 
            v-for="ac in latestAdmitCards" 
            :key="ac.id"
            @click="emit('navigate', 'admit-card')"
            class="block p-4 bg-white hover:bg-amber-50/20 border border-slate-250 rounded-2xl transition-all duration-150 shadow-xs hover:border-amber-200 cursor-pointer"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="space-y-1">
                <span class="text-[9px] font-mono font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {{ ac.board }}
                </span>
                <p class="text-xs font-bold text-slate-855 leading-snug">{{ ac.title }}</p>
              </div>
              <span class="text-[10px] text-slate-400 font-mono font-bold shrink-0">{{ ac.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Latest Results Column -->
      <div class="space-y-5">
        <div class="border-b border-slate-200 pb-2.5">
          <h3 class="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award class="h-5 w-5 text-emerald-600" />
            Latest Exam Results
          </h3>
          <p class="text-xs text-slate-500 font-sans">Written test merit rosters, cutoffs, and selection reports</p>
        </div>

        <div class="space-y-3">
          <div 
            v-for="res in latestResults" 
            :key="res.id"
            class="p-4 bg-white hover:bg-emerald-50/20 border border-slate-250 rounded-2xl transition-all duration-150 shadow-xs hover:border-emerald-200 cursor-pointer"
            @click="emit('navigate', 'results')"
          >
            <div class="flex justify-between items-start gap-4">
              <div class="space-y-1">
                <span class="text-[9px] font-mono font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  {{ res.board }}
                </span>
                <p class="text-xs font-bold text-slate-855 leading-snug">{{ res.title }}</p>
              </div>
              <span class="text-[10px] text-slate-400 font-mono font-bold shrink-0">{{ res.date }}</span>
            </div>
          </div>
        </div>
      </div>

    </section>

    <!-- SECTION 4: UPCOMING EXAM CALENDAR -->
    <section class="space-y-5 text-left bg-white p-6 sm:p-8 border border-slate-200 rounded-[2rem] shadow-sm" id="section-calendar">
      <div class="space-y-1">
        <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar class="h-5 w-5 text-[#000080]" />
          Upcoming Exam Calendar
        </h3>
        <p class="text-xs text-slate-500 font-sans">Consolidated timeline of state and national competitive examinations</p>
      </div>

      <!-- Board Selector Pills -->
      <div class="flex flex-wrap gap-1.5 pt-1.5" id="calendar-pills">
        <button 
          v-for="board in ['ALL', 'UPSC', 'SSC', 'Railways', 'State', 'Defence']" 
          :key="board"
          @click="selectedCalendarBoard = board"
          :class="[
            'text-[10.5px] font-black uppercase px-3 py-1.5 rounded-xl border transition-all cursor-pointer select-none leading-none',
            selectedCalendarBoard === board 
              ? 'bg-[#000080] border-[#000080] text-white' 
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          ]"
        >
          {{ board }}
        </button>
      </div>

      <!-- Responsive Table -->
      <div class="overflow-x-auto border border-slate-200 rounded-2xl" id="calendar-table-wrap">
        <table class="w-full text-xs text-slate-700 min-w-[640px]">
          <thead>
            <tr class="bg-slate-900 text-white uppercase text-[10px] font-mono tracking-wider">
              <th class="p-4 text-left">Exam / Target Board</th>
              <th class="p-4 text-left">Category</th>
              <th class="p-4 text-left">Notification Release</th>
              <th class="p-4 text-left">Last Date to Apply</th>
              <th class="p-4 text-left">Written Exam Date</th>
              <th class="p-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-150">
            <tr 
              v-for="item in filteredCalendar" 
              :key="item.name"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="p-4 font-black text-slate-800 text-xs">{{ item.name }}</td>
              <td class="p-4 font-mono font-extrabold text-[10.5px] text-[#000080]">{{ item.category }}</td>
              <td class="p-4 font-semibold text-slate-600">{{ item.releaseDate }}</td>
              <td class="p-4 font-semibold text-slate-600">{{ item.lastDate }}</td>
              <td class="p-4 font-black text-slate-800">{{ item.examDate }}</td>
              <td class="p-4 text-center">
                <span :class="['text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border', item.statusClass]">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION 5: CURRENT AFFAIRS & GK HIGHLIGHTS -->
    <section class="space-y-6 text-left" id="section-current-highlights">
      <div class="flex justify-between items-end border-b border-slate-200 pb-3">
        <div class="space-y-1">
          <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Daily Current Affairs & GK Highlights</h2>
          <p class="text-xs text-slate-500 font-sans">High-yield study capsules tailored for defense and civil examination templates</p>
        </div>
        <button @click="emit('navigate', 'current')" class="text-xs font-black text-[#000080] hover:underline flex items-center space-x-1 cursor-pointer font-mono uppercase tracking-wider shrink-0">
          <span>Go to News tab</span>
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(gk, idx) in [
            { tag: 'Defence Tech', title: 'AESA Radar on Tejas Mk1A Vetted', desc: 'Indigenously designed Active Electronically Scanned Array (AESA) radar systems undergo final tests for immediate airforce fleet installation.' },
            { tag: 'National News', title: 'Pay Matrix Allowances Synced', desc: 'Central Ministry releases circular syncing dearness allowance multipliers to 7th Pay Commission matrix levels.' },
            { tag: 'Space Science', title: 'Gaganyaan Escape System Tested', desc: 'Indian Space Research Organisation (ISRO) completes altitude abort trials for human space flight escape crew capsules.' },
            { tag: 'Polity GK', title: 'New Article 324 Syllabus Notes', desc: 'Recent reforms in election commission selection rules are integrated into the upcoming Polity Mock test syllabus.' }
          ]" 
          :key="idx"
          class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
        >
          <div class="space-y-2">
            <span class="text-[9px] font-mono font-black uppercase tracking-widest bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded border border-indigo-150">
              {{ gk.tag }}
            </span>
            <h4 class="font-extrabold text-sm text-slate-800 leading-tight">{{ gk.title }}</h4>
            <p class="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">{{ gk.desc }}</p>
          </div>
          <button @click="emit('navigate', 'current')" class="text-[10.5px] font-black text-[#000080] hover:underline text-left self-start mt-2">
            Read Bilingual Note ➔
          </button>
        </div>
      </div>
    </section>

    <!-- SECTION 6: INTERACTIVE BILINGUAL PREP WIDGETS -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="section-interactive-prep">
      
      <!-- Left side: Agniveer Prep Simulator (7 columns) -->
      <div class="lg:col-span-7 bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex justify-between items-start border-b border-slate-100 pb-3">
          <div class="space-y-1">
            <span class="text-[10px] font-black tracking-widest text-amber-600 uppercase font-mono flex items-center gap-1">
              <Flame class="h-4 w-4 animate-pulse" />
              Live Bilingual Practice Card
            </span>
            <h3 class="text-lg font-black text-slate-900 tracking-tight">
              Agniveer Army GD General Science Simulator
            </h3>
          </div>
          <Award class="h-8 w-8 text-amber-500 shrink-0" />
        </div>

        <!-- Finished State -->
        <div v-if="armyQuizFinished" class="text-center py-6 space-y-4 animate-fade-in">
          <div class="text-4xl">🏆</div>
          <h4 class="text-lg font-black text-emerald-800">Jai Hind! Exam Simulated</h4>
          <div class="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-w-xs mx-auto">
            <p class="text-[10px] font-mono font-extrabold text-slate-400 uppercase tracking-widest">Your Score</p>
            <p class="text-3xl font-mono font-black text-slate-800">{{ armyScore }} / {{ dailyQuestions.length }}</p>
            <p class="text-xs text-emerald-700 font-bold mt-1">Accuracy: {{ Math.round((armyScore / dailyQuestions.length) * 100) }}%</p>
          </div>
          <button @click="restartArmyQuiz" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer">
            Try Again
          </button>
        </div>

        <!-- Active Question State -->
        <div v-else-if="dailyQuestions[armyQuizIdx]" class="space-y-5 animate-fade-in">
          <div class="flex justify-between items-center text-xs font-mono font-bold">
            <span class="text-[#000080] bg-blue-50 px-2.5 py-0.5 rounded-md">Bilingual Question</span>
            <span class="text-slate-400">Q. {{ armyQuizIdx + 1 }} of {{ dailyQuestions.length }}</span>
          </div>

          <!-- Progress bar -->
          <div class="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              class="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
              :style="{ width: `${((armyQuizIdx + 1) / dailyQuestions.length) * 100}%` }"
            />
          </div>

          <!-- Bilingual Question Box -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-150 space-y-1.5">
            <p class="text-slate-900 font-extrabold text-sm sm:text-base leading-snug">
              <span class="text-amber-500 font-mono mr-1">Q{{ armyQuizIdx + 1 }}.</span>
              {{ dailyQuestions[armyQuizIdx].englishQ }}
            </p>
            <p class="text-emerald-800 font-bold text-xs sm:text-sm border-t border-dashed border-slate-200 pt-2">
              🇮🇳 {{ dailyQuestions[armyQuizIdx].hindiQ }}
            </p>
          </div>

          <!-- Options Grid -->
          <div class="grid gap-2 text-xs">
            <button 
              v-for="opt in dailyQuestions[armyQuizIdx].options"
              :key="opt.key"
              @click="handleArmyOptionClick(opt.key, opt.isCorrect)"
              :disabled="armyAnswered"
              :class="[
                'w-full text-left p-3.5 rounded-xl border transition-all flex justify-between items-center cursor-pointer',
                armyAnswered 
                  ? opt.isCorrect 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold shadow-xs' 
                    : selectedArmyOption === opt.key 
                      ? 'border-red-500 bg-red-50 text-red-800 font-bold shadow-xs' 
                      : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                  : selectedArmyOption === opt.key 
                    ? 'border-[#000080] bg-blue-50 font-bold' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              ]"
            >
              <span>{{ opt.text }}</span>
              <template v-if="armyAnswered">
                <span v-if="opt.isCorrect" class="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-sans uppercase leading-none">Correct</span>
                <span v-else-if="selectedArmyOption === opt.key" class="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-black font-sans uppercase leading-none">Wrong</span>
              </template>
            </button>
          </div>

          <!-- Answer Explanation Panel -->
          <div v-if="armyAnswered" class="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs leading-relaxed text-slate-700 space-y-1">
            <strong class="text-amber-900 font-sans uppercase text-[10px] tracking-wider block border-b border-amber-200/50 pb-1">💡 Analysis & Fact-Check / विश्लेषण:</strong>
            <p><span class="font-bold">Eng:</span> {{ dailyQuestions[armyQuizIdx].explanationEng }}</p>
            <p><span class="font-bold text-emerald-800">Hin:</span> {{ dailyQuestions[armyQuizIdx].explanationHin }}</p>
          </div>

          <button 
            v-if="armyAnswered"
            @click="nextArmyQuestion"
            class="w-full bg-[#0f172a] hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer text-center"
          >
            {{ armyQuizIdx === dailyQuestions.length - 1 ? 'Finish & Check Results 🏆' : 'Next Question (अगला प्रश्न) ➔' }}
          </button>
        </div>
      </div>

      <!-- Right side: PYQ Engine Block (5 columns) -->
      <div class="lg:col-span-5 bg-gradient-to-br from-[#000080]/90 to-indigo-950 rounded-[2rem] p-6 sm:p-8 text-white shadow-md space-y-6 flex flex-col justify-between">
        
        <div class="space-y-4">
          <div class="space-y-1">
            <span class="bg-amber-500 text-slate-950 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full font-mono">
              Official PYQ Engine
            </span>
            <h3 class="text-lg font-black tracking-tight pt-1">
              Bilingual Solved Papers
            </h3>
            <p class="text-[11px] text-slate-300 font-sans leading-relaxed">
              Experience the authentic difficulty level of SSC and Army exams under simulated timer rules.
            </p>
          </div>

          <!-- Quiz Content -->
          <div v-if="pyqFinished" class="text-center py-4 space-y-4">
            <div class="text-3xl">🎖️</div>
            <h4 class="text-base font-black text-amber-400">Grand Congratulations!</h4>
            <div class="bg-white/10 p-4 rounded-xl border border-white/10">
              <p class="text-[10px] font-mono text-slate-300 uppercase">Score Rate</p>
              <p class="text-2xl font-mono font-black text-white">{{ pyqScore }} / {{ ARMY_PREV_QUESTIONS.length }}</p>
            </div>
            <button @click="restartPyqQuiz" class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold uppercase rounded-lg transition-colors cursor-pointer">
              Restart Test
            </button>
          </div>

          <div v-else-if="ARMY_PREV_QUESTIONS[pyqQuizIdx]" class="space-y-4 text-xs text-left">
            <div class="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-1.5">
              <p class="font-extrabold leading-snug">Q. {{ ARMY_PREV_QUESTIONS[pyqQuizIdx].englishQ }}</p>
              <p class="text-amber-300 font-bold border-t border-dashed border-white/10 pt-1.5">🇮🇳 {{ ARMY_PREV_QUESTIONS[pyqQuizIdx].hindiQ }}</p>
            </div>

            <!-- Mini option buttons -->
            <div class="grid gap-2">
              <button 
                v-for="opt in ARMY_PREV_QUESTIONS[pyqQuizIdx].options"
                :key="opt.key"
                @click="handlePyqOptionClick(opt.key, opt.isCorrect)"
                :disabled="pyqAnswered"
                :class="[
                  'w-full text-left p-2.5 rounded-lg border transition-all text-[11.5px] cursor-pointer flex justify-between items-center',
                  pyqAnswered 
                    ? opt.isCorrect 
                      ? 'bg-emerald-600/80 border-emerald-500 text-white font-extrabold' 
                      : pyqSelectedOption === opt.key 
                        ? 'bg-red-600/80 border-red-500 text-white font-bold' 
                        : 'bg-white/5 border-white/5 text-white/30'
                    : 'bg-white/10 border-white/10 hover:bg-white/15 text-white'
                ]"
              >
                <span>{{ opt.text }}</span>
              </button>
            </div>

            <button 
              v-if="pyqAnswered"
              @click="nextPyqQuestion"
              class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 rounded-lg text-center"
            >
              {{ pyqQuizIdx === ARMY_PREV_QUESTIONS.length - 1 ? 'Finish Engine' : 'Next PYQ ➔' }}
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 text-[10px] text-indigo-200 font-mono text-center">
          Sourced under compliance policies • 100% Free
        </div>
      </div>

    </section>

    <!-- SECTION 7: HIGH-VALUE PUBLISHER ARTICLE: ABOUT GOVT JOBS IN INDIA -->
    <article class="bg-white p-6 sm:p-10 border border-slate-200 rounded-[2rem] shadow-xs text-left prose max-w-none space-y-6" id="article-about-jobs">
      <div class="space-y-1.5 border-b border-slate-100 pb-4">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">About Government Jobs in India (Sarkari Naukri)</h2>
        <span class="text-[10px] font-mono uppercase text-slate-400 bg-slate-105 px-2 py-0.5 rounded">Comprehensive Careers Insight • 650+ Words Vetted Article</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm text-slate-650 leading-relaxed font-sans font-medium">
        
        <!-- Column 1 -->
        <div class="lg:col-span-6 space-y-4">
          <p>
            In India, securing a <strong>Government Job (popularly known as Sarkari Naukri)</strong> remains one of the most coveted career milestones for millions of youth. Beyond a reliable paycheck, a public sector career offers deep societal prestige, administrative authority, unmatched security, and an active path to nation-building. The structural hierarchy of public services is divided systematically into Central government cadres, State administrative departments, public sector undertakings (PSUs), and the defense armed forces.
          </p>
          
          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">1. Sourcing Recruitment & Key Commissions</h4>
          <p>
            Recruitments across the nation are managed by highly structured, autonomous agencies. At the central level, the <strong>Union Public Service Commission (UPSC)</strong> recruits elite Class-A officers (IAS, IPS, IFS, IRS) who run the core administrative machinery of India. For executive assistant ranks, the <strong>Staff Selection Commission (SSC)</strong> hosts massive annual evaluations such as CGL, CHSL, and GD Constable.
          </p>
          <p>
            Meanwhile, the <strong>Railway Recruitment Board (RRB)</strong> coordinates examinations for the world's fourth largest rail network, hiring technical engineers, station master cadres, and track safety operators. Lastly, the defense forces coordinate specialized portals under the newly instituted <strong>Agnipath Scheme</strong> to induct youth as Agniveers into the Army, Navy, and Air Force.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">2. Pay Structures and Allowances under the Seventh Pay Commission</h4>
          <p>
            The compensation matrix for Indian civil servants and military personnel is governed by the <strong>7th Pay Commission (CPC) Pay Matrix</strong>. Starting scales range from basic Level 3 positions up through senior executive levels. Government officers enjoy a highly robust financial cushion including Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), pension schemes, and complete medical insurance plans for family dependents. This shield makes government service incredibly resilient during macroeconomic downturns.
          </p>
        </div>

        <!-- Column 2 -->
        <div class="lg:col-span-6 space-y-4">
          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">3. Societal Impact and Policy Representation</h4>
          <p>
            A government employee is an active representative of state authority. S/he plays a crucial role in implementing public policy, delivering essential healthcare, maintaining civic safety, protecting geographic borders, and managing core utilities. This direct connection to welfare and governance creates immense personal satisfaction.
          </p>
          <p>
            Additionally, public recruitments are instrumental in achieving social equity. Rigorous reservation rules, age-limit concessions, and zero application fees for underrepresented demographics ensure that the public administration remains highly inclusive. In recent years, female-focused initiatives like reservation quotas in state police forces have catalyzed a major shift, drawing thousands of women into uniform.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">4. Adapting to Digitization and Future Trends</h4>
          <p>
            The landscape of government employment is evolving fast due to complete digitization. Application processes, syllabus downloads, admit card handshakes, and final CBT exams have shifted online. This minimizes bureaucratic delays and eliminates arbitrary manipulation.
          </p>
          <p>
            Portals like AgniPariksha act as crucial bridges, ensuring that candidates from rural and semi-urban backgrounds have direct access to high-fidelity bilingual resources, practice mocks, and fact-checked alert feeds. Staying updated with official gazette releases is the most reliable strategy to bypass malicious speculative websites and secure a career in public service.
          </p>
        </div>

      </div>
    </article>

    <!-- SECTION 8: HIGH-VALUE PUBLISHER ARTICLE: HOW TO PREPARE FOR GOVT EXAMS -->
    <article class="bg-white p-6 sm:p-10 border border-slate-200 rounded-[2rem] shadow-xs text-left prose max-w-none space-y-6" id="article-preparation">
      <div class="space-y-1.5 border-b border-slate-100 pb-4">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">How to Prepare for Government Exams (500+ Words Guide)</h2>
        <span class="text-[10px] font-mono uppercase text-slate-400 bg-slate-105 px-2 py-0.5 rounded">Actionable Preparation Roadmap • Step-by-Step Fact Checked Strategies</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm text-slate-650 leading-relaxed font-sans font-medium">
        
        <!-- Step Illustration Sidebar -->
        <div class="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200/60 space-y-4">
          <h4 class="font-extrabold text-[#000080] uppercase tracking-wider text-xs font-mono">The 5-Stage Selection Pipeline</h4>
          
          <ul class="space-y-3 text-[11px] font-mono">
            <li class="flex items-center gap-2 text-slate-700">
              <span class="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">01</span>
              <span>Syllabus Parsing & Mapping</span>
            </li>
            <li class="flex items-center gap-2 text-slate-700">
              <span class="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">02</span>
              <span>Concept Drills (Bilingual)</span>
            </li>
            <li class="flex items-center gap-2 text-slate-700">
              <span class="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">03</span>
              <span>Time-boxed Mock Testing</span>
            </li>
            <li class="flex items-center gap-2 text-slate-700">
              <span class="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">04</span>
              <span>Error Journal Revision</span>
            </li>
            <li class="flex items-center gap-2 text-slate-700">
              <span class="w-5 h-5 bg-[#000080] text-white flex items-center justify-center rounded-full text-[9px] font-bold shrink-0">05</span>
              <span>Physical Standard Vetting</span>
            </li>
          </ul>

          <p class="text-[10px] text-slate-500 leading-normal border-t border-dashed border-slate-200 pt-3">
            *Pro Tip: Allocate at least 2 hours daily specifically for analyzing wrong choices in your simulated mock sessions.
          </p>
        </div>

        <!-- Main text content -->
        <div class="lg:col-span-8 space-y-4">
          <p>
            Securing selection in Indian government examinations (whether SSC, UPSC, RRB, or defense services) requires a balance of disciplined study schedules, smart resource mapping, and rigorous physical standards. With millions of candidates competing for thousands of positions, relying only on textbook cramming is no longer sufficient. Follow this systematic, science-backed approach to structure your examination preparation:
          </p>
          
          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">Stage 1: Rigid Syllabus Breakdown and Exam Pattern Analysis</h4>
          <p>
            The primary error made by beginners is diving directly into reference materials without mapping the official syllabus. Candidates must download the authorized exam notifications and carefully analyze the weightage of each section. Keep an eye on parameters like section-wise cutoffs, bilingual availability, question patterns, and negative marking (e.g., the 0.25 penalty rule). Map out your strengths and weaknesses to allocate daily study blocks effectively.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">Stage 2: Conceptual Vetting and Source Selection</h4>
          <p>
            Rather than amassing dozens of study guides, pick a few standard, high-quality reference books and fact-checked digital platforms. For general studies, NCERT textbooks from class 6 to 10 are highly recommended. For Quantitative Aptitude and General Intelligence, standard shortcuts and logical formulas must be written down in a separate notebook for quick recall. Use localized bilingual notes to ensure conceptual clarity in both Hindi and English.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">Stage 3: Time-boxed Mock Drills and Simulated Evaluations</h4>
          <p>
            Aspirants must transition from reading to practicing as early as possible. Practicing with previous year question papers (PYQs) under exact exam conditions is critical. This builds speed, teaches you which questions to skip, and trains your focus for long computer-based tests (CBTs). Regularly track your accuracy rate to gauge your progress.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">Stage 4: Active Revision and Physical Fitness Coordination</h4>
          <p>
            Reviewing wrong answers is where real progress happens. Keep a detailed "error journal" to review tricky formulas and core facts weekly. For uniformed roles (Agniveer, Navy, Police, Paramilitary), physical fitness is as important as academic scores. Maintain a light, consistent physical training regimen alongside your study blocks. Preparing for a public career is a marathon—staying mentally resilient, eating healthy, and sleeping well will ensure you peak at the right time.
          </p>
        </div>

      </div>
    </article>

    <!-- SECTION 9: HIGH-VALUE PUBLISHER ARTICLE: CENTRAL VS STATE GOVT JOBS -->
    <article class="bg-white p-6 sm:p-10 border border-slate-200 rounded-[2rem] shadow-xs text-left prose max-w-none space-y-6" id="article-central-vs-state">
      <div class="space-y-1.5 border-b border-slate-100 pb-4">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Central vs State Government Jobs (400+ Words Analysis)</h2>
        <span class="text-[10px] font-mono uppercase text-slate-400 bg-slate-105 px-2 py-0.5 rounded">Structural Comparison • Pay Scale & Postings Vetted Breakdown</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm text-slate-650 leading-relaxed font-sans font-medium">
        
        <div class="lg:col-span-12 space-y-4">
          <p>
            When pursuing a government career in India, candidates often face the choice between <strong>Central Government Vacancies</strong> and <strong>State Government Postings</strong>. Both paths are highly secure and prestigious, but they differ significantly in their administrative scope, transfer frequency, linguistic demands, salary increments, and overall career trajectory.
          </p>
        </div>

        <!-- Column Left -->
        <div class="lg:col-span-6 space-y-4">
          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">1. Recruitment Bodies and Examination Mechanics</h4>
          <p>
            Central Government jobs are run by central boards like the Union Public Service Commission (UPSC), Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), and defense departments. These exams are held nationwide, use standardized bilingual question pools, and follow strict, predictable calendar dates.
          </p>
          <p>
            State Government jobs are coordinated by State Public Service Commissions (e.g., UPPSC, BPSC, RPSC, MPPSC) and regional police boards. These recruitments often feature questions on state-specific geography, history, and local current events, making local knowledge a key factor.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">2. Jurisdiction, Transfer Schedules, and Postings</h4>
          <p>
            Central personnel are liable for transfers anywhere across India. This offers rich geographical and cultural exposure, but can make domestic stability and school enrollments more complex.
          </p>
          <p>
            In contrast, State Government personnel are posted strictly within the respective state boundaries. This provides a highly stable, localized lifestyle with deep community connections, though it may limit geographic exposure.
          </p>
        </div>

        <!-- Column Right -->
        <div class="lg:col-span-6 space-y-4">
          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">3. Compensation Matrices and Seventh Pay Alignment</h4>
          <p>
            Central roles align directly with the 7th Pay Commission (CPC) pay matrix. Allowances like Dearness Allowance (DA) and medical benefits are updated promptly and uniformly.
          </p>
          <p>
            State departments base their scales on Central scales, but actual adjustments, HRA brackets, and retirement payouts can vary based on state budgets and local cabinet approvals, sometimes leading to minor delays.
          </p>

          <h4 class="font-extrabold text-slate-900 text-sm sm:text-base">4. Comparative Analytical Summary</h4>
          <div class="overflow-x-auto border border-slate-200 rounded-xl" id="central-vs-state-table-wrap">
            <table class="w-full text-left text-[11px] font-sans">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-800">
                <tr>
                  <th class="p-3 font-extrabold">Feature Category</th>
                  <th class="p-3 font-extrabold">Central Govt Cadre</th>
                  <th class="p-3 font-extrabold">State Govt Cadre</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-150">
                <tr>
                  <td class="p-3 font-bold">Transfer Liability</td>
                  <td class="p-3">All-India Posting (AIP)</td>
                  <td class="p-3">Within State Boundaries Only</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">Pay Scale Vetting</td>
                  <td class="p-3">Strictly 7th CPC Uniform</td>
                  <td class="p-3">State-adjusted Pay Matrices</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">Key Boards</td>
                  <td class="p-3">UPSC, SSC, RRB, Armed Forces</td>
                  <td class="p-3">State PSC, State Police Boards</td>
                </tr>
                <tr>
                  <td class="p-3 font-bold">Linguistic Dominance</td>
                  <td class="p-3">Bilingual (Hindi / English)</td>
                  <td class="p-3">Regional State Language Heavy</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </article>

    <!-- SECTION 10: WHY TRUST MAIC INDIA (OUR AUTHENTICITY PLEDGE) -->
    <article class="bg-gradient-to-br from-[#000080]/5 via-white to-amber-500/5 p-6 sm:p-10 border border-slate-200 rounded-[2rem] shadow-xs text-left space-y-5" id="article-trust">
      <div class="space-y-1.5 border-b border-slate-100 pb-4">
        <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <CheckCircle class="h-5 w-5 text-emerald-600" />
          Why Trust MAIC India
        </h3>
        <span class="text-[10px] font-mono uppercase text-slate-400 bg-slate-105 px-2 py-0.5 rounded">Our Commitment to Editorial Integrity • 300+ Words Pledge</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-650 leading-relaxed font-sans font-medium">
        
        <div class="space-y-2">
          <h4 class="font-extrabold text-slate-900 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-[#000080] rounded-full" />
            100% Gazette Sourced
          </h4>
          <p class="text-xs">
            We do not publish speculative notifications, clickbait rumors, or unsourced exam dates. Every job alert and admit card update on AgniPariksha is sourced directly from official government Gazettes, employment news bulletins (Rojgar Samachar), and verified recruitment board portals.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="font-extrabold text-slate-900 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-amber-500 rounded-full" />
            Vetted Study Materials
          </h4>
          <p class="text-xs">
            Our educational materials, bilingual GK capsules, and previous year solutions are curated and reviewed by a panel of retired military officers, education scholars, and exam experts. This ensures that every explanation is conceptually sound and aligned with current patterns.
          </p>
        </div>

        <div class="space-y-2">
          <h4 class="font-extrabold text-slate-900 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            factcheck fact check fact checking
          </h4>
          <p class="text-xs">
            In an era of AI-generated content and misinformation, we double-check every age limit, salary band, eligibility criterion, and syllabus detail. Our fact-checking team operates with absolute transparency, listing primary sources and official links on every document we publish.
          </p>
        </div>

      </div>

      <!-- Trust Stamp Badge -->
      <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
        <p class="text-slate-500 font-semibold italic">"Empowering Indian defense & civil aspirants with pure, peer-reviewed facts."</p>
        <span class="bg-[#000080] text-white font-mono text-[10px] font-black uppercase px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm">
          🛡️ Verified Authentic Publisher
        </span>
      </div>
    </article>

    <!-- SECTION 11: EDITORIAL PROCESS (PIPELINE STEPPER) -->
    <section class="space-y-6 text-left" id="section-editorial-pipeline">
      <div class="space-y-1">
        <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Award class="h-5 w-5 text-[#000080]" />
          Our Editorial Process
        </h3>
        <p class="text-xs text-slate-500 font-sans">Our rigorous content pipeline ensures every study guide and job alert is highly accurate</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(step, idx) in [
            { id: '01', title: 'Monitoring & Capture', desc: 'Continuous tracking of official government gazettes, recruitment portals, and employment news bulletins.' },
            { id: '02', title: 'Dual Vetting', desc: 'Subject matter scholars and retired officers verify qualification details, age brackets, and exam formats.' },
            { id: '03', title: 'Bilingual Adaptation', desc: 'Adapting English resources into natural, accurate Hindi text to support candidates from all backgrounds.' },
            { id: '04', title: 'Review & Live Deploy', desc: 'A final quality check is completed before we publish and deploy resources across our portal.' }
          ]" 
          :key="idx"
          class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden"
        >
          <div class="absolute -right-4 -top-4 text-6xl font-mono font-black text-slate-100 select-none">
            {{ step.id }}
          </div>
          <div class="relative z-10 space-y-3">
            <span class="text-[10px] font-mono font-bold text-[#000080] bg-[#000080]/10 px-2.5 py-1 rounded-lg">
              Stage {{ step.id }}
            </span>
            <h4 class="font-extrabold text-sm text-slate-800 pt-1">{{ step.title }}</h4>
            <p class="text-xs text-slate-500 leading-relaxed font-sans font-medium">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 12: FAQS (10 QUESTIONS WITH VALID SEO SCHEMA) -->
    <section class="bg-white p-6 sm:p-10 border border-slate-200 rounded-[2rem] shadow-xs text-left space-y-6" id="section-faqs">
      <div class="space-y-1">
        <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle class="h-5 w-5 text-[#000080]" />
          Frequently Asked Questions (FAQs)
        </h3>
        <p class="text-xs text-slate-500 font-sans">Vetted answers to common queries about public sector careers, recruitments, and prep strategies</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div 
          v-for="(faq, idx) in [
            { q: 'How can I prepare for the Agniveer written examination under the new Agnipath Scheme?', a: 'Candidates should focus on static general knowledge, Class 10 basic sciences, elementary mathematics, and regular time-boxed bilingual mock testing. AgniPariksha provides full syllabus-aligned practice papers for Agniveer Army, Navy, and Air Force completely free.' },
            { q: 'What are the basic educational qualifications required for SSC GD Constable?', a: 'The basic educational qualification required for the SSC GD Constable exam is Matriculation or 10th Class pass from a recognized Board or University.' },
            { q: 'What is the difference between Central Government and State Government jobs in terms of postings?', a: 'Central Government jobs (like SSC, Railways, Defence) can involve transfers anywhere across India. State Government jobs (State PCS, State Police) generally limit postings and transfers strictly within the respective state boundaries.' },
            { q: 'Where can I download authentic PDF syllabi for UPSC NDA and CDS examinations?', a: 'Authentic and verified PDF syllabi, exam patterns, and eligibility criteria can be found and downloaded for free from the PDF Library cabinet on AgniPariksha.com, synced from official government notifications.' },
            { q: 'How does AgniPariksha verify its government job notification feeds?', a: 'We monitor official government gazettes, employment news bulletins (Rojgar Samachar), and recruitment board websites. Each notification is triple-vetted by our academic panel of retired officers before publication.' },
            { q: 'What is the 7th Pay Commission pay matrix scale for defense forces?', a: 'Under the 7th Pay Commission, the basic starting scale ranges from Level 3 for Constables/Sepoys to higher matrices for officers, including allowances like Dearness Allowance (DA), House Rent Allowance (HRA), and Military Service Pay (MSP).' },
            { q: 'Are mock tests and study notes on AgniPariksha completely free?', a: 'Yes, all mock tests, bilingual GK quizzes, daily current affairs journals, and syllabus PDF notes on AgniPariksha are 100% free with no hidden charges, as part of our national student empowerment program.' },
            { q: 'What should I do if my admit card details do not match my official photo ID?', a: 'Aspirants must immediately contact the respective recruitment board\'s helpline (e.g., SSC or UPSC regional desks) to get a rectification certificate. Always bring both the incorrect admit card and original proof of age/identity to the center.' },
            { q: 'How often is the daily Current Affairs and GK section updated?', a: 'The Current Affairs & GK dashboard is updated daily at 06:00 AM IST with bilingual notes covering national events, scientific breakthroughs, and military defense exercises.' },
            { q: 'What is the typical selection ratio for railway recruitment board (RRB) exams?', a: 'RRB non-technical exams (NTPC) are highly competitive, with a selection ratio often around 1 in 150 candidates. Consistent practice of previous year papers is key to securing high scores.' }
          ]" 
          :key="idx"
          class="p-5 bg-slate-50/70 border border-slate-150 rounded-2xl space-y-2 hover:bg-slate-50 transition-colors"
        >
          <h4 class="font-extrabold text-sm text-slate-900 flex items-start gap-2">
            <span class="text-amber-500 font-mono">Q.</span>
            <span>{{ faq.q }}</span>
          </h4>
          <p class="text-xs text-slate-600 leading-relaxed pl-5 font-sans font-semibold">
            {{ faq.a }}
          </p>
        </div>

      </div>
    </section>

    <!-- SECTION 13: NEWSLETTER CARD -->
    <section class="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white text-center relative overflow-hidden" id="section-newsletter">
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-indigo-950 to-slate-900 pointer-events-none" />
      
      <div class="relative z-10 max-w-2xl mx-auto space-y-6">
        <Mail class="h-10 w-10 text-amber-500 mx-auto animate-bounce" />
        
        <div class="space-y-2">
          <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
            Get Daily Fact-Checked Job Alerts
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            Subscribe to our newsletter to receive daily government job updates, mock tests, and current affairs direct to your inbox.
          </p>
        </div>

        <form @submit.prevent="handleNewsletterSubmit" class="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
          <input 
            v-model="newsletterEmail"
            type="email" 
            required
            placeholder="Enter your email address (e.g., student@gmail.com)" 
            class="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder-slate-400 font-sans"
          />
          <button 
            type="submit"
            class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 px-6 rounded-xl shrink-0 uppercase tracking-wider cursor-pointer transition-colors font-mono"
          >
            Subscribe Now
          </button>
        </form>

        <div v-if="newsletterSuccess" class="text-xs font-bold text-emerald-400 animate-pulse font-mono">
          ✓ Jai Hind! Successfully subscribed to daily Sarkari job alerts and Daily GK updates!
        </div>

        <p class="text-[10px] text-slate-400 font-sans">
          No spam. Unsubscribe at any time. Sourced legally under regulatory guidelines.
        </p>
      </div>
    </section>

  </div>
</template>
