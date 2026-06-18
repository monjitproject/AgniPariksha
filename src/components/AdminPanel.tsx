import React, { useState } from "react";
import { 
  Settings, Users, Award, Briefcase, FileText, Globe, 
  DollarSign, Activity, Sparkles, TrendingUp, CheckCircle, Plus
} from "lucide-react";
import { Quiz, Question, JobPost } from "../types";

interface AdminPanelProps {
  onAddQuiz: (newQuiz: Quiz) => void;
  onAddJob: (newJob: JobPost) => void;
  quizzesCount: number;
  jobsCount: number;
}

export default function AdminPanel({
  onAddQuiz,
  onAddJob,
  quizzesCount,
  jobsCount
}: AdminPanelProps) {
  
  // Realtime analytic counters state
  const [trafficImpressions, setTrafficImpressions] = useState(14820);
  const [adsenseClicks, setAdSenseClicks] = useState(742);
  const [estimatedCpcUsd, setEstimatedCpcUsd] = useState(259.70);

  // Form states for creating general GK quiz category item
  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("Agniveer Selection CEE");
  const [quizDifficulty, setQuizDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [quizTimeLimit, setQuizTimeLimit] = useState(150);

  // Single question input arrays
  const [qText, setQText] = useState("");
  const [opt0, setOpt0] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [opt3, setOpt3] = useState("");
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [qExplanation, setQExplanation] = useState("");

  const [messagePrompt, setMessagePrompt] = useState("");

  const handleCreateMockQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim() || !qText.trim()) {
      setMessagePrompt("Quiz Title and at least one Question are required!");
      return;
    }

    const compiledQuestions: Question[] = [
      {
        id: "q-dyn-" + Date.now(),
        text: qText.trim(),
        options: [
          opt0.trim() || "Option A Template",
          opt1.trim() || "Option B Template",
          opt2.trim() || "Option C Template",
          opt3.trim() || "Option D Template",
        ],
        correctAnswer: correctOptionIdx,
        explanation: qExplanation.trim() || "Verified objective answers based on official commission guidelines.",
        category: quizCategory
      }
    ];

    const newQuiz: Quiz = {
      id: "quiz-dyn-" + Date.now(),
      title: quizTitle.trim(),
      category: quizCategory,
      difficulty: quizDifficulty,
      timeLimit: quizTimeLimit,
      questions: compiledQuestions,
      iconName: "Shield"
    };

    onAddQuiz(newQuiz);
    setMessagePrompt("Premium Mock Test successfully injected into system categories!");

    // Reset fields
    setQuizTitle("");
    setQText("");
    setOpt0("");
    setOpt1("");
    setOpt2("");
    setOpt3("");
    setQExplanation("");
    setTimeout(() => setMessagePrompt(""), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-management-panel">
      
      {/* 1. Header description */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4 border-t-[#000080]" id="admin-banner">
        <h2 className="text-xl font-black text-gray-900 flex items-center">
          <Settings className="h-6 w-6 text-gray-650 mr-2" />
          AgniPariksha Board Command Center & Operations
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Monitor search statistics, simulate SEO traffic signals, and deploy authentic mock questions in real-time.
        </p>
      </div>

      {/* 2. SEO & AdSense Earnings Stats Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="adsense-analytic-reporters">
        
        <div className="bg-white p-4.5 rounded-xl border border-gray-150 flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase block font-mono">Monthly Impressions</span>
            <span className="text-2xl font-black text-gray-800 font-mono mt-1 block">
              {trafficImpressions.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            +18.3% organic lift
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-gray-150 flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-gray-400 font-bold uppercase block font-mono">AdSense Clicks</span>
            <span className="text-2xl font-black text-gray-800 font-mono mt-1 block">
              {adsenseClicks.toLocaleString()}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono leading-none mt-2">CTR Average: 5.01%</p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-[#138808]/20 flex flex-col justify-between bg-emerald-50/10">
          <div>
            <span className="text-[9px] text-[#138808] font-black uppercase block font-mono">Calculated CPC Earnings</span>
            <span className="text-2xl font-black text-[#138808] font-mono mt-1 block">
              ${estimatedCpcUsd.toFixed(2)}
            </span>
          </div>
          <p className="text-[9px] text-[#aa4400] font-black uppercase mt-2">★ AdSense Approved Domain</p>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-100 p-4.5 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] text-indigo-400 font-extrabold uppercase block font-mono">Active Database Items</span>
            <div className="text-[11px] space-y-1 font-mono mt-2">
              <p>✔ Quizzes Catalog: <strong className="text-white">{quizzesCount}</strong></p>
              <p>✔ Vacancies Listed: <strong className="text-white">{jobsCount}</strong></p>
            </div>
          </div>
          <button 
            onClick={() => {
              setTrafficImpressions(prev => prev + 120);
              setAdSenseClicks(prev => prev + 4);
              setEstimatedCpcUsd(prev => prev + 1.8);
            }} 
            className="text-[9px] text-[#FF9933] font-bold text-left hover:underline uppercase tracking-wide cursor-pointer mt-3"
          >
            Simulate organic visitor ping ↗
          </button>
        </div>

      </div>

      {/* 3. Graphical trends mockup using SVG */}
      <div className="bg-white rounded-xl p-5 border border-gray-150" id="analytic-graph-chart">
        <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-2 mb-4">
          SEO Traffic & Organic Authority Trends (6 Months)
        </h4>
        
        {/* Simple inline SVG representational area */}
        <div className="h-24 w-full bg-gray-50 rounded-lg relative overflow-hidden flex items-end px-4 border">
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            {/* Draw grid lines */}
            <line x1="0" y1="25" x2="400" y2="25" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="#f0f0f0" strokeWidth="1" />
            <line x1="0" y1="75" x2="400" y2="75" stroke="#f0f0f0" strokeWidth="1" />
            
            {/* Saffron trending line chart */}
            <path 
              d="M 0 85 Q 80 70 160 55 T 320 30 T 400 10" 
              fill="none" 
              stroke="#FF9933" 
              strokeWidth="3.5" 
              strokeLinecap="round"
            />
            {/* India green auxiliary trend line */}
            <path 
              d="M 0 92 Q 80 85 160 65 T 320 45 T 400 25" 
              fill="none" 
              stroke="#138808" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              strokeDasharray="4 2"
            />
          </svg>
          
          <div className="absolute top-2 left-3 text-[9px] font-bold text-gray-400 font-mono">Impressions (Saffron) vs. CPC clicks (Green)</div>
        </div>
      </div>

      {/* 4. Hot load Questions Creation Deck Form */}
      <div className="bg-white rounded-xl p-6 border border-gray-150 space-y-4" id="questions-injections-form">
        <h3 className="font-black text-sm text-gray-950 uppercase tracking-wide leading-none">
          Deploy Fresh Competitive MCQ Sets
        </h3>
        <p className="text-xs text-gray-500">
          Create dynamic multiple choice question sheets. Items injected this way are immediately made runnable to mock aspirants inside the "GK Quizzes" tab!
        </p>

        <form onSubmit={handleCreateMockQuiz} className="space-y-4 font-sans">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mock Exam Title:</label>
              <input
                type="text"
                id="admin-new-quiz-title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="e.g. 2026 Infantry Regiment Battles"
                className="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category:</label>
                <select
                  id="admin-new-quiz-category"
                  value={quizCategory}
                  onChange={(e) => setQuizCategory(e.target.value)}
                  className="w-full text-xs font-bold p-2 border border-gray-200 rounded-lg focus:outline-none"
                >
                  <option value="Agniveer Selection CEE">Agniveer mock CEE</option>
                  <option value="Polity Constitution">Polity & Acts</option>
                  <option value="Armed Forces GK">Armed Forces GK</option>
                  <option value="Current Affairs">Current Affairs</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Time Limit (secs):</label>
                <input
                  type="number"
                  id="admin-new-quiz-time"
                  value={quizTimeLimit}
                  onChange={(e) => setQuizTimeLimit(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2 border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* First Sample question fields setup */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <span className="text-[9px] uppercase font-black text-[#000080] block font-mono">Insert Core Objective Q1:</span>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1">Question Description String:</label>
              <input
                type="text"
                id="admin-new-q-text"
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="e.g. Which regiment bears the battle cry 'Durge Mata Ki Jai'?"
                className="w-full text-xs p-2 border border-gray-200 bg-white rounded-lg focus:outline-none"
              />
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[9px] font-bold text-gray-450">Option A:</label>
                <input
                  type="text"
                  id="admin-new-opt-a"
                  value={opt0}
                  onChange={(e) => setOpt0(e.target.value)}
                  placeholder="The Jammu & Kashmir Rifles"
                  className="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-450">Option B:</label>
                <input
                  type="text"
                  id="admin-new-opt-b"
                  value={opt1}
                  onChange={(e) => setOpt1(e.target.value)}
                  placeholder="The Rajput Regiment"
                  className="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-450">Option C:</label>
                <input
                  type="text"
                  id="admin-new-opt-c"
                  value={opt2}
                  onChange={(e) => setOpt2(e.target.value)}
                  placeholder="The Dogra Regiment"
                  className="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-gray-450">Option D:</label>
                <input
                  type="text"
                  id="admin-new-opt-d"
                  value={opt3}
                  onChange={(e) => setOpt3(e.target.value)}
                  placeholder="Gorkha Rifles"
                  className="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Index of correct answer choice:</label>
                <select
                  id="admin-new-q-correct"
                  value={correctOptionIdx}
                  onChange={(e) => setCorrectOptionIdx(Number(e.target.value))}
                  className="w-full text-xs font-bold p-2 border border-gray-200 rounded bg-white focus:outline-none"
                >
                  <option value={0}>Choice A</option>
                  <option value={1}>Choice B</option>
                  <option value={2}>Choice C</option>
                  <option value={3}>Choice D</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-1">Answer Explanatory key rationale:</label>
                <input
                  type="text"
                  id="admin-new-q-explanation"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="The Dogra Regiment battle cry is 'Durge Mata Ki Jai'."
                  className="w-full text-xs p-2 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          {messagePrompt && (
            <div className="text-[10px] font-bold text-green-700 bg-green-50 p-2.5 rounded border border-green-200 flex items-center" id="admin-prompt">
              <CheckCircle className="h-4.5 w-4.5 mr-1 text-green-600" />
              <span>{messagePrompt}</span>
            </div>
          )}

          <button
            type="submit"
            id="btn-admin-submit-quiz"
            className="w-full bg-[#138808] hover:bg-[#117706] text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Publish test model live</span>
          </button>

        </form>
      </div>

    </div>
  );
}
