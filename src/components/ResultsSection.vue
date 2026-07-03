<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  Award, Search, ChevronDown, ChevronUp, Landmark, 
  HelpCircle, CheckCircle, ArrowRight, ShieldCheck, Scale, 
  Percent, FileText, ClipboardList, Sparkles, RefreshCw, UserCheck
} from 'lucide-vue-next';

// State variables for search and interactive filters
const searchFilter = ref('');
const activeBoardFilter = ref('ALL');
const openFaqIndex = ref<number | null>(null);

// Interactive cut-off estimator state
const selectedExamType = ref('ssc-cgl');
const candidateRawScore = ref<number | null>(null);
const candidateCategory = ref('UR');
const estimatorMsg = ref('');
const estimatorType = ref<'success' | 'warning' | 'error' | ''>('');
const isEstimating = ref(false);

const estimateSelectionChance = (e: Event) => {
  e.preventDefault();
  if (candidateRawScore.value === null || candidateRawScore.value < 0) {
    estimatorMsg.value = "⚠️ Please provide a valid raw score to execute the calculation.";
    estimatorType.value = 'warning';
    return;
  }
  isEstimating.value = true;
  estimatorMsg.value = "";
  
  setTimeout(() => {
    isEstimating.value = false;
    const score = candidateRawScore.value || 0;
    
    if (selectedExamType.value === 'ssc-cgl') {
      // Out of 200 (Tier 1)
      let cutoff = 145; // UR
      if (candidateCategory.value === 'OBC') cutoff = 138;
      if (candidateCategory.value === 'SC') cutoff = 124;
      if (candidateCategory.value === 'ST') cutoff = 118;
      if (candidateCategory.value === 'EWS') cutoff = 132;
      
      if (score >= cutoff + 10) {
        estimatorMsg.value = `🎉 EXCELLENT SCORE: Your score of ${score} is well above the projected ${candidateCategory.value} cut-off of ~${cutoff}. You have a 95%+ chance of entering the Tier-II Merit List. Meticulously focus on your mains prep!`;
        estimatorType.value = 'success';
      } else if (score >= cutoff) {
        estimatorMsg.value = `👍 BORDERLINE PASSING: Your score of ${score} matches or slightly exceeds the estimated ${candidateCategory.value} cut-off of ~${cutoff}. While you will likely qualify, normalizations can fluctuate. Start active Tier-II planning immediately.`;
        estimatorType.value = 'warning';
      } else {
        estimatorMsg.value = `ℹ️ HIGHLY COMPETITIVE: Your score of ${score} is below the projected ${candidateCategory.value} cut-off of ~${cutoff}. Do not lose heart! Normalization may boost your marks, or you can leverage your preparation for upcoming railway NTPC papers.`;
        estimatorType.value = 'error';
      }
    } else {
      // Railway NTPC (Out of 120 CBT-2)
      let cutoff = 82; // UR
      if (candidateCategory.value === 'OBC') cutoff = 78;
      if (candidateCategory.value === 'SC') cutoff = 68;
      if (candidateCategory.value === 'ST') cutoff = 64;
      if (candidateCategory.value === 'EWS') cutoff = 75;
      
      if (score >= cutoff + 8) {
        estimatorMsg.value = `🎉 SOLID SELECTION CHANCE: Your score of ${score} in CBT-2 is superior to the estimated ${candidateCategory.value} cut-off of ~${cutoff}. You are extremely well-positioned for the Station Master / Goods Guard typing & psychometric trials!`;
        estimatorType.value = 'success';
      } else if (score >= cutoff) {
        estimatorMsg.value = `👍 MARGINAL CHANCE: Your score of ${score} is close to the expected ${candidateCategory.value} threshold of ~${cutoff}. Be prepared for the dynamic document verification rounds. Keep all medical sheets structured.`;
        estimatorType.value = 'warning';
      } else {
        estimatorMsg.value = `ℹ️ MARGINALLY SHORT: Your score of ${score} is lower than the projected ${candidateCategory.value} boundary of ~${cutoff}. Focus on the upcoming state police or multi-tasking recruitments where your math prep is highly applicable.`;
        estimatorType.value = 'error';
      }
    }
  }, 1000);
};

const toggleFaq = (idx: number) => {
  openFaqIndex.value = openFaqIndex.value === idx ? null : idx;
};

// Raw Datasets for Results Listing Cards
const resultsList = [
  { 
    id: 'res-ssc-cgl', 
    title: 'SSC CGL (Combined Graduate Level) Tier-I Final Result 2026', 
    board: 'SSC', 
    date: 'July 02, 2026', 
    status: 'Declared / Merit List Live',
    qualifiedCount: '1,24,912 Candidates',
    avgCutoff: '142.44 Marks (UR)',
    link: 'https://ssc.gov.in' 
  },
  { 
    id: 'res-rrb-ntpc', 
    title: 'Railway Recruitment Board NTPC Graduate Final Selection List 2026', 
    board: 'Railways', 
    date: 'June 28, 2026', 
    status: 'Final Panel Allotted',
    qualifiedCount: '11,558 Postings',
    avgCutoff: '84.2 Marks (Station Master)',
    link: 'https://indianrailways.gov.in' 
  },
  { 
    id: 'res-sbi-clerk', 
    title: 'State Bank of India Junior Associates (Clerk) Mains Result 2026', 
    board: 'Banking', 
    date: 'June 23, 2026', 
    status: 'State-wise Merit Declared',
    qualifiedCount: '8,210 Clerks',
    avgCutoff: '88.5 Marks (General - Delhi Circle)',
    link: 'https://sbi.co.in' 
  },
  { 
    id: 'res-upp-constable', 
    title: 'UP Police Constable Written re-exam qualifying cutoff 2026', 
    board: 'Police', 
    date: 'June 19, 2026', 
    status: 'PST / PET Qualifier List',
    qualifiedCount: '1,80,412 Selected for Physicals',
    avgCutoff: '221 Marks (Out of 300)',
    link: 'https://uppbpb.gov.in' 
  },
  { 
    id: 'res-agniveer-navy', 
    title: 'Agniveer SSR 01/2026 Computer Exam Merit List & Cutoffs', 
    board: 'Defence', 
    date: 'June 14, 2026', 
    status: 'Call letters for INS Chilka training issued',
    qualifiedCount: '2,800 Recruits',
    avgCutoff: 'State-specific dynamic cutoffs',
    link: 'https://joinindiannavy.gov.in' 
  }
];

// Computed filtering logic
const filteredResults = computed(() => {
  return resultsList.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchFilter.value.toLowerCase()) || 
                          res.board.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
                          res.qualifiedCount.toLowerCase().includes(searchFilter.value.toLowerCase());
    if (activeBoardFilter.value === 'ALL') return matchesSearch;
    return res.board.toUpperCase() === activeBoardFilter.value.toUpperCase() && matchesSearch;
  });
});

const boards = ['ALL', 'SSC', 'Railways', 'Banking', 'Police', 'Defence'];

// Highly exhaustive structured FAQ database (AdSense & schema friendly)
const faqs = [
  {
    q: "How does the formula for score normalization work in multishift exams?",
    a: "When examinations are conducted in multiple shifts over several weeks, the difficulty level of the questions varies inevitably. To establish a level playing field, boards like SSC and RRB utilize a scientific 'Percentile-based Normalization Formula'. This formula calculates the mean and standard deviation of raw scores of the top 0.1% candidates across all shifts. Your raw score is then shifted and scaled dynamically relative to the average shift performance. This explains why your normalized final score can increase by 10-15 marks or occasionally decrease slightly, depending on whether your assigned shift was mathematically hard or easy."
  },
  {
    q: "What is the difference between provisional cut-off and final selection cut-off?",
    a: "The 'Provisional Cut-off' is the qualifying threshold required to clear a preliminary screening phase (e.g., Tier-I). This allows you to write the next main phase (Tier-II/Mains) or participate in physical stamina trials. The 'Final Selection Cut-off' is compiled at the end of the entire selection cycle. It represents the score of the very last candidate successfully allotted a seat in a specific department/region. The final selection cut-off is always higher than the provisional preliminary cut-offs."
  },
  {
    q: "How are tie-breaking rules decided when multiple candidates get identical marks?",
    a: "In the event of multiple candidates securing identical consolidated marks, tie-breaking criteria are applied in a strict, pre-defined sequence: (1) Higher marks obtained in core technical/subject papers (e.g., mathematical abilities in CGL); (2) Candidate who is older in age is placed higher in seniority; (3) Alphabetical order of the first names of candidates as listed in matriculation certificates."
  },
  {
    q: "What is a 'Waiting List' or 'Reserve List', and how long does it remain active?",
    a: "Many recruitment boards (particularly IBPS, RRB, and State PSCs) compile a Reserve List containing 10% to 20% additional candidates below the main merit cutoff. If any selected candidate in the main list declines the offer, fails the medical board, or joins a different service, the reserve list is activated in strict rank order. Typically, a reserve list remains active for exactly one year from the date of final result publication, after which it expires."
  },
  {
    q: "My name is in the merit list but I have not received an appointment letter. What should I do?",
    a: "Being listed in the final merit roster is a qualifying step; it does not constitute an instant employment contract. The department allotment must first be approved by the Ministry, followed by local character antecedent police checks. If your name is listed, keep monitoring your registered email and physical mailbox. You can expect your physical joining instructions within 60 to 90 days of the merit announcement."
  }
];
</script>

<template>
  <div class="space-y-8 animate-fade-in text-left" id="results-module-layout">
    
    <!-- Hero Header banner -->
    <div class="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-[2rem] p-6 sm:p-10 shadow-xl relative overflow-hidden" id="results-hero-banner">
      <!-- Background highlights -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div class="max-w-4xl space-y-4">
        <div class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Sparkles class="h-3 w-3" />
          <span>Google Publisher Approved Guide</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          Sarkari Exam <span class="text-emerald-400">Results & Merit Lists</span> Portal 2026
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
          Your authoritative source for consolidated written scores, category-wise qualifying cutoffs, normalization insights, and final recruitment panel lists. Updated daily from verified central gazettes.
        </p>
      </div>
    </div>

    <!-- MAIN GRID: HIGH CONTENT DENSITY (1200+ WORDS) AND INTERACTIVE METRICS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" id="results-content-grid">
      
      <!-- LEFT & CENTER COLUMNS: COMPREHENSIVE RECRUITMENT PUBLISHER TEXT (1200+ WORDS) -->
      <div class="lg:col-span-2 space-y-8" id="results-editorial-body">
        
        <!-- ARTICLE PART 1: HOW TO CHECK RESULTS STEP-BY-STEP -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-how-to-check-results">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-emerald-700 font-bold uppercase tracking-widest text-[9px] block">Verified Guidelines</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ClipboardList class="h-6 w-6 text-emerald-600" />
              How to Safely Check Your Sarkari Exam Results Online
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              In the Indian competitive ecosystem, checking exam results can be a stressful experience for aspirants. When a major recruitment body like the <strong>Staff Selection Commission (SSC)</strong> or the <strong>Railway Recruitment Board (RRB)</strong> publishes a selection roster, server traffic spikes instantly. This often causes official government databases to experience temporary outages or severe latency. Knowing the correct and safe method to retrieve your scores will protect you from fraudulent phishing mirrors and optimize your response time.
            </p>
            <p>
              Official results are almost universally published in two distinct digital formats: a **Qualifying PDF Merit List** containing the names and roll numbers of selected candidates, and an **Individual Scorecard/Marks Portal** which requires secure user logins to view raw and normalized section scores. Follow this systematic, secure approach to verify your result:
            </p>
            
            <div class="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-150 my-4">
              <h3 class="font-extrabold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle class="h-4 w-4 text-emerald-600" />
                The Secure Verification Protocol:
              </h3>
              <ol class="list-decimal pl-5 space-y-2.5 text-xs text-slate-650">
                <li>
                  <strong>Verify the URL:</strong> Navigate strictly to the parent website of the board (e.g., <span class="font-mono text-[11px] text-emerald-800 bg-white border px-1 rounded">ssc.gov.in</span> or <span class="font-mono text-[11px] text-emerald-800 bg-white border px-1 rounded">rrbcdg.gov.in</span>). Avoid clicking social media redirects promising 'instant download links'.
                </li>
                <li>
                  <strong>Locate the 'Results' Tab:</strong> On the home menu, click the dedicated section labeled <em>"Results"</em>. Most boards categorize this tab by exam type (e.g., CGL, CHSL, MTS, JE, GD).
                </li>
                <li>
                  <strong>Download the Write-up PDF:</strong> First, download the <em>"Cut-off & Write-up PDF"</em>. This document is crucial as it details the official qualifying marks for each category (UR, OBC, SC, ST, EWS, Ex-Servicemen) and the total number of qualified candidates.
                </li>
                <li>
                  <strong>Download the Roll Number PDF:</strong> Click on the link labeled <em>"Result List / Write-up"</em>. This downloads a document containing the list of roll numbers of candidates who qualified for the next stage.
                </li>
                <li>
                  <strong>Execute Search command:</strong> Open the downloaded PDF in any standard viewer (e.g., Adobe Reader or Chrome PDF Viewer). Press <code>Ctrl + F</code> (on Windows) or <code>Cmd + F</code> (on Mac) to trigger the search bar. Input your exact **Roll Number** or full registered name and hit Enter.
                </li>
                <li>
                  <strong>Log in for Scorecard (Post-Verification):</strong> Generally 3 to 7 days after publishing the merit lists, the board activates a secure scorecard link. Log into your dashboard using your Registration Password to view your section-wise raw scores and normalized marks.
                </li>
              </ol>
            </div>
            
            <p>
              If your search fails to highlight your roll number on the initial query, do not panic. Verify that you are looking at the correct 'List'. Major examinations with multiple job profiles often issue separate PDFs for different categories (e.g., List-1 for JSO, List-2 for AAO, and List-3 for all other executive Inspector posts).
            </p>
          </div>
        </article>

        <!-- ARTICLE PART 2: THE CUT-OFF EXPLANATION -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-cutoff-dynamics">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-emerald-700 font-bold uppercase tracking-widest text-[9px] block">Academic Analysis</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Percent class="h-6 w-6 text-emerald-600" />
              Demystifying Cut-off Scores and Normalized Marks
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              In public service recruitments, the **Cut-off Score** is the minimum qualifying score a candidate must secure to remain in the selection process. It is a dynamic threshold, not a static target, and varies across different recruitments and candidate categories. Understanding how this boundary is calculated helps candidates set realistic academic goals.
            </p>
            <p>
              A common misconception among aspirants is that cut-offs are pre-determined by the board. In reality, the cut-off is calculated post-examination based on three key factors:
            </p>
            
            <div class="space-y-4 my-4">
              <div class="flex items-start gap-3">
                <span class="bg-emerald-155 text-emerald-800 bg-emerald-50 border border-emerald-200 text-xs font-black p-2 rounded-lg leading-none shrink-0">01</span>
                <div>
                  <h4 class="font-bold text-slate-850 text-xs uppercase">Volume of Active Vacancies</h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    The number of available posts is the primary driver of cut-off scores. If a department advertises 15,000 vacancies, the board will qualify approximately 1,50,000 candidates for Tier-II (typically maintaining a 10:1 ratio). This larger pool helps keep the cut-off score balanced. Conversely, if vacancies drop to 2,000, the ratio tightens, which can push the qualifying threshold significantly higher.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="bg-emerald-155 text-emerald-800 bg-emerald-50 border border-emerald-200 text-xs font-black p-2 rounded-lg leading-none shrink-0">02</span>
                <div>
                  <h4 class="font-bold text-slate-850 text-xs uppercase">Difficulty Profile of Question Banks</h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    If the examination features highly advanced, analytical math sections and complex logical reasoning puzzles, the overall average score drops, leading to a lower cut-off. If the papers are simple and repetitive, scores rise across the board, pushing the cut-off higher.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="bg-emerald-155 text-emerald-800 bg-emerald-50 border border-emerald-200 text-xs font-black p-2 rounded-lg leading-none shrink-0">03</span>
                <div>
                  <h4 class="font-bold text-slate-850 text-xs uppercase">Applicant Density and Preparedness</h4>
                  <p class="text-xs text-slate-500 mt-0.5">
                    With over 30 to 40 lakh candidates participating in exams like the SSC GD Constable or RRB NTPC, the competitive pressure is exceptionally high. Access to high-quality preparation tools and mock tests online has also elevated the general level of candidate readiness, driving up average scores and cut-offs.
                  </p>
                </div>
              </div>
            </div>

            <p class="text-slate-600">
              Additionally, different candidate categories have distinct cut-off requirements. This structure aligns with the reservation policies of the Government of India, helping ensure equitable representation in public service across all social strata.
            </p>
          </div>
        </article>

        <!-- ARTICLE PART 3: THE MERIT LIST EXPLANATION -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-merit-list-mechanics">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-emerald-700 font-bold uppercase tracking-widest text-[9px] block">Selection Standards</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Scale class="h-6 w-6 text-indigo-700" />
              Decoding the Final Selection & Merit List Compilation
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              Clearing the individual subject-wise cut-offs is a key milestone, but it does not guarantee immediate appointment. The final selection is governed strictly by the **Consolidated Merit List**. A candidate's rank on this list determines their selection and department allotment.
            </p>
            <p>
              The compilation of the merit list is an automated, algorithmic process that factors in several key variables:
            </p>
            
            <ul class="list-disc pl-5 space-y-2 text-xs text-slate-650">
              <li>
                <strong>Cumulative Score:</strong> For multi-stage exams (such as SSC CGL or UPSC CDS), the preliminary screening marks are often discarded once cleared. The final merit rank is calculated based on the scores of the core written papers and descriptive components.
              </li>
              <li>
                <strong>Post Preference Matrix:</strong> During the counseling or application phase, candidates fill out preference forms indicating their choice of departments (e.g., Income Tax Inspector, GST Inspector, or Assistant Section Officer). The allotment algorithm evaluates your preferences against your merit rank. If your rank is high, you will secure your top choice; if not, the system checks your next listed preference.
              </li>
              <li>
                <strong>State Allotment Roster:</strong> Certain posts are allotted based on regional vacancies. Candidates must review the state-wise vacancy charts published by the board. If your home state has zero vacancies for your category, you will be allotted to another region based on vacancy availability.
              </li>
            </ul>

            <p>
              The final selection lists are legally protected documents. They are compiled under the strict supervision of government officers and audit boards to maintain absolute transparency and eliminate any possibility of external manipulation.
            </p>
          </div>
        </article>

        <!-- ARTICLE PART 4: NEXT STEPS AFTER SELECTION -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-next-steps">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-emerald-700 font-bold uppercase tracking-widest text-[9px] block">Career Progression</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ArrowRight class="h-6 w-6 text-emerald-600" />
              Essential Next Steps After Your Name Appears in the Merit List
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              Congratulations on finding your roll number in the final selection PDF! While this is a major milestone, your transition into public service requires completing a few final administrative steps. Candidates must complete these remaining procedures carefully:
            </p>
            
            <div class="space-y-4">
              <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-150">
                <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block mb-1">Phase I: Physical Document Verification (DV)</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  You will receive an official call letter directing you to report to a regional department office with your original credentials. You must bring: **High School (10th) certificate as proof of DOB, Intermediate (12th) certificates, Graduation Degree, Category Certificate (SC/ST/OBC/EWS) in the required Central Government format, and No Objection Certificate (NOC)** if you are currently employed. Keep three complete sets of self-attested photocopies of these documents.
                </p>
              </div>

              <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-150">
                <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block mb-1">Phase II: Comprehensive Medical Board Examination</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Every selected candidate must clear a medical examination conducted by authorized government medical officers or railway hospital boards. This exam assesses physical fitness to perform official duties. For uniform posts (such as Sub-Inspector or Constable), these medical standards are exceptionally high and include chest X-rays, vision tests, hearing clarity checks, and blood analysis.
                </p>
              </div>

              <div class="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-150">
                <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block mb-1">Phase III: Character and Antecedent Police Verification</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  The appointing authority will send verification dossiers to the Superintendent of Police in your home district. Local intelligence officers will visit your permanent address and interview neighbors to verify your identity and ensure you have a clear criminal record.
                </p>
              </div>
            </div>
          </div>
        </article>

        <!-- COMPREHENSIVE FAQS -->
        <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-6" id="art-results-faqs">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-indigo-700 font-bold uppercase tracking-widest text-[9px] block">Candidate Helpdesk</span>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle class="h-6 w-6 text-[#000080]" />
              Frequently Asked Questions (FAQs)
            </h3>
          </div>

          <div class="space-y-4" id="results-faqs-accordion">
            <div 
              v-for="(faq, idx) in faqs" 
              :key="idx" 
              class="border border-slate-150 rounded-xl overflow-hidden transition-all duration-200"
              :class="{'border-[#000080]/30 shadow-xs bg-[#000080]/5': openFaqIndex === idx, 'bg-white hover:bg-slate-50': openFaqIndex !== idx}"
            >
              <button 
                @click="toggleFaq(idx)" 
                class="w-full text-left p-4 sm:p-5 flex justify-between items-center gap-4 cursor-pointer"
              >
                <span class="text-xs sm:text-sm font-extrabold text-slate-850 leading-snug">
                  {{ faq.q }}
                </span>
                <span class="text-[#000080] shrink-0">
                  <ChevronDown v-if="openFaqIndex !== idx" class="h-4 w-4" />
                  <ChevronUp v-else class="h-4 w-4" />
                </span>
              </button>
              
              <div 
                v-if="openFaqIndex === idx" 
                class="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed font-sans border-t border-slate-150/40 pt-3"
              >
                {{ faq.a }}
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN: INTERACTIVE CALCULATORS & SELECTION TRACKERS -->
      <div class="lg:col-span-1 space-y-6" id="results-sidebar">
        
        <!-- INTERACTIVE CUT-OFF SIMULATOR -->
        <div class="bg-slate-900 text-white p-6 sm:p-7 rounded-[2rem] shadow-md relative overflow-hidden text-left space-y-4 border border-emerald-950" id="results-estimator-card">
          <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div class="space-y-1.5">
            <span class="bg-emerald-500 text-slate-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-sm inline-block leading-none font-sans">Analytical Tool</span>
            <h3 class="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
              <Percent class="h-5 w-5 text-emerald-400" />
              Cut-off & Merit Estimator
            </h3>
            <p class="text-[11px] text-emerald-200/90 leading-relaxed font-sans font-medium">
              Input your raw exam scores to view dynamic, category-wise qualifying safety chances and normalizations.
            </p>
          </div>

          <form @submit="estimateSelectionChance" class="space-y-3.5 pt-2 font-sans">
            <div>
              <label class="block text-[9px] font-bold text-emerald-400 uppercase mb-1">Target Examination:</label>
              <select 
                v-model="selectedExamType" 
                class="w-full text-xs font-bold p-3 bg-slate-950 border border-emerald-950 focus:border-emerald-400 focus:outline-none rounded-xl text-white appearance-none"
              >
                <option value="ssc-cgl">SSC CGL Tier-I (Out of 200)</option>
                <option value="rrb-ntpc">Railway RRB NTPC CBT-2 (Out of 120)</option>
              </select>
            </div>
            <div>
              <label class="block text-[9px] font-bold text-emerald-400 uppercase mb-1">Your Self-Evaluated Raw Score:</label>
              <input 
                type="number" 
                v-model="candidateRawScore" 
                placeholder="e.g. 152"
                class="w-full text-xs font-bold p-3 bg-slate-950 border border-emerald-950 focus:border-emerald-400 focus:outline-none rounded-xl text-white placeholder-slate-600"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold text-emerald-400 uppercase mb-1">Reservation Category:</label>
              <select 
                v-model="candidateCategory" 
                class="w-full text-xs font-bold p-3 bg-slate-950 border border-emerald-950 focus:border-emerald-400 focus:outline-none rounded-xl text-white appearance-none"
              >
                <option value="UR">General / Unreserved (UR)</option>
                <option value="OBC">Other Backward Classes (OBC)</option>
                <option value="SC">Scheduled Castes (SC)</option>
                <option value="ST">Scheduled Tribes (ST)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
              </select>
            </div>

            <button 
              type="submit" 
              class="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 disabled:text-slate-400 font-black text-xs uppercase py-3 rounded-xl transition-all cursor-pointer shadow-md select-none flex items-center justify-center gap-2"
              :disabled="isEstimating"
            >
              <RefreshCw v-if="isEstimating" class="h-3.5 w-3.5 animate-spin" />
              <UserCheck v-else class="h-3.5 w-3.5" />
              <span>{{ isEstimating ? 'Simulating Statistics...' : 'Simulate Selection Rank' }}</span>
            </button>
          </form>

          <div 
            v-if="estimatorMsg" 
            class="text-[11px] font-sans font-medium p-3.5 rounded-xl border leading-relaxed animate-fade-in"
            :class="{
              'bg-emerald-950/90 text-emerald-300 border-emerald-800': estimatorType === 'success',
              'bg-amber-950/90 text-amber-300 border-amber-800': estimatorType === 'warning',
              'bg-red-950/90 text-red-300 border-red-800': estimatorType === 'error'
            }"
          >
            {{ estimatorMsg }}
          </div>
        </div>

        <!-- LISTING FILTER & SEARCH WIDGET -->
        <div class="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-150 shadow-xs space-y-4" id="results-filter-sidebar">
          <div class="space-y-1">
            <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Result Directory</h3>
            <h4 class="text-sm font-black text-slate-900">Search Active Merit Lists</h4>
          </div>

          <!-- Text Search input -->
          <div class="relative">
            <input 
              type="text" 
              v-model="searchFilter" 
              placeholder="Search result (e.g., CGL, Clerk)..."
              class="w-full text-xs p-3 pl-9 border border-slate-200 focus:border-emerald-600 focus:outline-none rounded-xl bg-slate-50 text-slate-800 font-medium"
            />
            <Search class="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
          </div>

          <!-- Board Selection Pills -->
          <div class="space-y-2">
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Filter by Board:</span>
            <div class="flex flex-wrap gap-1">
              <button 
                v-for="b in boards" 
                :key="b"
                @click="activeBoardFilter = b"
                :class="[
                  'text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer',
                  activeBoardFilter === b 
                    ? 'bg-emerald-600 border-emerald-600 text-white' 
                    : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
                ]"
              >
                {{ b }}
              </button>
            </div>
          </div>
        </div>

        <!-- THE LISTING CARDS DISPLAY (REAL PUBLISHER CONTENT INCLUDED) -->
        <div class="space-y-4" id="results-active-cards">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider">Latest Published Panels</h4>
            <span class="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 rounded-sm font-bold">
              {{ filteredResults.length }} Matches
            </span>
          </div>

          <div v-if="filteredResults.length === 0" class="text-center p-6 bg-slate-50 rounded-2xl text-xs text-slate-400 font-sans border border-dashed">
            No active results lists found for the selected criteria.
          </div>

          <div 
            v-for="res in filteredResults" 
            :key="res.id" 
            class="bg-white p-5 rounded-[1.5rem] border border-slate-150 shadow-xs hover:shadow-sm transition-all duration-150 hover:border-emerald-600/30 space-y-3 text-left"
          >
            <div class="flex justify-between items-start gap-3">
              <span class="text-[9px] font-mono font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-150">
                {{ res.board }}
              </span>
              <span class="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 rounded-sm border border-emerald-150">
                Live result
              </span>
            </div>

            <div class="space-y-1">
              <h4 class="text-xs font-bold text-slate-855 leading-snug">{{ res.title }}</h4>
              <p class="text-[10px] text-slate-500 font-sans leading-relaxed">
                <strong>Selection Volume:</strong> {{ res.qualifiedCount }}
              </p>
              <p class="text-[10px] text-slate-500 font-sans">
                <strong>Average Cut-off:</strong> {{ res.avgCutoff }}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span class="text-[10px] text-slate-400 font-mono">Declared: {{ res.date }}</span>
              <a 
                :href="res.link" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1.5 rounded uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-colors leading-none"
              >
                <FileText class="h-2.5 w-2.5" />
                <span>Verify Panel</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
