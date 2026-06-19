<script setup lang="ts">
import { ref } from 'vue';
import { 
  Settings, Award, Briefcase, FileText, Globe, 
  DollarSign, Activity, Sparkles, TrendingUp, CheckCircle, Plus
} from 'lucide-vue-next';
import { Quiz, Question, JobPost } from '../types';

interface AdminPanelProps {
  quizzesCount: number;
  jobsCount: number;
}

const props = defineProps<AdminPanelProps>();

const emit = defineEmits<{
  (e: 'addQuiz', newQuiz: Quiz): void;
  (e: 'addJob', newJob: JobPost): void;
}>();

// Realtime analytic counters state
const trafficImpressions = ref(14820);
const adsenseClicks = ref(742);
const estimatedCpcUsd = ref(259.70);

// Form states for creating general GK quiz category item
const quizTitle = ref("");
const quizCategory = ref("Agniveer Selection CEE");
const quizDifficulty = ref<"Easy" | "Medium" | "Hard">("Medium");
const quizTimeLimit = ref(150);

// Single question input arrays
const qText = ref("");
const opt0 = ref("");
const opt1 = ref("");
const opt2 = ref("");
const opt3 = ref("");
const correctOptionIdx = ref(0);
const qExplanation = ref("");

const messagePrompt = ref("");

const handleCreateMockQuiz = (e: Event) => {
  e.preventDefault();
  if (!quizTitle.value.trim() || !qText.value.trim()) {
    messagePrompt.value = "Quiz Title and at least one Question are required!";
    return;
  }

  const compiledQuestions: Question[] = [
    {
      id: "q-dyn-" + Date.now(),
      text: qText.value.trim(),
      options: [
        opt0.value.trim() || "Option A Template",
        opt1.value.trim() || "Option B Template",
        opt2.value.trim() || "Option C Template",
        opt3.value.trim() || "Option D Template",
      ],
      correctAnswer: correctOptionIdx.value,
      explanation: qExplanation.value.trim() || "Verified objective answers based on official commission guidelines.",
      category: quizCategory.value
    }
  ];

  const newQuiz: Quiz = {
    id: "quiz-dyn-" + Date.now(),
    title: quizTitle.value.trim(),
    category: quizCategory.value,
    difficulty: quizDifficulty.value,
    timeLimit: quizTimeLimit.value,
    questions: compiledQuestions,
    iconName: "Shield"
  };

  emit('addQuiz', newQuiz);
  messagePrompt.value = "Premium Mock Test successfully injected into system categories!";

  // Reset fields
  quizTitle.value = "";
  qText.value = "";
  opt0.value = "";
  opt1.value = "";
  opt2.value = "";
  opt3.value = "";
  qExplanation.value = "";
  
  setTimeout(() => {
    messagePrompt.value = "";
  }, 4000);
};

const simulateVisitor = () => {
  trafficImpressions.value += 120;
  adsenseClicks.value += 4;
  estimatedCpcUsd.value += 1.8;
};
</script>

<template>
  <div class="space-y-6 animate-fade-in" id="admin-management-panel">
    
    <!-- 1. Header description -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-t-[#000080]" id="admin-banner">
      <h2 class="text-xl font-black text-gray-900 flex items-center">
        <Settings class="h-6 w-6 text-gray-650 mr-2" />
        AgniPariksha Board Command Center & Operations
      </h2>
      <p class="text-xs text-gray-500 mt-1">
        Monitor search statistics, simulate SEO traffic signals, and deploy authentic mock questions in real-time.
      </p>
    </div>

    <!-- 2. SEO & AdSense Earnings Stats Tracker -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="adsense-analytic-reporters">
      
      <div class="bg-white p-4.5 rounded-xl border border-gray-150 flex flex-col justify-between">
        <div>
          <span class="text-[9px] text-gray-400 font-bold uppercase block font-mono">Monthly Impressions</span>
          <span class="text-2xl font-black text-gray-800 font-mono mt-1 block">
            {{ trafficImpressions.toLocaleString() }}
          </span>
        </div>
        <p class="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
          <TrendingUp class="h-3.5 w-3.5" />
          +18.3% organic lift
        </p>
      </div>

      <div class="bg-white p-4.5 rounded-xl border border-gray-150 flex flex-col justify-between">
        <div>
          <span class="text-[9px] text-gray-400 font-bold uppercase block font-mono">AdSense Clicks</span>
          <span class="text-2xl font-black text-gray-800 font-mono mt-1 block">
            {{ adsenseClicks.toLocaleString() }}
          </span>
        </div>
        <p class="text-[10px] text-gray-400 font-mono leading-none mt-2">CTR Average: 5.01%</p>
      </div>

      <div class="bg-white p-4.5 rounded-xl border border-[#138808]/20 flex flex-col justify-between bg-emerald-50/10">
        <div>
          <span class="text-[9px] text-[#138808] font-black uppercase block font-mono">Calculated CPC Earnings</span>
          <span class="text-2xl font-black text-[#138808] font-mono mt-1 block">
            ${{ estimatedCpcUsd.toFixed(2) }}
          </span>
        </div>
        <p class="text-[9px] text-[#aa4400] font-black uppercase mt-2">★ AdSense Approved Domain</p>
      </div>

      <div class="bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-100 p-4.5 rounded-xl flex flex-col justify-between">
        <div>
          <span class="text-[9px] text-indigo-400 font-extrabold uppercase block font-mono">Active Database Items</span>
          <div class="text-[11px] space-y-1 font-mono mt-2">
            <p>✔ Quizzes Catalog: <strong class="text-white">{{ quizzesCount }}</strong></p>
            <p>✔ Vacancies Listed: <strong class="text-white">{{ jobsCount }}</strong></p>
          </div>
        </div>
        <button 
          @click="simulateVisitor" 
          class="text-[9px] text-[#FF9933] font-bold text-left hover:underline uppercase tracking-wide cursor-pointer mt-3"
        >
          Simulate organic visitor ping ↗
        </button>
      </div>

    </div>

    <!-- 3. Graphical trends mockup using SVG -->
    <div class="bg-white rounded-xl p-5 border border-gray-150" id="analytic-graph-chart">
      <h4 class="text-xs font-black text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">
        SEO Traffic & Organic Authority Trends (6 Months)
      </h4>
      
      <!-- Simple inline SVG representational area -->
      <div class="h-24 w-full bg-gray-50 rounded-lg relative overflow-hidden flex items-end px-4 border">
        <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <!-- Draw grid lines -->
          <line x1="0" y1="25" x2="400" y2="25" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="50" x2="400" y2="50" stroke="#f0f0f0" strokeWidth="1" />
          <line x1="0" y1="75" x2="400" y2="75" stroke="#f0f0f0" strokeWidth="1" />
          
          <!-- Saffron trending line chart -->
          <path 
            d="M 0 85 Q 80 70 160 55 T 320 30 T 400 10" 
            fill="none" 
            stroke="#FF9933" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          <!-- India green auxiliary trend line -->
          <path 
            d="M 0 92 Q 80 85 160 65 T 320 45 T 400 25" 
            fill="none" 
            stroke="#138808" 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeDasharray="4 2"
          />
        </svg>
        
        <div class="absolute top-2 left-3 text-[9px] font-bold text-gray-400 font-mono">Impressions (Saffron) vs. CPC clicks (Green)</div>
      </div>
    </div>

    <!-- 4. Hot load Questions Creation Deck Form -->
    <div class="bg-white rounded-xl p-6 border border-gray-150 space-y-4" id="questions-injections-form">
      <h3 class="font-black text-sm text-gray-950 uppercase tracking-wide leading-none">
        Deploy Fresh Competitive MCQ Sets
      </h3>
      <p class="text-xs text-gray-500">
        Create dynamic multiple choice question sheets. Items injected this way are immediately made runnable to mock aspirants inside the "GK Quizzes" tab!
      </p>

      <form @submit="handleCreateMockQuiz" class="space-y-4 font-sans">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mock Exam Title:</label>
            <input
              type="text"
              id="admin-new-quiz-title"
              v-model="quizTitle"
              placeholder="e.g. 2026 Infantry Regiment Battles"
              class="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category:</label>
              <select
                id="admin-new-quiz-category"
                v-model="quizCategory"
                class="w-full text-xs font-bold p-2 border border-gray-200 rounded-lg focus:outline-none"
              >
                <option value="Agniveer Selection CEE">Agniveer mock CEE</option>
                <option value="Polity Constitution">Polity & Acts</option>
                <option value="Armed Forces GK">Armed Forces GK</option>
                <option value="Current Affairs">Current Affairs</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Time Limit (secs):</label>
              <input
                type="number"
                id="admin-new-quiz-time"
                v-model="quizTimeLimit"
                class="w-full text-xs font-bold p-2 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        <!-- First Sample question fields setup -->
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
          <span class="text-[9px] uppercase font-black text-[#000080] block font-mono">Insert Core Objective Q1:</span>
          
          <div>
            <label class="block text-[10px] font-bold text-gray-400 mb-1">Question Description String:</label>
            <input
              type="text"
              id="admin-new-q-text"
              v-model="qText"
              placeholder="e.g. Which regiment bears the battle cry 'Durge Mata Ki Jai'?"
              class="w-full text-xs p-2 border border-gray-200 bg-white rounded-lg focus:outline-none"
            />
          </div>

          <!-- Options grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="text-[9px] font-bold text-gray-450">Option A:</label>
              <input
                type="text"
                id="admin-new-opt-a"
                v-model="opt0"
                placeholder="The Jammu & Kashmir Rifles"
                class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-450">Option B:</label>
              <input
                type="text"
                id="admin-new-opt-b"
                v-model="opt1"
                placeholder="The Rajput Regiment"
                class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-450">Option C:</label>
              <input
                type="text"
                id="admin-new-opt-c"
                v-model="opt2"
                placeholder="The Dogra Regiment"
                class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label class="text-[9px] font-bold text-gray-450">Option D:</label>
              <input
                type="text"
                id="admin-new-opt-d"
                v-model="opt3"
                placeholder="Gorkha Rifles"
                class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 mb-1">Index of correct answer choice:</label>
              <select
                id="admin-new-q-correct"
                v-model="correctOptionIdx"
                class="w-full text-xs font-bold p-2 border border-gray-200 rounded bg-white focus:outline-none"
              >
                <option :value="0">Choice A</option>
                <option :value="1">Choice B</option>
                <option :value="2">Choice C</option>
                <option :value="3">Choice D</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 mb-1">Answer Explanatory key rationale:</label>
              <input
                type="text"
                id="admin-new-q-explanation"
                v-model="qExplanation"
                placeholder="The Dogra Regiment battle cry is 'Durge Mata Ki Jai'."
                class="w-full text-xs p-2 border border-gray-200 bg-white rounded focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div v-if="messagePrompt" class="text-[10px] font-bold text-green-700 bg-green-50 p-2.5 rounded border border-green-200 flex items-center" id="admin-prompt">
          <CheckCircle class="h-4.5 w-4.5 mr-1 text-green-600" />
          <span>{{ messagePrompt }}</span>
        </div>

        <button
          type="submit"
          id="btn-admin-submit-quiz"
          class="w-full bg-[#138808] hover:bg-[#117706] text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 shadow-md"
        >
          <Plus class="h-4 w-4" />
          <span>Publish test model live</span>
        </button>

      </form>
    </div>

  </div>
</template>
