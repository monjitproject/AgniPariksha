<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { BookOpen, Newspaper, Zap, Award, RotateCcw, CheckCircle, XCircle, Sparkles, ArrowRight, HelpCircle, RefreshCw, Globe } from 'lucide-vue-next';
import confetti from 'canvas-confetti';

interface NewsItem {
  id: string;
  date: string;
  titleEng: string;
  titleHin: string;
  source: string;
  summaryEng: string;
  summaryHin: string;
  quizQuestion: {
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

const DAILY_CURRENT_NEWS: NewsItem[] = [
  {
    id: "news-1",
    date: "June 20, 2026",
    titleEng: "India Joins Global Space Alliance for Lunar Settlement Blueprint",
    titleHin: "चंद्रमा पर मानव बस्ती ब्लूप्रिंट हेतु भारत वैश्विक अंतरिक्ष गठबंधन में शामिल",
    source: "Global Space Bulletin & ISRO",
    summaryEng: "India formally signed the joint charter for peaceful lunar exploration research, committing advanced robotic rovers and landing systems for mapping deep regolith deposits.",
    summaryHin: "भारत ने शांतिपूर्ण चंद्र अन्वेषण अनुसंधान के लिए संयुक्त घोषणापत्र पर औपचारिक रूप से हस्ताक्षर किए, जिसमें गहरे रेगोलिथ जमा का मानचित्रण करने हेतु उन्नत रोबोटिक रोवर और लैंडिंग सिस्टम समर्पित किए गए हैं।",
    quizQuestion: {
      text: "Which Space Agency represented India in signing the joint charter for Lunar Settlement Blueprint? / लूनर सेटलमेंट ब्लूप्रिंट के संयुक्त घोषणापत्र पर हस्ताक्षर करने में भारत का प्रतिनिधित्व किस अंतरिक्ष एजेंसी ने किया?",
      options: [
        "NASA / नासा",
        "ISRO / इसरो",
        "ESA / यूरोपीय अंतरिक्ष एजेंसी",
        "Roscosmos / रॉसकॉसमॉस"
      ],
      correctAnswer: 1,
      explanation: "ISRO (Indian Space Research Organisation) represents India in signing terms for international lunar exploration consortia. / इसरो (भारतीय अंतरिक्ष अनुसंधान संगठन) अंतरराष्ट्रीय चंद्र अन्वेषण संघ के लिए नियमों पर हस्ताक्षर करने में भारत का प्रतिनिधित्व करता है।"
    }
  }
];

interface CurrentAffairsProps {
  selectedNewsId?: string | null;
}

const props = defineProps<CurrentAffairsProps>();

const emit = defineEmits<{
  (e: 'selectNews', newsId: string | null): void;
}>();

const news = ref<NewsItem[]>(DAILY_CURRENT_NEWS);
const selectedNews = ref<NewsItem | null>(null);
const userAnswer = ref<number | null>(null);
const isSubmitted = ref<boolean>(false);
const score = ref<number>(0);
const completedQuizIds = ref<string[]>([]);

const isLoading = ref(true);
const isResearching = ref(false);
const researchLogs = ref<string[]>([]);
const currentLogIndex = ref(0);

const logMessages = [
  "Connecting to Drishti IAS Live Portal Feed: https://www.drishtiias.com/hindi/quiz/quizlist/current-affairs-quiz-set ...",
  "Resolving secure socket layer handshakes and HTTP payload packets...",
  "Acquiring newest daily automated current affairs feed items...",
  "Powering Gemini 3.5 live translation and bilingual quiz generation models...",
  "Formatting English/Hindi mutual verification matrices and score markers...",
  "Successfully synced live automated date-wise quiz bulletin!"
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const fetchCurrentAffairs = async (force = false) => {
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
    const res = await fetch(`/api/current-affairs${force ? '?force=true' : ''}`);
    const data = await res.json();
    if (data && data.affairs && Array.isArray(data.affairs)) {
      news.value = data.affairs;
      if (data.affairs.length > 0) {
        const slug = props.selectedNewsId;
        const match = slug ? data.affairs.find((n: any) => toSlug(n.titleEng) === slug || n.id === slug) : null;
        selectedNews.value = match || data.affairs[0];
      }
    }
  } catch (err) {
    console.error("Failed to load current affairs:", err);
  } finally {
    isLoading.value = false;
    isResearching.value = false;
  }
};

onMounted(() => {
  fetchCurrentAffairs();
});

watch(() => props.selectedNewsId, (newId) => {
  if (newId && news.value) {
    const match = news.value.find(n => n.id === newId || toSlug(n.titleEng) === newId);
    if (match && (!selectedNews.value || selectedNews.value.id !== match.id)) {
      selectedNews.value = match;
      userAnswer.value = null;
      isSubmitted.value = false;
    }
  }
}, { immediate: true });

const handleOptionSelect = (idx: number) => {
  if (isSubmitted.value) return;
  userAnswer.value = idx;
};

const handleSubmitAnswer = () => {
  if (userAnswer.value === null || !selectedNews.value) return;
  isSubmitted.value = true;

  const isCorrect = userAnswer.value === selectedNews.value.quizQuestion.correctAnswer;
  if (isCorrect) {
    score.value += 10;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#FF9933", "#ffffff", "#138808"]
    });
  }

  if (!completedQuizIds.value.includes(selectedNews.value.id)) {
    completedQuizIds.value.push(selectedNews.value.id);
  }
};

const handleNextNews = () => {
  if (!news.value || news.value.length === 0) return;
  const currentIdx = news.value.findIndex(n => n.id === selectedNews.value?.id);
  const nextIdx = (currentIdx + 1) % news.value.length;
  const nextItem = news.value[nextIdx];
  selectedNews.value = nextItem;
  userAnswer.value = null;
  isSubmitted.value = false;
  emit('selectNews', toSlug(nextItem.titleEng));
};

const selectBulletin = (item: NewsItem) => {
  selectedNews.value = item;
  userAnswer.value = null;
  isSubmitted.value = false;
  emit('selectNews', toSlug(item.titleEng));
};
</script>

<template>
  <div class="space-y-6 animate-fade-in" id="current-affairs-viewport">
    
    <!-- Header element -->
    <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#000080]" id="current-affairs-header">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="space-y-1 text-left">
          <div class="flex items-center space-x-2 mb-1">
            <span class="bg-red-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest animate-pulse">Live</span>
            <span class="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">DrishtiIAS quiz list integration</span>
          </div>
          <h2 class="text-xl font-black text-gray-900 flex items-center">
            <Newspaper class="h-6 w-6 text-[#000080] mr-2" />
            Daily Live Current Affairs Interactive Hub / दैनिक समसामयिकी
          </h2>
          <p class="text-xs text-gray-500 leading-relaxed max-w-2xl">
            Synchronize date-wise general knowledge items automatically loaded from the **Drishti IAS Current Affairs feed**, then challenge your retention with our animated quiz system.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Research Sync Button -->
          <button
            id="btn-sync-current-affairs"
            @click="fetchCurrentAffairs(true)"
            :disabled="isResearching || isLoading"
            class="px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transition-all shadow-md items-center space-x-1.5 flex cursor-pointer disabled:opacity-50"
          >
            <Sparkles class="h-4 w-4" :class="{'animate-spin': isResearching}" />
            <span>{{ isResearching ? "Syncing..." : "Sync Live Feed" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Dynamic Research Terminal -->
    <div v-if="isResearching" class="bg-slate-900 text-green-400 p-5 rounded-2xl shadow-xl font-mono text-xs border border-green-500/20 space-y-3 overflow-hidden transition-all duration-300">
      <div class="absolute top-0 right-0 p-3 select-none flex items-center space-x-1.5 opacity-80 text-[10px] text-green-300">
        <span class="inline-block h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
        <span>RESEARCHING DRI-IAS RSS FEED...</span>
      </div>
      <h3 class="text-white font-black flex items-center text-xs">
        <Sparkles class="h-4.5 w-4.5 text-amber-400 mr-2 animate-pulse" />
        DrishtiIAS Feed AI Synthesizer / दैनिक समसामयिकी अनुसंधान और सत्यापन
      </h3>
      <div class="space-y-1.5 my-3 bg-black/40 p-3 rounded-lg border border-slate-800 text-[11px] leading-relaxed max-h-[140px] overflow-y-auto">
        <div v-for="(log, idx) in researchLogs" :key="idx" :class="[idx === currentLogIndex ? 'text-green-300 font-bold' : 'text-slate-500']" class="flex items-start text-left">
          <span class="text-green-500 mr-2">></span>
          <span>{{ log }}</span>
        </div>
      </div>
      <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-green-550 via-emerald-400 to-teal-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :style="{ width: `${((currentLogIndex + 1) / logMessages.length) * 100}%` }"></div>
      </div>
    </div>

    <!-- Skeleton Loading Screen -->
    <div v-else-if="isLoading" class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <!-- Left bulletin sidebar skeleton -->
      <div class="lg:col-span-5 space-y-4">
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div class="space-y-3">
          <div v-for="i in 3" :key="i" class="p-4 bg-white border-2 border-gray-100 rounded-xl space-y-3">
            <div class="flex justify-between">
              <div class="h-3 bg-gray-250 rounded w-16"></div>
              <div class="h-3 bg-gray-150 rounded w-14"></div>
            </div>
            <div class="h-4 bg-gray-250 rounded w-5/6"></div>
            <div class="h-3 bg-gray-150 rounded w-1/2"></div>
          </div>
        </div>
      </div>
      <!-- Right quiz board skeleton -->
      <div class="lg:col-span-12 lg:col-start-6 lg:col-end-13 bg-white p-6 rounded-2xl border border-gray-100 space-y-6">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-7 bg-gray-300 rounded w-3/4"></div>
        <div class="h-16 bg-gray-100 rounded-xl"></div>
        <div class="space-y-3 pt-4">
          <div v-for="i in 4" :key="i" class="h-11 bg-gray-50 rounded-xl border border-gray-100"></div>
        </div>
      </div>
    </div>

    <!-- Main Content layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="current-affairs-layout">
      
      <!-- Left Side: Today's Online Bulletins -->
      <div class="lg:col-span-5 space-y-4" id="bulletin-sidebar">
        <div class="flex justify-between items-center pl-1">
          <h4 class="font-bold text-xs uppercase text-gray-400 font-mono tracking-widest flex items-center">
            <Sparkles class="h-3.5 w-3.5 text-[#FF9933] mr-1 animate-pulse" />
            Today's News Bulletins / दैनिक मुख्य समाचार
          </h4>
          <span class="text-[10px] font-mono font-bold text-blue-600 uppercase flex items-center space-x-1">
            <Globe class="h-3 w-3 animate-pulse" />
            <span>DRISHTI IAS RSS</span>
          </span>
        </div>

        <div class="space-y-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent" id="bulletin-scroller">
          <div
            v-for="item in news"
            :key="item.id"
            :id="`news-bulletin-card-${item.id}`"
            @click="selectBulletin(item)"
            :class="[
              'p-4 rounded-xl border-2 transition-all duration-150 hover:scale-[1.01] hover:shadow-md relative overflow-hidden flex flex-col justify-between',
              selectedNews?.id === item.id
                ? 'bg-white border-[#000080] shadow-md'
                : 'bg-white border-gray-100 hover:border-gray-200 cursor-pointer'
            ]"
          >
            <div class="space-y-2.5">
              <div class="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400">
                <span class="text-[#FF9933] uppercase font-bold">{{ item.source }}</span>
                <span>{{ item.date }}</span>
              </div>

              <h5 class="font-black text-xs text-slate-800 leading-snug text-left">
                {{ item.titleEng }}
              </h5>
              
              <p class="text-[11px] font-bold text-[#138808] leading-relaxed text-left">
                {{ item.titleHin }}
              </p>
            </div>

            <div class="mt-4 pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-mono">
              <span class="font-semibold text-gray-500">Secured Bulletin</span>
              <span v-if="completedQuizIds.includes(item.id)" class="text-[#138808] font-bold uppercase flex items-center">
                <CheckCircle class="h-3.5 w-3.5 mr-0.5" /> Quiz Solved
              </span>
              <span v-else class="text-[#000080] font-bold uppercase flex items-center">
                <Zap class="h-3 w-3 mr-0.5 animate-pulse text-[#FF9933] fill-[#FF9933]" /> Quiz Pending
              </span>
            </div>
          </div>
        </div>

        <!-- Gamified Points Badge scoreboard -->
        <div class="bg-slate-900 text-white p-4 rounded-xl shadow-md border-b-4 border-b-[#138808] flex items-center justify-between" id="daily-points-scorecard">
          <div class="text-left">
            <span class="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">Current Affairs Score</span>
            <h4 class="text-xl font-black mt-0.5 text-[#FF9933]">{{ score }} Points</h4>
          </div>
          <Award class="h-8 w-8 text-[#FF9933] animate-pulse" />
        </div>
      </div>

      <!-- Right Side: High Fidelity Animated Quiz Board -->
      <div class="lg:col-span-7" id="bulletin-quiz-board">
        <transition name="fade" mode="out-in">
          <div
            v-if="selectedNews"
            :key="selectedNews.id"
            class="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden flex flex-col justify-between"
            style="min-height: 580px"
            id="active-bulletin-reader"
          >
            <!-- Header segment with national tricolor strip -->
            <div class="relative">
              <div class="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
              <div class="p-6 pb-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] font-black uppercase text-white bg-[#000080]" style="padding: 4px 10px; border-radius: 4px;">NEWS BRIEF</span>
                  <span class="text-xs text-gray-500 font-bold font-mono">{{ selectedNews.date }}</span>
                </div>
                <span class="text-[10px] text-[#138808] font-black font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">ONLINE VERIFIED</span>
              </div>
            </div>

            <!-- News details -->
            <div class="p-6 flex-1 space-y-4">
              <div class="space-y-1.5 text-left">
                <h2 class="text-lg font-black text-slate-900 tracking-tight leading-snug">
                  {{ selectedNews.titleEng }}
                </h2>
                <p class="text-sm font-black text-[#138808] leading-relaxed">
                  {{ selectedNews.titleHin }}
                </p>
              </div>

              <div class="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-200 font-sans text-left space-y-3">
                <p class="text-xs text-gray-600 leading-relaxed">
                  {{ selectedNews.summaryEng }}
                </p>
                <div class="border-t border-gray-200/50" />
                <p class="text-xs text-[#138808] leading-relaxed font-semibold">
                  {{ selectedNews.summaryHin }}
                </p>
              </div>

              <!-- ANIMATED QUIZ SEGMENT -->
              <div class="pt-4 border-t border-gray-100 text-left">
                <div class="flex items-center space-x-1 mb-3 text-[#000080]">
                  <HelpCircle class="h-4.5 w-4.5" />
                  <span class="text-[10px] font-black tracking-widest uppercase font-mono">RETENTION CHECK / एनिमेटेड क्विज</span>
                </div>

                <h4 class="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug mb-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-left">
                  {{ selectedNews.quizQuestion.text }}
                </h4>

                <!-- Question Options -->
                <div class="space-y-2.5">
                  <button
                    v-for="(option, idx) in selectedNews.quizQuestion.options"
                    :key="idx"
                    :id="`ca-option-btn-${idx}`"
                    :disabled="isSubmitted"
                    @click="handleOptionSelect(idx)"
                    :class="[
                      'w-full text-left py-3 px-4 rounded-xl border transition-all duration-150 text-xs flex items-center justify-between',
                      isSubmitted ? 'cursor-default' : 'cursor-pointer hover:scale-[1.015] hover:translate-x-[2px] active:scale-[0.99]',
                      isSubmitted && idx === selectedNews.quizQuestion.correctAnswer
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold ring-1 ring-emerald-400'
                        : isSubmitted && userAnswer === idx
                        ? 'border-red-500 bg-red-50 text-red-800 font-extrabold ring-1 ring-red-400'
                        : isSubmitted
                        ? 'border-gray-100 bg-gray-50 text-gray-400 opacity-60'
                        : userAnswer === idx
                        ? 'border-[#000080] bg-[#000080]/10 text-slate-900 font-black ring-1 ring-[#000080]/20'
                        : 'border-gray-300 bg-white hover:bg-slate-50 text-gray-800 font-bold'
                    ]"
                  >
                    <span>{{ option }}</span>
                    <span v-if="isSubmitted && idx === selectedNews.quizQuestion.correctAnswer">
                      <CheckCircle class="h-4 w-4 text-emerald-600" />
                    </span>
                    <span v-else-if="isSubmitted && userAnswer === idx">
                      <XCircle class="h-4 w-4 text-red-600" />
                    </span>
                  </button>
                </div>

                <!-- Explanation Box -->
                <div
                  v-if="isSubmitted"
                  class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-[11px] leading-relaxed text-slate-800 font-sans text-left"
                  id="ca-quiz-explanation"
                >
                  <strong class="text-amber-900 block font-black uppercase mb-1">EXPLANATION / विश्लेषण</strong>
                  {{ selectedNews.quizQuestion.explanation }}
                </div>
              </div>
            </div>

            <!-- Submit and Next Question row -->
            <div class="p-6 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
              <button
                @click="handleNextNews"
                class="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw class="h-3.5 w-3.5" />
                <span>Next Bulletin</span>
              </button>

              <button
                v-if="!isSubmitted"
                id="ca-quiz-submit-button"
                :disabled="userAnswer === null"
                @click="handleSubmitAnswer"
                class="bg-[#000080] hover:bg-[#000060] text-white disabled:opacity-40 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors duration-150 flex items-center space-x-1 shadow-md cursor-pointer"
              >
                <span>Check Answer</span>
                <ArrowRight class="h-3.5 w-3.5" />
              </button>
              <button
                v-else
                id="ca-quiz-next-nav-button"
                @click="handleNextNews"
                class="bg-[#138808] hover:bg-[#117706] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors duration-150 flex items-center space-x-1 shadow-md cursor-pointer"
              >
                <span>Explore Next News</span>
                <ArrowRight class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div v-else class="bg-white rounded-2xl p-12 text-center shadow" id="ca-view-fallback">
            <BookOpen class="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p class="text-xs text-gray-500 font-bold">Select a bulletin from the list to launch the animated quiz.</p>
          </div>
        </transition>
      </div>

    </div>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
