<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { 
  Award, Clock, ArrowRight, ArrowLeft, RefreshCw, 
  CheckCircle2, XCircle, BookOpen, AlertCircle, Sparkles, 
  HelpCircle, Zap, ShieldAlert, CheckCircle, ThumbsUp
} from 'lucide-vue-next';
import canvasConfetti from 'canvas-confetti';

interface GKQuestion {
  id: string;
  text: string;
  hindiText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const questions = ref<GKQuestion[]>([]);
const isLoading = ref(true);
const isError = ref(false);
const errorMsg = ref('');

// Test progression states
const currentIndex = ref(0);
const selectedAnswers = ref<Record<string, number>>({}); // maps question ID to chosen option index
const testSubmitted = ref(false);
const durationSeconds = ref(0);
let durationInterval: any = null;

// Practice Statistics Trackers
const correctCount = computed(() => {
  let count = 0;
  questions.value.forEach(q => {
    const selected = selectedAnswers.value[q.id];
    if (selected !== undefined && selected === q.correctAnswer) {
      count++;
    }
  });
  return count;
});

const incorrectCount = computed(() => {
  let count = 0;
  questions.value.forEach(q => {
    const selected = selectedAnswers.value[q.id];
    if (selected !== undefined && selected !== q.correctAnswer) {
      count++;
    }
  });
  return count;
});

const answeredCount = computed(() => {
  return Object.keys(selectedAnswers.value).length;
});

const accuracyPercentage = computed(() => {
  if (answeredCount.value === 0) return 100;
  return Math.round((correctCount.value / answeredCount.value) * 100);
});

// Dynamic Performance Rating
const performanceBadge = computed(() => {
  const acc = accuracyPercentage.value;
  if (answeredCount.value < 4) return { title: 'Aspirant', desc: 'Answer more questions to reveal level', color: 'bg-zinc-100 text-zinc-700 border-zinc-200' };
  if (acc >= 90) return { title: 'Marshal of Agni', desc: 'Outstanding 90%+ Accuracy!', color: 'bg-orange-50 text-orange-700 border-orange-200 animate-pulse' };
  if (acc >= 75) return { title: 'Chief Commander', desc: 'Excellent command on GK & GS topics', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  if (acc >= 50) return { title: 'Subedar Captain', desc: 'Stable performance, keep improving!', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  return { title: 'Recruit Cadet', desc: 'Review descriptions to build knowledge', color: 'bg-amber-50 text-amber-700 border-amber-200' };
});

const fetchMockQuestions = async (forceBypass = false) => {
  isLoading.value = true;
  isError.value = false;
  try {
    const url = `/api/gk-mock-test?_t=${Date.now()}${forceBypass ? '&force=true' : ''}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    const data = await response.json();
    if (data && Array.isArray(data.questions)) {
      questions.value = data.questions;
    } else {
      throw new Error('API returned malformed question template structure');
    }
  } catch (err: any) {
    isError.value = true;
    errorMsg.value = err?.message || 'Error occurred while loading questions';
  } finally {
    isLoading.value = false;
  }
};

const handleOptionClick = (questionId: string, idx: number, isCorrect: boolean) => {
  if (selectedAnswers.value[questionId] !== undefined) return; // Answered already
  
  selectedAnswers.value = {
    ...selectedAnswers.value,
    [questionId]: idx
  };

  // Provide immediate celebratory confetti trigger on matching correct result
  if (isCorrect) {
    canvasConfetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF9933', '#138808', '#000080', '#FFD700']
    });
  }
};

const handleNext = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  }
};

const handlePrev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const handleRetake = () => {
  selectedAnswers.value = {};
  currentIndex.value = 0;
  testSubmitted.value = false;
  durationSeconds.value = 0;
  fetchMockQuestions(true);
};

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

onMounted(() => {
  fetchMockQuestions();
  durationInterval = setInterval(() => {
    if (!isLoading.value && !isError.value && !testSubmitted.value) {
      durationSeconds.value++;
    }
  }, 1000);
});
</script>

<template>
  <div class="space-y-6" id="mt-root-container">
    
    <!-- Top Decorative Header with Indian Tricolor theme -->
    <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 border-t-[#FF9933] text-left relative overflow-hidden" id="mt-header-card">
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF9933]/10 via-transparent to-[#138808]/15 rounded-bl-full pointer-events-none" />
      <div class="space-y-2">
        <span class="inline-flex items-center space-x-1 bg-amber-50 text-amber-800 text-[10.5px] font-black px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
          <Sparkles class="h-3 w-3 animate-pulse" />
          <span>Practice & Analytics Simulator</span>
        </span>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          AgniPariksha GK & GS Live Mock-Test
        </h1>
        <p class="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Prepare with our offline and live Gemini-powered General Knowledge interactive series. Get complete detailed bilingual explanations instantly for self-assessment and strategic learning.
        </p>
      </div>

      <!-- Live metrics HUD -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 font-mono" id="mt-hud-metrics">
        <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Time Elapsed</span>
          <span class="text-base font-extrabold text-slate-900 flex items-center justify-center space-x-1">
            <Clock class="h-4 w-4 text-[#000080]" />
            <span>{{ formatTime(durationSeconds) }}</span>
          </span>
        </div>

        <div class="bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Correct Pick</span>
          <span class="text-lg font-black text-[#138808]">{{ correctCount }} / {{ questions.length }}</span>
        </div>

        <div class="bg-red-50/40 p-3.5 rounded-xl border border-red-100 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Failed Pick</span>
          <span class="text-lg font-black text-red-650">{{ incorrectCount }}</span>
        </div>

        <div class="bg-orange-50/40 p-3.5 rounded-xl border border-orange-100 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Real-time Accuracy</span>
          <span class="text-lg font-black text-orange-700">{{ accuracyPercentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="isError" class="bg-red-50 border-2 border-red-200/70 p-8 rounded-2xl text-center space-y-4 shadow-sm" id="mt-error-box">
      <AlertCircle class="h-12 w-12 text-red-500 mx-auto" />
      <div class="space-y-1">
        <h3 class="font-extrabold text-red-800 text-lg">Failed to retrieve mock exam paper</h3>
        <p class="text-xs text-red-600 max-w-md mx-auto leading-relaxed">
          {{ errorMsg }}
        </p>
      </div>
      <button 
        @click="fetchMockQuestions(true)"
        class="bg-[#000080] hover:bg-[#000060] text-white font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase flex items-center space-x-2 mx-auto cursor-pointer transition-all shadow-md"
      >
        <RefreshCw class="h-3.5 w-3.5" />
        <span>Try Fetching Again</span>
      </button>
    </div>

    <!-- Loading Skeleton View -->
    <div v-else-if="isLoading" class="bg-white rounded-2xl p-8 shadow-md border border-slate-100 space-y-6 text-left" id="mt-skeleton-loader">
      <div class="space-y-3">
        <div class="h-4 bg-slate-200 rounded-full w-1/4 animate-pulse" />
        <div class="h-7 bg-slate-200 rounded-lg w-3/4 animate-pulse" />
      </div>
      <div class="space-y-3.5 pt-6">
        <div v-for="i in 4" :key="i" class="h-12 bg-slate-100 rounded-xl w-full border border-slate-200/50 animate-pulse" />
      </div>
    </div>

    <!-- Mock test Interactive Quiz engine -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left" id="mt-interactive-grid">
      
      <!-- Main question screen -->
      <div class="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[500px]" id="mt-left-column">
        <!-- Top accent flag streak -->
        <div class="absolute top-0 left-0 right-0 h-1 flex">
          <div class="w-[33%] bg-[#FF9933]" />
          <div class="w-[34%] bg-slate-100" />
          <div class="w-[33%] bg-[#138808]" />
        </div>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- Quiz meta navigation card -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="bg-[#000080]/5 text-[#000080] px-3 py-1 rounded-lg border border-[#000080]/10 text-xs font-black tracking-wide flex items-center space-x-1">
              <Zap class="h-3.5 w-3.5 text-amber-500 fill-amber-300" />
              <span>PRACTICE FEEDBACK MODE</span>
            </div>
            
            <span class="text-xs sm:text-sm font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md">
              Question {{ currentIndex + 1 }} of {{ questions.length }}
            </span>
          </div>

          <!-- Dynamic high value Progress bar -->
          <div class="space-y-1.5">
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 relative">
              <div 
                class="h-full bg-gradient-to-r from-[#FF9933] via-yellow-400 to-[#138808] rounded-full transition-all duration-300 relative"
                :style="{ width: `${((currentIndex + 1) / questions.length) * 100}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 font-bold font-mono">
              <span>Progress Bar: {{ Math.round(((currentIndex + 1) / questions.length) * 100) }}%</span>
              <span>{{ questions.length - (currentIndex + 1) }} Questions remaining</span>
            </div>
          </div>

          <!-- Question Body Display in Bilingual Format -->
          <div class="bg-slate-50/70 p-5 rounded-2xl border border-slate-250 text-slate-900 space-y-4" id="mt-question-body">
            <!-- English -->
            <div class="flex items-start space-x-2.5">
              <span class="flex items-center justify-center bg-[#000080]/10 text-[#000080] font-black h-6 w-6 rounded-md text-xs font-mono shrink-0 select-none">
                EN
              </span>
              <p class="text-sm sm:text-base font-extrabold text-slate-905 leading-relaxed">
                {{ questions[currentIndex].text }}
              </p>
            </div>

            <div class="border-t border-slate-200 border-dashed" />

            <!-- Hindi -->
            <div class="flex items-start space-x-2.5">
              <span class="flex items-center justify-center bg-[#138808]/10 text-[#138808] font-black h-6 w-6 rounded-md text-xs font-mono shrink-0 select-none">
                हि
              </span>
              <p class="text-sm sm:text-[15px] font-bold text-slate-800 leading-relaxed">
                {{ questions[currentIndex].hindiText }}
              </p>
            </div>
          </div>

          <!-- MCQ Option Buttons -->
          <div class="space-y-3" id="mt-mcq-options-container">
            <button
              v-for="(option, idx) in questions[currentIndex].options"
              :key="idx"
              :id="`mt-option-btn-${idx}`"
              :disabled="selectedAnswers[questions[currentIndex].id] !== undefined"
              @click="handleOptionClick(questions[currentIndex].id, idx, idx === questions[currentIndex].correctAnswer)"
              :class="[
                'w-full text-left py-3.5 px-5 rounded-2xl border-2 transition-all cursor-pointer font-sans text-xs sm:text-sm flex justify-between items-center',
                // When already answered
                selectedAnswers[questions[currentIndex].id] !== undefined
                  ? (idx === questions[currentIndex].correctAnswer
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-extrabold ring-2 ring-emerald-350/20'
                      : (selectedAnswers[questions[currentIndex].id] === idx
                          ? 'border-red-500 bg-red-50/50 text-red-950 font-extrabold ring-2 ring-red-350/20'
                          : 'border-slate-200/60 bg-slate-50/60 text-slate-400 opacity-60'))
                  // Not answered yet
                  : 'bg-white border-slate-250 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-black'
              ]"
            >
              <span>{{ option }}</span>
              
              <!-- Correct/incorrect icon indicator -->
              <span v-if="selectedAnswers[questions[currentIndex].id] !== undefined" class="shrink-0 select-none ml-2">
                <CheckCircle2 v-if="idx === questions[currentIndex].correctAnswer" class="h-5 w-5 text-emerald-600" />
                <XCircle v-else-if="selectedAnswers[questions[currentIndex].id] === idx" class="h-5 w-5 text-red-600" />
              </span>
            </button>
          </div>

          <!-- Instant Feedback drawer -->
          <div 
            v-if="selectedAnswers[questions[currentIndex].id] !== undefined"
            class="bg-amber-50/50 border border-amber-250 p-5 rounded-2xl text-left space-y-3 animate-fade-in shadow-inner"
            id="mt-feedback-drawer"
          >
            <div class="flex items-center space-x-2 text-amber-900 font-extrabold text-[11.5px] uppercase tracking-wider border-b border-amber-200/50 pb-2">
              <BookOpen class="h-4 w-4 text-amber-700" />
              <span>Bilingual Explanatory Notes / सविस्तार व्याख्या विवरण</span>
            </div>
            
            <p class="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-sans">
              {{ questions[currentIndex].explanation }}
            </p>
          </div>
        </div>

        <!-- Pagination Action Bar -->
        <div class="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center" id="mt-footer-nav-bar">
          <button
            @click="handlePrev"
            :disabled="currentIndex === 0"
            class="px-4 py-2 text-xs font-black rounded-xl border border-slate-250 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-45 disabled:pointer-events-none flex items-center space-x-1 cursor-pointer transition-all"
          >
            <ArrowLeft class="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span class="text-slate-500 font-black text-xs font-mono select-none">
            {{ currentIndex + 1 }} / {{ questions.value?.length || questions.length }}
          </span>

          <button
            v-if="currentIndex < questions.length - 1"
            @click="handleNext"
            class="px-4 py-2 text-xs font-black rounded-xl bg-[#000080] hover:bg-[#000060] text-white disabled:opacity-45 flex items-center space-x-1 cursor-pointer transition-all shadow"
          >
            <span>Next Case</span>
            <ArrowRight class="h-4 w-4" />
          </button>
          
          <button
            v-else
            @click="testSubmitted = true"
            :disabled="answeredCount < questions.length"
            class="px-5 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl bg-[#138808] hover:bg-[#117706] disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center space-x-1 cursor-pointer transition-all shadow"
          >
            <span>Submit Scorecard</span>
            <Award class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Right column details & performance sidebar -->
      <div class="lg:col-span-1 space-y-6" id="mt-right-column">
        
        <!-- Live performance Scoreboard dashboard -->
        <div class="bg-white rounded-3xl p-6 border border-slate-250 shadow-md space-y-5" id="mt-stats-sidebar">
          <h2 class="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center">
            <Award class="h-5 w-5 mr-1.5 text-[#000080]" />
            Your Mock Scoreboard
          </h2>

          <div class="space-y-4">
            <!-- Progress pie status -->
            <div class="flex items-center justify-between border-b border-slate-50 pb-2">
              <span class="text-xs font-bold text-slate-500">Attempted questions:</span>
              <span class="text-xs font-black text-slate-800">{{ answeredCount }} / {{ questions.length }}</span>
            </div>

            <!-- Accuracy gauge visually custom -->
            <div class="space-y-1.5 text-left">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-slate-500">Current Accuracy Rate:</span>
                <span :class="[
                  'font-black font-mono',
                  accuracyPercentage >= 75 ? 'text-[#138808]' : accuracyPercentage >= 50 ? 'text-amber-600' : 'text-red-650'
                ]">{{ accuracyPercentage }}%</span>
              </div>
              
              <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  class="h-full rounded-full transition-all duration-300"
                  :class="[
                    accuracyPercentage >= 75 ? 'bg-[#138808]' : accuracyPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  ]"
                  :style="{ width: `${accuracyPercentage}%` }"
                />
              </div>
            </div>

            <!-- Rank Badge dynamic -->
            <div class="p-4 rounded-2xl border text-left space-y-1.5" :class="performanceBadge.color" id="mt-badge-box">
              <div class="flex items-center space-x-1">
                <Award class="h-4.5 w-4.5 shrink-0" />
                <span class="text-xs font-black uppercase tracking-wider">{{ performanceBadge.title }}</span>
              </div>
              <p class="text-[11px] leading-snug font-medium text-slate-705">
                {{ performanceBadge.desc }}
              </p>
            </div>
          </div>

          <div class="pt-2">
            <button
              @click="handleRetake"
              class="w-full bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <RefreshCw class="h-3.5 w-3.5" />
              <span>Reset & Generate Fresh Mock</span>
            </button>
          </div>
        </div>

        <!-- Interactive Question Palette grid for fast navigation -->
        <div class="bg-white rounded-3xl p-6 border border-slate-250 shadow-md space-y-4" id="mt-palette-sidebar">
          <h2 class="text-sm font-black text-slate-900 flex items-center">
            <HelpCircle class="h-4.5 w-4.5 mr-1 text-slate-500" />
            <span>Question Response Palette</span>
          </h2>

          <div class="grid grid-cols-5 gap-2.5" id="mt-palette-btn-grid">
            <button
              v-for="(q, idx) in questions"
              :key="q.id"
              :id="`mt-p-btn-${idx}`"
              @click="currentIndex = idx"
              class="h-9 w-full rounded-lg text-xs font-black cursor-pointer border flex items-center justify-center transition-all"
              :class="[
                currentIndex === idx ? 'ring-2 ring-[#000080]' : '',
                selectedAnswers[q.id] !== undefined
                  ? (selectedAnswers[q.id] === q.correctAnswer
                      ? 'bg-emerald-500 border-emerald-600 text-white font-extrabold'
                      : 'bg-red-500 border-red-600 text-white font-extrabold')
                  : 'bg-white border-slate-250 hover:bg-slate-100 text-slate-700'
              ]"
            >
              {{ idx + 1 }}
            </button>
          </div>

          <!-- Color palette legend -->
          <div class="pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-[10.5px] font-bold text-slate-550 justify-start select-none">
            <div class="flex items-center space-x-1">
              <span class="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 block shrink-0" />
              <span>Correct Pick</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="w-3.5 h-3.5 rounded bg-red-500 border border-red-600 block shrink-0" />
              <span>Failed Pick</span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="w-3.5 h-3.5 rounded bg-white border border-slate-250 block shrink-0 animate-pulse" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>

        <!-- SSC GD, Army, Navy recruitment tips alert box -->
        <div class="bg-gradient-to-tr from-[#000080] to-[#1e1b4b] text-white rounded-3xl p-5 text-left border border-indigo-950 shadow-md relative overflow-hidden" id="mt-banner-defense">
          <div class="absolute -right-8 -bottom-8 opacity-10 font-black text-8xl pointer-events-none">
            IN
          </div>
          <div class="space-y-2.5">
            <h3 class="text-xs uppercase tracking-widest font-black text-amber-400">
              Aspirants Note / निर्देश
            </h3>
            <p class="text-[12px] leading-relaxed text-indigo-100 font-medium">
              Daily practice of themed General Studies mock templates reinforces memory pathways up to 3x faster than reading books passively. Make sure to complete the feedback sequence for every wrong attempts!
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Celebration Screen Modal overlay when submitted -->
    <div v-if="testSubmitted" class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="mt-celebration-popup">
      <div class="max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 text-center relative p-8 space-y-6" id="mt-celebration-card">
        <!-- Tricolor decorative borders -->
        <div class="absolute top-0 left-0 right-0 h-2 flex">
          <div class="w-[33%] bg-[#FF9933]" />
          <div class="w-[34%] bg-white" />
          <div class="w-[33%] bg-[#138808]" />
        </div>

        <div class="p-3 bg-[#FF9933]/10 w-fit rounded-full mx-auto animate-bounce">
          <Award class="h-10 w-10 text-[#FF9933]" />
        </div>

        <div class="space-y-1.5">
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Jai Hind, Aspirant!
          </h2>
          <p class="text-sm text-slate-500">
            You have successfully completed current AgniPariksha general studies evaluation series. Here is your official performance report dashboard.
          </p>
        </div>

        <!-- Metrics cards in modal -->
        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-150 grid grid-cols-2 gap-4 font-mono">
          <div class="text-left space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Final Score Report</span>
            <span class="text-xl font-black text-slate-900">{{ correctCount }} / {{ questions.length }} Correct</span>
          </div>

          <div class="text-right space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Accuracy Index</span>
            <span class="text-xl font-black text-[#138808]">{{ accuracyPercentage }}% Acc</span>
          </div>

          <div class="text-left space-y-0.5 border-t border-slate-200/60 pt-3">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Time Invested</span>
            <span class="text-base font-extrabold text-slate-800">{{ formatTime(durationSeconds) }} Secs</span>
          </div>

          <div class="text-right space-y-0.5 border-t border-slate-200/60 pt-3">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Current Rank Badge</span>
            <span class="text-xs font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded">{{ performanceBadge.title }}</span>
          </div>
        </div>

        <!-- Interactive advice list based on stats level -->
        <div class="text-left space-y-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Recommended Next Actions:</h4>
          <ul class="space-y-2 text-xs text-slate-650 leading-relaxed font-sans">
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-emerald-600 shrink-0 mr-1.5" style="margin-top: 1px;" />
              <span>Great job on building familiarity with high-yield defense and general science items!</span>
            </li>
            <li v-if="accuracyPercentage < 80" class="flex items-start">
              <ShieldAlert class="h-4 w-4 text-amber-500 shrink-0 mr-1.5" style="margin-top: 1px;" />
              <span>Review the explanations drawer on the mock response palette for any failed answers.</span>
            </li>
            <li class="flex items-start">
              <ThumbsUp class="h-4 w-4 text-[#000080] shrink-0 mr-1.5" style="margin-top: 1px;" />
              <span>Download official models in the PDF library matching Indian Army Agniveer GD curriculum templates.</span>
            </li>
          </ul>
        </div>

        <!-- Buttons inside modal -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 select-none">
          <button
            @click="testSubmitted = false"
            class="flex-1 bg-slate-150 hover:bg-slate-200 text-slate-800 font-extrabold px-5 py-3 rounded-xl text-xs uppercase cursor-pointer text-center"
          >
            Review Responses Grid
          </button>
          
          <button
            @click="handleRetake"
            class="flex-1 bg-[#138808] hover:bg-[#117706] text-white font-extrabold px-5 py-3 rounded-xl text-xs uppercase cursor-pointer text-center shadow-md flex items-center justify-center space-x-1"
          >
            <RefreshCw class="h-3.5 w-3.5 animate-spin" />
            <span>Retake New Mock</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
