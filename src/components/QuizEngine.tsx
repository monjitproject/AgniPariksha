import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, Award, Clock, ArrowRight, ArrowLeft, Bookmark, 
  CheckCircle, XCircle, RefreshCw, Sparkles, Printer, Play, 
  ChevronRight, AlertCircle, FileText, BookmarkCheck, Flame
} from "lucide-react";
import { Quiz, Question, QuizHistoryItem, UserCertificate } from "../types";
import { MOCK_QUIZZES, ARMY_PREV_QUESTIONS } from "../data/mockData";

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
    "defence minister of india": "Defence Minister of India / भारत के रक्षा मंत्री",
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
  timeLimit: 600 // 10 minutes
};

const COMBINED_QUIZZES = [GENUINE_PYQ_QUIZ, ...MOCK_QUIZZES];

interface QuizEngineProps {
  onQuizCompleted: (historyItem: QuizHistoryItem, cert?: UserCertificate) => void;
  userBookmarks: string[];
  toggleBookmark: (questionId: string) => void;
  userName?: string;
}

export default function QuizEngine({
  onQuizCompleted,
  userBookmarks,
  toggleBookmark,
  userName = "Aspirant"
}: QuizEngineProps) {
  // Navigation active states
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  
  // Confetti state for real result celebration
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; duration: number; delay: number }[]>([]);

  // Active test playing states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({}); // questionId -> selectedIndex
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results screen states
  const [showResults, setShowResults] = useState(false);
  const [resultsData, setResultsData] = useState<{
    correctCount: number;
    wrongCount: number;
    skippedCount: number;
    scorePercentage: number;
    timeTakenStr: string;
    suggestedTopics: string[];
    performanceTier: string;
  } | null>(null);

  // Trigger celebration on success
  useEffect(() => {
    if (showResults) {
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
      setConfetti(list);
    } else {
      setConfetti([]);
    }
  }, [showResults]);

  // Certificate generation state
  const [certIssuedName, setCertIssuedName] = useState(userName);
  const [issuedCertificate, setIssuedCertificate] = useState<UserCertificate | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<"summary" | "review">("summary");

  // Filter quizzes loaded
  const filteredQuizzes = COMBINED_QUIZZES.filter(quiz => {
    if (difficultyFilter === "All") return true;
    return quiz.difficulty === difficultyFilter;
  });

  // Start selected quiz
  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeRemaining(quiz.timeLimit);
    setIsPlaying(true);
    setShowResults(false);
    setResultsData(null);
    setIssuedCertificate(null);
    setTimerActive(true);
  };

  // Timekeeper thread
  useEffect(() => {
    if (timerActive && isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, isPlaying, timeRemaining]);

  // Submit test triggered by countdown finish
  const handleAutoSubmit = () => {
    alert("Time has elapsed! Your answers are being submitted automatically.");
    submitQuiz();
  };

  // Calculate results on completion
  const submitQuiz = () => {
    if (!selectedQuiz) return;
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const suggestedTopics: string[] = [];

    selectedQuiz.questions.forEach((q) => {
      const ans = selectedAnswers[q.id];
      if (ans === undefined) {
        skipped++;
        suggestedTopics.push(q.text.includes("Article") ? "Indian Polity Duties" : "Armed Forces Static GK");
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
        suggestedTopics.push(q.text.split("?")[0]); // Topic title from question
      }
    });

    const total = selectedQuiz.questions.length;
    const scorePercentage = Math.round((correct / total) * 100);
    const timeSpentSecs = selectedQuiz.timeLimit - timeRemaining;
    const mins = Math.floor(timeSpentSecs / 60);
    const secs = timeSpentSecs % 60;
    const timeTakenStr = `${mins}m ${secs}s`;

    let performanceTier = "Agniveer Cadet";
    if (scorePercentage >= 90) performanceTier = "Param Vir Champion";
    else if (scorePercentage >= 75) performanceTier = "Captain Commander";
    else if (scorePercentage >= 50) performanceTier = "Duty Sergeant";

    // Build lists of suggested improvements
    const uniqueSuggested = Array.from(new Set(suggestedTopics)).slice(0, 3);
    if (uniqueSuggested.length === 0) {
      uniqueSuggested.push("Maintain current mock streak - Join National top list!");
    }

    setResultsData({
      correctCount: correct,
      wrongCount: wrong,
      skippedCount: skipped,
      scorePercentage,
      timeTakenStr,
      suggestedTopics: uniqueSuggested,
      performanceTier
    });

    const historyItem: QuizHistoryItem = {
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      scorePercentage,
      correctAnswers: correct,
      totalQuestions: total,
      timeTaken: timeTakenStr,
      date: new Date().toLocaleDateString()
    };

    // Auto-save history item
    onQuizCompleted(historyItem);
    setShowResults(true);
    setIsPlaying(false);
  };

  // Issue custom certificate of merit
  const issueCertificate = () => {
    if (!selectedQuiz || !resultsData) return;
    const newCert: UserCertificate = {
      id: "CERT-" + Math.floor(100000 + Math.random() * 900000),
      userName: certIssuedName.trim() || "Brave Indian Aspirant",
      quizTitle: selectedQuiz.title,
      scorePercentage: resultsData.scorePercentage,
      date: new Date().toLocaleDateString()
    };
    setIssuedCertificate(newCert);

    // Save certificate in history metrics
    const dummyHistoryItem: QuizHistoryItem = {
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      scorePercentage: resultsData.scorePercentage,
      correctAnswers: resultsData.correctCount,
      totalQuestions: selectedQuiz.questions.length,
      timeTaken: resultsData.timeTakenStr,
      date: new Date().toLocaleDateString()
    };
    onQuizCompleted(dummyHistoryItem, newCert);
  };

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  return (
    <div className="space-y-6" id="quiz-engine-viewport">
      
      {/* SECTION 1: QUIZ SELECTOR VIEW */}
      {!isPlaying && !showResults && (
        <div className="space-y-6" id="quiz-list-selector">
          {/* Header & filters */}
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933]">
            <h1 className="text-2xl font-black text-gray-900 flex items-center">
              <Award className="h-7 w-7 mr-2 text-[#000080]" />
              Official GK and Army Mock Test Portal
            </h1>
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              Achieve strategic readiness by practicing timed mock templates built selectively for Agniveer recruitment, Navy entries, NDA/CDS boards, and national polity challenges.
            </p>

            {/* Difficulty Filter Switcher */}
            <div className="flex flex-wrap items-center gap-2 mt-6" id="difficulty-filter-row">
              <span className="text-xs font-bold text-gray-500 uppercase">Difficulty level:</span>
              {(["All", "Easy", "Medium", "Hard"] as const).map((diff) => (
                <button
                  key={diff}
                  id={`filter-diff-${diff}`}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    difficultyFilter === diff
                      ? "bg-[#000080] text-white border-[#000080]"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {diff === "All" ? "⭐ All Levels" : diff}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Available Quizzes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="available-quizzes-grid">
            {filteredQuizzes.map((quiz) => (
              <div 
                key={quiz.id} 
                id={`quiz-card-${quiz.id}`}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group flex flex-col justify-between"
              >
                {/* Decorative background national stripes */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF9933]/10 via-transparent to-[#138808]/10 rounded-bl-full pointer-events-none" />
                
                <div className="space-y-4">
                  {/* Category icon */}
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-wider uppercase bg-[#FF9933]/15 text-[#aa4400] px-2.5 py-1 rounded">
                      {quiz.category}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      quiz.difficulty === "Easy" ? "bg-green-50 text-green-700 border-green-200" :
                      quiz.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                      "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 group-hover:text-[#000080] transition-colors">
                    {quiz.title}
                  </h3>

                  {/* Metas */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4 text-[#000080]" />
                      <span>{quiz.questions.length} Objective Qs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-[#000080]" />
                      <span>{quiz.timeLimit} Seconds</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-2 border-t border-gray-100/60 flex items-center justify-between">
                  {/* Total high scores */}
                  <span className="text-[10px] font-bold text-gray-500 italic">⭐ Certified Scorecard Included</span>
                  <button
                    id={`btn-start-quiz-${quiz.id}`}
                    onClick={() => handleStartQuiz(quiz)}
                    className="bg-[#138808] hover:bg-[#117706] text-white px-4 py-2 rounded-lg text-xs font-black tracking-wider uppercase transition-colors flex items-center space-x-1 shadow-md"
                  >
                    <span>Start Test</span>
                    <Play className="h-3 w-3 fill-white" />
                  </button>
                </div>
              </div>
            ))}

            {filteredQuizzes.length === 0 && (
              <div className="col-span-1 md:col-span-2 text-center p-12 bg-gray-50 rounded-xl" id="no-quizzes-found">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <h4 className="font-bold text-gray-700">No mock tests found for this filter</h4>
                <p className="text-xs text-gray-500 mt-1">Try switching back to some of our general categories.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE RECRUITMENT GAME INTERACTIVE VIEW */}
      {isPlaying && selectedQuiz && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="active-quiz-board">
          
          {/* Main Questions Slate */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] shadow-xl border border-slate-200/90 relative overflow-hidden flex flex-col justify-between min-h-[520px]" id="quiz-question-container">
            {/* Top tricolor bar accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 flex z-10">
              <div className="w-[33%] bg-[#FF9933]" />
              <div className="w-[34%] bg-white" />
              <div className="w-[33%] bg-[#138808]" />
            </div>

            <div>
              {/* Internal header banner reconstructed in elegant white */}
              <div className="p-6 sm:p-8 pb-4 flex justify-between items-start">
                <div className="space-y-1 text-left">
                  <div className="flex items-center space-x-1">
                    <Flame className="h-4 w-4 text-[#FF9933] fill-[#FF9933] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#FF9933] uppercase font-mono">
                      PREVIOUS PAPER QUIZ
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight leading-snug">
                    {selectedQuiz.title}
                  </h3>
                </div>

                {/* Orange/Golden Ribbon in top-right */}
                <div className="shrink-0 text-amber-500 hover:text-amber-600 transition-colors cursor-pointer p-1">
                  <Bookmark className="h-7 w-7 fill-amber-500/10 text-amber-500 stroke-[1.5]" />
                </div>
              </div>

              {/* Bilingual Status & Progress Indicator Container */}
              <div className="px-6 sm:px-8 flex justify-between items-center pb-2.5" id="bilingual-quiz-meta-row">
                <div className="bg-[#000080]/5 text-[#000080] text-[10px] sm:text-[11px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg border border-[#000080]/10 flex items-center shadow-sm select-none">
                  <span className="mr-1 text-slate-500 font-bold">BILINGUAL</span>
                  <span className="text-slate-300 mx-1">/</span>
                  <span className="text-[#FF9933] font-black">हिंदी</span>
                  <span className="mx-1 text-slate-300">+</span>
                  <span className="text-[#138808] font-black">ENG</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <span className="text-xs sm:text-sm font-bold text-gray-500 font-mono">
                    Q. {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </span>
                  {/* Clock Indicator */}
                  <div className="flex items-center space-x-1 bg-amber-50/80 text-amber-800 px-2 mt-0.5 py-1 rounded-md border border-amber-200 font-mono text-[11px] font-black shadow-sm select-none">
                    <Clock className="h-3.5 w-3.5 animate-spin text-amber-600" />
                    <span>{timeRemaining}s</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Gradient Progress bar */}
              <div className="px-6 sm:px-8">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question description & interactive options */}
              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Visual clean bilingually formatted box */}
                {(() => {
                  const bilingual = getBilingualQuestion(selectedQuiz.questions[currentQuestionIndex].text);
                  return (
                    <div className="bg-slate-50/45 rounded-2xl border border-slate-300 p-5 sm:p-6 text-left space-y-4 shadow-sm" id="question-text-box">
                      {/* English version of the Question */}
                      <p className="text-slate-900 text-sm sm:text-base font-extrabold leading-snug">
                        <span className="text-[#FF9933] font-black mr-1.5 font-mono">Q{currentQuestionIndex + 1}.</span>
                        {bilingual.english}
                      </p>

                      {/* Dashed elegant separator if Hindi exists */}
                      {bilingual.hindi && (
                        <div className="border-t border-dashed border-slate-300/80" />
                      )}

                      {/* Hindi Translation with 'IN' prefix */}
                      {bilingual.hindi && (
                        <div className="flex items-start">
                          <span className="text-[#138808] font-black font-mono text-[10px] mr-2 px-1.5 py-0.5 rounded bg-[#138808]/10 select-none shrink-0" style={{ marginTop: "2px" }}>IN</span>
                          <p className="text-[#138808] text-xs sm:text-sm font-extrabold leading-relaxed">
                            {bilingual.hindi}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Bookmark & info row */}
                <div className="flex justify-end items-center px-1">
                  <button
                    id={`bookmark-btn-${selectedQuiz.questions[currentQuestionIndex].id}`}
                    onClick={() => toggleBookmark(selectedQuiz.questions[currentQuestionIndex].id)}
                    className="flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-[#000080] transition-colors"
                  >
                    <Bookmark 
                      className={`h-4 w-4 transition-colors ${
                        userBookmarks.includes(selectedQuiz.questions[currentQuestionIndex].id)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-gray-400"
                      }`} 
                    />
                    <span>
                      {userBookmarks.includes(selectedQuiz.questions[currentQuestionIndex].id) ? "Bookmarked!" : "Bookmark"}
                    </span>
                  </button>
                </div>

                {/* Question Options formatted without label circles A,B,C,D matching image */}
                <div className="space-y-3.5" id="quiz-question-options">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] === idx;
                    const bilingualOptionStr = getBilingualOption(selectedQuiz.questions[currentQuestionIndex].text, option);
                    
                    const hasSelectedAny = selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] !== undefined;
                    const isCorrectAnswer = idx === selectedQuiz.questions[currentQuestionIndex].correctAnswer;
                    
                    let optionStyle = "bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-bold";
                    
                    if (hasSelectedAny) {
                      if (isCorrectAnswer) {
                        optionStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-extrabold ring-2 ring-emerald-400/20";
                      } else if (isSelected) {
                        optionStyle = "border-red-500 bg-red-50/50 text-red-800 font-extrabold ring-2 ring-red-400/20";
                      } else {
                        optionStyle = "bg-slate-50 border-slate-200/50 text-slate-400 opacity-60";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-[#000080] bg-[#000080]/5 text-slate-900 font-extrabold ring-2 ring-[#000080]/15";
                    }

                    return (
                      <button
                        key={idx}
                        id={`option-${idx}`}
                        disabled={hasSelectedAny}
                        onClick={() => handleOptionSelect(selectedQuiz.questions[currentQuestionIndex].id, idx)}
                        className={`w-full text-left py-3.5 px-5 rounded-[1.25rem] border transition-all duration-150 text-xs sm:text-[14px] ${
                          hasSelectedAny ? "cursor-default" : "cursor-pointer"
                        } ${optionStyle}`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{bilingualOptionStr}</span>
                          {hasSelectedAny && (
                            <>
                              {isCorrectAnswer && (
                                <span className="text-[10px] bg-emerald-105 text-emerald-800 font-black px-2 py-0.5 rounded-full font-mono uppercase">
                                  Correct ✓
                                </span>
                              )}
                              {!isCorrectAnswer && isSelected && (
                                <span className="text-[10px] bg-red-105 text-red-800 font-black px-2 py-0.5 rounded-full font-mono uppercase">
                                  Incorrect ✗
                                </span>
                              )}
                            </>
                          )}
                          {!hasSelectedAny && isSelected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-[#000080] ring-4 ring-[#000080]/20 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamically show High Fidelity Explanation / Study support card if option answered */}
                {(() => {
                  const hasSelectedAny = selectedAnswers[selectedQuiz.questions[currentQuestionIndex].id] !== undefined;
                  if (!hasSelectedAny) return null;

                  const matchedAQ = ARMY_PREV_QUESTIONS.find(aq => {
                    const cleaned1 = aq.englishQ.toLowerCase().replace(/[^a-z]/g, "");
                    const cleaned2 = selectedQuiz.questions[currentQuestionIndex].text.toLowerCase().replace(/[^a-z]/g, "");
                    return cleaned1.includes(cleaned2) || cleaned2.includes(cleaned1);
                  });

                  const engExplain = matchedAQ?.explanationEng || selectedQuiz.questions[currentQuestionIndex].explanation || "Correct choice validated by the Board of Armed Services Education guidelines.";
                  const hinExplain = matchedAQ?.explanationHin || "सशस्त्र सेना शिक्षा बोर्ड दिशानिर्देशों द्वारा सत्यापित सही विकल्प।";

                  return (
                    <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl text-left space-y-3.5 text-xs animate-fade-in shadow-inner" id="explanation-box">
                      <div className="flex items-center space-x-2 font-black text-amber-950 uppercase tracking-widest border-b border-amber-200/40 pb-2">
                        <Flame className="h-4 w-4 text-[#FF9933] animate-pulse" />
                        <span>EXPLANATION / विश्लेषण</span>
                      </div>
                      <div className="space-y-2 text-slate-705 leading-relaxed">
                        <p className="font-semibold text-[12px] sm:text-[13px] text-slate-800">
                          <span className="text-amber-800 font-extrabold mr-1 font-mono uppercase">English Description:</span>
                          {engExplain}
                        </p>
                        <div className="border-t border-dashed border-amber-200/60" />
                        <p className="font-semibold text-[12px] sm:text-[13px] text-[#138808]">
                          <span className="text-[#138808] font-extrabold mr-1">हिन्दी विवरण:</span>
                          {hinExplain}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Questions board footer */}
            <div className="bg-slate-50/70 px-6 py-5 border-t border-slate-200/60 rounded-b-[2rem] flex items-center justify-between">
              <button
                id="btn-prev-question"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="flex items-center space-x-1.5 px-4.5 py-2.5 border border-slate-300/80 rounded-xl text-xs font-black text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                <button
                  id="btn-next-question"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="bg-[#0f172a] hover:bg-slate-900 text-white flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  id="btn-submit-exam"
                  onClick={submitQuiz}
                  className="bg-[#138808] hover:bg-[#117706] text-white flex items-center space-x-1.5 px-6 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md animate-pulse cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Finish & View Result</span>
                  <Award className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Question Hopping Map */}
          <div className="space-y-6" id="quiz-question-map-pane">
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-2 mb-4 uppercase tracking-wide">
                Question Tracker Map
              </h4>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" id="grid-question-quick-hop">
                {selectedQuiz.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentQuestionIndex;
                  const isBk = userBookmarks.includes(q.id);

                  return (
                    <button
                      key={q.id}
                      id={`hop-btn-${idx}`}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative aspect-square rounded-lg font-bold text-xs flex flex-col items-center justify-center border-2 transition-all ${
                        isCurrent ? "border-[#FF9933] ring-1 ring-[#FF9933]" : "border-transparent"
                      } ${
                        isAnswered 
                          ? "bg-[#138808] text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <span>{idx + 1}</span>
                      {isBk && (
                        <span className="absolute -top-1 -right-1 bg-yellow-400 border border-white text-black p-0.5 rounded-full scale-75">
                          <Bookmark className="h-2 w-2 fill-current" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Indicators legend */}
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-[10px] font-mono text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="h-3.5 w-3.5 rounded bg-[#138808]" />
                  <span>Answered Standard Options</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3.5 w-3.5 rounded bg-gray-100 border border-gray-300" />
                  <span>Unanswered Items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-3.5 w-3.5 rounded bg-yellow-400 shrink-0" />
                  <span>Bookmarked Questions</span>
                </div>
              </div>
            </div>

            {/* Test alert reminder card */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start space-x-3 text-xs text-amber-800">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Important Instructions:</p>
                <p className="mt-1 leading-relaxed">
                  Avoid exiting or clearing your browser cache during active mock drills. Unsaved questions cannot be verified afterward. If the timer expires, current progress submits immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: EXAM PERFORMANCE RESULTS VIEW */}
      {showResults && selectedQuiz && resultsData && (
        <div className="space-y-6 animate-fade-in relative" id="quiz-results-dashboard">
          {/* Confetti falling animation styles */}
          <style>{`
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
            .animate-confetti-fall {
              animation-name: confettiFall;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            }
          `}</style>

          {/* Dynamic celebration confetti */}
          {confetti.map((c) => (
            <div
              key={c.id}
              style={{
                left: `${c.left}%`,
                backgroundColor: c.color,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                width: `${6 + Math.random() * 8}px`,
                height: `${12 + Math.random() * 10}px`,
              }}
              className="fixed -top-10 rounded-sm opacity-90 pointer-events-none z-[100] animate-confetti-fall"
            />
          ))}

          {/* Premium Congratulations & Celebration Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-[#000080] to-slate-900 rounded-[2.5rem] p-6 sm:p-10 text-center text-white relative overflow-hidden shadow-2xl border border-slate-800" id="celebrate-congrats-card">
            {/* National flag background accents */}
            <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-col justify-between">
              <div className="h-[33%] bg-[#FF9933]" />
              <div className="h-[34%] bg-white" />
              <div className="h-[33%] bg-[#138808]" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center space-y-5">
              <div className="inline-flex justify-center items-center w-20 h-20 bg-amber-500/10 text-amber-400 rounded-full border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-bounce font-sans text-4xl">
                🏆
              </div>
              
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#FF9933] uppercase font-mono bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
                  🇮🇳 जय हिन्द ! GRAND CONGRATULATIONS
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                  CEE Soldier Merit Achievement!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-xl mx-auto leading-relaxed">
                  Excellent completion! You practiced the official simulated paper of <span className="text-yellow-400 font-extrabold">{selectedQuiz.title}</span> showing outstanding diligence!
                </p>
              </div>

              {/* Dynamic status ratings with beautiful badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <div className="bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-amber-300 shadow-md">
                  <span>🎖️ MERIT TITLE:</span>
                  <span className="text-white font-black uppercase font-mono">{resultsData.performanceTier}</span>
                </div>
                <div className="bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#FF9933] shadow-md">
                  <span>🎯 ACCURACY:</span>
                  <span className="text-white font-black font-mono">{resultsData.scorePercentage}%</span>
                </div>
                <div className="bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-2xl flex items-center space-x-2 text-xs font-bold text-[#138808] shadow-md">
                  <span>✅ CORRECT ANSWERS:</span>
                  <span className="text-white font-black font-mono">{resultsData.correctCount} / {selectedQuiz.questions.length}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sub-tabs header for review */}
          <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-lg border max-w-xs">
            <button
              onClick={() => setActiveTabSub("summary")}
              className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${
                activeTabSub === "summary" ? "bg-white text-[#000080] shadow" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Summary Analysis
            </button>
            <button
              onClick={() => setActiveTabSub("review")}
              className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${
                activeTabSub === "review" ? "bg-white text-[#000080] shadow" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Answer Explanations
            </button>
          </div>

          {activeTabSub === "summary" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="tab-summary-viewport">
              {/* Analytics & Performance Block */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-gray-100 space-y-6">
                <div className="border-b border-gray-100 pb-4 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 p-4 rounded-xl">
                  <div>
                    <span className="text-xs font-black tracking-widest text-[#FF9933] uppercase">AgniPariksha Assessment</span>
                    <h2 className="text-xl font-black text-gray-900 mt-1">Practice Complete!</h2>
                  </div>
                  <span className="mt-3 sm:mt-0 font-mono text-[10px] font-bold uppercase bg-gray-200 px-3 py-1 rounded text-gray-700">
                    ID: {selectedQuiz.id}
                  </span>
                </div>

                {/* Main analytical radial layout */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                  
                  {/* Dynamic percentage animated score representation */}
                  <div className="text-center bg-gradient-to-tr from-gray-50 to-gray-100/30 p-4 rounded-full aspect-square flex flex-col items-center justify-center max-w-[170px] mx-auto border-4 border-[#000080]" id="percentage-visual-ring">
                    <span className="text-4xl font-black text-[#000080]">{resultsData.scorePercentage}%</span>
                    <span className="text-[10px] font-black text-[#138808] uppercase tracking-wider mt-1">Overall Score</span>
                  </div>

                  {/* Linear breakdown labels */}
                  <div className="sm:col-span-2 space-y-3" id="scorecard-breakdown-details">
                    <h4 className="font-sans font-bold text-sm text-gray-700">Performance Metrics for {certIssuedName}:</h4>
                    
                    <div className="grid grid-cols-2 gap-3" id="metrics-grid">
                      <div className="bg-green-50/50 p-2.5 rounded-lg border border-green-100 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500 font-mono">Correct</p>
                          <p className="font-black text-green-700 text-sm">{resultsData.correctCount} / {selectedQuiz.questions.length}</p>
                        </div>
                      </div>

                      <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-100 flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500 font-mono">Incorrect</p>
                          <p className="font-black text-red-700 text-sm">{resultsData.wrongCount}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-600 shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500 font-mono">Time Spent</p>
                          <p className="font-black text-gray-700 text-sm">{resultsData.timeTakenStr}</p>
                        </div>
                      </div>

                      <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 flex items-center space-x-2">
                        <Award className="h-5 w-5 text-[#000080]" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-indigo-500 font-mono">Badge Rank</p>
                          <p className="font-black text-indigo-800 text-xs leading-none mt-1">{resultsData.performanceTier}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Suggested areas for study feedback */}
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200" id="suggested-improvement-block">
                  <h4 className="font-bold text-xs text-amber-900 uppercase tracking-widest flex items-center mb-2">
                    <AlertCircle className="h-4.5 w-4.5 mr-1.5 text-amber-700" />
                    Recommended Knowledge Improvement Plan:
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed mb-3">
                    Our analyzer pinpointed specific subjects matching skipped or failed objective slots. Spend extra visual practice time revising:
                  </p>
                  <ul className="space-y-1.5 text-xs text-amber-950 font-semibold" id="suggested-topics-list">
                    {resultsData.suggestedTopics.map((topic, idx) => (
                      <li key={idx} className="flex items-center space-x-2 bg-white/60 p-1.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action commands */}
                <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                  <button
                    id="btn-retry-quiz"
                    onClick={() => handleStartQuiz(selectedQuiz)}
                    className="flex-1 bg-[#000080] hover:bg-[#000060] text-white py-3 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Try Mock Test Again</span>
                  </button>
                  <button
                    id="btn-exit-to-categories"
                    onClick={() => {
                      setSelectedQuiz(null);
                      setShowResults(false);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-all text-center"
                  >
                    Change Quiz Category
                  </button>
                </div>
              </div>

              {/* Certificate issuer panel */}
              <div className="space-y-6" id="certificate-printing-launcher">
                
                {/* Visual preview or issuer container */}
                {!issuedCertificate ? (
                  <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
                    <div className="bg-[#FF9933]/15 text-[#aa4400] text-xs font-extrabold p-3 rounded-lg flex items-center">
                      <Sparkles className="h-5 w-5 mr-1.5 shrink-0" />
                      <span>Unlockable Merit Document Available!</span>
                    </div>
                    
                    <h3 className="font-extrabold text-gray-900 text-sm">AgniPariksha Official Academy Badge</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Issue your professional digital verification certificate based on your score of <strong className="text-gray-900">{resultsData.scorePercentage}%</strong>. Type down your full official name below:
                    </p>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Your Full Name:</label>
                      <input
                        type="text"
                        id="input-certificate-name"
                        value={certIssuedName}
                        onChange={(e) => setCertIssuedName(e.target.value)}
                        placeholder="e.g. Manjeet Singh"
                        className="w-full text-xs font-bold p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000080]"
                      />
                    </div>

                    <button
                      id="btn-generate-cert-action"
                      onClick={issueCertificate}
                      className="w-full bg-[#138808] hover:bg-[#117706] text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Award className="h-4 w-4" />
                      <span>Issue Custom Certificate</span>
                    </button>
                  </div>
                ) : (
                  /* Formal certificate template renderer */
                  <div className="bg-white rounded-2xl p-6 shadow-xl border-4 border-double border-[#FF9933] text-center space-y-4 relative overflow-hidden" id="verified-merit-certificate">
                    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                    <div className="absolute -bottom-12 -right-12 h-24 w-24 bg-[#000080]/10 rounded-full flex items-center justify-center p-3 text-transparent group-hover:duration-200">
                      <Award className="h-10 w-10 text-[#000080]" />
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold tracking-widest text-[#000080] uppercase">AGNI PARIKSHA MERIT DECREE</p>
                      <h4 className="font-serif font-bold text-gray-800 italic text-sm">Certificate of Achievement</h4>
                    </div>

                    <div className="py-2">
                      <p className="text-[9px] text-gray-500 font-sans">This is to officially acknowledge that aspirant:</p>
                      <p className="text-sm font-black text-gray-900 border-b border-gray-100 pb-1 mt-1 uppercase tracking-wide">
                        {issuedCertificate.userName}
                      </p>
                    </div>

                    <p className="text-[9px] text-gray-500 leading-normal font-sans">
                      completed and secured a performance metric rating of <strong className="text-gray-950">{issuedCertificate.scorePercentage}%</strong> on the certified mock drill:
                    </p>
                    <p className="text-xs font-bold text-[#138808] px-2 py-1 bg-[#138808]/5 rounded border border-[#138808]/15">
                      {issuedCertificate.quizTitle}
                    </p>

                    <div className="pt-2 flex justify-between items-center text-[8px] font-mono text-gray-400">
                      <div className="text-left">
                        <p>Date: {issuedCertificate.date}</p>
                        <p>ID: {issuedCertificate.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-black text-[#000080]">AGNI PARIKSHA</p>
                        <p className="border-t border-gray-200 pt-0.5 mt-0.5">Verification Registrar</p>
                      </div>
                    </div>

                    <button
                      id="btn-print-certificate"
                      onClick={() => window.print()}
                      className="w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 shadow"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Print Document</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Answer explanation list review view */
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6" id="answers-explanations-viewport">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-sm uppercase text-gray-800">Correct Answers Key & Detailed Explanations</h3>
                <button
                  onClick={() => {
                    setSelectedQuiz(null);
                    setShowResults(false);
                  }}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  Exit Review Menu
                </button>
              </div>

              <div className="space-y-6" id="review-explanations-list">
                {selectedQuiz.questions.map((q, qidx) => {
                  const studentAnswer = selectedAnswers[q.id];
                  const isCorrect = studentAnswer === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="p-4 sm:p-5 rounded-xl border border-gray-100 flex flex-col space-y-3 bg-gray-50/50">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold bg-gray-200 text-gray-700 font-mono py-0.5 px-2 rounded">
                          Question {qidx + 1}
                        </span>
                        
                        {studentAnswer === undefined ? (
                          <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded border">
                            Skipped
                          </span>
                        ) : isCorrect ? (
                          <span className="text-[10px] uppercase font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center space-x-0.5">
                            <CheckCircle className="h-3 w-3 inline" />
                            <span>Correct</span>
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center space-x-0.5">
                            <XCircle className="h-3 w-3 inline" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-gray-800 text-sm leading-relaxed">{q.text}</h5>

                      {/* Display choices breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oindex) => {
                          const isSelection = studentAnswer === oindex;
                          const isTrueAnswer = q.correctAnswer === oindex;
                          
                          return (
                            <div 
                              key={oindex}
                              className={`p-2.5 rounded border ${
                                isTrueAnswer 
                                  ? "bg-green-50 border-green-300 text-green-800 font-bold" 
                                  : isSelection 
                                    ? "bg-red-50 border-red-200 text-red-800" 
                                    : "bg-white border-gray-100 text-gray-600"
                              }`}
                            >
                              <span>{String.fromCharCode(65 + oindex)}. {opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="bg-[#000080]/5 p-3 rounded-lg border border-[#000080]/15 text-xs text-indigo-950 font-sans mt-2">
                        <strong className="text-[#000080] font-black uppercase tracking-wider block mb-1">Answer explanation key:</strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
