<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { 
  Award, Clock, ArrowRight, ArrowLeft, RefreshCw, 
  CheckCircle2, XCircle, BookOpen, AlertCircle, Sparkles, 
  HelpCircle, Zap, ShieldAlert, CheckCircle, ThumbsUp,
  FileCheck, Shield, Bookmark, BarChart2, Play, Pause, RotateCcw
} from 'lucide-vue-next';
import canvasConfetti from 'canvas-confetti';
import { MOCK_TEST_PAPERS, MockQuestion, MockTestPaper } from '../data/mockTestData';

// Test paper state
const selectedPaperId = ref<string>(MOCK_TEST_PAPERS[0].id);
const selectedPaper = computed(() => {
  return MOCK_TEST_PAPERS.find(p => p.id === selectedPaperId.value) || MOCK_TEST_PAPERS[0];
});

// Questions state with immediate instant fallback
const questions = ref<MockQuestion[]>([...MOCK_TEST_PAPERS[0].questions]);
const isLoading = ref(false);
const isError = ref(false);
const errorMsg = ref('');
const isUsingLiveAiPaper = ref(false);

// Test progression states
const currentIndex = ref(0);
const selectedAnswers = ref<Record<string, number>>({}); // maps question ID to chosen option index
const testSubmitted = ref(false);
const durationSeconds = ref(0);
const isTimerPaused = ref(false);
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
  if (answeredCount.value < 3) return { title: 'Aspirant', desc: 'Answer more questions to reveal your live percentile badge', color: 'bg-zinc-100 text-zinc-700 border-zinc-200' };
  if (acc >= 90) return { title: 'Marshal of Agni', desc: 'Outstanding 90%+ Accuracy! Top 1% tier performance.', color: 'bg-orange-50 text-orange-700 border-orange-200 ring-2 ring-orange-400/30' };
  if (acc >= 75) return { title: 'Chief Commander', desc: 'Excellent command over general knowledge and syllabus topics.', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  if (acc >= 50) return { title: 'Subedar Captain', desc: 'Solid performance. Revise explanatory notes for weak sections.', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  return { title: 'Recruit Cadet', desc: 'Review descriptions carefully to build fundamental knowledge.', color: 'bg-amber-50 text-amber-700 border-amber-200' };
});

const selectPaper = (paperId: string) => {
  if (selectedPaperId.value === paperId && !isUsingLiveAiPaper.value) return;
  selectedPaperId.value = paperId;
  isUsingLiveAiPaper.value = false;
  const paper = MOCK_TEST_PAPERS.find(p => p.id === paperId) || MOCK_TEST_PAPERS[0];
  questions.value = [...paper.questions];
  resetTestState();
};

const resetTestState = () => {
  selectedAnswers.value = {};
  currentIndex.value = 0;
  testSubmitted.value = false;
  durationSeconds.value = 0;
  isTimerPaused.value = false;
};

const fetchMockQuestions = async (forceBypass = false, requestAiLive = false) => {
  isLoading.value = true;
  isError.value = false;
  errorMsg.value = '';

  try {
    const url = `/api/gk-mock-test?_t=${Date.now()}${forceBypass ? '&force=true' : ''}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type') || '';
    
    // Validate that response is actually JSON and not an HTML fallback
    if (response.ok && contentType.toLowerCase().includes('application/json')) {
      const data = await response.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        questions.value = data.questions;
        if (requestAiLive) {
          isUsingLiveAiPaper.value = true;
        }
        resetTestState();
        isLoading.value = false;
        return;
      }
    }

    // Graceful fallback to verified curated paper pool without showing any error
    const paper = MOCK_TEST_PAPERS.find(p => p.id === selectedPaperId.value) || MOCK_TEST_PAPERS[0];
    questions.value = [...paper.questions];
    resetTestState();
  } catch (err: any) {
    console.warn('Note: API returned offline/static response. Loading verified local high-yield mock paper:', err?.message || err);
    // Seamless fallback to high-yield paper pool
    const paper = MOCK_TEST_PAPERS.find(p => p.id === selectedPaperId.value) || MOCK_TEST_PAPERS[0];
    questions.value = [...paper.questions];
    resetTestState();
  } finally {
    isLoading.value = false;
  }
};

const handleOptionClick = (questionId: string, idx: number, isCorrect: boolean) => {
  if (selectedAnswers.value[questionId] !== undefined || isTimerPaused.value) return;
  
  selectedAnswers.value = {
    ...selectedAnswers.value,
    [questionId]: idx
  };

  // Immediate celebratory confetti on correct pick
  if (isCorrect) {
    canvasConfetti({
      particleCount: 35,
      spread: 55,
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
  resetTestState();
  if (isUsingLiveAiPaper.value) {
    fetchMockQuestions(true, true);
  }
};

const toggleTimerPause = () => {
  isTimerPaused.value = !isTimerPaused.value;
};

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

onMounted(() => {
  // Ensure default paper questions are loaded instantly
  if (questions.value.length === 0) {
    questions.value = [...MOCK_TEST_PAPERS[0].questions];
  }
  
  // Attempt background sync with server without blocking UI
  fetchMockQuestions(false, false);

  durationInterval = setInterval(() => {
    if (!isLoading.value && !isError.value && !testSubmitted.value && !isTimerPaused.value) {
      durationSeconds.value++;
    }
  }, 1000);
});

onUnmounted(() => {
  if (durationInterval) {
    clearInterval(durationInterval);
  }
});
</script>

<template>
  <div class="space-y-6" id="mt-root-container">
    
    <!-- Top Decorative Header with Indian Tricolor theme -->
    <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-md border-t-4 border-t-[#FF9933] text-left relative overflow-hidden" id="mt-header-card">
      <div class="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FF9933]/10 via-transparent to-[#138808]/15 rounded-bl-full pointer-events-none" />
      
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center space-x-1 bg-amber-50 text-amber-900 text-[10.5px] font-black px-3 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
              <Sparkles class="h-3 w-3 text-amber-600 animate-pulse" />
              <span>National Mock Test Series</span>
            </span>
            <span class="inline-flex items-center space-x-1 bg-emerald-50 text-emerald-800 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>100% Free & Verified</span>
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            AgniPariksha™ Online Mock Exam Simulator
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Practice bilingual (English & Hindi) objective questions aligned with the official syllabus for Indian Army Agniveer CEE, Indian Navy SSR/MR, SSC GD, and State Police exams.
          </p>
        </div>

        <div class="flex items-center space-x-2 shrink-0">
          <button 
            @click="fetchMockQuestions(true, true)" 
            :disabled="isLoading"
            class="bg-[#000080] hover:bg-[#000060] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            id="btn-generate-ai-mock"
          >
            <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': isLoading }" />
            <span>{{ isLoading ? 'Loading...' : 'Generate New Questions' }}</span>
          </button>
        </div>
      </div>

      <!-- Exam Paper Selector Tabs -->
      <div class="mt-6 pt-5 border-t border-slate-100" id="mt-paper-tabs-container">
        <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Select Exam Syllabus Paper:
        </div>
        <div class="flex flex-wrap gap-2" id="mt-paper-button-group">
          <button
            v-for="paper in MOCK_TEST_PAPERS"
            :key="paper.id"
            :id="`btn-paper-${paper.id}`"
            @click="selectPaper(paper.id)"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-2 border',
              selectedPaperId === paper.id && !isUsingLiveAiPaper
                ? 'bg-[#000080] text-white border-[#000080] shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            ]"
          >
            <FileCheck class="h-3.5 w-3.5" />
            <span>{{ paper.title.split(' - ')[0] }}</span>
          </button>

          <button
            v-if="isUsingLiveAiPaper"
            class="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white border-amber-600 shadow-sm flex items-center space-x-1.5"
          >
            <Sparkles class="h-3.5 w-3.5" />
            <span>AI Dynamic Generator Paper</span>
          </button>
        </div>
      </div>

      <!-- Live metrics HUD -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5 pt-4 border-t border-slate-100 font-mono" id="mt-hud-metrics">
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-center space-y-0.5 relative">
          <div class="flex items-center justify-center space-x-1 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <Clock class="h-3 w-3 text-[#000080]" />
            <span>Time Elapsed</span>
          </div>
          <div class="flex items-center justify-center space-x-2">
            <span class="text-base font-extrabold text-slate-900">
              {{ formatTime(durationSeconds) }}
            </span>
            <button 
              @click="toggleTimerPause" 
              class="text-slate-500 hover:text-slate-800 p-0.5 rounded cursor-pointer transition-colors"
              :title="isTimerPaused ? 'Resume Timer' : 'Pause Timer'"
            >
              <Pause v-if="!isTimerPaused" class="h-3.5 w-3.5" />
              <Play v-else class="h-3.5 w-3.5 text-emerald-600" />
            </button>
          </div>
        </div>

        <div class="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/70 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Correct Pick</span>
          <span class="text-lg font-black text-[#138808]">{{ correctCount }} / {{ questions.length }}</span>
        </div>

        <div class="bg-red-50/50 p-3 rounded-xl border border-red-200/70 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Failed Pick</span>
          <span class="text-lg font-black text-red-650">{{ incorrectCount }}</span>
        </div>

        <div class="bg-orange-50/50 p-3 rounded-xl border border-orange-200/70 text-center space-y-0.5">
          <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Accuracy Rate</span>
          <span class="text-lg font-black text-orange-700">{{ accuracyPercentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Error State with Auto-Recovery (Guaranteed 100% non-blocking) -->
    <div v-if="isError" class="bg-amber-50 border border-amber-300 p-6 rounded-2xl text-left space-y-3 shadow-sm" id="mt-error-box">
      <div class="flex items-center space-x-2 text-amber-900 font-bold text-sm">
        <AlertCircle class="h-5 w-5 text-amber-600 shrink-0" />
        <span>Loaded Verified Offline Mock Exam Paper</span>
      </div>
      <p class="text-xs text-amber-800 leading-relaxed">
        {{ errorMsg || 'Using high-yield offline question bank aligned with official defense exam syllabus.' }}
      </p>
      <button 
        @click="fetchMockQuestions(true, false)"
        class="bg-[#000080] hover:bg-[#000060] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 cursor-pointer transition-all shadow-sm"
      >
        <RefreshCw class="h-3 w-3" />
        <span>Reload Exam Paper</span>
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
    <div v-else-if="questions.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left" id="mt-interactive-grid">
      
      <!-- Main question screen -->
      <div class="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[500px]" id="mt-left-column">
        <!-- Top accent flag streak -->
        <div class="absolute top-0 left-0 right-0 h-1.5 flex">
          <div class="w-[33%] bg-[#FF9933]" />
          <div class="w-[34%] bg-slate-200" />
          <div class="w-[33%] bg-[#138808]" />
        </div>

        <div class="p-6 sm:p-8 space-y-6">
          <!-- Quiz meta navigation card -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-4">
            <div class="bg-[#000080]/5 text-[#000080] px-3 py-1 rounded-lg border border-[#000080]/10 text-xs font-black tracking-wide flex items-center space-x-1.5">
              <Zap class="h-3.5 w-3.5 text-amber-500 fill-amber-300" />
              <span>QUESTION {{ currentIndex + 1 }} OF {{ questions.length }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <span v-if="questions[currentIndex]?.category" class="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                {{ questions[currentIndex].category }}
              </span>
              <span class="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
                +2.0 Marks / -0.5 Neg
              </span>
            </div>
          </div>

          <!-- Dynamic high value Progress bar -->
          <div class="space-y-1.5">
            <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 relative">
              <div 
                class="h-full bg-gradient-to-r from-[#FF9933] via-yellow-400 to-[#138808] rounded-full transition-all duration-300 relative"
                :style="{ width: `${((currentIndex + 1) / questions.length) * 100}%` }"
              />
            </div>
            <div class="flex items-center justify-between text-[11px] text-slate-500 font-bold font-mono">
              <span>Exam Progress: {{ Math.round(((currentIndex + 1) / questions.length) * 100) }}%</span>
              <span>{{ questions.length - (currentIndex + 1) }} Remaining</span>
            </div>
          </div>

          <!-- Question Body Display in Bilingual Format -->
          <div class="bg-slate-50/80 p-5 sm:p-6 rounded-2xl border border-slate-200 text-slate-900 space-y-4" id="mt-question-body">
            <!-- English -->
            <div class="flex items-start space-x-3">
              <span class="flex items-center justify-center bg-[#000080] text-white font-bold h-6 w-6 rounded-md text-[11px] font-mono shrink-0 select-none">
                EN
              </span>
              <p class="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                {{ questions[currentIndex].text }}
              </p>
            </div>

            <div class="border-t border-slate-200 border-dashed" />

            <!-- Hindi -->
            <div class="flex items-start space-x-3">
              <span class="flex items-center justify-center bg-[#138808] text-white font-bold h-6 w-6 rounded-md text-[11px] font-mono shrink-0 select-none">
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
                      ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-extrabold ring-2 ring-emerald-400/20'
                      : (selectedAnswers[questions[currentIndex].id] === idx
                          ? 'border-red-500 bg-red-50/70 text-red-950 font-extrabold ring-2 ring-red-400/20'
                          : 'border-slate-200/60 bg-slate-50/60 text-slate-400 opacity-60'))
                  // Not answered yet
                  : 'bg-white border-slate-200 hover:border-[#000080]/40 hover:bg-slate-50/80 text-slate-800 font-bold'
              ]"
            >
              <div class="flex items-center space-x-3">
                <span class="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs font-mono font-bold text-slate-600 shrink-0">
                  {{ String.fromCharCode(65 + idx) }}
                </span>
                <span>{{ option }}</span>
              </div>
              
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
            class="bg-amber-50/60 border border-amber-200 p-5 rounded-2xl text-left space-y-3 animate-fade-in shadow-inner"
            id="mt-feedback-drawer"
          >
            <div class="flex items-center space-x-2 text-amber-900 font-extrabold text-[11.5px] uppercase tracking-wider border-b border-amber-200/60 pb-2">
              <BookOpen class="h-4 w-4 text-amber-700" />
              <span>Bilingual Explanatory Notes / सविस्तार व्याख्या</span>
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
            class="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none flex items-center space-x-1.5 cursor-pointer transition-all"
          >
            <ArrowLeft class="h-4 w-4" />
            <span>Previous</span>
          </button>

          <span class="text-slate-600 font-bold text-xs font-mono select-none">
            {{ currentIndex + 1 }} / {{ questions.length }}
          </span>

          <button
            v-if="currentIndex < questions.length - 1"
            @click="handleNext"
            class="px-5 py-2.5 text-xs font-bold rounded-xl bg-[#000080] hover:bg-[#000060] text-white disabled:opacity-45 flex items-center space-x-1.5 cursor-pointer transition-all shadow-sm"
          >
            <span>Next Question</span>
            <ArrowRight class="h-4 w-4" />
          </button>
          
          <button
            v-else
            @click="testSubmitted = true"
            :disabled="answeredCount < questions.length"
            class="px-5 py-2.5 text-xs font-bold tracking-wider uppercase rounded-xl bg-[#138808] hover:bg-[#117706] disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center space-x-1.5 cursor-pointer transition-all shadow"
          >
            <span>Submit Exam</span>
            <Award class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Right column details & performance sidebar -->
      <div class="lg:col-span-1 space-y-6" id="mt-right-column">
        
        <!-- Live performance Scoreboard dashboard -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5" id="mt-stats-sidebar">
          <h2 class="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
            <Award class="h-5 w-5 mr-2 text-[#000080]" />
            <span>Your Live Scorecard</span>
          </h2>

          <div class="space-y-4">
            <!-- Progress pie status -->
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <span class="text-xs font-bold text-slate-500">Attempted Questions:</span>
              <span class="text-xs font-black text-slate-800">{{ answeredCount }} / {{ questions.length }}</span>
            </div>

            <!-- Accuracy gauge visually custom -->
            <div class="space-y-1.5 text-left">
              <div class="flex justify-between text-xs font-bold">
                <span class="text-slate-500">Real-time Accuracy:</span>
                <span :class="[
                  'font-black font-mono',
                  accuracyPercentage >= 75 ? 'text-[#138808]' : accuracyPercentage >= 50 ? 'text-amber-600' : 'text-red-650'
                ]">{{ accuracyPercentage }}%</span>
              </div>
              
              <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
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
              <div class="flex items-center space-x-1.5">
                <Award class="h-4 w-4 shrink-0" />
                <span class="text-xs font-black uppercase tracking-wider">{{ performanceBadge.title }}</span>
              </div>
              <p class="text-[11px] leading-snug font-medium text-slate-700">
                {{ performanceBadge.desc }}
              </p>
            </div>
          </div>

          <div class="pt-2">
            <button
              @click="handleRetake"
              class="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <RotateCcw class="h-3.5 w-3.5 text-slate-600" />
              <span>Reset & Retake This Paper</span>
            </button>
          </div>
        </div>

        <!-- Interactive Question Palette grid for fast navigation -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4" id="mt-palette-sidebar">
          <h2 class="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span class="flex items-center">
              <HelpCircle class="h-4 w-4 mr-1.5 text-slate-500" />
              <span>Question Palette</span>
            </span>
            <span class="text-[11px] font-mono text-slate-400">{{ questions.length }} Total</span>
          </h2>

          <div class="grid grid-cols-5 gap-2" id="mt-palette-btn-grid">
            <button
              v-for="(q, idx) in questions"
              :key="q.id"
              :id="`mt-p-btn-${idx}`"
              @click="currentIndex = idx"
              class="h-8 w-full rounded-lg text-xs font-black cursor-pointer border flex items-center justify-center transition-all"
              :class="[
                currentIndex === idx ? 'ring-2 ring-[#000080] scale-105' : '',
                selectedAnswers[q.id] !== undefined
                  ? (selectedAnswers[q.id] === q.correctAnswer
                      ? 'bg-emerald-500 border-emerald-600 text-white font-extrabold'
                      : 'bg-red-500 border-red-600 text-white font-extrabold')
                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
              ]"
            >
              {{ idx + 1 }}
            </button>
          </div>

          <!-- Color palette legend -->
          <div class="pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-[10.5px] font-bold text-slate-500 justify-start select-none">
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-3 rounded bg-emerald-500 border border-emerald-600 block shrink-0" />
              <span>Correct Pick</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-3 rounded bg-red-500 border border-red-600 block shrink-0" />
              <span>Failed Pick</span>
            </div>
            <div class="flex items-center space-x-1.5">
              <span class="w-3 h-3 rounded bg-white border border-slate-300 block shrink-0" />
              <span>Not Answered</span>
            </div>
          </div>
        </div>

        <!-- Aspirants Examination Guidelines Box -->
        <div class="bg-gradient-to-tr from-[#000080] to-[#1e1b4b] text-white rounded-3xl p-5 text-left border border-indigo-950 shadow-md relative overflow-hidden" id="mt-banner-defense">
          <div class="absolute -right-6 -bottom-6 opacity-10 font-black text-7xl pointer-events-none">
            MAIC
          </div>
          <div class="space-y-2">
            <h3 class="text-xs uppercase tracking-widest font-black text-amber-400">
              Exam Strategy / परीक्षा निर्देश
            </h3>
            <p class="text-[12px] leading-relaxed text-indigo-100 font-normal">
              Continuous mock test drills help master negative marking calculation and time management. Review each explanation carefully before moving to the next subject paper!
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
          <p class="text-xs sm:text-sm text-slate-500">
            You have successfully completed the {{ selectedPaper.title }}. Here is your official performance evaluation scorecard.
          </p>
        </div>

        <!-- Metrics cards in modal -->
        <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 gap-4 font-mono">
          <div class="text-left space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Total Score</span>
            <span class="text-xl font-black text-slate-900">{{ correctCount }} / {{ questions.length }} Correct</span>
          </div>

          <div class="text-right space-y-0.5">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Accuracy Index</span>
            <span class="text-xl font-black text-[#138808]">{{ accuracyPercentage }}% Acc</span>
          </div>

          <div class="text-left space-y-0.5 border-t border-slate-200 pt-3">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Time Invested</span>
            <span class="text-base font-extrabold text-slate-800">{{ formatTime(durationSeconds) }} Secs</span>
          </div>

          <div class="text-right space-y-0.5 border-t border-slate-200 pt-3">
            <span class="text-[10px] uppercase font-bold text-slate-500 block">Earned Rank Badge</span>
            <span class="text-xs font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">{{ performanceBadge.title }}</span>
          </div>
        </div>

        <!-- Interactive advice list based on stats level -->
        <div class="text-left space-y-2.5">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">Recommended Next Steps:</h4>
          <ul class="space-y-2 text-xs text-slate-650 leading-relaxed font-sans">
            <li class="flex items-start">
              <CheckCircle class="h-4 w-4 text-emerald-600 shrink-0 mr-2" style="margin-top: 1px;" />
              <span>Great discipline! Consistent mock test practice strengthens exam temperament.</span>
            </li>
            <li v-if="accuracyPercentage < 80" class="flex items-start">
              <ShieldAlert class="h-4 w-4 text-amber-500 shrink-0 mr-2" style="margin-top: 1px;" />
              <span>Review the explanations drawer on the question palette for any missed concepts.</span>
            </li>
            <li class="flex items-start">
              <ThumbsUp class="h-4 w-4 text-[#000080] shrink-0 mr-2" style="margin-top: 1px;" />
              <span>Download syllabus-aligned study notes from our Study Material and PDF Library sections.</span>
            </li>
          </ul>
        </div>

        <!-- Buttons inside modal -->
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 select-none">
          <button
            @click="testSubmitted = false"
            class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl text-xs uppercase cursor-pointer text-center transition-colors"
          >
            Review Question Answers
          </button>
          
          <button
            @click="handleRetake"
            class="flex-1 bg-[#138808] hover:bg-[#117706] text-white font-bold px-5 py-3 rounded-xl text-xs uppercase cursor-pointer text-center shadow-md flex items-center justify-center space-x-1.5 transition-colors"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            <span>Retake Exam</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
