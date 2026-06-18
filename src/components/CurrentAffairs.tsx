import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Newspaper, Zap, Award, Clock, ArrowRight, RotateCcw, CheckCircle, XCircle, Sparkles, Check, HelpCircle } from "lucide-react";
import confetti from "canvas-confetti";

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

export default function CurrentAffairs() {
  const [news, setNews] = useState<NewsItem[]>(DAILY_CURRENT_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(DAILY_CURRENT_NEWS[0]);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completedQuizIds, setCompletedQuizIds] = useState<string[]>([]);

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setUserAnswer(idx);
  };

  const handleSubmitAnswer = () => {
    if (userAnswer === null || !selectedNews) return;
    setIsSubmitted(true);

    const isCorrect = userAnswer === selectedNews.quizQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 10);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#FF9933", "#ffffff", "#138808"]
      });
    }

    if (!completedQuizIds.includes(selectedNews.id)) {
      setCompletedQuizIds(prev => [...prev, selectedNews.id]);
    }
  };

  const handleNextNews = () => {
    const currentIdx = news.findIndex(n => n.id === selectedNews?.id);
    const nextIdx = (currentIdx + 1) % news.length;
    setSelectedNews(news[nextIdx]);
    setUserAnswer(null);
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="current-affairs-viewport">
      
      {/* Header element */}
      <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#000080]" id="current-affairs-header">
        <div className="flex items-center space-x-2 text-[#000080]">
          <Newspaper className="h-6 w-6 stroke-[2]" />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Daily Live Current Affairs Interactive Hub / दैनिक समसामयिकी
          </h2>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          Read official updates parsed from major digital directories, then test your strategic retention with our modern <strong>Animated Current Affairs Quiz format</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="current-affairs-layout">
        
        {/* Left Side: Today's Online Bulletins (Col spanned 5) */}
        <div className="lg:col-span-5 space-y-4" id="bulletin-sidebar">
          <h4 className="font-bold text-xs uppercase text-gray-400 font-mono tracking-widest pl-1 flex items-center">
            <Sparkles className="h-3.5 w-3.5 text-[#FF9933] mr-1 animate-pulse" />
            Today's News Bulletins / दैनिक मुख्य समाचार
          </h4>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1" id="bulletin-scroller">
            {news.map((item) => {
              const isSelected = selectedNews?.id === item.id;
              const isQuizDone = completedQuizIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  id={`news-bulletin-card-${item.id}`}
                  onClick={() => {
                    setSelectedNews(item);
                    setUserAnswer(null);
                    setIsSubmitted(false);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-[#000080] shadow"
                      : "bg-white border-gray-100 hover:border-gray-200 cursor-pointer"
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400">
                      <span className="text-[#FF9933] uppercase font-bold">{item.source}</span>
                      <span>{item.date}</span>
                    </div>

                    <h5 className="font-black text-xs text-slate-800 leading-snug">
                      {item.titleEng}
                    </h5>
                    
                    <p className="text-[11px] font-bold text-[#138808] leading-relaxed">
                      {item.titleHin}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span className="font-semibold text-gray-500">Secured Bulletin</span>
                    {isQuizDone ? (
                      <span className="text-[#138808] font-bold uppercase flex items-center">
                        <CheckCircle className="h-3.5 w-3.5 mr-0.5" /> Quiz Solved
                      </span>
                    ) : (
                      <span className="text-[#000080] font-bold uppercase flex items-center">
                        <Zap className="h-3 w-3 mr-0.5 animate-pulse text-[#FF9933] fill-[#FF9933]" /> Quiz Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gamified Points Badge scoreboard */}
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md border-b-4 border-b-[#138808] flex items-center justify-between" id="daily-points-scorecard">
            <div className="text-left">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black">Current Affairs Score</span>
              <h4 className="text-xl font-black mt-0.5 text-[#FF9933]">{score} Points</h4>
            </div>
            <Award className="h-8 w-8 text-[#FF9933] animate-pulse" />
          </div>
        </div>

        {/* Right Side: High Fidelity Animated Quiz Board (Col spanned 7) */}
        <div className="lg:col-span-7" id="bulletin-quiz-board">
          {selectedNews ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNews.id}
                initial={{ opacity: 0, x: 25, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -25, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden flex flex-col justify-between"
                style={{ minHeight: "580px" }}
                id="active-bulletin-reader"
              >
                
                {/* Header segment with national tricolor strip */}
                <div className="relative">
                  <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
                  <div className="p-6 pb-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase text-white bg-[#000080] px-2.5 py-1 rounded font-mono shadow-sm">NEWS BRIEF</span>
                      <span className="text-xs text-gray-500 font-bold font-mono">{selectedNews.date}</span>
                    </div>
                    <span className="text-[10px] text-[#138808] font-black font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">ONLINE VERIFIED</span>
                  </div>
                </div>

                {/* News details */}
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-1.5 text-left">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {selectedNews.titleEng}
                    </h2>
                    <p className="text-sm font-black text-[#138808] leading-relaxed">
                      {selectedNews.titleHin}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-200 font-sans text-left space-y-3">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {selectedNews.summaryEng}
                    </p>
                    <div className="border-t border-gray-200/50" />
                    <p className="text-xs text-[#138808] leading-relaxed font-semibold">
                      {selectedNews.summaryHin}
                    </p>
                  </div>

                  {/* ANIMATED QUIZ SEGMENT */}
                  <div className="pt-4 border-t border-gray-100 text-left">
                    <div className="flex items-center space-x-1 mb-3 text-[#000080]">
                      <HelpCircle className="h-4.5 w-4.5" />
                      <span className="text-[10px] font-black tracking-widest uppercase font-mono">RETENTION CHECK / एनिमेटेड क्विज</span>
                    </div>

                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 leading-snug mb-4 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                      {selectedNews.quizQuestion.text}
                    </h4>

                    {/* Question Options */}
                    <div className="space-y-2.5">
                      {selectedNews.quizQuestion.options.map((option, idx) => {
                        const isSelect = userAnswer === idx;
                        const correctAnswersIdx = selectedNews.quizQuestion.correctAnswer;
                        
                        let optStyle = "border-gray-250 bg-white hover:bg-slate-50 text-gray-800 font-bold";
                        let checkBadge = null;

                        if (isSubmitted) {
                          if (idx === correctAnswersIdx) {
                            optStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold ring-1 ring-emerald-400";
                            checkBadge = <CheckCircle className="h-4 w-4 text-emerald-600" />;
                          } else if (isSelect) {
                            optStyle = "border-red-500 bg-red-50 text-red-800 font-extrabold ring-1 ring-red-400";
                            checkBadge = <XCircle className="h-4 w-4 text-red-600" />;
                          } else {
                            optStyle = "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                          }
                        } else if (isSelect) {
                          optStyle = "border-[#000080] bg-[#000080]/8 text-slate-900 font-black ring-1 ring-[#000080]/20";
                        }

                        return (
                          <motion.button
                            key={idx}
                            id={`ca-option-btn-${idx}`}
                            disabled={isSubmitted}
                            onClick={() => handleOptionSelect(idx)}
                            whileHover={!isSubmitted ? { scale: 1.015, x: 2 } : {}}
                            whileTap={!isSubmitted ? { scale: 0.99 } : {}}
                            className={`w-full text-left py-3 px-4 rounded-xl border transition-all duration-150 text-xs flex items-center justify-between ${
                              isSubmitted ? "cursor-default" : "cursor-pointer"
                            } ${optStyle}`}
                          >
                            <span>{option}</span>
                            {checkBadge}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-[11px] leading-relaxed text-slate-800 font-sans"
                        id="ca-quiz-explanation"
                      >
                        <strong className="text-amber-900 block font-black uppercase mb-1">EXPLANATION / विश्लेषण</strong>
                        {selectedNews.quizQuestion.explanation}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Submit and Next Question row */}
                <div className="p-6 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={handleNextNews}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Next Bulletin</span>
                  </button>

                  {!isSubmitted ? (
                    <button
                      id="ca-quiz-submit-button"
                      disabled={userAnswer === null}
                      onClick={handleSubmitAnswer}
                      className="bg-[#000080] hover:bg-[#000060] text-white disabled:opacity-40 px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors duration-150 flex items-center space-x-1 shadow-md"
                    >
                      <span>Check Answer</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <button
                      id="ca-quiz-next-nav-button"
                      onClick={handleNextNews}
                      className="bg-[#138808] hover:bg-[#117706] text-white px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors duration-150 flex items-center space-x-1 shadow-md"
                    >
                      <span>Explore Next News</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center shadow" id="ca-view-fallback">
              <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-bold">Select a bulletin from the list to launch the animated quiz.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
