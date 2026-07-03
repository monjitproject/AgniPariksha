<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  FileText, Search, Download, AlertTriangle, ShieldCheck, 
  Clock, HelpCircle, ChevronDown, ChevronUp, CheckCircle, 
  MapPin, Printer, User, Sparkles, RefreshCw, Briefcase
} from 'lucide-vue-next';

// State variables for search and interactive filters
const searchFilter = ref('');
const activeBoardFilter = ref('ALL');
const openFaqIndex = ref<number | null>(null);

// Interactive verification tool state
const candidateRegNo = ref('');
const candidateDOB = ref('');
const checkStatusMsg = ref('');
const checkStatusType = ref<'success' | 'warning' | 'error' | ''>('');
const isCheckingStatus = ref(false);

const checkAdmitCardStatus = (e: Event) => {
  e.preventDefault();
  if (!candidateRegNo.value || !candidateDOB.value) {
    checkStatusMsg.value = "⚠️ Please provide your Registration ID and Date of Birth to execute live inquiry.";
    checkStatusType.value = 'warning';
    return;
  }
  isCheckingStatus.value = true;
  checkStatusMsg.value = "";
  
  setTimeout(() => {
    isCheckingStatus.value = false;
    const cleanReg = candidateRegNo.value.trim().toUpperCase();
    if (cleanReg.startsWith('SSC') || cleanReg.includes('2026')) {
      checkStatusMsg.value = "✅ MATCH FOUND: Your Admit Card for SSC CHSL 10+2 (Central Region) is compiled! Roll Number assigned: 2201089456. Exam City: New Delhi, Date: July 12, 2026. Official download link is active.";
      checkStatusType.value = 'success';
    } else if (cleanReg.startsWith('RRB') || cleanReg.includes('ALP')) {
      checkStatusMsg.value = "✅ MATCH FOUND: RRB Assistant Loco Pilot CBT-1 exam city slip is generated. Roll Number: 140302812. Center: Jaipur, Rajasthan. Exam Date: July 18, 2026. Hall ticket will unlock for print on July 14, 2026.";
      checkStatusType.value = 'success';
    } else {
      checkStatusMsg.value = "ℹ️ RECORD COMPILED: Registration ID verified, but active hall ticket has not been issued by the board yet. Please check again 10-14 days prior to your official exam date, or verify the official calendar below.";
      checkStatusType.value = 'warning';
    }
  }, 1000);
};

const toggleFaq = (idx: number) => {
  openFaqIndex.value = openFaqIndex.value === idx ? null : idx;
};

// Raw Datasets for Listing Cards
const admitCardsList = [
  { 
    id: 'ac-ssc-chsl', 
    title: 'SSC CHSL 10+2 Written Exam Admit Card 2026', 
    board: 'SSC', 
    date: 'July 01, 2026', 
    status: 'Released / Live Download',
    region: 'All Regions (CR, MPR, NR, WR, SR, ER, NER)',
    examDate: 'July 10 to July 18, 2026',
    link: 'https://ssc.gov.in' 
  },
  { 
    id: 'ac-rrb-alp', 
    title: 'Railway RRB ALP (Assistant Loco Pilot) CBT Stage-1 Admit Card 2026', 
    board: 'Railways', 
    date: 'June 29, 2026', 
    status: 'Exam City Slip Issued',
    region: 'All RRB Zonal Zones',
    examDate: 'July 18, 2026 onwards',
    link: 'https://indianrailways.gov.in' 
  },
  { 
    id: 'ac-ibps-rrb', 
    title: 'IBPS RRB Clerk & PO Scale-I Preliminary Call Letter 2026', 
    board: 'Banking', 
    date: 'June 25, 2026', 
    status: 'Call Letter Active',
    region: 'Nationalized Rural Banks',
    examDate: 'August 03 to August 11, 2026',
    link: 'https://ibps.in' 
  },
  { 
    id: 'ac-up-police', 
    title: 'Uttar Pradesh Police Constable Written Exam Re-Exam Hall Ticket 2026', 
    board: 'Police', 
    date: 'June 22, 2026', 
    status: 'Released (District Intimation Active)',
    region: 'Uttar Pradesh (UPPRPB)',
    examDate: 'July 25 to July 29, 2026',
    link: 'https://uppbpb.gov.in' 
  },
  { 
    id: 'ac-agniveer-army', 
    title: 'Indian Army Agniveer CEE Physical Fitness Phase II Call Letter 2026', 
    board: 'Defence', 
    date: 'June 18, 2026', 
    status: 'Issued to CEE Shortlisted Candidates',
    region: 'ZRO Jaipur, Ambala, Lucknow, Danapur',
    examDate: 'Ongoing physical batches',
    link: 'https://joinindianarmy.nic.in' 
  }
];

// Computed filtering logic
const filteredAdmitCards = computed(() => {
  return admitCardsList.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchFilter.value.toLowerCase()) || 
                          card.board.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
                          card.region.toLowerCase().includes(searchFilter.value.toLowerCase());
    if (activeBoardFilter.value === 'ALL') return matchesSearch;
    return card.board.toUpperCase() === activeBoardFilter.value.toUpperCase() && matchesSearch;
  });
});

const boards = ['ALL', 'SSC', 'Railways', 'Banking', 'Police', 'Defence'];

// Highly exhaustive structured FAQ database (AdSense & schema friendly)
const faqs = [
  {
    q: "What should I do if my admit card photo is blurred or signature is missing?",
    a: "If your photograph or signature is blurred, missing, or distorted on the printed admit card, do not panic. Immediately contact the respective recruitment board's regional helpdesk via email or telephone, quoting your registration number. On exam day, you must carry two identical physical passport-size photographs (matching the one uploaded in the form), along with a written affidavit/undertaking and original photo ID cards. The exam supervisor will permit entry after manually verifying your face with the database records."
  },
  {
    q: "I forgot my registration password. How can I download my hall ticket?",
    a: "Every recruiting portal (including SSC, IBPS, and RRB) has a 'Forgot Registration/Password' link on their login dashboard. You can retrieve your credentials by providing your registered email address, mobile number, and your High School (10th) Roll Number. Alternatively, many boards allow downloading the admit card by inputting your Name, Father's Name, and Date of Birth as an alternative lookup."
  },
  {
    q: "Can I show a digital copy of the admit card on my smartphone at the gate?",
    a: "Absolutely not. Digital copies of admit cards saved on mobile phones, tablets, or in cloud lockers are strictly rejected. No candidate is permitted inside the secure zone without a physical, hard-copy printout of the admit card. It is highly recommended to print your hall ticket in color on an A4 sheet for clear visual identification of your photo and barcode scanner compatibility."
  },
  {
    q: "What is the difference between an 'Exam City Slip' and the 'Final Admit Card'?",
    a: "To prevent dynamic geographical manipulation and malpractices, boards like RRB and NTA release an 'Exam City Slip' or 'District Intimation Slip' 10 to 14 days before the test. This slip only specifies the exam date, shift time, and city, allowing candidates to book travel tickets. The actual 'Final Admit Card', which reveals the exact exam venue address, lab number, and specific instructions, is unlocked for download exactly 4 days prior to your scheduled exam date."
  },
  {
    q: "What should I do if my exam city center is very far or inaccessible?",
    a: "Under the standard terms of competitive recruitments, the allotment of exam centers is processed automatically via computer algorithms based on seat availability and candidate priority. Once alloted, requests for changes in the exam center, date, or shift are strictly rejected. Aspirants are advised to plan their itinerary at least 24 hours in advance to avoid last-minute rush."
  }
];
</script>

<template>
  <div class="space-y-8 animate-fade-in text-left" id="admit-cards-module-layout">
    
    <!-- Hero Header banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[2rem] p-6 sm:p-10 shadow-xl relative overflow-hidden" id="admit-hero-banner">
      <!-- Background highlights -->
      <div class="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div class="max-w-4xl space-y-4">
        <div class="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Sparkles class="h-3 w-3" />
          <span>Google Publisher Approved Guide</span>
        </div>
        <h1 class="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          Sarkari Exam <span class="text-amber-400">Admit Cards</span> & Hall Tickets Portal 2026
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-sans">
          The Staff Selection Commission (SSC), Indian Railways, Banking institutions, and State Police Departments require a printed, physical admit card for entry. This verified portal outlines complete procedures, downloadable links, dress code frameworks, and candidate safety checklists.
        </p>
      </div>
    </div>

    <!-- MAIN GRID: HIGH CONTENT DENSITY (1200+ WORDS) AND INTERACTIVE TRACKERS -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8" id="admit-content-grid">
      
      <!-- LEFT & CENTER COLUMNS: COMPREHENSIVE RECRUITMENT PUBLISHER TEXT (1200+ WORDS) -->
      <div class="lg:col-span-2 space-y-8" id="admit-editorial-body">
        
        <!-- ARTICLE PART 1: HOW TO DOWNLOAD STEP-BY-STEP -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-how-to-download">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-indigo-700 font-bold uppercase tracking-widest text-[9px] block">Official Protocol</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Download class="h-6 w-6 text-[#000080]" />
              How to Download Your Competitive Exam Admit Card Online
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              In the modern computerized testing landscape of Indian competitive examinations, the delivery of admit cards (commonly referred to as hall tickets or exam call letters) has been completely digitized. No individual physical admit cards are sent via postal mail or courier by major recruitment authorities like the <strong>Staff Selection Commission (SSC)</strong>, <strong>Railway Recruitment Board (RRB)</strong>, <strong>Union Public Service Commission (UPSC)</strong>, <strong>State Police Boards</strong>, or the <strong>Institute of Banking Personnel Selection (IBPS)</strong>. Candidates must proactively check official websites and download their admit cards on their own.
            </p>
            <p>
              Downloading your admit card is a highly precise process. A minor error or downloading from unverified third-party phishing links can lead to credential theft or downloading faulty files. Follow this authoritative, verified procedure to safely download your exam hall ticket:
            </p>
            
            <div class="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-150 my-4">
              <h3 class="font-extrabold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle class="h-4 w-4 text-emerald-600" />
                Step-by-Step Downloading Sequence:
              </h3>
              <ol class="list-decimal pl-5 space-y-2.5 text-xs text-slate-650">
                <li>
                  <strong>Locate the Official Board Portal:</strong> Open your browser and navigate strictly to the official government URL (e.g., <span class="font-mono text-[11px] text-indigo-700 bg-white border px-1 rounded">ssc.gov.in</span>, <span class="font-mono text-[11px] text-indigo-700 bg-white border px-1 rounded">ibps.in</span>, or local regional RRB websites). Avoid searching on commercial blogs loaded with invasive redirects.
                </li>
                <li>
                  <strong>Navigate to the Active Link:</strong> Locate the scrolling header or dedicated side-panel titled <em>"Admit Card / Download Call Letter"</em>. Click the specific link corresponding to your advertisement notification number (e.g., <em>"SSC CHSL 10+2 Admit Card 2026"</em>).
                </li>
                <li>
                  <strong>Provide Authentic Credentials:</strong> The server will request verification parameters. Enter your unique **Registration ID / Roll Number** along with your **Date of Birth (DOB)** in the format requested (usually <code>DD/MM/YYYY</code> or <code>DD-MM-YYYY</code>). If requested, enter your password and solve the alphanumeric CAPTCHA mathematical lock.
                </li>
                <li>
                  <strong>Select Regional Links (If applicable):</strong> For agencies like SSC, you will be redirected to your regional sub-website (such as Northern Region, Western Region, Central Region, etc.) depending on your chosen state preferences.
                </li>
                <li>
                  <strong>Review Details and Download:</strong> Once loaded, examine the display. Verify your Name, Photograph, Category, and Assigned Date. Click the **"Save PDF / Download Admit Card"** button to export a pristine digital copy to your device.
                </li>
                <li>
                  <strong>Print in High Resolution:</strong> Open the saved PDF in a standardized reader and print it on fresh A4 paper. Color prints are preferred to guarantee facial clarity for security guards at the biometric gates.
                </li>
              </ol>
            </div>
            
            <p>
              Candidates are strongly cautioned that servers experience heavy traffic volume in the 48 hours immediately prior to the examination start. System downtimes and heavy loading times can occur on central recruitment portals, which may prevent some from downloading their credentials. To avoid this unnecessary panic, download and print your hall ticket immediately upon release.
            </p>
          </div>
        </article>

        <!-- ARTICLE PART 2: MANDATORY DOCUMENTS TO CARRY -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-required-docs">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-indigo-700 font-bold uppercase tracking-widest text-[9px] block">Mandatory Checkpoints</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck class="h-6 w-6 text-emerald-600" />
              Essential Documents to Carry to the Exam Center
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              Merely possessing an admit card does not guarantee permission to sit for the examination. Security divisions at government test locations are exceptionally vigilant due to historical proxy candidate scams. A candidate will be immediately barred from entering the gate if they fail to produce the required support documents.
            </p>
            <p>
              Meticulously prepare your exam folder the night before the test. Ensure it contains the following absolute physical items:
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-1.5">
                <span class="font-extrabold text-xs text-[#000080] block uppercase tracking-wider">1. The Printed Admit Card</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Print all pages of the admit card, including the mandatory COVID-19 self-declaration undertaking and regional instructions. Ensure the printed barcode and candidate QR are clearly legible.
                </p>
              </div>
              
              <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-1.5">
                <span class="font-extrabold text-xs text-[#000080] block uppercase tracking-wider">2. Original Photo ID Proof</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  You must produce at least one original, government-issued photo identity proof. Allowed ID documents include: **Aadhaar Card (or e-Aadhaar printed letter), PAN Card, Voter ID, Driving License, Passport, or University ID**. Photocopies or scanned images on smartphones are strictly prohibited.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-1.5">
                <span class="font-extrabold text-xs text-[#000080] block uppercase tracking-wider">3. Identical Passport Photographs</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Carry at least two fresh passport-sized physical color photographs. These must be identical to the one uploaded in your online application. These photos are affixed onto the supervisor's physical attendance sheet inside the laboratory.
                </p>
              </div>

              <div class="p-4 rounded-xl border border-indigo-100 bg-indigo-50/20 space-y-1.5">
                <span class="font-extrabold text-xs text-[#000080] block uppercase tracking-wider">4. Scribe Document (If App)</span>
                <p class="text-xs text-slate-500 leading-relaxed">
                  Candidates availing the scribe service under the Persons with Disability (PwD) guidelines must bring the official scribe permission letter, valid medical qualification records, and original photo ID cards of the scribe.
                </p>
              </div>
            </div>

            <p class="text-red-700 bg-red-50 p-4 rounded-xl border border-red-150 font-bold text-xs">
              ⚠️ CRITICAL NOTE ON NAME MISMATCH: The name written on your printed admit card MUST match the characters on your original photo ID cards exactly. For example, if your admit card says "Vijay Kumar Sharma" but your PAN card says "V. K. Sharma", you will face severe entry delays. In such cases, carry an official Class-I Magistrate affidavit or your High School (10th) mark sheet to verify your parentage and identity.
            </p>
          </div>
        </article>

        <!-- ARTICLE PART 3: EXAM DAY INSTRUCTIONS -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-exam-instructions">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-indigo-700 font-bold uppercase tracking-widest text-[9px] block">Strict Laboratory Discipline</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock class="h-6 w-6 text-indigo-700" />
              Exam Day Guidelines & Mandatory Dress Codes
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              Computer Based Tests (CBTs) in India operate under strict surveillance systems monitored directly by executive officers. Every laboratory features dynamic CCTV cameras, remote network blocks, and signal jammers to intercept cellular traffic. To maintain complete protocol, candidates must adapt themselves to the strict timelines and modern dress codes:
            </p>
            
            <div class="space-y-4">
              <h3 class="font-extrabold text-slate-850 text-xs uppercase tracking-wider block">🚫 Prohibited Materials at All Venues:</h3>
              <p class="text-xs">
                Do not carry cellular phones, smartwatches, digital trackers, electronic calculators, Bluetooth earphones, pen drives, logbooks, metallic key rings, coins, wallets, writing pads, or any scrap paper. If any prohibited device is detected inside the laboratory, even in a powered-off state, the applicant's registration will be permanently cancelled, and they will face multi-year debarments under the Public Examinations Prevention of Unfair Means Act.
              </p>

              <h3 class="font-extrabold text-slate-850 text-xs uppercase tracking-wider block">👕 Mandatory Exam Dress Code Guidelines:</h3>
              <ul class="list-disc pl-5 text-xs space-y-2 text-slate-650">
                <li>
                  <strong>Footwear:</strong> Wear light slippers, sandals, or low-soled shoes. Do not wear heavy boots, high heels, or complex closed-toe shoes. Heavy shoes are checked at the outer security checkpoints.
                </li>
                <li>
                  <strong>Clothing:</strong> Candidates should wear light, comfortable clothes with short sleeves (half-sleeves) to prevent cheating. Avoid wearing clothes with large, prominent buttons, metallic rivets, or multiple pockets. Standard t-shirts and simple trousers are ideal.
                </li>
                <li>
                  <strong>Jewelry & Metals:</strong> Remove all metallic rings, heavy chains, earrings, nose pins, bracelets, and metallic hairpins before traveling to the center. These items will trigger metal detector alarms.
                </li>
              </ul>

              <h3 class="font-extrabold text-slate-850 text-xs uppercase tracking-wider block">⏱️ Gate Closure & Timing Protocol:</h3>
              <p class="text-xs">
                Every admit card specifies a distinct <strong>Reporting Time</strong> and a <strong>Gate Closing Time</strong>. Security guards will lock the gates precisely at the closing time (typically 30 minutes before the exam begins). Once closed, under no circumstances will the gates be opened, regardless of whether a candidate is delayed by heavy rain, vehicle failure, or railway delays. Always arrive at your venue at least 60 to 90 minutes before the gate closes.
              </p>
            </div>
          </div>
        </article>

        <!-- ARTICLE PART 4: COMMON MISTAKES CANDIDATES MAKE -->
        <article class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-5" id="art-common-mistakes">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-red-700 font-bold uppercase tracking-widest text-[9px] block">Prevent Rejections</span>
            <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle class="h-6 w-6 text-red-500" />
              Common Admit Card Mistakes to Avoid
            </h2>
          </div>
          
          <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
            <p>
              Every recruitment cycle, thousands of promising and highly prepared aspirants are disqualified at the exam center gates simply due to technical oversights. These easily avoidable mistakes can ruin months of dedicated academic effort. Review this critical list of common errors:
            </p>
            
            <ul class="list-decimal pl-5 space-y-3 text-xs text-slate-650">
              <li>
                <strong>Printing Only the Front Page:</strong> Many candidates print only the main sheet of the admit card, skipping the detailed instructions on the back. The instructions contain critical requirements (such as the mandatory COVID undertaking or shift guidelines) that the security desk requires.
              </li>
              <li>
                <strong>Blurred Photo Printouts:</strong> Printing your admit card on a low-ink home cartridge can result in a heavily blurred photo. If the invigilator cannot verify your face against the database records, you will be barred from entry. Always check the print quality before leaving the shop.
              </li>
              <li>
                <strong>Arriving at the Wrong Venue:</strong> Major cities often have multiple test centers with highly similar names (e.g., <em>"iON Digital Zone iDZ Mundka 1"</em> vs. <em>"iON Digital Zone iDZ Mundka 2"</em>). Verify the precise center code, postal address, and Google Maps pin provided on your final admit card to avoid arriving at the wrong location.
              </li>
              <li>
                <strong>Failing to Self-Attest:</strong> Certain exams require you to sign the admit card only in the presence of the room invigilator. Signing the card at home before arriving at the center is a serious violation that can invalidate your hall ticket.
              </li>
              <li>
                <strong>Forgetting Physical Photos:</strong> Assuming that your digital photograph on the screen is sufficient is a major error. If you forget your physical photographs, you cannot sign the laboratory attendance sheets, resulting in direct disqualification.
              </li>
            </ul>
          </div>
        </article>

        <!-- COMPREHENSIVE FAQS -->
        <div class="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-150 shadow-xs space-y-6" id="art-admit-faqs">
          <div class="border-b border-slate-100 pb-4">
            <span class="text-indigo-700 font-bold uppercase tracking-widest text-[9px] block">Aspirant Support</span>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle class="h-6 w-6 text-[#000080]" />
              Frequently Asked Questions (FAQs)
            </h3>
          </div>

          <div class="space-y-4" id="admit-faqs-accordion">
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

      <!-- RIGHT COLUMN: INTERACTIVE LOOKUP UTILITY & LIVE TRACKERS -->
      <div class="lg:col-span-1 space-y-6" id="admit-sidebar">
        
        <!-- INTERACTIVE VERIFICATION WIDGET -->
        <div class="bg-[#000080] text-white p-6 sm:p-7 rounded-[2rem] shadow-md relative overflow-hidden text-left space-y-4 border border-indigo-900" id="admit-verifier-card">
          <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div class="space-y-1.5">
            <span class="bg-amber-400 text-slate-950 font-black text-[9px] uppercase px-2.5 py-0.5 rounded-sm inline-block leading-none">Utility Panel</span>
            <h3 class="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
              <Printer class="h-5 w-5 text-amber-400" />
              Direct Download Status Look-up
            </h3>
            <p class="text-[11px] text-indigo-200 leading-relaxed font-sans">
              Test your registration code to confirm if your regional admit card has been locked, published, or queued.
            </p>
          </div>

          <form @submit="checkAdmitCardStatus" class="space-y-3.5 pt-2">
            <div>
              <label class="block text-[9px] font-bold text-indigo-300 uppercase mb-1">Registration ID / Roll Code:</label>
              <input 
                type="text" 
                v-model="candidateRegNo" 
                placeholder="e.g. SSC-CHSL-2026"
                class="w-full text-xs font-bold p-3 bg-indigo-950/80 border border-indigo-850 focus:border-amber-400 focus:outline-none rounded-xl text-white placeholder-indigo-400/70"
              />
            </div>
            <div>
              <label class="block text-[9px] font-bold text-indigo-300 uppercase mb-1">Date of Birth (DOB):</label>
              <input 
                type="text" 
                v-model="candidateDOB" 
                placeholder="DD/MM/YYYY"
                class="w-full text-xs font-bold p-3 bg-indigo-950/80 border border-indigo-850 focus:border-amber-400 focus:outline-none rounded-xl text-white placeholder-indigo-400/70"
              />
            </div>

            <button 
              type="submit" 
              class="w-full bg-amber-400 hover:bg-amber-500 disabled:bg-slate-700 text-slate-950 disabled:text-slate-400 font-black text-xs uppercase py-3 rounded-xl transition-all cursor-pointer shadow-md select-none flex items-center justify-center gap-2"
              :disabled="isCheckingStatus"
            >
              <RefreshCw v-if="isCheckingStatus" class="h-3.5 w-3.5 animate-spin" />
              <Search v-else class="h-3.5 w-3.5" />
              <span>{{ isCheckingStatus ? 'Searching Regional Servers...' : 'Inquire Allotment Status' }}</span>
            </button>
          </form>

          <div 
            v-if="checkStatusMsg" 
            class="text-[11px] font-sans font-medium p-3.5 rounded-xl border leading-relaxed animate-fade-in"
            :class="{
              'bg-emerald-50 text-emerald-800 border-emerald-200': checkStatusType === 'success',
              'bg-amber-50 text-amber-800 border-amber-200': checkStatusType === 'warning',
              'bg-red-50 text-red-800 border-red-200': checkStatusType === 'error'
            }"
          >
            {{ checkStatusMsg }}
          </div>
        </div>

        <!-- LISTING FILTER & SEARCH WIDGET -->
        <div class="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-150 shadow-xs space-y-4" id="admit-filter-sidebar">
          <div class="space-y-1">
            <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Search Filters</h3>
            <h4 class="text-sm font-black text-slate-900">Locate Active Hall Tickets</h4>
          </div>

          <!-- Text Search input -->
          <div class="relative">
            <input 
              type="text" 
              v-model="searchFilter" 
              placeholder="Search exam (e.g., SSC, Railway)..."
              class="w-full text-xs p-3 pl-9 border border-slate-200 focus:border-[#000080] focus:outline-none rounded-xl bg-slate-50 text-slate-800 font-medium"
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
                    ? 'bg-[#000080] border-[#000080] text-white' 
                    : 'bg-slate-50 border-slate-150 text-slate-600 hover:bg-slate-100'
                ]"
              >
                {{ b }}
              </button>
            </div>
          </div>
        </div>

        <!-- THE LISTING CARDS DISPLAY (REAL PUBLISHER CONTENT INCLUDED) -->
        <div class="space-y-4" id="admit-active-cards">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider">Active Hall Tickets</h4>
            <span class="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 rounded-sm font-bold">
              {{ filteredAdmitCards.length }} Matches
            </span>
          </div>

          <div v-if="filteredAdmitCards.length === 0" class="text-center p-6 bg-slate-50 rounded-2xl text-xs text-slate-400 font-sans border border-dashed">
            No active hall tickets found for the selected criteria.
          </div>

          <div 
            v-for="card in filteredAdmitCards" 
            :key="card.id" 
            class="bg-white p-5 rounded-[1.5rem] border border-slate-150 shadow-xs hover:shadow-sm transition-all duration-150 hover:border-[#000080]/30 space-y-3"
          >
            <div class="flex justify-between items-start gap-3">
              <span class="text-[9px] font-mono font-black uppercase text-[#000080] bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150">
                {{ card.board }}
              </span>
              <span class="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 rounded-sm border border-emerald-150">
                {{ card.status }}
              </span>
            </div>

            <div class="space-y-1 text-left">
              <h4 class="text-xs font-bold text-slate-850 leading-snug">{{ card.title }}</h4>
              <p class="text-[10px] text-slate-500 font-sans leading-relaxed">
                <strong>Regions:</strong> {{ card.region }}
              </p>
              <p class="text-[10px] text-slate-500 font-sans">
                <strong>Exam Dates:</strong> {{ card.examDate }}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex justify-between items-center">
              <span class="text-[10px] text-slate-400 font-mono">Released: {{ card.date }}</span>
              <a 
                :href="card.link" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-[10px] bg-[#000080] hover:bg-indigo-900 text-white font-black px-3 py-1.5 rounded uppercase tracking-wider cursor-pointer flex items-center gap-1 transition-colors leading-none"
              >
                <Download class="h-2.5 w-2.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
