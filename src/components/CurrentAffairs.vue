<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { BookOpen, Newspaper, Zap, Award, RotateCcw, CheckCircle, XCircle, Sparkles, ArrowRight, HelpCircle } from 'lucide-vue-next';
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
    date: "June 17, 2026",
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
  },
  {
    id: "news-2",
    date: "June 16, 2026",
    titleEng: "Reserve Bank of India Retains Repo Rate at 6.50% to Balance Growth",
    titleHin: "आरबीआई ने विकास संतुलित रखने हेतु रेपो रेट को 6.50% पर बरकरार रखा",
    source: "RBI Bulletin & Monetary Policy Committee",
    summaryEng: "The Monetary Policy Committee of the RBI voted to keep the policy Repo Rate unchanged at 6.50%, focusing on containment of retail inflation objectives under stable targets.",
    summaryHin: "आरबीआई की मौद्रिक नीति समिति ने नीतिगत रेपो दर को 6.50% पर अपरिवर्तित रखने का फैसला किया, जिसमें स्थिर लक्ष्यों के तहत खुदरा मुद्रास्फीति को नियंत्रित करने पर ध्यान केंद्रित किया गया है।",
    quizQuestion: {
      text: "What is the policy Repo Rate maintained by the RBI in its June 2026 Monetary Committee meeting? / जून 2026 मौद्रिक समिति की बैठक में आरबीआई द्वारा बरकरार रखी गई रेपो दर क्या है?",
      options: [
        "6.00% / 6.00%",
        "6.25% / 6.25%",
        "6.50% / 6.50%",
        "6.75% / 6.75%"
      ],
      correctAnswer: 2,
      explanation: "The Reserve Bank of India decided to retain its key lending Repo Rate at 6.50% for monetary stability. / भारतीय रिजर्व बैंक ने मौद्रिक स्थिरता के लिए अपनी प्रमुख ब्याज रेपो दर को 6.50% पर बनाए रखने का फैसला किया।"
    }
  },
  {
    id: "news-3",
    date: "June 15, 2026",
    titleEng: "Bi-lateral Maritime Defense Drill 'Samudra Gati' Commences",
    titleHin: "द्विपक्षीय समुद्री नौसेना अभ्यास 'समुद्र गति' का शुभारंभ हुआ",
    source: "Indian Navy Strategic Desk",
    summaryEng: "Indian Navy guided warships arrived at the Eastern Naval Command waters to participate alongside strategic allies in high-octane anti-submarine war game scenarios.",
    summaryHin: "भारतीय नौसेना के युद्धपोत उच्च तीव्रता वाले पनडुब्बी विरोधी अभ्यासों में रणनीतिक सहयोगियों के साथ भाग लेने के लिए पूर्वी नौसेना कमान क्षेत्र में पहुंचे।",
    quizQuestion: {
      text: "Which branch of the Indian Armed Forces participates in the 'Samudra Gati' tactical drill? / 'समुद्र गति' सामरिक अभ्यास में भारतीय सशस्त्र बलों की कौन सी शाखा भाग लेती है?",
      options: [
        "Indian Army / भारतीय सेना",
        "Indian Air Force / भारतीय वायु सेना",
        "Indian Navy / भारतीय नौसेना",
        "Indian Coast Guard / भारतीय तट रक्षक"
      ],
      correctAnswer: 2,
      explanation: "'Samudra Gati' is a dedicated maritime drill designed for coordinate naval fleets, sonar tracking, and anti-submarine missions. / 'समुद्र गति' नौसैनिक बेड़े, सोनार ट्रैकिंग और पनडुब्बी-रोधी अभियानों के लिए बनाया गया एक विशेष समुद्री अभ्यास है।"
    }
  },
  {
    id: "news-4",
    date: "June 14, 2026",
    titleEng: "India's First Green Hydrogen Fuel Pipeline Network Commissioned",
    titleHin: "भारत का पहला ग्रीन हाइड्रोजन ईंधन पाइपलाइन नेटवर्क चालू किया गया",
    source: "Ministry of New and Renewable Energy",
    summaryEng: "A state-of-the-art clean energy corridor connects primary production hubs in Gujarat to consumer grids, reducing carbon output by 2 million metric tons annually.",
    summaryHin: "एक अत्याधुनिक स्वच्छ ऊर्जा कॉरिडोर गुजरात के प्राथमिक उत्पादन केंद्रों को उपभोक्ता ग्रिड से जोड़ता है, जिससे सालाना 2 मिलियन मीट्रिक टन कार्बन उत्सर्जन कम होगा।",
    quizQuestion: {
      text: "Which Indian state hosts the main starting terminal for the first Green Hydrogen Pipeline? / पहली ग्रीन हाइड्रोजन पाइपलाइन का मुख्य शुरुआती टर्मिनल किस भारतीय राज्य में स्थित है?",
      options: [
        "Rajasthan / राजस्थान",
        "Maharashtra / महाराष्ट्र",
        "Gujarat / गुजरात",
        "Uttar Pradesh / उत्तर प्रदेश"
      ],
      correctAnswer: 2,
      explanation: "Gujarat acts as the pioneer hub for launching green hydrogen initiatives and regional renewable corridor terminals. / गुजरात ग्रीन हाइड्रोजन पहलों और क्षेत्रीय नवीकरणीय कॉरिडोर टर्मिनलों को शुरू करने के लिए अग्रणी केंद्र के रूप में कार्य करता है।"
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
const selectedNews = ref<NewsItem | null>(DAILY_CURRENT_NEWS[0]);
const userAnswer = ref<number | null>(null);
const isSubmitted = ref<boolean>(false);
const score = ref<number>(0);
const completedQuizIds = ref<string[]>([]);

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

watch(() => props.selectedNewsId, (newId) => {
  if (newId) {
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
      <div class="flex items-center space-x-2 text-[#000080]">
        <Newspaper class="h-6 w-6 stroke-[2]" />
        <h2 class="text-xl font-black text-gray-900 tracking-tight">
          Daily Live Current Affairs Interactive Hub / दैनिक समसामयिकी
        </h2>
      </div>
      <p class="text-xs text-gray-500 mt-1 leading-relaxed">
        Read official updates parsed from major digital directories, then test your strategic retention with our modern <strong>Animated Current Affairs Quiz format</strong>.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6" id="current-affairs-layout">
      
      <!-- Left Side: Today's Online Bulletins -->
      <div class="lg:col-span-5 space-y-4" id="bulletin-sidebar">
        <h4 class="font-bold text-xs uppercase text-gray-400 font-mono tracking-widest pl-1 flex items-center">
          <Sparkles class="h-3.5 w-3.5 text-[#FF9933] mr-1 animate-pulse" />
          Today's News Bulletins / दैनिक मुख्य समाचार
        </h4>

        <div class="space-y-3 max-h-[580px] overflow-y-auto pr-1" id="bulletin-scroller">
          <div
            v-for="item in news"
            :key="item.id"
            :id="`news-bulletin-card-${item.id}`"
            @click="selectBulletin(item)"
            :class="[
              'p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between',
              selectedNews?.id === item.id
                ? 'bg-white border-[#000080] shadow'
                : 'bg-white border-gray-100 hover:border-gray-200 cursor-pointer'
            ]"
          >
            <div class="space-y-2.5">
              <div class="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400">
                <span class="text-[#FF9933] uppercase font-bold">{{ item.source }}</span>
                <span>{{ item.date }}</span>
              </div>

              <h5 class="font-black text-xs text-slate-800 leading-snug">
                {{ item.titleEng }}
              </h5>
              
              <p class="text-[11px] font-bold text-[#138808] leading-relaxed">
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

                <h4 class="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug mb-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
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
                  class="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-[11px] leading-relaxed text-slate-800 font-sans"
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
