import React, { useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "motion/react";
import { 
  Shield, Award, BookOpen, FileText, Briefcase, Globe, 
  MessageSquare, LayoutDashboard, Settings, Bell, Clock, 
  Flame, CheckCircle, XCircle, ChevronRight, HelpCircle, Landmark 
} from "lucide-react";

// Import modular child components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdSenseSidebar from "./components/AdSenseSidebar";
import QuizEngine from "./components/QuizEngine";
import StudyMaterial from "./components/StudyMaterial";
import PdfLibrary from "./components/PdfLibrary";
import JobsSection from "./components/JobsSection";
import BlogSection from "./components/BlogSection";
import CurrentAffairs from "./components/CurrentAffairs";
import AiAssistant from "./components/AiAssistant";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import SeoPages from "./components/SeoPages";

import { 
  UserProfile, Quiz, JobPost, QuizHistoryItem, UserCertificate 
} from "./types";
import { 
  MOCK_QUIZZES, MOCK_JOBS, MOCK_NOTES, MOCK_PDFS, ARMY_PREV_QUESTIONS
} from "./data/mockData";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>("about");
  
  // Student Profile state (Authenticated)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [profile, setProfile] = useState<UserProfile>({
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

  // Daily GK Question state
  const [dailyGkChoice, setDailyGkChoice] = useState<number | null>(null);
  const [dailyGkFeedback, setDailyGkFeedback] = useState<string>("");

  // Interactive Previous Army Paper Quiz states
  const [armyQuizIdx, setArmyQuizIdx] = useState<number>(0);
  const [selectedArmyOption, setSelectedArmyOption] = useState<string | null>(null);
  const [armyAnswered, setArmyAnswered] = useState<boolean>(false);
  const [armyScore, setArmyScore] = useState<number>(0);
  const [armyQuizFinished, setArmyQuizFinished] = useState<boolean>(false);

  // Secondary / Detailed PYQs Feed Quiz states
  const [pyqQuizIdx, setPyqQuizIdx] = useState<number>(0);
  const [pyqSelectedOption, setPyqSelectedOption] = useState<string | null>(null);
  const [pyqAnswered, setPyqAnswered] = useState<boolean>(false);
  const [pyqScore, setPyqScore] = useState<number>(0);
  const [pyqFinished, setPyqFinished] = useState<boolean>(false);

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

  // Notification alerts drawer state
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Agniveer Army Rally 2026 written exam hall tickets are active.", type: "urgent" },
    { id: 2, text: "Indian Navy Marine Commando CEE syllabus update released.", type: "new" },
    { id: 3, text: "Weekly National General Knowledge test commences on Sunday.", type: "general" }
  ]);

  // Quizzes and Jobs counts managed for Admin imports
  const [activeQuizzes, setActiveQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [activeJobs, setActiveJobs] = useState<JobPost[]>(MOCK_JOBS);

  // Authenticate triggers
  const handleLoginToggle = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      // seed or keep profile
    }
  };

  // Callback when student completes a quiz
  const handleQuizCompleted = (hItem: QuizHistoryItem, cert?: UserCertificate) => {
    setProfile(prev => {
      const updatedHistory = [hItem, ...prev.history];
      const updatedCerts = cert ? [cert, ...prev.certificates] : prev.certificates;
      const pointAccr = hItem.scorePercentage >= 50 ? 150 : 50;

      return {
        ...prev,
        history: updatedHistory,
        certificates: updatedCerts,
        points: prev.points + pointAccr
      };
    });

    // Add immediate system notification
    setNotifications(prev => [
      { id: Date.now(), text: `Jai Hind! You completed ${hItem.quizTitle} mock test with ${hItem.scorePercentage}% score.`, type: "general" },
      ...prev
    ]);
  };

  const toggleBookmark = (qId: string) => {
    setProfile(prev => {
      const exists = prev.bookmarkedQuestionIds.includes(qId);
      const updated = exists 
        ? prev.bookmarkedQuestionIds.filter(id => id !== qId)
        : [...prev.bookmarkedQuestionIds, qId];

      return { ...prev, bookmarkedQuestionIds: updated };
    });
  };

  // Add quiz from admin panel
  const handleAdminAddQuiz = (newQuiz: Quiz) => {
    // Adding to preseeded quiz index
    setActiveQuizzes(prev => [newQuiz, ...prev]);
    MOCK_QUIZZES.unshift(newQuiz); // persistent during memory runtime
  };

  const handleAdminAddJob = (newJob: JobPost) => {
    setActiveJobs(prev => [newJob, ...prev]);
    MOCK_JOBS.unshift(newJob);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between" id="app-root-container">
      
      {/* 1. Traditional Flag-Inspired Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isAuthenticated={isAuthenticated}
        onLoginClick={handleLoginToggle}
        onLogoutClick={handleLoginToggle}
        notificationCount={notifications.length}
        setNotificationDrawerOpen={setNotificationDrawerOpen}
      />

      {/* 2. Top Banner Notification Ticker */}
      <div className="bg-[#FF9933]/10 border-b border-[#FF9933]/25 py-2 overflow-hidden" id="notice-alert-ticker">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-2 text-xs text-[#aa4400] font-sans font-bold">
          <span className="bg-[#FF9933] text-black px-1.5 py-0.5 rounded text-[10px] uppercase font-black tracking-widest leading-none shrink-0 animate-pulse">Running alerts</span>
          <span className="truncate">🛡 Notification: Agniveer Army Navy Airforce Mock Portal is active in preparation. Register today to win verified academy badges.</span>
        </div>
      </div>

      {/* 3. Main Body Container with Two Column Split for certain sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full" id="main-content-layout">
        
        {/* LANDING HOMEPAGE LAYOUT */}
        {currentTab === "home" && (
          <div className="space-y-8" id="home-view-container">
            
            {/* A. Hero Banner Section with Two Columns: Left text info and Right interactive Quiz card */}
            <div className="bg-gradient-to-br from-[#FF9933]/5 via-white to-[#138808]/5 rounded-[2rem] p-6 sm:p-10 border border-gray-150/80 shadow-sm relative overflow-hidden" id="hero-banner-sec">
              {/* Subtle ambient lighting orbs */}
              <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] bg-[#FF9933]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-[#138808]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10 w-full">
                {/* Left Side Content - Col span 7 */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center space-x-1.5 border border-amber-300/60 bg-amber-50/60 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-800 tracking-wider">
                    <span>✨</span>
                    <span>100% FREE • ADSENSE READY</span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-3xl sm:text-5xl lg:text-[4.2rem] font-extrabold text-[#0f172a] tracking-tight leading-[1.08] font-sans" id="hero-heading">
                    India's Complete <br />
                    <span className="bg-gradient-to-r from-[#FF9933] via-[#a855f7] to-[#138808] bg-clip-text text-transparent">Government</span> Exam <br />
                    Preparation Platform
                  </h1>

                  {/* Body Text */}
                  <p className="text-xs sm:text-[14px] text-gray-550 font-sans leading-relaxed max-w-2xl">
                    Practice GK Quizzes, Mock Tests, Current Affairs, Study Notes and Government Job Preparation Materials for the Indian Armed Forces, SSC, Railway, UPSC, Banking and more.
                  </p>

                  {/* Buttons Row */}
                  <div className="flex flex-wrap gap-2.5 pt-2" id="hero-cta-group">
                    <button
                      id="btn-quick-quiz"
                      onClick={() => setCurrentTab("quizzes")}
                      className="bg-[#FF9933] hover:bg-[#dd8822] text-black font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 cursor-pointer hover:scale-105 active:scale-95 border border-[#FF9933]/10"
                    >
                      <span>Start Quiz</span>
                      <span>➔</span>
                    </button>

                    <button
                      id="btn-quick-jobs"
                      onClick={() => setCurrentTab("jobs")}
                      className="bg-[#138808] hover:bg-[#117706] text-white font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    >
                      Latest Jobs
                    </button>

                    <button
                      id="btn-quick-study"
                      onClick={() => setCurrentTab("study")}
                      className="border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    >
                      Study Material
                    </button>

                    <button
                      id="btn-quick-current"
                      onClick={() => setCurrentTab("current")}
                      className="border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                    >
                      Current Affairs
                    </button>
                  </div>

                  {/* KPI Metrics row */}
                  <motion.div 
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {[
                      { icon: BookOpen, val: "30+", desc: "Quiz Categories" },
                      { icon: FileText, val: "10K+", desc: "Practice Questions" },
                      { icon: Briefcase, val: "500+", desc: "Latest Job Updates" },
                      { icon: Award, val: "1L+", desc: "Students Preparing" }
                    ].map((metric, idx) => {
                      const Icon = metric.icon;
                      return (
                        <motion.div 
                          key={idx} 
                          className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm space-y-2 text-left transition-all duration-300 relative overflow-hidden"
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { 
                              opacity: 1, 
                              y: 0,
                              transition: { type: "spring", stiffness: 100, damping: 16 }
                            }
                          }}
                          whileHover={{ 
                            y: -4, 
                            scale: 1.03,
                            boxShadow: "0 10px 20px -5px rgba(0, 0, 128, 0.08), 0 4px 6px -2px rgba(255, 153, 51, 0.04)"
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {/* Top mini slide-over accent line matching Indian tricolor colors subtly */}
                          <div className={`absolute top-0 left-0 right-0 h-[2.5px] opacity-80 ${
                            idx % 3 === 0 
                              ? "bg-[#FF9933]" 
                              : idx % 3 === 1 
                                ? "bg-indigo-600" 
                                : "bg-[#138808]"
                          }`} />

                          <div className="flex items-center space-x-1.5 text-[#FF9933]">
                            <motion.div
                              animate={{ scale: [1, 1.15, 1] }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 3, 
                                delay: idx * 0.4,
                                ease: "easeInOut" 
                              }}
                            >
                              <Icon className="h-4.5 w-4.5 text-[#FF9933]" />
                            </motion.div>
                          </div>
                          <div>
                            <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none">{metric.val}</p>
                            <p className="text-[10px] text-gray-400 font-bold leading-tight pt-1">{metric.desc}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Right Side: QUIZ OF THE DAY Interactive Widget */}
                <div className="lg:col-span-5 h-full" id="quiz-of-the-day-slot">
                  <div className="bg-white rounded-[2rem] shadow-xl border border-gray-200/90 p-6 sm:p-7 space-y-5 relative overflow-hidden" id="quiz-of-day-card">
                    {/* Top flag stripe header inside the card exactly as shown in screenshot */}
                    <div className="absolute top-0 left-0 right-0 flex h-[4px]" id="internal-card-flag">
                      <div className="w-[45%] h-full bg-[#FF9933]" />
                      <div className="w-[10%] h-full bg-transparent" />
                      <div className="w-[45%] h-full bg-[#138808]" />
                    </div>

                    {/* Sub title row with trophy icon */}
                    <div className="flex justify-between items-start pt-1.5">
                      <div className="space-y-1">
                        <span className="text-[11px] font-black tracking-widest text-[#FF9933] uppercase font-mono flex items-center">
                          <Flame className="h-4 w-4 mr-1 animate-pulse" />
                          PREVIOUS PAPER QUIZ
                        </span>
                        <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                          Indian Army GD / Clerk
                        </h4>
                      </div>
                      <div className="text-amber-500 shrink-0">
                        <Award className="h-8 w-8 text-[#FF9933] stroke-[1.5]" />
                      </div>
                    </div>

                    {/* Dynamic Interactive Quiz Widget */}
                    {armyQuizFinished ? (
                      <div className="space-y-5 text-center py-4 animate-fade-in" id="army-quiz-finished-view">
                        {/* Congratulations Celebration */}
                        <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center text-4xl shadow-sm mb-2 animate-bounce">
                          🏆
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xl font-extrabold text-[#138808]">Jai Hind! Congratulations 🇮🇳</h4>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider font-mono">Previous Paper Quiz Completed!</p>
                        </div>

                        {/* Big Score Bubble */}
                        <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl max-w-xs mx-auto space-y-1">
                          <div className="text-[10px] font-bold text-gray-500 tracking-wider">YOUR SCORE / आपका स्कोर</div>
                          <div className="text-4xl font-black text-slate-900 font-mono">
                            {armyScore} / {ARMY_PREV_QUESTIONS.length}
                          </div>
                          <div className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                            {Math.round((armyScore / ARMY_PREV_QUESTIONS.length) * 100)}% Accuracy Rate
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 px-4 leading-relaxed font-semibold">
                          {armyScore >= 4 
                            ? "Excellent! You have remarkable command of Armed Forces previous years questions. You are fully ready for the written exam!" 
                            : "Good attempt! Keep revising with our study materials to boost your core performance in Army exam tracks."}
                        </p>

                        <div className="space-y-2 pt-2">
                          <button
                            id="btn-restart-army-quiz"
                            onClick={() => {
                              setArmyQuizIdx(0);
                              setSelectedArmyOption(null);
                              setArmyAnswered(false);
                              setArmyScore(0);
                              setArmyQuizFinished(false);
                            }}
                            className="w-full bg-[#138808] hover:bg-[#117706] text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                          >
                            <span>🔄 Practice Again (दोबारा अभ्यास करें)</span>
                          </button>

                          <button
                            id="btn-goto-full-quizzes"
                            onClick={() => {
                              setCurrentTab("quizzes");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-950 font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <span>Explore All 12 Exam Track Quizzes ➔</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5" id="army-quiz-active-view">
                        {/* Question Header & Micro Stepper */}
                        <div className="flex items-center justify-between text-[11px] font-bold font-mono">
                          <span className="text-[#000080] bg-blue-50 px-2.5 py-1 rounded">
                            BILINGUAL / हिंदी + ENG
                          </span>
                          <span className="text-slate-500">
                            Q. {armyQuizIdx + 1} of {ARMY_PREV_QUESTIONS.length}
                          </span>
                        </div>

                        {/* Micro Progress Bar */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-[#FF9933] to-[#138808] h-full transition-all duration-300"
                            style={{ width: `${((armyQuizIdx + 1) / ARMY_PREV_QUESTIONS.length) * 100}%` }}
                          />
                        </div>

                        {/* Rich Bilingual Question Box */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-150 text-left space-y-2">
                          <div className="text-slate-950 text-[14px] sm:text-[15px] font-black leading-snug">
                            <span className="text-[#FF9933] font-mono mr-1">Q{armyQuizIdx + 1}.</span>
                            {ARMY_PREV_QUESTIONS[armyQuizIdx].englishQ}
                          </div>
                          <div className="text-[#138808] text-[12px] font-extrabold leading-relaxed border-t border-dashed border-gray-200/80 pt-1.5">
                            🇮🇳 {ARMY_PREV_QUESTIONS[armyQuizIdx].hindiQ}
                          </div>
                        </div>

                        {/* Options list */}
                        <div className="space-y-2.5 text-xs text-left">
                          {ARMY_PREV_QUESTIONS[armyQuizIdx].options.map((opt) => {
                            const isSelected = selectedArmyOption === opt.key;
                            const isCorrectOption = opt.isCorrect;
                            
                            let buttonStyle = "bg-white hover:bg-slate-50 border-gray-150 text-slate-700 font-semibold";
                            if (armyAnswered) {
                              if (isCorrectOption) {
                                buttonStyle = "border-emerald-500 bg-emerald-50/45 text-emerald-800 font-black ring-2 ring-emerald-500/20";
                              } else if (isSelected && !isCorrectOption) {
                                buttonStyle = "border-red-500 bg-red-50/45 text-red-800 font-bold ring-2 ring-red-500/10";
                              } else {
                                buttonStyle = "bg-slate-50/30 border-gray-100 text-slate-400 opacity-60";
                              }
                            } else {
                              if (isSelected) {
                                buttonStyle = "border-blue-500 bg-blue-50 text-blue-900 font-semibold";
                              }
                            }

                            return (
                              <button
                                key={opt.key}
                                onClick={() => {
                                  if (armyAnswered) return;
                                  setSelectedArmyOption(opt.key);
                                  setArmyAnswered(true);
                                  if (isCorrectOption) {
                                    setArmyScore(prev => prev + 1);
                                  }
                                }}
                                id={`army-choice-${opt.key}`}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${buttonStyle}`}
                              >
                                <span className="pr-2">{opt.text}</span>
                                {armyAnswered && isCorrectOption && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded shrink-0 font-sans">
                                    ✓ Correct
                                  </span>
                                )}
                                {armyAnswered && isSelected && !isCorrectOption && (
                                  <span className="text-[10px] bg-red-100 text-red-800 font-black px-1.5 py-0.5 rounded shrink-0 font-sans">
                                    ✗ Wrong
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Feedback Block */}
                        {armyAnswered && (
                          <div className="bg-amber-50/40 border border-amber-200/60 p-3.5 rounded-xl text-[11px] leading-relaxed text-slate-700 text-left space-y-1.5" id="army-explanation-box">
                            <p className="font-extrabold text-amber-900 border-b border-amber-200/30 pb-1">💡 EXPLANATION / विश्लेषण :</p>
                            <p className="font-medium text-slate-800"><span className="font-bold font-mono">Eng:</span> {ARMY_PREV_QUESTIONS[armyQuizIdx].explanationEng}</p>
                            <p className="font-medium text-slate-600"><span className="font-bold">Hin:</span> {ARMY_PREV_QUESTIONS[armyQuizIdx].explanationHin}</p>
                          </div>
                        )}

                        {/* Navigation Button */}
                        {armyAnswered && (
                          <button
                            id="btn-army-quiz-next"
                            onClick={() => {
                              if (armyQuizIdx === ARMY_PREV_QUESTIONS.length - 1) {
                                setArmyQuizFinished(true);
                                triggerCelebration();
                              } else {
                                setArmyQuizIdx(prev => prev + 1);
                                setSelectedArmyOption(null);
                                setArmyAnswered(false);
                              }
                            }}
                            className="w-full bg-[#0f172a] hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl shadow transition-all flex items-center justify-center space-x-1 cursor-pointer animate-pulse"
                          >
                            <span>
                              {armyQuizIdx === ARMY_PREV_QUESTIONS.length - 1 
                                ? "Finish & View Results! (परिणाम देखें)" 
                                : "Next Question (अगला प्रश्न) ➔"}
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* B. Two Column Layout split: content on left, AdSense Ready block on right */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="home-columns-split">
              
              {/* Left Column content directory */}
              <div className="lg:col-span-2 space-y-8" id="home-primary-feed">
                
                {/* 1. Mini dashboard profile quick link */}
                {isAuthenticated && (
                  <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="home-student-card">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-indigo-50 text-[#000080] rounded-xl font-bold flex items-center justify-center">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-800">Aspirant: {profile.name}</h4>
                        <p className="text-[10px] text-gray-400 font-mono font-bold">POINTS ACCUMULATED: {profile.points} Pts</p>
                      </div>
                    </div>

                    <button
                      id="btn-goto-profile-desk"
                      onClick={() => setCurrentTab("dashboard")}
                      className="text-xs font-black text-indigo-700 hover:text-indigo-900 tracking-wider uppercase flex items-center gap-1 cursor-pointer"
                    >
                      <span>Review Badges Desk</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* 3. Sectors of recruitment lists we cater for */}
                <div className="space-y-6" id="exam-catalog-sec">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm uppercase text-gray-500 tracking-wider font-mono">Exam Segments & Key Quizzes</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">12 Active Tracks</span>
                  </div>

                  {/* Interactive Genuine Previous Paper Quiz Module (Bilingual) */}
                  <div className="bg-gradient-to-br from-blue-50/50 via-white to-emerald-50/50 border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 relative overflow-hidden" id="pyq-hub-main-card">
                    {/* Top flag accent border */}
                    <div className="absolute top-0 left-0 right-0 h-1 flex">
                      <div className="w-[33%] bg-[#FF9933]" />
                      <div className="w-[34%] bg-white" />
                      <div className="w-[33%] bg-[#138808]" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-slate-900 text-[#FF9933] text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full font-mono">
                            OFFICIAL PYQ ENGINE
                          </span>
                          <span className="animate-pulse bg-[#138808]/10 text-[#138808] border border-[#138808]/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ★ 100% Genuine Questions
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug text-left">
                          Indian Army GD / Agniveer Previous Year Question Paper (Bilingual)
                        </h4>
                        <p className="text-[11px] font-bold text-gray-500 font-sans text-left">
                          🎯 विगत वर्षों के परीक्षाओं (2020-2025) में पूछे गए सबसे महत्वपूर्ण वास्तविक प्रश्न
                        </p>
                      </div>

                      {/* Score Badge / Floating step counts */}
                      <div className="flex items-center space-x-2.5 shrink-0 self-start sm:self-center">
                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-center shadow-sm">
                          <p className="text-[9px] font-bold text-gray-400 font-mono uppercase tracking-wider">SUCCESS RATE</p>
                          <p className="text-sm font-black text-slate-800 font-mono">
                            {pyqAnswered || pyqFinished ? `${Math.round((pyqScore / (pyqFinished ? ARMY_PREV_QUESTIONS.length : Math.max(pyqQuizIdx, 1))) * 100)}%` : "0%"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {pyqFinished ? (
                      <div className="py-6 text-center space-y-6 max-w-xl mx-auto animate-fade-in" id="pyq-results-board">
                        {/* Celebrate Banner */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-150 shadow-inner text-4xl animate-bounce">
                          🏆
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-[#138808]">जय हिन्द! Grand Congratulations!</h3>
                          <p className="text-xs text-gray-550 font-bold uppercase tracking-wider font-mono">
                            You completed the National Army Solved Paper simulator!
                          </p>
                        </div>

                        {/* Detailed Score Breakdown */}
                        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                          <div className="grid grid-cols-2 gap-4 divide-x divide-slate-105">
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-gray-400 font-mono uppercase">FINAL SCORE / स्कोर</p>
                              <p className="text-3xl font-black text-slate-800 font-mono pt-1">
                                {pyqScore} / {ARMY_PREV_QUESTIONS.length}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-bold text-gray-400 font-mono uppercase">ACCURACY / सटीकता</p>
                              <p className="text-3xl font-black text-[#138808] font-mono pt-1">
                                {Math.round((pyqScore / ARMY_PREV_QUESTIONS.length) * 100)}%
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed font-semibold">
                            {pyqScore >= 8 
                              ? "🎖️ Outstanding Performance! Your prep level matches state standard merit lists. Keep up the high accuracy rate!" 
                              : pyqScore >= 5 
                              ? "👍 Good Job! You cleared the cut-off. Focus on general knowledge and science units to lock in top spots." 
                              : "📚 Keep Practicing! Armed forces exams require consistent revision of previous years' papers. Study notes to quickly score better."}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button
                            id="btn-pyq-retry"
                            onClick={() => {
                              setPyqQuizIdx(0);
                              setPyqSelectedOption(null);
                              setPyqAnswered(false);
                              setPyqScore(0);
                              setPyqFinished(false);
                            }}
                            className="bg-[#138808] hover:bg-[#117706] text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow cursor-pointer transition-transform duration-100 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
                          >
                            <span>🔄 Practice Again (दोबारा हल करें)</span>
                          </button>
                          
                          <button
                            id="btn-scroll-segments"
                            onClick={() => {
                              const el = document.getElementById("exam-segments-grid");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 font-extrabold text-xs py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                          >
                            Explore 12 Other Core Categories
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5 animate-fade-in" id="pyq-quiz-active-interface">
                        {/* Top Micro info bar */}
                        <div className="flex items-center justify-between text-xs font-mono font-bold">
                          <span className="text-[#000080] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            Q. {pyqQuizIdx + 1} of {ARMY_PREV_QUESTIONS.length}
                          </span>
                          <span className="text-slate-400">
                            CATEGORY: GENERAL KNOWLEDGE (GK)
                          </span>
                        </div>

                        {/* Visual Step Bar */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                          {ARMY_PREV_QUESTIONS.map((_, idx) => {
                            let stepColor = "bg-slate-200";
                            if (idx < pyqQuizIdx) stepColor = "bg-[#138808]";
                            else if (idx === pyqQuizIdx) stepColor = "bg-[#FF9933] animate-pulse";
                            return (
                              <div 
                                key={idx} 
                                className={`h-full border-r border-white/50 last:border-0 transition-all flex-1 ${stepColor}`} 
                              />
                            );
                          })}
                        </div>

                        {/* Rich Bilingual Question Panel */}
                        <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                          <p className="text-slate-900 text-sm sm:text-base font-extrabold leading-snug text-left">
                            <span className="text-[#FF9933] font-mono mr-1.5">Q{pyqQuizIdx + 1}.</span>
                            {ARMY_PREV_QUESTIONS[pyqQuizIdx].englishQ}
                          </p>
                          <p className="text-[#138808] text-xs sm:text-sm font-extrabold pb-1 leading-relaxed border-t border-dashed border-slate-200 pt-3 text-left">
                            🇮🇳 {ARMY_PREV_QUESTIONS[pyqQuizIdx].hindiQ}
                          </p>
                        </div>

                        {/* Interactive Options list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="pyq-options-container">
                          {ARMY_PREV_QUESTIONS[pyqQuizIdx].options.map((opt) => {
                            const isSelected = pyqSelectedOption === opt.key;
                            const isCorrectOption = opt.isCorrect;
                            
                            let optionCardStyle = "bg-white border-gray-200 text-slate-800 hover:bg-slate-50 hover:border-gray-300";
                            
                            if (pyqAnswered) {
                              if (isCorrectOption) {
                                optionCardStyle = "border-emerald-500 bg-emerald-50/40 text-emerald-800 font-extrabold ring-2 ring-emerald-400/20";
                              } else if (isSelected) {
                                optionCardStyle = "border-red-500 bg-red-50/40 text-red-800 font-extrabold ring-2 ring-red-400/20";
                              } else {
                                optionCardStyle = "bg-slate-50/40 border-slate-100 text-slate-450 opacity-60";
                              }
                            } else {
                              if (isSelected) {
                                optionCardStyle = "border-blue-500 bg-blue-50/60 text-blue-900 font-bold ring-2 ring-blue-500/20";
                              }
                            }

                            return (
                              <button
                                key={opt.key}
                                id={`pyq-option-${opt.key}`}
                                disabled={pyqAnswered}
                                onClick={() => {
                                  setPyqSelectedOption(opt.key);
                                  setPyqAnswered(true);
                                  if (isCorrectOption) {
                                    setPyqScore(prev => prev + 1);
                                  }
                                }}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-center justify-between cursor-pointer text-xs sm:text-sm ${optionCardStyle}`}
                              >
                                <span>{opt.text}</span>
                                {pyqAnswered && isCorrectOption && (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full font-sans uppercase">
                                    Correct ✓
                                  </span>
                                )}
                                {pyqAnswered && isSelected && !isCorrectOption && (
                                  <span className="text-[10px] bg-red-100 text-red-800 font-black px-2 py-0.5 rounded-full font-sans uppercase">
                                    Incorrect ✗
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Detailed Bilingual Explanation Modal/Block */}
                        {pyqAnswered && (
                          <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl text-left space-y-2 text-xs leading-relaxed animate-fade-in" id="pyq-explanation-box">
                            <div className="flex items-center space-x-1.5 font-bold text-amber-950 uppercase tracking-wide border-b border-amber-200/50 pb-1.5">
                              <span>💡</span>
                              <span>EXPLANATION / विश्लेषण :</span>
                            </div>
                            <p className="text-slate-800 font-medium font-sans">
                              <span className="font-bold text-slate-900 font-mono mr-1">English:</span>
                              {ARMY_PREV_QUESTIONS[pyqQuizIdx].explanationEng}
                            </p>
                            <p className="text-slate-600 font-medium">
                              <span className="font-bold text-[#138808] mr-1">हिन्दी:</span>
                              {ARMY_PREV_QUESTIONS[pyqQuizIdx].explanationHin}
                            </p>
                          </div>
                        )}

                        {/* Next question Controls */}
                        {pyqAnswered && (
                          <div className="pt-2 flex justify-end">
                            <button
                              id="btn-pyq-next-action"
                              onClick={() => {
                                if (pyqQuizIdx === ARMY_PREV_QUESTIONS.length - 1) {
                                  setPyqFinished(true);
                                  triggerCelebration();
                                } else {
                                  setPyqQuizIdx(prev => prev + 1);
                                  setPyqSelectedOption(null);
                                  setPyqAnswered(false);
                                }
                              }}
                              className="w-full sm:w-auto bg-[#0f172a] hover:bg-slate-900 text-white font-black text-xs sm:text-sm py-3 px-8 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                            >
                              <span>
                                {pyqQuizIdx === ARMY_PREV_QUESTIONS.length - 1 
                                  ? "Finish Simulator & See Scores (परिणाम देखें)" 
                                  : "Next Previous Paper Question ➔"}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="exam-segments-grid">
                    {[
                      {
                        emoji: "🪖",
                        categoryName: "Indian Army GK",
                        description: "Test your knowledge on the Indian Army's history, ranks and operations.",
                        questions: "10 Qs",
                        difficulty: "Medium",
                        color: "amber"
                      },
                      {
                        emoji: "⚓",
                        categoryName: "Indian Navy GK",
                        description: "Naval history, vessels, ranks and operations of the Indian Navy.",
                        questions: "8 Qs",
                        difficulty: "Medium",
                        color: "blue"
                      },
                      {
                        emoji: "✈️",
                        categoryName: "Indian Air Force GK",
                        description: "Aircraft, squadrons and history of the IAF.",
                        questions: "7 Qs",
                        difficulty: "Medium",
                        color: "sky"
                      },
                      {
                        emoji: "🏛️",
                        categoryName: "Indian Constitution",
                        description: "Articles, schedules and key provisions of the Constitution of India.",
                        questions: "8 Qs",
                        difficulty: "Medium",
                        color: "purple"
                      },
                      {
                        emoji: "📜",
                        categoryName: "Indian History",
                        description: "Ancient, medieval and modern Indian history.",
                        questions: "7 Qs",
                        difficulty: "Medium",
                        color: "orange"
                      },
                      {
                        emoji: "🗺️",
                        categoryName: "Indian Geography",
                        description: "Physical and economic geography of India.",
                        questions: "7 Qs",
                        difficulty: "Easy",
                        color: "green"
                      },
                      {
                        emoji: "📰",
                        categoryName: "Current Affairs",
                        description: "Daily updates from India and the world.",
                        questions: "5 Qs",
                        difficulty: "Medium",
                        color: "red"
                      },
                      {
                        emoji: "🛡️",
                        categoryName: "Agniveer Quiz",
                        description: "Practice for Agniveer Army/Navy/Air Force.",
                        questions: "5 Qs",
                        difficulty: "Medium",
                        color: "teal"
                      },
                      {
                        emoji: "🎯",
                        categoryName: "NDA Quiz",
                        description: "Combined Defence Service entry.",
                        questions: "5 Qs",
                        difficulty: "Hard",
                        color: "rose"
                      },
                      {
                        emoji: "🎖️",
                        categoryName: "CDS Quiz",
                        description: "Officer entry to IMA, INA, AFA, OTA.",
                        questions: "5 Qs",
                        difficulty: "Hard",
                        color: "indigo"
                      },
                      {
                        emoji: "🛩️",
                        categoryName: "AFCAT Quiz",
                        description: "Air Force Common Admission Test.",
                        questions: "5 Qs",
                        difficulty: "Medium",
                        color: "cyan"
                      },
                      {
                        emoji: "🧠",
                        categoryName: "General Knowledge",
                        description: "Mixed GK from every topic.",
                        questions: "5 Qs",
                        difficulty: "Medium",
                        color: "pink"
                      }
                    ].map((seg, idx) => (
                      <div
                        key={idx}
                        id={`segment-card-${idx}`}
                        onClick={() => {
                          setCurrentTab("quizzes");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="group relative cursor-pointer text-left bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden"
                      >
                        {/* Interactive hover color splash accent */}
                        <div className={`absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-[0.06] transition-opacity group-hover:opacity-[0.12] pointer-events-none ${
                          seg.color === "amber" ? "bg-amber-600" :
                          seg.color === "blue" ? "bg-blue-600" :
                          seg.color === "sky" ? "bg-sky-600" :
                          seg.color === "purple" ? "bg-purple-600" :
                          seg.color === "orange" ? "bg-orange-600" :
                          seg.color === "green" ? "bg-emerald-600" :
                          seg.color === "red" ? "bg-red-600" :
                          seg.color === "teal" ? "bg-teal-600" :
                          seg.color === "rose" ? "bg-rose-600" :
                          seg.color === "indigo" ? "bg-indigo-600" :
                          seg.color === "cyan" ? "bg-cyan-600" :
                          "bg-pink-600"
                        }`} />

                        <div className="space-y-4">
                          {/* Top Row: Emoji Icon block & Metadata badges */}
                          <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform duration-200 group-hover:scale-110 select-none ${
                              seg.color === "amber" ? "bg-amber-50 border border-amber-200 text-amber-900" :
                              seg.color === "blue" ? "bg-blue-50 border border-blue-200 text-blue-900" :
                              seg.color === "sky" ? "bg-sky-50 border border-sky-200 text-sky-900" :
                              seg.color === "purple" ? "bg-purple-50 border border-purple-200 text-purple-900" :
                              seg.color === "orange" ? "bg-orange-50 border border-orange-200 text-orange-900" :
                              seg.color === "green" ? "bg-emerald-50 border border-emerald-200 text-emerald-900" :
                              seg.color === "red" ? "bg-red-50 border border-red-200 text-red-900" :
                              seg.color === "teal" ? "bg-teal-50 border border-teal-200 text-teal-900" :
                              seg.color === "rose" ? "bg-rose-50 border border-rose-200 text-rose-900" :
                              seg.color === "indigo" ? "bg-indigo-50 border border-indigo-200 text-indigo-900" :
                              seg.color === "cyan" ? "bg-cyan-50 border border-cyan-200 text-cyan-900" :
                              "bg-pink-50 border border-pink-200 text-pink-900"
                            }`}>
                              {seg.emoji}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full shrink-0">
                                {seg.questions}
                              </span>
                              <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                                seg.difficulty === "Easy" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                seg.difficulty === "Hard" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                                "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {seg.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          {/* Info section */}
                          <div className="space-y-1">
                            <h4 className="text-sm font-black text-gray-900 tracking-tight transition-colors duration-200 group-hover:text-[#000080]">
                              {seg.categoryName}
                            </h4>
                            <p className="text-[11px] text-gray-500 leading-relaxed font-sans line-clamp-2">
                              {seg.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Footer segment: CTA Action */}
                        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-extrabold text-[#000080]/80 group-hover:text-[#000080] group-hover:underline">
                          <span>Practice Now</span>
                          <span className="transform translate-x-0 transition-transform duration-200 group-hover:translate-x-1">➔</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Dynamic AI Assistant quick summary widget */}
                <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-l-4 border-l-[#138808]" id="ai-teaser-banner">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black tracking-widest text-[#138808] uppercase bg-[#138808]/10 px-2 py-0.5 rounded">Agni AI Tutor</span>
                    <h4 className="font-black text-sm text-gray-900">Confused about commission ranks index or constitution laws?</h4>
                    <p className="text-[11px] text-gray-550 leading-relaxed font-sans">Chat instantly with Agni AI, our highly calibrated study advisor.</p>
                  </div>

                  <button
                    id="btn-teaser-chat"
                    onClick={() => setCurrentTab("chat")}
                    className="bg-[#000080] hover:bg-[#000060] text-white text-xs font-black py-2.5 px-5 rounded-lg shrink-0 uppercase tracking-widest shadow"
                  >
                    Launch Tutor
                  </button>
                </div>

              </div>

              {/* Right Column details dashboard simulator for ads and checks */}
              <div className="space-y-6 lg:col-span-1" id="home-secondary-right-side">
                <AdSenseSidebar />
              </div>

            </div>

          </div>
        )}

        {/* VERIFIED QUIZ PORTALS */}
        {currentTab === "quizzes" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="quizzes-view-split">
            <div className="lg:col-span-2">
              <QuizEngine
                onQuizCompleted={handleQuizCompleted}
                userBookmarks={profile.bookmarkedQuestionIds}
                toggleBookmark={toggleBookmark}
                userName={profile.name}
              />
            </div>
            
            <div className="lg:col-span-1">
              <AdSenseSidebar />
            </div>
          </div>
        )}

        {/* COMPREHENSIVE STUDY MATERIAL NOTES */}
        {currentTab === "study" && (
          <StudyMaterial />
        )}

        {/* DAILY INTERACTIVE समसामयिकी (CURRENT AFFAIRS) SECTION */}
        {currentTab === "current" && (
          <CurrentAffairs />
        )}

        {/* VERIFIED PDF CYCLING CENTER */}
        {currentTab === "pdfs" && (
          <PdfLibrary />
        )}

        {/* ACTIVE VACANCIES ALERTS MODULE */}
        {currentTab === "jobs" && (
          <JobsSection />
        )}

        {/* GENERAL KNOWLEDGE TIPS ARTICLES */}
        {currentTab === "blog" && (
          <BlogSection />
        )}

        {/* MANDATORY ADSENSE DISCLOSURES ACCORDION */}
        {currentTab === "policies" && (
          <SeoPages initialPolicyId={selectedPolicyId} />
        )}

        {/* ACTIVE CANDIDATE ACCOUNT BOARD */}
        {currentTab === "dashboard" && (
          <Dashboard 
            profile={profile} 
            setCurrentTab={setCurrentTab}
          />
        )}

        {/* DYNAMIC SYSTEM ADMINISTRATION CONSOLE */}
        {currentTab === "admin" && (
          <AdminPanel
            onAddQuiz={handleAdminAddQuiz}
            onAddJob={handleAdminAddJob}
            quizzesCount={activeQuizzes.length}
            jobsCount={activeJobs.length}
          />
        )}

        {/* REAL-TIME AI TUTOR SCREEN */}
        {currentTab === "chat" && (
          <div className="max-w-4xl mx-auto" id="chat-tab-viewport">
            <AiAssistant />
          </div>
        )}

      </main>

      {/* 4. Active notification drawer display list panels */}
      {notificationDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="activity-alert-drawer">
          {/* Backdrop screen */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setNotificationDrawerOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between" id="activity-alert-sheet">
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-gray-50 shrink-0">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-[#000080]" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-800">Aspirant Live Alerts</h4>
              </div>

              <button 
                onClick={() => setNotificationDrawerOpen(false)}
                className="text-xs font-bold text-gray-400 hover:text-gray-900 border px-1.5 py-0.5 rounded cursor-pointer"
              >
                Close ×
              </button>
            </div>

            {/* List items */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3.5" id="notification-entries">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  id={`notif-${n.id}`}
                  className="p-3.5 bg-gray-50 border border-gray-150 rounded-xl space-y-1 relative"
                >
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded inline-block ${
                    n.type === "urgent" ? "bg-red-50 text-red-700 border border-red-200" :
                    n.type === "new" ? "bg-green-50 text-green-700 border border-green-200" :
                    "bg-[#000080]/10 text-[#000080]"
                  }`}>
                    {n.type}
                  </span>
                  <p className="text-xs text-gray-800 leading-snug font-sans">{n.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 border-t text-[10px] text-gray-400 font-mono text-center shrink-0">
              Helpline operations support: +91 141 2450011
            </div>
          </div>
        </div>
      )}

      {/* 5. Indian National Flag-inspired Footer */}
      <Footer 
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          // if admin requested
          if (tab === "admin") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }} 
        setSelectedPolicy={setSelectedPolicyId}
      />

      {/* Secret Developer backlink to Admin Operations Panel placed humbly in the footer bar */}
      <div className="bg-gray-950 py-2 border-t border-gray-900 text-center text-[9px] text-gray-600 block shrink-0" id="developer-admin-anchor">
        <span>Admin desk access: </span>
        <button
          id="btn-goto-admin"
          onClick={() => {
            setCurrentTab("admin");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-[#FF9933] hover:underline hover:text-[#ffbb55] font-black tracking-widest uppercase cursor-pointer underline ml-1"
        >
          [Launch Agni Operations Desk ⚙]
        </button>
      </div>

    </div>
  );
}
