<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { 
  Shield, Award, Clock, ArrowRight, ArrowLeft, Bookmark, 
  CheckCircle, XCircle, RefreshCw, Sparkles, Printer, Play, 
  AlertCircle, FileText, Flame
} from 'lucide-vue-next';
import canvasConfetti from 'canvas-confetti';
import { Quiz, QuizHistoryItem, UserCertificate } from '../types';
import { MOCK_QUIZZES, ARMY_PREV_QUESTIONS } from '../data/mockData';

const getBilingualQuestion = (qText: string) => {
  const normalizedKey = qText.toLowerCase().replace(/[^a-z]/g, "");
  
  const matched = ARMY_PREV_QUESTIONS.find(aq => {
    const aqKey = aq.englishQ.toLowerCase().replace(/[^a-z]/g, "");
    return aqKey.includes(normalizedKey) || normalizedKey.includes(aqKey);
  });

  if (matched) {
    return {
      english: matched.englishQ,
      hindi: matched.hindiQ
    };
  }

  if (qText.includes("/")) {
    const parts = qText.split("/");
    return {
      english: parts[0].trim(),
      hindi: parts[1].trim()
    };
  }

  const genericTranslations: Record<string, string> = {
    "who is the supreme commander of the indian armed forces?": "भारतीय सशस्त्र बलों के सर्वोच्च कमांडर कौन हैं?",
    "where is the indian military academy (ima) situated?": "भारतीय सैन्य अकादमी (IMA) कहाँ स्थित है?",
    "what is the motto of the indian army?": "भारतीय सेना का नारा/आदर्श वाक्य क्या है?",
    "under the agniveer scheme, for how many years are youths recruited into the armed forces?": "अग्निवीर योजना के तहत, युवाओं को कितने वर्षों के लिए सशस्त्र बलों में भर्ती किया जाता है?",
    "who is considered as the 'father of the indian navy'?": "किसे 'भारतीय नौसेना का जनक' माना जाता है?",
    "where is the national defence academy (nda) located?": "राष्ट्रीय रक्षा एकेडमी (NDA) कहाँ स्थित है?",
    "what is the highest gallantry award in india during peacetime?": "शांति काल के दौरान भारत में सर्वोच्च वीरता पुरस्कार क्या है?",
    "which is the oldest paramilitary force in india?": "भारत में सबसे पुराना अर्धसैनिक बल कौन सा है?"
  };

  const lookupKey = qText.toLowerCase().trim().replace(/\s+/g, " ");
  for (const [key, val] of Object.entries(genericTranslations)) {
    if (lookupKey.includes(key) || key.includes(lookupKey)) {
      return {
        english: qText,
        hindi: val
      };
    }
  }

  return {
    english: qText,
    hindi: ""
  };
};

const getBilingualOption = (qText: string, optionText: string) => {
  const normalizedQ = qText.toLowerCase().replace(/[^a-z]/g, "");
  const matchedQ = ARMY_PREV_QUESTIONS.find(aq => {
    const aqKey = aq.englishQ.toLowerCase().replace(/[^a-z]/g, "");
    return aqKey.includes(normalizedQ) || normalizedQ.includes(aqKey);
  });

  if (matchedQ) {
    const optMatch = matchedQ.options.find(o => {
      const parts = o.text.split("/");
      const engPart = parts[0].trim().toLowerCase();
      const rawOpt = optionText.trim().toLowerCase();
      return engPart.includes(rawOpt) || rawOpt.includes(engPart);
    });
    if (optMatch) {
      return optMatch.text;
    }
  }

  const optionTranslations: Record<string, string> = {
    "prime minister of india": "Prime Minister of India / भारत के प्रधानमंत्री",
    "president of india": "President of India / भारत के राष्ट्रपति",
    "chief of defence staff (cds)": "Chief of Defence Staff (CDS) / चीफ ऑफ डिफेंस स्टाफ (CDS)",
    "defence minister of india": "Defence Minister of India / भारत के रक्षा minister",
    "dehradun, uttarakhand": "Dehradun, Uttarakhand / देहरादून, उत्तराखंड",
    "khadakwasla, pune": "Khadakwasla, Pune / खड़कवासला, पुणे",
    "chennai, tamil nadu": "Chennai, Tamil Nadu / चेन्नई, तमिलनाडु",
    "mhow, madyha pradesh": "Mhow, Madhya Pradesh / महू, मध्य प्रदेश",
    "service before self": "Service Before Self / सेवा परमो धर्मः",
    "sam no varunah": "Sam No Varunah / शं नो वरुणः",
    "nabhal sprisham deeptam": "Nabhal Sprisham Deeptam / नभः स्पृशं दीप्तम्",
    "valour and wisdom": "Valour and Wisdom / वीरता और विवेक",
    "3 years": "3 Years / 3 वर्ष",
    "15 years": "15 Years / 15 वर्ष",
    "4 years": "4 Years / 4 वर्ष",
    "5 years": "5 Years / 5 वर्ष",
    "chhatrapati shivaji maharaj": "Chhatrapati Shivaji Maharaj / छत्रपति शिवाजी महाराज",
    "kanhoji angre": "Kanhoji Angre / कान्होजी आंग्रे",
    "raja raja chola i": "Raja Raja Chola I / राजराजा चोल प्रथम",
    "samudragupta": "Samudragupta / समुद्रगुप्त"
  };

  const lookupKey = optionText.toLowerCase().trim();
  if (optionTranslations[lookupKey]) {
    return optionTranslations[lookupKey];
  }

  return optionText;
};

const getBilingualExplanation = (q: any) => {
  // 1. If it's a previous year question from ARMY_PREV_QUESTIONS (like pyq-question-*), we can find it
  if (q.id && q.id.startsWith("pyq-")) {
    const idx = parseInt(q.id.replace("pyq-question-", ""));
    const pq = ARMY_PREV_QUESTIONS[idx];
    if (pq) {
      return {
        english: pq.explanationEng || q.explanation,
        hindi: pq.explanationHin || "सशस्त्र सेना शिक्षा बोर्ड दिशानिर्देशों द्वारा सत्यापित सही विकल्प।"
      };
    }
  }

  // 2. Or, if it has a slash separator in the explanation itself, extract them
  if (q.explanation && q.explanation.includes(" / ")) {
    const parts = q.explanation.split(" / ");
    return {
      english: parts[0].trim(),
      hindi: parts[1].trim()
    };
  } else if (q.explanation && q.explanation.includes("/")) {
    const parts = q.explanation.split("/");
    return {
      english: parts[0].trim(),
      hindi: parts[1].trim()
    };
  }

  // 3. Exact dictionary for Mock Quizzes
  const mockExpls: Record<string, { english: string; hindi: string }> = {
    "af-1": {
      english: "Article 53 of the Constitution of India provides that the Supreme Command of the Defence Forces of the Union shall be vested in the President of India.",
      hindi: "भारत के संविधान का अनुच्छेद 53 प्रावधान करता है कि संघ के रक्षा बलों की सर्वोच्च कमान भारत के राष्ट्रपति में निहित होगी।"
    },
    "af-2": {
      english: "The Indian Military Academy (IMA) was established in 1932 and is located in Dehradun, Uttarakhand.",
      hindi: "भारतीय सैन्य अकादमी (IMA) की स्थापना 1932 में हुई थी और यह देहरादून, उत्तराखंड में स्थित है।"
    },
    "af-3": {
      english: "The official motto of the Indian Army is 'Service Before Self' ('Seva Parmo Dharma').",
      hindi: "भारतीय सेना का आधिकारिक आदर्श वाक्य 'सेवा परमो धर्मः' है।"
    },
    "af-4": {
      english: "The commissioned naval rank sequence from lowest to highest starts with Sub-Lieutenant, Lieutenant, Lieutenant Commander, then Commander.",
      hindi: "कमीशन प्राप्त नौसेना रैंक का अनुक्रम सबसे निचले स्थान से क्रमशः सब-लेफ्टिनेंट, लेफ्टिनेंट, लेफ्टिनेंट कमांडर और फिर कमांडर होता है।"
    },
    "af-5": {
      english: "The Agniveer recruitment under Agnipath scheme is a tour of duty style enrollment for a duration of 4 years.",
      hindi: "अग्निपथ योजना के तहत अग्निवीर भर्ती 4 वर्ष की अवधि के लिए 'टूर ऑफ ड्यूटी' प्रणाली है।"
    },
    "navy-1": {
      english: "Chhatrapati Shivaji Maharaj, the Maratha emperor, is considered the Father of the Indian Navy due to his visionary creation of a formidable coastal naval fleet to combat foreign invaders.",
      hindi: "मराठा सम्राट छत्रपति शिवाजी महाराज को विदेशी आक्रांताओं के मुकाबले के लिए मजबूत तटीय नौसैनिक बेड़े के निर्माण के कारण भारतीय नौसेना का जनक माना जाता है।"
    },
    "navy-2": {
      english: "INS Vikrant (IAC-1) is the first aircraft carrier designed by the Warship Design Bureau of the Indian Navy and constructed by Cochin Shipyard.",
      hindi: "INS विक्रांत (IAC-1) भारत में स्वदेशी रूप से डिजाइन और निर्मित होने वाला पहला विमानवाहक पोत है, जिसे कोचीन शिपयार्ड ने बनाया है।"
    },
    "navy-3": {
      english: "The Southern Naval Command of the Indian Navy is headquartered at Kochi, Kerala.",
      hindi: "भारतीय नौसेना की दक्षिणी नौसैनिक कमान का मुख्य कार्यालय कोच्चि, केरल में स्थित है।"
    },
    "af-tech-1": {
      english: "Marshal of the Indian Air Force Arjan Singh DFC was the first five-star rank officer and the only Marshal of the IAF.",
      hindi: "मार्शल ऑफ द इंडियन एयर फोर्स अर्जन सिंह भारतीय वायुसेना के एकमात्र पांच-सितारा अधिकारी और मार्शल थे।"
    },
    "af-tech-2": {
      english: "India purchased the Rafale multi-role combat fighter aircraft from Dassault Aviation of France.",
      hindi: "भारत ने फ्रांस के डसॉल्ट एविऐशन से अत्याधुनिक राफेल मल्टीरोल लड़ाकू विमान खरीदे हैं।"
    },
    "polity-1": {
      english: "Dr. Bhimrao Ramji Ambedkar served as the chairman of the Drafting Committee which prepared the Constitution of India.",
      hindi: "डॉ. भीमराव रामजी आंबेडकर ने भारतीय संविधान का मसौदा तैयार करने वाली प्रारूप समिति के अध्यक्ष के रूप में कार्य किया।"
    },
    "polity-2": {
      english: "Articles 14 to 18 of the Constitution of India guarantee the Right to Equality as a fundamental right.",
      hindi: "भारतीय संविधान के अनुच्छेद 14 से 18 संपूर्ण नागरिकों को समानता के मौलिक अधिकार की गारंटी प्रदान करते हैं।"
    },
    "polity-3": {
      english: "Originally, there were 8 schedules. Currently, the Constitution of India has 12 schedules after various amendments.",
      hindi: "मूल संविधान में 8 अनुसूचियां थीं। विभिन्न संवैधानिक संशोधनों के उपरांत वर्तमान में 12 अनुसूचियां हैं।"
    },
    "ca-1": {
      english: "The 20th G20 summit was hosted by South Africa in late 2025 as the presidency rotated, continuing diplomatic cooperation.",
      hindi: "20वें जी-20 शिखर सम्मेलन की मेजबानी 2025 के अंत में दक्षिण अफ्रीका द्वारा की गई क्योंकि अध्यक्षता घूमती रही।"
    },
    "ca-2": {
      english: "The K9 Vajra-T tracked self-propelled Howitzer gun system is manufactured by Larsen & Toubro in India with Korean technology transfer.",
      hindi: "K9 वज्र-T स्व-चालित होवित्जर तोप प्रणाली का निर्माण भारत में लार्सन एंड टुब्रो द्वारा कोरियाई तकनीकी हस्तांतरण के साथ किया जाता है।"
    },
    "ssc-gd-1": {
      english: "Chandragupta Maurya established the Maurya Empire in 322 BCE after defeating Dhanananda.",
      hindi: "चन्द्रगुप्त मौर्य ने 322 ईसा पूर्व में धनानंद को पराजित कर महान मौर्य साम्राज्य की स्थापना की थी।"
    },
    "ssc-gd-2": {
      english: "Article 17 of the Constitution of India abolishes 'untouchability' and forbids its practice.",
      hindi: "भारतीय संविधान का अनुच्छेद 17 अस्पृश्यता (छुआछूत) का पूर्ण उन्मूलन करता है और इसका आचरण निषिद्ध करता है।"
    },
    "ssc-gd-3": {
      english: "The capital of India was shifted from Calcutta to Delhi in 1911 during the Delhi Durbar.",
      hindi: "वर्ष 1911 में दिल्ली दरबार के आयोजन के दौरान भारत की राजधानी को कलकत्ता से दिल्ली स्थानांतरित किया गया था।"
    },
    "ssc-gd-4": {
      english: "The antonym of 'Sankshipt' (brief) is 'Vistrit' (detailed).",
      hindi: "हिंदी व्याकरण के अनुसार शब्द 'संक्षिप्त' का सही विलोम शब्द 'विस्तृत' होता है।"
    },
    "rrb-1": {
      english: "Shree Siddharoodha Swamiji Hubballi Station platform in Karnataka is the longest in the world (1507m).",
      hindi: "कर्नाटक के हुबली में स्थित श्री सिद्धारूढ़ स्वामीजी हुबली रेलवे स्टेशन का प्लेटफॉर्म वर्तमान में विश्व का सबसे लंबा (1507 मीटर) प्लेटफॉर्म है।"
    },
    "rrb-2": {
      english: "The first passenger train ran on April 16, 1853, covering 34 km with 400 passengers.",
      hindi: "भारत की प्रथम यात्री रेलगाड़ी 16 अप्रैल 1853 को मुंबई से ठाणे के बीच 34 किलोमीटर की दूरी पर चलाई गई थी।"
    },
    "up-ex-1": {
      english: "The holy confluence (Triveni Sangam) at Prayagraj is formed by the Ganga, Yamuna, and mythical Saraswati.",
      hindi: "प्रयागराज में स्थित पवित्र त्रिवेणी संगम गंगा, यमुना और अदृश्य/पौराणिक सरस्वती नदी के मिलन से बनता है।"
    },
    "up-ex-2": {
      english: "Since the face is compared to the Moon (Moon-like face), it is a Karmadharaya Samas.",
      hindi: "मुख की तुलना चंद्रमा से की जाने के कारण (चंद्रमा के समान मुख), इसमें कर्मधारय समास प्रयुक्त हुआ है।"
    },
    "bank-1": {
      english: "The Reserve Bank of India (RBI) has sole authority to control currency supply and govern monetary policies.",
      hindi: "भारतीय रिजर्व बैंक (RBI) देश की मुद्रा आपूर्ति को नियंत्रित करने तथा देश की मौद्रिक नीति निर्धारित करने का सर्वोच्च बैंक है।"
    },
    "bank-2": {
      english: "An asset becomes non-performing when it ceases to generate income for the bank, typically past due for 90 days.",
      hindi: "कोई परिसंपत्ति तब गैर-निष्पादित (NPA) श्रेणी में आती है जब वह बैंक के लिए ब्याज या आय उत्पन्न करना बंद कर देती है, जो सामान्यतः 90 दिनों तक बकाया रहने पर होता है।"
    },
    "civils-1": {
      english: "The Bill of Rights of the United States Constitution inspired the Drafting Committee to implement Part III Fundamental Rights.",
      hindi: "संयुक्त राज्य अमेरिका (USA) के संविधान के 'बिल ऑफ राइट्स' ने भारतीय संविधान के भाग III में मौलिक अधिकारों को शामिल करने की प्रेरणा दी।"
    },
    "civils-2": {
      english: "Raja Ram Mohan Roy founded Brahmo Samaj in Calcutta in 1828 to fight social evils like Sati.",
      hindi: "राजा राम मोहन राय ने सती प्रथा जैसी कुरीतियों के विरुद्ध सामाजिक जागृति के लिए वर्ष 1828 में कलकत्ता में 'ब्रह्म समाज' की स्थापना की थी।"
    },
    "bihar-p-1": {
      english: "Kosi is known as Sorrow of Bihar because its frequent course changes cause extreme seasonal floods.",
      hindi: "कोसी नदी को अपना मार्ग बदलने तथा अत्यधिक बाढ़ के प्रकोप के कारण 'बिहार का शोक' कहा जाता है।"
    }
  };

  if (q.id && mockExpls[q.id]) {
    return mockExpls[q.id];
  }

  return {
    english: q.explanation || "Correct choice validated by the official Armed Services education guidelines.",
    hindi: "आधिकारिक सशस्त्र सेना शिक्षा परीक्षा दिशानिर्देशों द्वारा सविस्तार सत्यापित सही विकल्प।"
  };
};

const GENUINE_PYQ_QUIZ: Quiz = {
  id: "army-pyq-bilingual-model",
  title: "Agniveer Army GD Genuine Previous Year Paper (Bilingual)",
  category: "Previous Year Paper",
  questions: ARMY_PREV_QUESTIONS.map((q, idx) => {
    const correctIdx = q.options.findIndex(o => o.isCorrect);
    return {
      id: `pyq-question-${idx}`,
      text: q.englishQ,
      options: q.options.map(o => o.text),
      correctAnswer: correctIdx === -1 ? 0 : correctIdx,
      explanation: q.explanationEng || "Comprehensive previous year solved paper explanation.",
      category: "Previous Year Paper"
    };
  }),
  difficulty: "Medium",
  iconName: "Shield",
  timeLimit: 600
};

const COMBINED_QUIZZES = [GENUINE_PYQ_QUIZ, ...MOCK_QUIZZES];

interface QuizEngineProps {
  userBookmarks: string[];
  userName?: string;
  selectedQuizId?: string | null;
}

const props = withDefaults(defineProps<QuizEngineProps>(), {
  userName: "Aspirant"
});

const emit = defineEmits<{
  (e: 'quizCompleted', historyItem: QuizHistoryItem, cert?: UserCertificate): void;
  (e: 'toggleBookmark', questionId: string): void;
  (e: 'selectQuiz', quizId: string | null): void;
}>();

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const selectedQuiz = ref<Quiz | null>(null);
const difficultyFilter = ref<"All" | "Easy" | "Medium" | "Hard">("All");

// Active test playing states
const isPlaying = ref(false);
const currentQuestionIndex = ref(0);
const selectedAnswers = ref<Record<string, number>>({});
const timeRemaining = ref(0);
const timerActive = ref(false);
let timerInterval: any = null;

// Results screen states
const showResults = ref(false);
const resultsData = ref<{
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  scorePercentage: number;
  timeTakenStr: string;
  suggestedTopics: string[];
  performanceTier: string;
} | null>(null);

// Confetti state for real result celebration
const confetti = ref<{ id: number; left: number; color: string; duration: number; delay: number }[]>([]);

// Certificate generation states
const certIssuedName = ref(props.userName);
const issuedCertificate = ref<UserCertificate | null>(null);
const activeTabSub = ref<"summary" | "review">("summary");

watch(() => props.userName, (newVal) => {
  certIssuedName.value = newVal;
});

watch(() => props.selectedQuizId, (newId) => {
  if (newId) {
    const match = COMBINED_QUIZZES.find(q => q.id === newId || toSlug(q.title) === newId);
    if (match) {
      if (!selectedQuiz.value || selectedQuiz.value.id !== match.id) {
        selectedQuiz.value = match;
        currentQuestionIndex.value = 0;
        selectedAnswers.value = {};
        timeRemaining.value = match.timeLimit;
        isPlaying.value = true;
        showResults.value = false;
        resultsData.value = null;
        issuedCertificate.value = null;
        timerActive.value = true;
        startTimer();
      }
    }
  } else {
    if (selectedQuiz.value) {
      selectedQuiz.value = null;
      isPlaying.value = false;
      showResults.value = false;
    }
  }
}, { immediate: true });

const filteredQuizzes = () => {
  return COMBINED_QUIZZES.filter(quiz => {
    if (difficultyFilter.value === "All") return true;
    return quiz.difficulty === difficultyFilter.value;
  });
};

const handleStartQuiz = (quiz: Quiz) => {
  selectedQuiz.value = quiz;
  currentQuestionIndex.value = 0;
  selectedAnswers.value = {};
  timeRemaining.value = quiz.timeLimit;
  isPlaying.value = true;
  showResults.value = false;
  resultsData.value = null;
  issuedCertificate.value = null;
  timerActive.value = true;
  startTimer();
  emit('selectQuiz', toSlug(quiz.title));
};

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timerActive.value && isPlaying.value && timeRemaining.value > 0) {
      timeRemaining.value--;
      if (timeRemaining.value <= 0) {
        clearInterval(timerInterval);
        handleAutoSubmit();
      }
    }
  }, 1000);
};

const handleAutoSubmit = () => {
  alert("Time has elapsed! Your answers are being submitted automatically.");
  submitQuiz();
};

const submitQuiz = () => {
  if (!selectedQuiz.value) return;
  timerActive.value = false;
  if (timerInterval) clearInterval(timerInterval);

  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const suggestedTopics: string[] = [];

  selectedQuiz.value.questions.forEach((q) => {
    const ans = selectedAnswers.value[q.id];
    if (ans === undefined) {
      skipped++;
      suggestedTopics.push(q.text.includes("Article") ? "Indian Polity Duties" : "Armed Forces Static GK");
    } else if (ans === q.correctAnswer) {
      correct++;
    } else {
      wrong++;
      suggestedTopics.push(q.text.split("?")[0]);
    }
  });

  const total = selectedQuiz.value.questions.length;
  const scorePercentage = Math.round((correct / total) * 100);
  const timeSpentSecs = selectedQuiz.value.timeLimit - timeRemaining.value;
  const mins = Math.floor(timeSpentSecs / 60);
  const secs = timeSpentSecs % 60;
  const timeTakenStr = `${mins}m ${secs}s`;

  let performanceTier = "Agniveer Cadet";
  if (scorePercentage >= 90) performanceTier = "Param Vir Champion";
  else if (scorePercentage >= 75) performanceTier = "Captain Commander";
  else if (scorePercentage >= 50) performanceTier = "Duty Sergeant";

  const uniqueSuggested = Array.from(new Set(suggestedTopics)).slice(0, 3);
  if (uniqueSuggested.length === 0) {
    uniqueSuggested.push("Maintain current mock streak - Join National top list!");
  }

  resultsData.value = {
    correctCount: correct,
    wrongCount: wrong,
    skippedCount: skipped,
    scorePercentage,
    timeTakenStr,
    suggestedTopics: uniqueSuggested,
    performanceTier
  };

  const historyItem: QuizHistoryItem = {
    quizId: selectedQuiz.value.id,
    quizTitle: selectedQuiz.value.title,
    scorePercentage,
    correctAnswers: correct,
    totalQuestions: total,
    timeTaken: timeTakenStr,
    date: new Date().toLocaleDateString()
  };

  emit('quizCompleted', historyItem);
  showResults.value = true;
  isPlaying.value = false;

  // Fire celebration confetti elements for background
  const list = Array.from({ length: 50 }).map((_, idx) => {
    const colors = ["#FF9933", "#FFFFFF", "#138808", "#FFD700", "#000080", "#2563EB", "#10B981"];
    return {
      id: idx,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2.5
    };
  });
  confetti.value = list;

  // Trigger high engagement canvas-confetti particle engine
  if (scorePercentage >= 50) {
    if (scorePercentage >= 75) {
      // Grand high score celebration (continuous canon side bursts)
      const duration = 3.5 * 1000;
      const end = Date.now() + duration;
      
      const celebrativeInterval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(celebrativeInterval);
          return;
        }
        
        // Left side cannon
        canvasConfetti({
          particleCount: 25,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: ["#FF9933", "#FFFFFF", "#138808", "#FFD700", "#000080"]
        });
        
        // Right side cannon
        canvasConfetti({
          particleCount: 25,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: ["#FF9933", "#FFFFFF", "#138808", "#FFD700", "#000080"]
        });
      }, 250);
    } else {
      // Standard passing score celebration
      canvasConfetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FF9933", "#FFFFFF", "#138808", "#FFD700", "#000080"]
      });
    }
  }
};

const issueCertificate = () => {
  if (!selectedQuiz.value || !resultsData.value) return;
  const newCert: UserCertificate = {
    id: "CERT-" + Math.floor(100000 + Math.random() * 900000),
    userName: certIssuedName.value.trim() || "Brave Indian Aspirant",
    quizTitle: selectedQuiz.value.title,
    scorePercentage: resultsData.value.scorePercentage,
    date: new Date().toLocaleDateString()
  };
  issuedCertificate.value = newCert;

  const dummyHistoryItem: QuizHistoryItem = {
    quizId: selectedQuiz.value.id,
    quizTitle: selectedQuiz.value.title,
    scorePercentage: resultsData.value.scorePercentage,
    correctAnswers: resultsData.value.correctCount,
    totalQuestions: selectedQuiz.value.questions.length,
    timeTaken: resultsData.value.timeTakenStr,
    date: new Date().toLocaleDateString()
  };
  emit('quizCompleted', dummyHistoryItem, newCert);
};

const handleOptionSelect = (questionId: string, optionIdx: number) => {
  selectedAnswers.value = { ...selectedAnswers.value, [questionId]: optionIdx };
};

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<template>
  <div class="space-y-6" id="quiz-engine-viewport">
    
    <!-- SECTION 1: QUIZ SELECTOR VIEW -->
    <div v-if="!isPlaying && !showResults" class="space-y-6 text-left" id="quiz-list-selector">
      <!-- Header & filters -->
      <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933]">
        <h1 class="text-2xl font-black text-gray-900 flex items-center">
          <Award class="h-7 w-7 mr-2 text-[#000080]" />
          Official GK and Army Mock Test Portal
        </h1>
        <p class="text-sm text-gray-600 mt-1 leading-relaxed">
          Achieve strategic readiness by practicing timed mock templates built selectively for Agniveer recruitment, Navy entries, NDA/CDS boards, and national polity challenges.
        </p>

        <!-- Difficulty Filter Switcher -->
        <div class="flex flex-wrap items-center gap-2 mt-6" id="difficulty-filter-row">
          <span class="text-xs font-bold text-gray-500 uppercase">Difficulty level:</span>
          <button
            v-for="diff in ['All', 'Easy', 'Medium', 'Hard']"
            :key="diff"
            :id="`filter-diff-${diff}`"
            @click="difficultyFilter = (diff as any)"
            :class="[
              'text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer',
              difficultyFilter === diff
                ? 'bg-[#000080] text-white border-[#000080]'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            ]"
          >
            {{ diff === "All" ? "⭐ All Levels" : diff }}
          </button>
        </div>
      </div>

      <!-- Grid of Available Quizzes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="available-quizzes-grid">
        <div 
          v-for="quiz in filteredQuizzes()" 
          :key="quiz.id" 
          :id="`quiz-card-${quiz.id}`"
          class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group flex flex-col justify-between text-left"
        >
          <!-- Decorative background national stripes -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF9933]/10 via-transparent to-[#138808]/10 rounded-bl-full pointer-events-none" />
          
          <div class="space-y-4">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-black tracking-wider uppercase bg-[#FF9933]/15 text-[#aa4400] px-2.5 py-1 rounded">
                {{ quiz.category }}
              </span>
              <span :class="[
                'text-[10px] uppercase font-bold px-2 py-0.5 rounded border',
                quiz.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                quiz.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-red-50 text-red-700 border-red-200'
              ]">
                {{ quiz.difficulty }}
              </span>
            </div>

            <h3 class="text-lg font-black text-gray-900 group-hover:text-[#000080] transition-colors">
              {{ quiz.title }}
            </h3>

            <!-- Metas -->
            <div class="grid grid-cols-2 gap-4 text-xs font-mono text-gray-600 bg-gray-50 p-3 rounded-lg">
              <div class="flex items-center space-x-1">
                <FileText class="h-4 w-4 text-[#000080]" />
                <span>{{ quiz.questions.length }} Objective Qs</span>
              </div>
              <div class="flex items-center space-x-1">
                <Clock class="h-4 w-4 text-[#000080]" />
                <span>{{ quiz.timeLimit }} Seconds</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-2 border-t border-gray-100/60 flex items-center justify-between">
            <span class="text-[10px] font-bold text-gray-500 italic">⭐ Certified Scorecard Included</span>
            <button
              :id="`btn-start-quiz-${quiz.id}`"
              @click="handleStartQuiz(quiz)"
              class="bg-[#138808] hover:bg-[#117706] text-white px-4 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-colors flex items-center space-x-1 shadow-md cursor-pointer"
            >
              <span>Start Test</span>
              <Play class="h-3 w-3 fill-white" />
            </button>
          </div>
        </div>

        <div v-if="filteredQuizzes().length === 0" class="col-span-1 md:col-span-2 text-center p-12 bg-gray-50 rounded-xl" id="no-quizzes-found">
          <AlertCircle class="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <h4 class="font-bold text-gray-700">No mock tests found for this filter</h4>
          <p class="text-xs text-gray-500 mt-1">Try switching back to some of our general categories.</p>
        </div>
      </div>
    </div>

    <!-- SECTION 2: ACTIVE RECRUITMENT GAME INTERACTIVE VIEW -->
    <div v-if="isPlaying && selectedQuiz" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="active-quiz-board">
      
      <!-- Main Questions Slate -->
      <div class="lg:col-span-2 bg-white rounded-[2rem] shadow-xl border border-slate-200/90 relative overflow-hidden flex flex-col justify-between min-h-[520px]" id="quiz-question-container">
        <!-- Top tricolor bar accent -->
        <div class="absolute top-0 left-0 right-0 h-1.5 flex z-10">
          <div class="w-[33%] bg-[#FF9933]" />
          <div class="w-[34%] bg-white" />
          <div class="w-[33%] bg-[#138808]" />
        </div>

        <div>
          <!-- Internal header banner -->
          <div class="p-6 sm:p-8 pb-4 flex justify-between items-start text-left">
            <div class="space-y-1">
              <div class="flex items-center space-x-1">
                <Flame class="h-4 w-4 text-[#FF9933] fill-[#FF9933] animate-pulse" />
                <span class="text-[10px] sm:text-xs font-black tracking-widest text-[#FF9933] uppercase font-mono">
                  PREVIOUS PAPER QUIZ
                </span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight leading-snug">
                {{ selectedQuiz.title }}
              </h3>
            </div>

            <div class="shrink-0 text-amber-500 hover:text-amber-600 transition-colors cursor-pointer p-1">
              <Bookmark class="h-7 w-7 fill-amber-500/10 text-amber-500 stroke-[1.5]" />
            </div>
          </div>

          <!-- Bilingual Status -->
          <div class="px-6 sm:px-8 flex justify-between items-center pb-2.5" id="bilingual-quiz-meta-row">
            <div class="bg-[#000080]/5 text-[#000080] text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg border border-[#000080]/10 flex items-center shadow-sm select-none">
              <span class="mr-1 text-slate-500 font-bold">BILINGUAL</span>
              <span class="text-slate-300 mx-1">/</span>
              <span class="text-[#FF9933] font-black">हिंदी</span>
              <span class="mx-1 text-slate-300">+</span>
              <span class="text-[#138808] font-black">ENG</span>
            </div>
            <div class="flex items-center space-x-2.5">
              <span class="text-xs sm:text-sm font-bold text-gray-500 font-mono">
                Q. {{ currentQuestionIndex + 1 }} of {{ selectedQuiz.questions.length }}
              </span>
              <!-- Clock Indicator -->
              <div class="flex items-center space-x-1 bg-amber-50/80 text-amber-800 px-2 mt-0.5 py-1 rounded-md border border-amber-200 font-mono text-[11px] font-black shadow-sm select-none">
                <Clock class="h-3.5 w-3.5 animate-spin text-amber-600" />
                <span>{{ timeRemaining }}s</span>
              </div>
            </div>
          </div>

          <!-- Progress bar & Questions Left Tracker -->
          <div class="px-6 sm:px-8 space-y-1.5" id="quiz-progress-tracker-box">
            <!-- Progress Bar -->
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/40 relative">
              <div 
                class="h-full bg-gradient-to-r from-[#FF9933] via-yellow-400 to-[#138808] rounded-full transition-all duration-300 relative animate-pulse"
                :style="{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }"
              >
                <!-- subtle shine pulse overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
            
            <!-- Progress Details Sub-row specifying questions left -->
            <div class="flex items-center justify-between text-[11px] font-sans font-bold text-slate-500">
              <span class="flex items-center space-x-1 select-none">
                <span class="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  📊 Progress: {{ Math.round(((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100) }}% Completed
                </span>
              </span>
              
              <span 
                v-if="selectedQuiz.questions.length - (currentQuestionIndex + 1) > 0" 
                class="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded flex items-center space-x-1 shadow-sm font-mono text-[10.5px] uppercase tracking-wider font-extrabold"
              >
                <span class="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping mr-0.5" />
                <span>⏳ {{ selectedQuiz.questions.length - (currentQuestionIndex + 1) }} Questions Left / {{ selectedQuiz.questions.length - (currentQuestionIndex + 1) }} प्रश्न शेष</span>
              </span>
              <span 
                v-else
                class="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded flex items-center space-x-1 shadow-sm font-mono text-[10.5px] uppercase tracking-wider font-extrabold"
              >
                <span>🏁 Last Question! / अंतिम प्रश्न</span>
              </span>
            </div>
          </div>

          <!-- Question description -->
          <div class="p-6 sm:p-8 space-y-6">
            <div class="bg-slate-50/45 rounded-2xl border border-slate-300 p-5 sm:p-6 text-left space-y-4 shadow-sm" id="question-text-box">
              <p class="text-slate-900 text-sm sm:text-base font-extrabold leading-snug">
                <span class="text-[#FF9933] font-black mr-1.5 font-mono">Q{{ currentQuestionIndex + 1 }}.</span>
                {{ getBilingualQuestion(selectedQuiz.questions[currentQuestionIndex].text).english }}
              </p>

              <div v-if="getBilingualQuestion(selectedQuiz.questions[currentQuestionIndex].text).hindi" class="border-t border-dashed border-slate-300/80" />

              <div v-if="getBilingualQuestion(selectedQuiz.questions[currentQuestionIndex].text).hindi" class="flex items-start">
                <span class="text-[#138808] font-black font-mono text-[10px] mr-2 px-1.5 py-0.5 rounded bg-[#138808]/10 select-none shrink-0" style="margin-top: 2px;">IN</span>
                <p class="text-[#138808] text-xs sm:text-sm font-extrabold leading-relaxed">
                  {{ getBilingualQuestion(selectedQuiz.questions[currentQuestionIndex].text).hindi }}
                </p>
              </div>
            </div>

            <!-- Bookmark -->
            <div class="flex justify-end items-center px-1">
              <button
                :id="`bookmark-btn-${selectedQuiz.questions[currentQuestionIndex].id}`"
                @click="emit('toggleBookmark', selectedQuiz.questions[currentQuestionIndex].id)"
                class="flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-[#000080] transition-colors cursor-pointer"
              >
                <Bookmark 
                  :class="[
                    'h-4 w-4 transition-colors',
                    props.userBookmarks.includes(selectedQuiz.questions[currentQuestionIndex].id)
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-gray-400'
                  ]" 
                />
                <span>
                  {{ props.userBookmarks.includes(selectedQuiz.questions[currentQuestionIndex].id) ? "Bookmarked!" : "Bookmark" }}
                </span>
              </button>
            </div>

            <!-- Options answers -->
            <div class="space-y-3.5" id="quiz-question-options">
              <button
                v-for="(option, idx) in selectedQuiz.questions[currentQuestionIndex].options"
                :key="idx"
                :id="`option-${idx}`"
                :disabled="selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] !== undefined"
                @click="handleOptionSelect(selectedQuiz.questions[currentQuestionIndex].id, idx)"
                :class="[
                  'w-full text-left py-3.5 px-5 rounded-[1.25rem] border transition-all duration-150 text-xs sm:text-[14px] cursor-pointer',
                  selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] !== undefined 
                    ? (idx === selectedQuiz.questions[currentQuestionIndex].correctAnswer 
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 font-extrabold ring-2 ring-emerald-400/20' 
                      : (selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === idx 
                        ? 'border-red-500 bg-red-50/50 text-red-800 font-extrabold ring-2 ring-red-400/20' 
                        : 'bg-slate-50 border-slate-200/50 text-slate-400 opacity-60'))
                    : (selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === idx 
                      ? 'border-[#000080] bg-[#000080]/5 text-slate-900 font-extrabold ring-2 ring-[#000080]/15'
                      : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold')
                ]"
              >
                <div class="flex items-center justify-between w-full">
                  <span>{{ getBilingualOption(selectedQuiz.questions[currentQuestionIndex].text, option) }}</span>
                  <template v-if="selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] !== undefined">
                    <span v-if="idx === selectedQuiz.questions[currentQuestionIndex].correctAnswer" class="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full font-mono uppercase" style="padding: 2px 8px;">
                      Correct ✓
                    </span>
                    <span v-else-if="selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === idx" class="text-[10px] bg-red-100 text-red-800 font-black px-2 py-0.5 rounded-full font-mono uppercase" style="padding: 2px 8px;">
                      Incorrect ✗
                    </span>
                  </template>
                </div>
              </button>
            </div>

            <!-- Explanations card -->
            <div 
              v-if="selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] !== undefined"
              class="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl text-left space-y-3.5 text-xs animate-fade-in shadow-inner" 
              id="explanation-box"
            >
              <div class="flex items-center space-x-2 font-black text-amber-950 uppercase tracking-widest border-b border-amber-200/40 pb-2">
                <Flame class="h-4 w-4 text-[#FF9933] animate-pulse" />
                <span>EXPLANATION / विश्लेषण</span>
              </div>
              <div class="space-y-2 text-slate-705 leading-relaxed">
                <p class="font-semibold text-[12px] sm:text-[13px] text-slate-800">
                  <span class="text-amber-800 font-extrabold mr-1 font-mono uppercase">English Explanation:</span>
                  {{ getBilingualExplanation(selectedQuiz.questions[currentQuestionIndex]).english }}
                </p>
                <div class="border-t border-dashed border-amber-200/60" />
                <p class="font-semibold text-[12px] sm:text-[13px] text-[#138808]">
                  <span class="text-[#138808] font-extrabold mr-1">हिन्दी व्याख्या:</span>
                  {{ getBilingualExplanation(selectedQuiz.questions[currentQuestionIndex]).hindi }}
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Questions board footer -->
        <div class="bg-slate-50/70 px-6 py-5 border-t border-slate-200/60 rounded-b-[2rem] flex items-center justify-between">
          <button
            id="btn-prev-question"
            :disabled="currentQuestionIndex === 0"
            @click="currentQuestionIndex--"
            class="flex items-center space-x-1.5 px-4.5 py-2.5 border border-slate-300/80 rounded-xl text-xs font-black text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
          >
            <ArrowLeft class="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            v-if="currentQuestionIndex < selectedQuiz.questions.length - 1"
            id="btn-next-question"
            @click="currentQuestionIndex++"
            class="bg-[#0f172a] hover:bg-slate-900 text-white flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Next</span>
            <ArrowRight class="h-4 w-4" />
          </button>
          <button
            v-else
            id="btn-submit-exam"
            @click="submitQuiz"
            class="bg-[#138808] hover:bg-[#117706] text-white flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md animate-pulse cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Finish & View Result</span>
            <Award class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Sidebar Question Map tracker -->
      <div class="space-y-6 text-left" id="quiz-question-map-pane">
        <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
          <h4 class="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4 uppercase tracking-wide">
            Question Tracker Map
          </h4>

          <div class="grid grid-cols-4 sm:grid-cols-5 gap-2" id="grid-question-quick-hop">
            <button
              v-for="(q, idx) in selectedQuiz.questions"
              :key="q.id"
              :id="`hop-btn-${idx}`"
              @click="currentQuestionIndex = idx"
              :class="[
                'relative aspect-square rounded-lg font-bold text-xs flex flex-col items-center justify-center border-2 transition-all cursor-pointer',
                idx === currentQuestionIndex ? 'border-[#FF9933] ring-1 ring-[#FF9933]' : 'border-transparent',
                selectedAnswers[q.id] !== undefined 
                  ? 'bg-[#138808] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <span>{{ idx + 1 }}</span>
              <span v-if="props.userBookmarks.includes(q.id)" class="absolute -top-1 -right-1 bg-yellow-400 border border-white text-black p-0.5 rounded-full scale-75">
                <Bookmark class="h-2 w-2 fill-current" />
              </span>
            </button>
          </div>

          <!-- Indicators legend -->
          <div class="mt-6 pt-4 border-t border-gray-100 space-y-2 text-[10px] font-mono text-gray-500">
            <div class="flex items-center space-x-2">
              <span class="h-3.5 w-3.5 rounded bg-[#138808]" />
              <span>Answered Standard Options</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="h-3.5 w-3.5 rounded bg-gray-100 border border-gray-300" />
              <span>Unanswered Items</span>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start space-x-3 text-xs text-amber-800">
          <AlertCircle class="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p class="font-bold">Important Instructions:</p>
            <p class="mt-1 leading-relaxed">
              Avoid exiting or clearing your browser cache during active mock drills. Unsaved questions cannot be verified afterward. If the timer expires, current progress submits immediately.
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- SECTION 3: EXAM PERFORMANCE RESULTS VIEW -->
    <div v-if="showResults && selectedQuiz && resultsData" class="space-y-6 animate-fade-in relative" id="quiz-results-dashboard">
      
      <!-- Dynamic celebration confetti falling with absolute positioning -->
      <div 
        v-for="c in confetti" 
        :key="c.id" 
        :style="{
          left: `${c.left}%`,
          backgroundColor: c.color,
          animationDuration: `${c.duration}s`,
          animationDelay: `${c.delay}s`,
          width: `${6 + Math.random() * 8}px`,
          height: `${12 + Math.random() * 10}px`,
          top: '-40px'
        }"
        class="fixed rounded-sm opacity-90 pointer-events-none z-[100] animate-bounce"
        style="animation-name: confettiFall; animation-timing-function: linear; animation-iteration-count: infinite; height: 10px; width: 10px;"
      />

      <!-- Congratulations & Celebration Banner -->
      <div class="bg-gradient-to-r from-slate-900 via-[#000080] to-slate-900 rounded-[2.5rem] p-6 sm:p-10 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800" id="celebrate-congrats-card">
        <div class="absolute inset-0 opacity-10 pointer-events-none flex flex-col justify-between">
          <div class="h-[33%] bg-[#FF9933]" />
          <div class="h-[34%] bg-white" />
          <div class="h-[33%] bg-[#138808]" />
        </div>
        
        <div class="relative z-10 flex flex-col items-center space-y-5">
          <div class="inline-flex justify-center items-center w-20 h-20 bg-amber-500/10 text-amber-400 rounded-full border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-bounce text-4xl">
            🏆
          </div>
          
          <div class="space-y-1.5">
            <span class="text-[10px] sm:text-xs font-black tracking-widest text-[#FF9933] uppercase font-mono bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
              🇮🇳 जय हिन्द ! GRAND CONGRATULATIONS
            </span>
            <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              CEE Soldier Merit Achievement!
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 font-bold max-w-xl mx-auto leading-relaxed">
              Excellent completion! You practiced the official simulated paper of <span class="text-yellow-400 font-extrabold">{{ selectedQuiz.title }}</span> showing outstanding diligence!
            </p>
          </div>

          <!-- Dynamic badges -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
            <div class="bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-amber-300 shadow-md">
              <span>🎖️ MERIT TITLE:</span>
              <span class="text-white font-black uppercase font-mono">{{ resultsData.performanceTier }}</span>
            </div>
            <div class="bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#FF9933] shadow-md">
              <span>🎯 ACCURACY:</span>
              <span class="text-white font-black font-mono">{{ resultsData.scorePercentage }}%</span>
            </div>
            <div class="bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#138808] shadow-md">
              <span>✅ CORRECT ANSWERS:</span>
              <span class="text-white font-black font-mono">{{ resultsData.correctCount }} / {{ selectedQuiz.questions.length }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sub-tabs header for review -->
      <div class="flex space-x-2 bg-gray-100 p-1.5 rounded-lg border max-w-xs">
        <button
          @click="activeTabSub = 'summary'"
          :class="[
            'flex-1 text-xs font-bold py-1.5 rounded-md transition-all cursor-pointer',
            activeTabSub === 'summary' ? 'bg-white text-[#000080] shadow' : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Summary Analysis
        </button>
        <button
          @click="activeTabSub = 'review'"
          :class="[
            'flex-1 text-xs font-bold py-1.5 rounded-md transition-all cursor-pointer',
            activeTabSub === 'review' ? 'bg-white text-[#000080] shadow' : 'text-gray-600 hover:text-gray-900'
          ]"
        >
          Answer Explanations
        </button>
      </div>

      <div v-if="activeTabSub === 'summary'" class="grid grid-cols-1 lg:grid-cols-3 gap-6" id="tab-summary-viewport">
        <!-- Analytics & Performance Block -->
        <div class="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6 text-left">
          <div class="border-b border-gray-100 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 p-4 rounded-xl">
            <div>
              <span class="text-xs font-black tracking-widest text-[#FF9933] uppercase">AgniPariksha Assessment</span>
              <h2 class="text-xl font-black text-gray-900 mt-1">Practice Complete!</h2>
            </div>
            <span class="mt-3 sm:mt-0 font-mono text-[10px] font-bold uppercase bg-gray-200 px-3 py-1 rounded text-gray-700">
              ID: {{ selectedQuiz.id }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            
            <div class="text-center bg-gradient-to-tr from-gray-50 to-gray-100/30 p-4 rounded-full aspect-square flex flex-col items-center justify-center max-w-[170px] mx-auto border-4 border-[#000080]" id="percentage-visual-ring">
              <span class="text-4xl font-black text-[#000080]">{{ resultsData.scorePercentage }}%</span>
              <span class="text-[10px] font-black text-[#138808] uppercase tracking-wider mt-1 text-center">Overall Score</span>
            </div>

            <div class="sm:col-span-2 space-y-3" id="scorecard-breakdown-details text-left">
              <h4 class="font-sans font-bold text-sm text-gray-700">Performance Metrics for {{ certIssuedName }}:</h4>
              
              <div class="grid grid-cols-2 gap-3" id="metrics-grid">
                <div class="bg-green-50/50 p-2.5 rounded-lg border border-green-100 flex items-center space-x-2">
                  <CheckCircle class="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p class="text-[10px] uppercase font-bold text-gray-500 font-mono">Correct</p>
                    <p class="font-black text-green-700 text-sm">{{ resultsData.correctCount }} / {{ selectedQuiz.questions.length }}</p>
                  </div>
                </div>

                <div class="bg-red-50/50 p-2.5 rounded-lg border border-red-100 flex items-center space-x-2">
                  <XCircle class="h-5 w-5 text-red-600 shrink-0" />
                  <div>
                    <p class="text-[10px] uppercase font-bold text-gray-500 font-mono">Incorrect</p>
                    <p class="font-black text-red-700 text-sm">{{ resultsData.wrongCount }}</p>
                  </div>
                </div>

                <div class="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center space-x-2">
                  <Clock class="h-5 w-5 text-gray-600 shrink-0" />
                  <div>
                    <p class="text-[10px] uppercase font-bold text-gray-500 font-mono">Time Spent</p>
                    <p class="font-black text-gray-700 text-sm">{{ resultsData.timeTakenStr }}</p>
                  </div>
                </div>

                <div class="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 flex items-center space-x-2">
                  <Award class="h-5 w-5 text-[#000080]" />
                  <div>
                    <p class="text-[10px] uppercase font-bold text-indigo-500 font-mono">Badge Rank</p>
                    <p class="font-black text-indigo-800 text-xs leading-none mt-1">{{ resultsData.performanceTier }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 p-5 rounded-2xl border border-amber-200" id="suggested-improvement-block text-left">
            <h4 class="font-bold text-xs text-amber-900 uppercase tracking-widest flex items-center mb-2">
              <AlertCircle class="h-4.5 w-4.5 mr-1.5 text-amber-700" />
              Recommended Knowledge Improvement Plan:
            </h4>
            <p class="text-xs text-amber-800 leading-relaxed mb-3">
              Our analyzer pinpointed specific subjects matching skipped or failed objective slots. Spend extra visual practice time revising:
            </p>
            <ul class="space-y-1.5 text-xs text-amber-950 font-semibold" id="suggested-topics-list">
              <li v-for="(topic, idx) in resultsData.suggestedTopics" :key="idx" class="flex items-center space-x-2 bg-white/60 p-1.5 rounded">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                <span>{{ topic }}</span>
              </li>
            </ul>
          </div>

          <div class="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
            <button
              id="btn-retry-quiz"
              @click="handleStartQuiz(selectedQuiz)"
              class="flex-1 bg-[#000080] hover:bg-[#000060] text-white py-3 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw class="h-4 w-4" />
              <span>Try Mock Test Again</span>
            </button>
            <button
              id="btn-exit-to-categories"
              @click="() => {
                selectedQuiz = null;
                showResults = false;
                emit('selectQuiz', null);
              }"
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer"
            >
              Change Quiz Category
            </button>
          </div>
        </div>

        <!-- Certificate issuer panel -->
        <div class="space-y-6 text-left" id="certificate-printing-launcher">
          <div v-if="!issuedCertificate" class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
            <div class="bg-[#FF9933]/15 text-[#aa4400] text-xs font-extrabold p-3 rounded-lg flex items-center">
              <Sparkles class="h-5 w-5 mr-1.5 shrink-0" />
              <span>Unlockable Merit Document Available!</span>
            </div>
            
            <h3 class="font-extrabold text-gray-900 text-sm">AgniPariksha Official Academy Badge</h3>
            <p class="text-xs text-gray-500 leading-relaxed">
              Issue your professional digital verification certificate based on your score of <strong class="text-gray-900">{{ resultsData.scorePercentage }}%</strong>. Type down your full official name below:
            </p>

            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Full Name:</label>
              <input
                type="text"
                id="input-certificate-name"
                v-model="certIssuedName"
                placeholder="e.g. Manjeet Singh"
                class="w-full text-xs font-bold p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50"
              />
            </div>

            <button
              id="btn-generate-cert-action"
              @click="issueCertificate"
              class="w-full bg-[#138808] hover:bg-[#117706] text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Award class="h-4 w-4" />
              <span>Issue Custom Certificate</span>
            </button>
          </div>

          <!-- Formal certificate template renderer -->
          <div v-else class="bg-white rounded-2xl p-6 shadow-xl border-4 border-double border-[#FF9933] text-center space-y-4 relative overflow-hidden" id="verified-merit-certificate">
            <div class="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <div class="absolute -bottom-12 -right-12 h-24 w-24 bg-[#000080]/10 rounded-full flex items-center justify-center p-3 text-transparent">
              <Award class="h-10 w-10 text-[#000080]" />
            </div>

            <div class="space-y-1">
              <p class="text-[10px] font-bold tracking-widest text-[#000080] uppercase">AGNI PARIKSHA MERIT DECREE</p>
              <h4 class="font-serif font-bold text-gray-800 italic text-sm">Certificate of Achievement</h4>
            </div>

            <div class="py-2">
              <p class="text-[9px] text-gray-500 font-sans">This is to officially acknowledge that aspirant:</p>
              <p class="text-sm font-black text-gray-900 border-b border-gray-100 pb-1 mt-1 uppercase tracking-wide">
                {{ issuedCertificate.userName }}
              </p>
            </div>

            <p class="text-[9px] text-gray-500 leading-normal font-sans">
              completed and secured a performance metric rating of <strong class="text-gray-950">{{ issuedCertificate.scorePercentage }}%</strong> on the certified mock drill:
            </p>
            <p class="text-xs font-bold text-[#138808] px-2 py-1 bg-[#138808]/5 rounded border border-[#138808]/15 text-center">
              {{ issuedCertificate.quizTitle }}
            </p>

            <div class="pt-2 flex justify-between items-center text-[8px] font-mono text-gray-400">
              <div class="text-left font-mono">
                <p>Date: {{ issuedCertificate.date }}</p>
                <p>ID: {{ issuedCertificate.id }}</p>
              </div>
              <div class="text-right">
                <p class="font-serif font-black text-[#000080]">AGNI PARIKSHA</p>
                <p class="border-t border-gray-200 pt-0.5 mt-0.5">Verification Registrar</p>
              </div>
            </div>

            <button
              id="btn-print-certificate"
              @click="() => window.print()"
              class="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow cursor-pointer"
            >
              <Printer class="h-3.5 w-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Review Explanations View -->
      <div v-if="activeTabSub === 'review'" class="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6 text-left" id="answers-explanations-viewport">
        <div class="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 class="font-extrabold text-sm uppercase text-gray-800">Correct Answers Key & Detailed Explanations</h3>
          <button
            @click="() => {
              selectedQuiz = null;
              showResults = false;
              emit('selectQuiz', null);
            }"
            class="text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
          >
            Exit Review Menu
          </button>
        </div>

        <div class="space-y-6" id="review-explanations-list">
          <div v-for="(q, qidx) in selectedQuiz.questions" :key="q.id" class="p-5 sm:p-6 rounded-2xl border border-gray-150 flex flex-col space-y-4 bg-white shadow-sm text-left">
            
            <!-- Question stats / metadata header -->
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <span class="text-xs font-extrabold bg-[#000080]/10 text-[#000080] font-mono py-1 px-3 rounded-full">
                QUESTION {{ qidx + 1 }} OF {{ selectedQuiz.questions.length }}
              </span>
              
              <div class="flex items-center space-x-2">
                <span v-if="selectedAnswers[q.id] === undefined" class="text-[10px] uppercase font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  ⚠️ Skipped / अनुत्तरित
                </span>
                <span v-else-if="selectedAnswers[q.id] === q.correctAnswer" class="text-[10px] uppercase font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle class="h-3.5 w-3.5" />
                  <span>Correct / सही उत्तर</span>
                </span>
                <span v-else class="text-[10px] uppercase font-black text-red-800 bg-red-50 px-2.5 py-1 rounded-md border border-red-200 flex items-center space-x-1">
                  <XCircle class="h-3.5 w-3.5" />
                  <span>Incorrect / गलत उत्तर</span>
                </span>
              </div>
            </div>

            <!-- Bilingual Question Text -->
            <div class="space-y-2">
              <h5 class="font-black text-slate-900 text-sm sm:text-base leading-relaxed">
                <span class="text-[#FF9933] font-mono mr-1">Q.</span> 
                {{ getBilingualQuestion(q.text).english }}
              </h5>
              <h5 v-if="getBilingualQuestion(q.text).hindi" class="font-bold text-slate-700 text-xs sm:text-sm leading-relaxed italic border-l-2 border-[#138808] pl-2.5 ml-1">
                {{ getBilingualQuestion(q.text).hindi }}
              </h5>
            </div>

            <!-- Display choices breakdown with full bilingual options -->
            <div class="space-y-2.5">
              <p class="text-[10px] uppercase font-black tracking-wider text-gray-400">Multiple Choice Answers / विकल्प:</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                <div 
                  v-for="(opt, oindex) in q.options"
                  :key="oindex"
                  :class="[
                    'p-3.5 rounded-xl border text-left flex items-start space-x-2.5 transition-all',
                    q.correctAnswer === oindex 
                      ? 'bg-emerald-50/70 border-emerald-400 text-emerald-900 font-bold ring-1 ring-emerald-300' 
                      : (selectedAnswers[q.id] === oindex 
                        ? 'bg-red-50/70 border-red-300 text-red-900 font-medium' 
                        : 'bg-slate-50 border-gray-200 text-gray-700')
                  ]"
                >
                  <span class="font-mono font-black shrink-0 px-1.5 py-0.5 bg-white/80 border rounded text-xs">
                    {{ String.fromCharCode(65 + oindex) }}
                  </span>
                  <span class="leading-relaxed">{{ getBilingualOption(q.text, opt) }}</span>
                </div>
              </div>
            </div>

            <!-- User Response Assessment Banner -->
            <div 
              :class="[
                'p-3.5 rounded-xl text-xs flex items-center space-x-2 border transition-all mt-1',
                selectedAnswers[q.id] === undefined
                  ? 'bg-amber-50/40 border-amber-200 text-amber-900'
                  : (selectedAnswers[q.id] === q.correctAnswer
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900'
                    : 'bg-red-50/40 border-red-200 text-red-900')
              ]"
            >
              <span class="font-extrabold mr-1">Candidate Choice / आपका चयन:</span>
              <span v-if="selectedAnswers[q.id] === undefined" class="font-semibold italic">
                You skipped this question. (0 Marks Allocated)
              </span>
              <span v-else-if="selectedAnswers[q.id] === q.correctAnswer" class="font-bold flex items-center">
                Option {{ String.fromCharCode(65 + selectedAnswers[q.id]) }} (Correct ✓)
              </span>
              <span v-else class="font-semibold flex flex-wrap items-center gap-1">
                <span class="line-through text-red-700">Option {{ String.fromCharCode(65 + selectedAnswers[q.id]) }} (Incorrect ✗)</span>
                <span class="mx-1 font-black">|</span>
                <span class="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-black">Correct Key: Option {{ String.fromCharCode(65 + q.correctAnswer) }}</span>
              </span>
            </div>

            <!-- Advanced Bilingual Explanations Container -->
            <div class="bg-amber-50/50 p-4 sm:p-5 rounded-2xl border border-amber-200/60 space-y-3.5 text-xs text-left mt-2 shadow-inner">
              <div class="flex items-center space-x-2 font-black text-amber-950 uppercase tracking-widest border-b border-amber-200/40 pb-2">
                <Flame class="h-4 w-4 text-[#FF9933]" />
                <span>EXPLANATION ANALYSIS / व्याख्यात्मक विश्लेषण</span>
              </div>
              <div class="space-y-3 text-slate-750 leading-relaxed">
                <div>
                  <p class="font-black text-[10px] text-amber-800 uppercase tracking-wide mb-0.5 font-mono">English Key Detail:</p>
                  <p class="font-medium text-[12px] sm:text-[13px] text-slate-800">
                    {{ getBilingualExplanation(q).english }}
                  </p>
                </div>
                <div class="border-t border-dashed border-amber-200/70" />
                <div>
                  <p class="font-black text-[10px] text-[#138808] uppercase tracking-wide mb-0.5 font-mono">हिन्दी व्याख्या विश्लेषण:</p>
                  <p class="font-bold text-[12px] sm:text-[13px] text-[#138808]">
                    {{ getBilingualExplanation(q).hindi }}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
@keyframes confettiFall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg);
    opacity: 0;
  }
}
</style>
