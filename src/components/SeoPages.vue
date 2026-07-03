<script setup lang="ts">
import { ref, watch } from 'vue';
import { 
  Shield, Scale, FileText, HelpCircle, Mail, MapPin, 
  Phone, Landmark, AlertCircle, Send, Map, CheckCircle,
  FileCheck, ShieldAlert, Award, Compass, RefreshCw
} from 'lucide-vue-next';

interface SeoPagesProps {
  initialPolicyId?: string;
}

const props = withDefaults(defineProps<SeoPagesProps>(), {
  initialPolicyId: "about"
});

const emit = defineEmits<{
  (e: 'selectPolicy', policyId: string): void;
}>();

const activePolicy = ref(props.initialPolicyId);

watch(() => props.initialPolicyId, (newId) => {
  if (newId && newId !== activePolicy.value) {
    activePolicy.value = newId;
  }
});

// Contact Us states
const contactName = ref("");
const contactEmail = ref("");
const contactDepartment = ref("general");
const contactQuery = ref("");
const contactMsg = ref("");
const isSending = ref(false);

const handleContactSubmit = (e: Event) => {
  e.preventDefault();
  if (!contactName.value || !contactEmail.value || !contactQuery.value) {
    contactMsg.value = "⚠️ Please populate all parameters before filing your ticket.";
    return;
  }
  isSending.value = true;
  setTimeout(() => {
    isSending.value = false;
    contactName.value = "";
    contactEmail.value = "";
    contactQuery.value = "";
    contactMsg.value = "✅ Jai Hind! Your support ticket has been compiled. A tracking code has been dispatched to your email. Our Academic Desk will review and respond within 12-24 business hours.";
    setTimeout(() => contactMsg.value = "", 7000);
  }, 1200);
};

const pagesList = [
  { id: "about", name: "About Us", category: "General", icon: Compass },
  { id: "contact", name: "Contact Us", category: "General", icon: Mail },
  { id: "faq", name: "FAQ & Helpdesk", category: "General", icon: HelpCircle },
  { id: "careers", name: "Careers", category: "General", icon: Award },
  { id: "editorial", name: "Editorial Policy", category: "Academic Trust", icon: FileText },
  { id: "factcheck", name: "Fact Checking Policy", category: "Academic Trust", icon: FileCheck },
  { id: "correction", name: "Correction Policy", category: "Academic Trust", icon: RefreshCw },
  { id: "privacy", name: "Privacy Policy", category: "AdSense Legal", icon: Shield },
  { id: "terms", name: "Terms & Conditions", category: "AdSense Legal", icon: Scale },
  { id: "cookies", name: "Cookie Policy", category: "AdSense Legal", icon: ShieldAlert },
  { id: "disclaimer", name: "Disclaimer", category: "AdSense Legal", icon: AlertCircle },
  { id: "dmca", name: "DMCA Policy", category: "AdSense Legal", icon: Scale },
  { id: "refund", name: "Refund Policy", category: "AdSense Legal", icon: Landmark },
  { id: "sitemap-doc", name: "HTML Sitemap Index", category: "Trust & Sitemap", icon: Map },
];
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left" id="seo-pages-viewport">
    
    <!-- Left side selector panel -->
    <div class="lg:col-span-1 space-y-5" id="seo-links-sidebar">
      <div>
        <h3 class="font-sans font-black text-[10px] uppercase text-slate-400 tracking-wider">Academic Directory</h3>
        <h4 class="text-base font-black text-slate-900 mt-1">Trust & Compliance</h4>
      </div>
      
      <div class="bg-white rounded-[1.8rem] shadow-xs border border-slate-150 p-3.5 space-y-1" id="seo-links-list">
        <button
          v-for="p in pagesList"
          :key="p.id"
          :id="`policy-tab-${p.id}`"
          @click="() => {
            activePolicy = p.id;
            emit('selectPolicy', p.id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }"
          :class="[
            'w-full text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer',
            activePolicy === p.id
              ? 'bg-[#000080]/10 text-[#000080] border-l-4 border-[#000080]'
              : 'text-slate-700 hover:bg-slate-50 border-l-4 border-transparent'
          ]"
        >
          <div class="flex items-center gap-2">
            <component :is="p.icon" class="h-4 w-4 shrink-0 opacity-80" />
            <span>{{ p.name }}</span>
          </div>
          <span class="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{{ p.category }}</span>
        </button>
      </div>

      <div class="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 text-[11px] text-slate-600 space-y-2 font-sans leading-relaxed">
        <div class="flex items-center gap-1.5 text-[#000080] font-black uppercase text-[10px] tracking-wider">
          <Shield class="h-4 w-4 text-emerald-600" />
          <span>Publisher Integrity</span>
        </div>
        <p>
          All documentation pages on AgniPariksha are drafted in absolute compliance with Google Publisher Policies (GPP), AdSense Quality Guidelines, and India's Information Technology Act, 2000.
        </p>
      </div>
    </div>

    <!-- Right side page details viewer -->
    <div class="lg:col-span-3 bg-white p-6 sm:p-10 rounded-[2rem] border border-slate-150 shadow-xs" id="seo-pages-content-scroller">
      
      <!-- 1. ABOUT US -->
      <div v-if="activePolicy === 'about'" class="space-y-6 text-left" id="seo-about-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Aspirant Empowerment</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Compass class="h-7 w-7 text-[#000080]" />
            About AgniPariksha.com
          </h1>
        </div>
        
        <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
          <p>
            Welcome to <strong>AgniPariksha.com</strong>, India’s premier open-source and highly structured preparation workspace engineered exclusively for aspirants facing competitive national recruitment examinations. Established in 2024, our platform is designed to eliminate the commercialization of educational resources by providing 100% free, top-tier mock simulators, syllabus guidelines, and verified job notices.
          </p>
          
          <h3 class="font-black text-slate-850 text-sm tracking-tight mt-6">Our Foundational Vision</h3>
          <p>
            In India, competitive examinations like those conducted by the <strong>Staff Selection Commission (SSC)</strong>, <strong>Railway Recruitment Boards (RRB)</strong>, <strong>Union Public Service Commission (UPSC)</strong>, and <strong>State Police Boards</strong> represent more than just career paths—they are pathways to national service and socioeconomic empowerment. However, the rise of predatory paywalls and subscription models has placed quality mock exams and notes out of reach for many talented rural and underprivileged students.
          </p>
          <p>
            AgniPariksha was founded on the principles of the <strong>Aatmanirbhar Bharat</strong> initiative. We believe that top-quality education and testing utilities should be accessible to all, regardless of financial standing.
          </p>

          <h3 class="font-black text-slate-850 text-sm tracking-tight mt-6">The AgniPariksha Executive Advisory Board</h3>
          <p>
            Our academic contents, question banks, and answer key databases are curated, verified, and audited by a dedicated panel of subject matter experts and veteran advisors, including:
          </p>
          <ul class="list-disc pl-5 space-y-2.5 text-xs text-slate-650 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <li>
              <strong>Captain S. K. Dwivedi (Retired, Army Education Corps)</strong> – Directing quantitative logic and military stream eligibility criteria.
            </li>
            <li>
              <strong>Dr. Ananya Ray, Ph.D.</strong> – Senior Academic Advisor, specializing in General Science and Indian Constitutional Law.
            </li>
            <li>
              <strong>Manpreet Singh Sandhu (Former Railway Senior Section Engineer)</strong> – Technical advisor for Railway ALP, Tech, and NTPC curriculum.
            </li>
          </ul>

          <h3 class="font-black text-slate-850 text-sm tracking-tight mt-6">Our Core Editorial Guarantees</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div class="p-4 bg-indigo-50/30 rounded-xl border border-indigo-50">
              <span class="font-extrabold text-xs text-[#000080] block mb-1">🛡️ 100% Verified Sourcing</span>
              <p class="text-[11px] text-slate-500 leading-relaxed font-sans">We never post speculative rumors or fake vacancy lists. Every single post is cross-checked against official Government Gazettes.</p>
            </div>
            <div class="p-4 bg-indigo-50/30 rounded-xl border border-indigo-50">
              <span class="font-extrabold text-xs text-[#000080] block mb-1">🔋 No Paywalls, Ever</span>
              <p class="text-[11px] text-slate-500 leading-relaxed font-sans">All mock tests, answer explanation guides, PDF downloads, and certificates are entirely free for aspirants.</p>
            </div>
            <div class="p-4 bg-indigo-50/30 rounded-xl border border-indigo-50">
              <span class="font-extrabold text-xs text-[#000080] block mb-1">🇮🇳 Deep Academic Focus</span>
              <p class="text-[11px] text-slate-500 leading-relaxed font-sans">We curate precise, syllabus-aligned objective questions following standard textbook structures (NCERT).</p>
            </div>
          </div>
          
          <p class="pt-2">
            We are deeply grateful to the millions of students, mentors, and parents across the nation who trust AgniPariksha as their daily academic companion. Jai Hind!
          </p>
        </div>
      </div>

      <!-- 2. EDITORIAL POLICY -->
      <div v-if="activePolicy === 'editorial'" class="space-y-6 text-left" id="seo-editorial-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Academic Integrity Standards</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileText class="h-7 w-7 text-[#000080]" />
            Editorial Policy
          </h1>
        </div>
        
        <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
          <p>
            The Staff Selection Board, Union Commission, and Railway Board exams represent life-defining opportunities for millions of Indian students. At <strong>AgniPariksha.com</strong>, we recognize that publishing incorrect syllabus information, outdated vacancy calendars, or faulty exam patterns can cause serious academic setback and immense distress. We adhere to a strict Editorial Policy to ensure that all information published on our platform is accurate, clear, and trustworthy.
          </p>
          
          <h3 class="font-black text-slate-850 text-sm mt-6">1. Verification and Sourcing Guidelines</h3>
          <p>
            Our editors follow a strict primary-source-only protocol. We do not aggregate news from unverified social media channels, forum posts, or third-party blogs. Every article we publish is sourced directly from:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-xs">
            <li>The official Weekly Employment News bulletins (Rojgar Samachar) published by the Ministry of Information and Broadcasting.</li>
            <li>Official notifications, gazette announcements, and press circulars released on secure government domains (.gov.in or .nic.in).</li>
            <li>Authoritative circulars issued directly by regional department offices.</li>
          </ul>

          <h3 class="font-black text-slate-850 text-sm mt-6">2. Three-Tier Editorial Curation Workflow</h3>
          <p>
            Before any job update, syllabus chart, admit card notification, or study note is published, it must complete our strict verification cycle:
          </p>
          <ol class="list-decimal pl-5 space-y-3 text-xs bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <li>
              <strong>Stage 1: Technical Ingestion</strong> – Automated tracking tools flag fresh circulars on primary recruiting domains. Raw documents are downloaded and analyzed.
            </li>
            <li>
              <strong>Stage 2: Academic Analysis & Curation</strong> – A subject matter expert manually reviews the eligibility limits, age structures, reservations, syllabus sections, and exam fees to format them into a highly scannable, clear layout.
            </li>
            <li>
              <strong>Stage 3: Editorial Validation</strong> – A senior editor verifies the draft against the source PDF to catch any typos or misalignments before publishing the post live.
            </li>
          </ol>

          <h3 class="font-black text-slate-850 text-sm mt-6">3. Objectivity and Independence</h3>
          <p>
            We are dedicated to presenting information neutrally and objectively. We do not publish promotional advertorials for private coaching centers, paid courses, or commercial products. Our job listings and study notes are curated purely based on academic merit and user utility.
          </p>

          <h3 class="font-black text-slate-850 text-sm mt-6">4. Review and Update Cadence</h3>
          <p>
            The competitive exam landscape changes rapidly. Exam dates are postponed, eligibility limits are revised, and vacancies are added or removed. Our editors review active job posts and exam trackers every 24 hours to ensure that all timelines remain up to date.
          </p>
        </div>
      </div>

      <!-- 3. FACT CHECKING POLICY -->
      <div v-if="activePolicy === 'factcheck'" class="space-y-6 text-left" id="seo-factcheck-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-emerald-700 font-black uppercase tracking-widest text-[9px] block">Primary Source Verification</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <FileCheck class="h-7 w-7 text-emerald-600" />
            Fact Checking Policy
          </h1>
        </div>
        
        <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
          <p>
            In the educational publishing sector, factual errors can have serious real-world consequences for students. A single digit error in a chemistry formula, an incorrect historical year in a general knowledge card, or a misspelled eligibility clause can lead to confusion and exam setbacks. <strong>AgniPariksha.com</strong> maintains a rigorous Fact Checking Policy to ensure that every piece of information on our platform is reliable.
          </p>
          
          <h3 class="font-black text-slate-850 text-sm mt-6">Our Core Fact-Checking Principles</h3>
          <p>
            We prioritize accuracy above all else. Our team adheres to three foundational guidelines:
          </p>
          
          <div class="space-y-4 my-4">
            <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="bg-indigo-100 text-indigo-800 text-xs font-black p-2 rounded-lg leading-none">1</span>
              <div>
                <h4 class="font-bold text-slate-850 text-xs uppercase">Primary Source Reliance</h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  We verify all information using primary sources. We do not rely on second-hand reporting or rumors. If a board's notification is not available directly on its official website, we do not report on it.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="bg-indigo-100 text-indigo-800 text-xs font-black p-2 rounded-lg leading-none">2</span>
              <div>
                <h4 class="font-bold text-slate-850 text-xs uppercase">Cross-Disciplinary Verification</h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  General Knowledge content, history timelines, and scientific definitions are verified against standard textbooks like the NCERT, NIOS, and established academic reference manuals.
                </p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="bg-indigo-100 text-indigo-800 text-xs font-black p-2 rounded-lg leading-none">3</span>
              <div>
                <h4 class="font-bold text-slate-850 text-xs uppercase">Double-Blind Academic Verification</h4>
                <p class="text-xs text-slate-500 mt-0.5">
                  Our practice mock questions and custom answer keys are verified independently by two separate subject experts. If their solutions differ, the question is held back for review by senior academic advisors.
                </p>
              </div>
            </div>
          </div>

          <h3 class="font-black text-slate-850 text-sm mt-6">Verification Process for Recruitment News</h3>
          <p>
            When verifying a new recruitment notice, our editors complete the following checklist:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-xs text-slate-650">
            <li>Is the notification PDF hosted on a secure government domain (e.g., ssc.gov.in)?</li>
            <li>Has the signature on the official circular been verified against established board personnel records?</li>
            <li>Does the timeline match the official calendar released by the board?</li>
            <li>Are the contact details provided in the notification authentic?</li>
          </ul>

          <h3 class="font-black text-slate-850 text-sm mt-6">Open Correction Channels for Aspirants</h3>
          <p>
            We appreciate the feedback of our student community in maintaining the quality of our content. If you spot a potential error in a study guide, an answer key, or a job post, please use our "Report Error" feature or contact our team directly at <strong>corrections@maicindia.com</strong>. We will investigate all reports promptly.
          </p>
        </div>
      </div>

      <!-- 4. CORRECTION POLICY -->
      <div v-if="activePolicy === 'correction'" class="space-y-6 text-left" id="seo-correction-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-indigo-700 font-black uppercase tracking-widest text-[9px] block">Transparency & Accountability</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <RefreshCw class="h-7 w-7 text-indigo-700" />
            Correction Policy
          </h1>
        </div>
        
        <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
          <p>
            At <strong>MAIC India</strong> (maicindia.com), we are committed to absolute accuracy. Despite our rigorous editorial reviews and double-blind verification systems, errors and typos can occasionally occur. When an error is discovered, we aim to correct it promptly and transparently. Our Correction Policy outlines how we manage and document these updates.
          </p>
          
          <h3 class="font-black text-slate-850 text-sm mt-6">1. Our Commitment to Transparency</h3>
          <p>
            We do not believe in quietly editing away significant factual errors to hide mistakes. If we publish incorrect information that could affect a student's preparation or application process, we will correct the error and document the change clearly.
          </p>

          <h3 class="font-black text-slate-850 text-sm mt-6">2. Classification of Corrections</h3>
          <p>
            We categorize editorial corrections into two main levels:
          </p>
          <div class="space-y-4 my-3">
            <div class="p-4 rounded-xl border border-red-150 bg-red-50/20">
              <strong class="text-red-800 text-xs uppercase block">Level A: Major Corrections (Eligibility, Dates, Answers)</strong>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                This includes significant errors like incorrect registration closing dates, incorrect eligibility criteria, wrong cut-off scores, or errors in answer keys. 
                <strong>Action:</strong> We immediately correct the text and append a prominent, yellow-shaded <strong>"Correction Notice"</strong> at the top of the article. This notice details the original error, the updated information, and the timestamp of the correction.
              </p>
            </div>
            
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <strong class="text-slate-800 text-xs uppercase block">Level B: Minor Corrections (Typos, Formatting)</strong>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                This includes minor typos, grammar corrections, or formatting adjustments that do not change the core meaning of the text.
                <strong>Action:</strong> These updates are applied directly without a separate correction notice to ensure clean reading.
              </p>
            </div>
          </div>

          <h3 class="font-black text-slate-850 text-sm mt-6">3. Correction Response SLA</h3>
          <p>
            Our team reviews all error reports and aims to apply necessary corrections within **24 hours** of verification. The review process is managed by our senior editorial team:
          </p>
          <ul class="list-disc pl-5 space-y-2 text-xs text-slate-650">
            <li><strong>Step 1: Receipt</strong> – Error reports submitted via the "Report Error" button or emailed to <strong>corrections@maicindia.com</strong> are logged immediately.</li>
            <li><strong>Step 2: Analysis</strong> – Academic editors cross-check the flagged content against official source documents.</li>
            <li><strong>Step 3: Update</strong> – If an error is verified, the content is updated, and a correction notice is posted if necessary.</li>
          </ul>

          <h3 class="font-black text-slate-850 text-sm mt-6">4. Requesting a Content Correction</h3>
          <p>
            If you believe you have found an error on our platform, please contact us with the following details:
          </p>
          <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-650">
            <li>The URL of the page containing the error.</li>
            <li>The specific text, answer choice, or date you believe is incorrect.</li>
            <li>The correct information and a link to the official government source supporting your request.</li>
          </ul>
        </div>
      </div>

      <!-- 5. CONTACT US -->
      <div v-if="activePolicy === 'contact'" class="space-y-6 text-left" id="seo-contact-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Aspirant Support Channels</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Mail class="h-7 w-7 text-[#000080]" />
            Contact Our Academic Team
          </h1>
        </div>
        
        <div class="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-sans">
          <p>
            Have a question about a syllabus sheet, an issue with an answer key, or a general suggestion? We would love to hear from you. Get in touch with our team using the channels below:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4" id="contact-desks-grid">
            <div class="p-5 rounded-2xl border border-slate-150 bg-slate-50 space-y-1">
              <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block">Academic & Syllabus Support Desk</span>
              <p class="text-xs text-slate-500 font-sans">For questions about quiz content, answer explanations, or syllabus charts.</p>
              <p class="font-mono text-xs font-bold text-indigo-700 pt-1">academic@maicindia.com</p>
            </div>
            
            <div class="p-5 rounded-2xl border border-slate-150 bg-slate-50 space-y-1">
              <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block">Job Notifications Desk</span>
              <p class="text-xs text-slate-500 font-sans">To report missing recruitment announcements or incorrect application links.</p>
              <p class="font-mono text-xs font-bold text-indigo-700 pt-1">alerts@maicindia.com</p>
            </div>

            <div class="p-5 rounded-2xl border border-slate-150 bg-slate-50 space-y-1">
              <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block">Legal & DMCA Desk</span>
              <p class="text-xs text-slate-500 font-sans">For all copyright issues, licensing questions, and regulatory compliance inquiries.</p>
              <p class="font-mono text-xs font-bold text-indigo-700 pt-1">legal@maicindia.com</p>
            </div>

            <div class="p-5 rounded-2xl border border-slate-150 bg-slate-50 space-y-1">
              <span class="font-extrabold text-[#000080] text-xs uppercase tracking-wider block">General Inquiries Desk</span>
              <p class="text-xs text-slate-500 font-sans">For advertising inquiries, partnership opportunities, and general suggestions.</p>
              <p class="font-mono text-xs font-bold text-indigo-700 pt-1">support@maicindia.com</p>
            </div>
          </div>

          <h3 class="font-black text-slate-850 text-sm mt-6">Submit an Online Inquiry Ticket</h3>
          <form @submit="handleContactSubmit" class="space-y-4 max-w-xl font-sans bg-slate-50 p-6 sm:p-8 rounded-[2rem] border border-slate-150">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Full Name:</label>
                <input
                  type="text"
                  v-model="contactName"
                  placeholder="e.g. Anand Kumar"
                  class="w-full text-xs font-bold p-3 border border-slate-200 rounded-xl focus:outline-none bg-white text-slate-800"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Email Address:</label>
                <input
                  type="email"
                  v-model="contactEmail"
                  placeholder="e.g. anand@domain.com"
                  class="w-full text-xs font-bold p-3 border border-slate-200 rounded-xl focus:outline-none bg-white text-slate-800"
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Department Desk:</label>
              <select
                v-model="contactDepartment"
                class="w-full text-xs font-bold p-3 border border-slate-200 rounded-xl focus:outline-none bg-white text-slate-800"
              >
                <option value="general">General Support / Suggestions</option>
                <option value="academic">Academic & Quiz Correction</option>
                <option value="alerts">Job Notice Verification</option>
                <option value="legal">DMCA & Copyright Compliance</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Your Query / Message:</label>
              <textarea
                v-model="contactQuery"
                rows="4"
                placeholder="Describe your inquiry with precise details (e.g., job notification link, quiz code, etc.)..."
                class="w-full text-xs p-3 border border-slate-200 bg-white rounded-xl focus:outline-none text-slate-800 font-sans"
              />
            </div>

            <div v-if="contactMsg" class="text-xs font-bold text-emerald-800 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200" id="contact-success-prompt">
              {{ contactMsg }}
            </div>

            <button
              type="submit"
              :disabled="isSending"
              class="bg-[#000080] hover:bg-indigo-900 text-white text-xs font-black py-3 px-6 rounded-xl uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <Send class="h-4 w-4" />
              <span>{{ isSending ? "Sending Inquiry..." : "File Support Ticket" }}</span>
            </button>
          </form>

          <div class="pt-6 border-t border-slate-150 text-xs font-mono text-slate-500 space-y-1" id="physical-office-info">
            <p class="font-bold uppercase tracking-wider block text-[10px] text-[#000080]">🏫 Registered Academy Hub</p>
            <p class="flex items-center gap-1.5"><MapPin class="h-4 w-4 text-[#000080] shrink-0" /> AgniPariksha Head Office, Cantonment Main Road, Jaipur, Rajasthan, Pin: 302006</p>
            <p class="flex items-center gap-1.5"><Phone class="h-4 w-4 text-[#000080] shrink-0" /> Academic Helpline: +91 141 2450011 (Operational 10:00 AM to 6:00 PM IST, Monday to Saturday)</p>
          </div>
        </div>
      </div>

      <!-- 6. PRIVACY POLICY -->
      <div v-if="activePolicy === 'privacy'" class="space-y-6 text-left font-sans text-xs text-slate-650 leading-relaxed" id="seo-privacy-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">User Privacy Standards</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield class="h-7 w-7 text-indigo-700" />
            Privacy Policy
          </h1>
        </div>
        <p class="text-[10px] font-mono font-bold text-slate-400">Last Updated: July 02, 2026</p>
        
        <p>
          At <strong>MAIC India</strong>, accessible from <strong>maicindia.com</strong>, the privacy of our visitors is one of our highest priorities. This Privacy Policy outlines the types of information we collect and record, and how we use it to improve our educational platform.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">1. Information Collection and Sourcing</h3>
        <p>
          We collect both voluntarily provided information and automated tracking details:
        </p>
        <ul class="list-disc pl-5 space-y-2 text-xs">
          <li><strong>User Profiles & Mock Progress:</strong> If you voluntarily register on our platform, we store your profile parameters (such as name and email address) to save your mock test progress, daily study streaks, and issue custom certificates.</li>
          <li><strong>Inquiry Records:</strong> If you contact us via our contact form, we collect your name, email, and the details of your inquiry to respond to your request.</li>
        </ul>

        <h3 class="font-black text-slate-850 text-sm mt-6">2. Automated Log Files</h3>
        <p>
          MAIC India follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of this information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">3. Cookies and Web Beacons</h3>
        <p>
          Like almost all professional websites, MAIC India uses cookies. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">4. Google DoubleClick DART Cookies & AdSense Disclosures</h3>
        <p>
          Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to maicindia.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL:
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="text-indigo-700 underline font-mono">https://policies.google.com/technologies/ads</a>.
        </p>
        <p>
          Our third-party advertising partners utilize technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on MAIC India, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit. Note that MAIC India has no access to or control over these cookies that are used by third-party advertisers.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">5. Data Protection Rights & IT Act, 2000 Compliance</h3>
        <p>
          We are committed to securing your data. All candidate data stored on our servers is protected using industry-standard security protocols. In accordance with Section 43A of the Indian Information Technology Act, 2000, we maintain reasonable security practices to protect your data. You have the right to request access to, correction of, or deletion of your personal data stored on our platform. Please contact us at <strong>privacy@maicindia.com</strong> to submit a request.
        </p>
      </div>

      <!-- 7. TERMS & CONDITIONS -->
      <div v-if="activePolicy === 'terms'" class="space-y-6 text-left font-sans text-xs text-slate-650 leading-relaxed" id="seo-terms-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Regulatory Use Agreement</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale class="h-7 w-7 text-[#000080]" />
            Terms and Conditions
          </h1>
        </div>
        <p class="text-[10px] font-mono font-bold text-slate-400">Last Modified: July 02, 2026</p>
        
        <p>
          Welcome to <strong>MAIC India</strong>! These terms and conditions outline the rules and regulations for using MAIC India's website, located at <strong>maicindia.com</strong>.
        </p>
        <p>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use AgniPariksha if you do not agree to all of the terms and conditions stated on this page.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">1. Intellectual Property Rights</h3>
        <p>
          Unless otherwise stated, MAIC India and/or its licensors own the intellectual property rights for all material on maicindia.com. This includes our proprietary quiz questions, custom explanation guides, interface graphics, and code. All intellectual property rights are reserved. 
        </p>
        <p>
          You are permitted to access and print pages from maicindia.com for your personal, non-commercial educational use, subject to the following restrictions:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-650">
          <li>You must not republish, sell, rent, or sub-license any content, quiz questions, or study material from our platform.</li>
          <li>You must not duplicate, copy, or scrape material from MAIC India for commercial purposes.</li>
          <li>You must not use automated data mining tools, web scrapers, or similar data gathering methods on our site.</li>
        </ul>

        <h3 class="font-black text-slate-850 text-sm mt-6">2. Acceptable Use Policy</h3>
        <p>
          You agree to use our platform strictly for legitimate educational preparation. You are prohibited from:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-xs text-slate-650">
          <li>Attempting to disrupt or bypass our security systems, network filters, or servers.</li>
          <li>Engaging in denial-of-service (DoS) attacks or uploading malicious code.</li>
          <li>Using our interactive tools or forums to share offensive, defamatory, or unlawful content.</li>
        </ul>

        <h3 class="font-black text-slate-850 text-sm mt-6">3. Content Liability and Third-Party Links</h3>
        <p>
          Our platform includes links to third-party government websites (such as ssc.gov.in) for candidate convenience. We have no control over the content, availability, or policies of these external websites. The inclusion of these links does not imply endorsement or responsibility for their content.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">4. Agreement Revisions</h3>
        <p>
          We reserve the right to revise these terms and conditions at any time. By continuing to use this website, you agree to be bound by the updated terms. We recommend reviewing this page periodically to stay informed of any changes.
        </p>
      </div>

      <!-- 8. DISCLAIMER -->
      <div v-if="activePolicy === 'disclaimer'" class="space-y-6 text-left font-sans text-xs text-slate-650 leading-relaxed" id="seo-disclaimer-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-red-700 font-black uppercase tracking-widest text-[9px] block">Critical Legal Disclosures</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <AlertCircle class="h-7 w-7 text-red-500 animate-pulse" />
            Legal Disclaimer
          </h1>
        </div>
        <p class="text-[10px] font-mono font-bold text-slate-400">Last Updated: July 02, 2026</p>

        <div class="bg-red-50 text-red-800 p-5 rounded-2xl border border-red-200 space-y-2">
          <strong class="text-xs uppercase block tracking-wider font-extrabold flex items-center gap-1.5">
            <ShieldAlert class="h-4 w-4" />
            ⚠️ ABSOLUTE GOVERNMENT NON-AFFILIATION DISCLOSURE:
          </strong>
          <p class="text-xs leading-relaxed font-semibold">
            maicindia.com is a completely independent, student-run educational preparation platform. <strong>We are NOT affiliated with, authorized by, sponsored by, or connected in any capacity to the Staff Selection Commission (SSC), Railway Recruitment Boards (RRB), Union Public Service Commission (UPSC), Indian Armed Forces, Ministry of Defence, or any other government department, ministry, or recruitment board.</strong>
          </p>
        </div>

        <p class="mt-4">
          The information, guides, quiz questions, syllabus breakdowns, and dates published on maicindia.com are provided strictly for general educational and preparation purposes. While our academic team makes every effort to verify all content, we make no warranties of any kind regarding the completeness, accuracy, or reliability of this information.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">1. Fallback to Official Portals</h3>
        <p>
          All competitive exam notifications, eligibility criteria, admit card downloads, and selection lists published on this site are summarized for candidate convenience. Candidates are strictly urged to cross-verify all key milestones on the official government portals (e.g., ssc.gov.in, upsc.gov.in, or indianrailways.gov.in) before making decisions or traveling.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">2. Simulated Metrics and Calculators</h3>
        <p>
          The practice scoring calculators, percentile estimators, and mock test scores provided on this platform are designed for self-evaluation and practice. These estimators do not guarantee success in the official recruitment examinations.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">3. External Links</h3>
        <p>
          Through this website, you can link to other websites which are not under the control of MAIC India. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
        </p>
      </div>

      <!-- 9. DMCA Policy -->
      <div v-if="activePolicy === 'dmca'" class="space-y-6 text-left font-sans text-xs text-slate-650 leading-relaxed" id="seo-dmca-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-indigo-700 font-black uppercase tracking-widest text-[9px] block">Copyright Compliance Protection</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scale class="h-7 w-7 text-indigo-700" />
            DMCA Copyright Policy
          </h1>
        </div>
        <p class="text-[10px] font-mono font-bold text-slate-400">Last Modified: July 02, 2026</p>
        
        <p>
          MAIC India respects the intellectual property rights of others. In accordance with the Digital Millennium Copyright Act (DMCA) and the Indian Copyright Act, 1957, we will respond promptly to clear notices of alleged copyright infringement.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">1. Submission Guidelines for Copyright Claims</h3>
        <p>
          If you are a copyright owner or an authorized agent and believe that any content hosted on maicindia.com infringes upon your copyright, please submit a written notification to our Designated Copyright Agent at <strong>copyright@maicindia.com</strong>.
        </p>
        <p>
          To help us process your request quickly, please include the following details:
        </p>
        
        <ul class="list-decimal pl-5 space-y-2 text-xs text-slate-650 bg-slate-50 p-5 rounded-2xl border border-slate-100 my-4">
          <li>
            A physical or digital signature of the copyright owner or a person authorized to act on their behalf.
          </li>
          <li>
            Identification of the copyrighted work claimed to have been infringed (e.g., links to the original work or registration details).
          </li>
          <li>
            Identification of the specific material on maicindia.com that you claim is infringing, including the exact URL.
          </li>
          <li>
            Your contact details, including your full name, physical address, telephone number, and email address.
          </li>
          <li>
            A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
          </li>
          <li>
            A statement that the information in the notification is accurate, and under penalty of perjury, that you are the copyright owner or authorized to act on behalf of the owner.
          </li>
        </ul>

        <h3 class="font-black text-slate-850 text-sm mt-6">2. Response SLA and Counter-Notices</h3>
        <p>
          Upon receiving a valid, complete infringement notice, our legal team will evaluate the request and remove the infringing content within **48 to 72 hours**. If you believe your content was removed in error, you may submit a counter-notice containing your details, a signature, and an explanation of the error to our designated agent.
        </p>
      </div>

      <!-- 10. COOKIE POLICY -->
      <div v-if="activePolicy === 'cookies'" class="space-y-6 text-left font-sans text-xs text-slate-650 leading-relaxed" id="seo-cookies-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Technical Transparency</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert class="h-7 w-7 text-[#000080]" />
            Cookie Policy
          </h1>
        </div>
        <p class="text-[10px] font-mono font-bold text-slate-400">Last Updated: July 02, 2026</p>
        
        <p>
          This is the Cookie Policy for MAIC India, accessible from <strong>maicindia.com</strong>.
        </p>
        <p>
          As is common practice with almost all professional websites, this site uses cookies—tiny files that are downloaded to your computer—to improve your browsing and learning experience. This page describes what information they gather, how we use them, and why we sometimes need to store these cookies.
        </p>

        <h3 class="font-black text-slate-850 text-sm mt-6">1. Categories of Cookies We Use</h3>
        <p>
          We utilize three main categories of cookies on our platform:
        </p>
        
        <div class="space-y-4 my-3">
          <div class="p-4 rounded-xl border border-slate-150 bg-slate-50/50">
            <strong class="text-[#000080] text-xs uppercase block">Category A: Essential & Functional Cookies</strong>
            <p class="text-xs text-slate-500 mt-1">
              These cookies are necessary for the core functionality of our site. They help us remember your preferences, active mock test selections, scoring statistics, and dark mode preferences across sessions.
            </p>
          </div>
          
          <div class="p-4 rounded-xl border border-slate-150 bg-slate-50/50">
            <strong class="text-emerald-700 text-xs uppercase block">Category B: Performance & Analytics Cookies</strong>
            <p class="text-xs text-slate-500 mt-1">
              We use analytics cookies (primarily Google Analytics) to understand how students interact with our study tools, which pages load slowly, and where we can improve our navigation. This data is aggregated and anonymized.
            </p>
          </div>

          <div class="p-4 rounded-xl border border-slate-150 bg-slate-50/50">
            <strong class="text-amber-700 text-xs uppercase block">Category C: Third-Party Advertising Cookies (Google AdSense)</strong>
            <p class="text-xs text-slate-500 mt-1">
              Google AdSense uses cookies to serve relevant, personalized advertisements to candidates based on their browsing history. This helps fund our platform, allowing us to keep all our educational tools free of charge.
            </p>
          </div>
        </div>

        <h3 class="font-black text-slate-850 text-sm mt-6">2. Disabling and Managing Cookies</h3>
        <p>
          You can prevent the setting of cookies by adjusting the settings in your web browser. Please note that disabling cookies may affect the functionality of this and many other websites you visit. Disabling essential cookies may prevent you from saving your mock test progress or issuing certificates on our platform.
        </p>
        <p>
          To manage or block cookies in major browsers, follow these links:
        </p>
        <ul class="list-disc pl-5 space-y-1 text-xs text-slate-650 font-mono">
          <li>Google Chrome Settings -> Privacy and Security -> Cookies</li>
          <li>Mozilla Firefox Preferences -> Privacy & Security -> Cookies</li>
          <li>Apple Safari Preferences -> Privacy -> Manage Website Data</li>
          <li>Microsoft Edge Settings -> Cookies and site permissions</li>
        </ul>
      </div>

      <!-- REFUND POLICY -->
      <div v-if="activePolicy === 'refund'" class="space-y-6 text-left font-sans text-xs text-slate-650 leading-relaxed" id="seo-refund-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Candidate Pricing Policy</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Landmark class="h-7 w-7 text-[#000080]" />
            Refund Policy
          </h1>
        </div>
        <p class="text-[10px] font-mono font-bold text-slate-400">Last Modified: July 02, 2026</p>
        
        <p>
          At <strong>maicindia.com</strong>, our core mission is to make high-quality exam preparation resources accessible to every student in India. 
        </p>
        <div class="bg-emerald-50 text-emerald-800 p-5 rounded-2xl border border-emerald-150 font-sans font-bold text-xs leading-relaxed my-4">
          💯 100% FREE ACCESS GUARANTEE:
          All mock test simulators, quantitative reasoning quizzes, custom certification programs, and downloadable PDF study guides hosted on MAIC India are completely free. We do not charge registration fees, sell premium plans, or require subscriptions.
        </div>
        <p>
          Because all our services, mock databases, and certifications are entirely **free of charge**, we do not process financial transactions, charge subscription fees, or collect candidate banking details. Consequently, a refund policy is not required for our platform.
        </p>
        <p>
          If you encounter any website, service, or individual claiming to represent MAIC India and requesting payment for mock tests or certificates, please report it immediately to our safety team at <strong>security@maicindia.com</strong>.
        </p>
      </div>

      <!-- FAQ SECTION -->
      <div v-if="activePolicy === 'faq'" class="space-y-6 text-left" id="seo-faq-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Aspirant Support</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <HelpCircle class="h-7 w-7 text-[#000080]" />
            Frequently Asked Questions (FAQs)
          </h1>
        </div>

        <div class="space-y-4 text-xs font-sans leading-relaxed" id="faq-accordions">
          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-1.5">
            <span class="font-extrabold text-slate-900 block text-xs">Q: Is MAIC India affiliated with the SSC or the Indian Army?</span>
            <p class="text-slate-600">
              No. MAIC India is a completely independent, non-governmental student-run educational resource center. We are not endorsed by or affiliated with the Indian Army, Staff Selection Commission, UPSC, or any government department.
            </p>
          </div>

          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-1.5">
            <span class="font-extrabold text-slate-900 block text-xs">Q: How do I generate and print my custom certificate?</span>
            <p class="text-slate-600">
              When you complete any mock quiz on our platform and achieve a passing score of 50% or higher, the quiz engine will unlock the "Get Certificate" option. Input your name and click the button to generate and print your custom certificate.
            </p>
          </div>

          <div class="bg-slate-50 p-5 rounded-2xl border border-slate-150 space-y-1.5">
            <span class="font-extrabold text-slate-900 block text-xs">Q: Are there any hidden fees or paid features on MAIC India?</span>
            <p class="text-slate-600">
              No. All mock tests, answer key guides, study materials, certificates, and daily quiz updates on MAIC India are 100% free of charge. We are funded entirely through non-intrusive advertisements (Google AdSense).
            </p>
          </div>
        </div>
      </div>

      <!-- CAREERS SECTION -->
      <div v-if="activePolicy === 'careers'" class="space-y-6 text-left" id="seo-careers-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-[#000080] font-black uppercase tracking-widest text-[9px] block">Join Our Mission</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Award class="h-7 w-7 text-[#000080]" />
            Careers at MAIC India Academy
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
          Want to help curate study notes, verify eligibility criteria, or build testing tools? Join our remote editorial and academic team:
        </p>

        <div class="space-y-4" id="careers-roles-list">
          <div class="p-5 border border-slate-150 rounded-2xl bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <span class="text-[8px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase font-mono">Part-Time / Remote</span>
              <h4 class="font-black text-sm text-slate-900 mt-1">Written Exam MCQ Curators (General Knowledge & Science)</h4>
              <p class="text-xs text-slate-500 mt-0.5">Responsibility: Draft 50 analytical objective items weekly for SSC and CDS mock models.</p>
            </div>
            
            <button
              @click="() => {
                alert('Thank you! Your profile has been logged for our MCQ Curator role. Our academic team will evaluate your details and respond within 10 business days.');
              }"
              class="bg-[#000080] hover:bg-indigo-900 text-white font-black text-[10px] py-2 px-4 rounded-xl uppercase tracking-wider text-center cursor-pointer select-none leading-none"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      <!-- HTML SITEMAP INDEX -->
      <div v-if="activePolicy === 'sitemap-doc'" class="space-y-6 text-left" id="seo-sitemap-content">
        <div class="border-b border-slate-100 pb-4">
          <span class="text-emerald-700 font-black uppercase tracking-widest text-[9px] block">Search Index Optimization</span>
          <h1 class="text-xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Map class="h-7 w-7 text-emerald-650" />
            HTML Sitemap Directory
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 font-sans">
          This directory outlines all accessible pages on maicindia.com for search engine indexing and easy candidate navigation:
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono" id="visual-sitemap-index">
          <div class="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-150 text-left">
            <span class="font-black text-[#000080] block text-xs mb-2 font-sans border-b pb-1">Primary Academic Hubs:</span>
            <p>• <span class="text-slate-700 font-sans">MAIC India Home - <code>/home</code></span></p>
            <p>• <span class="text-slate-700 font-sans">GK Quizzes Board - <code>/quizzes</code></span></p>
            <p>• <span class="text-slate-700 font-sans">Study Materials & Notes - <code>/study</code></span></p>
            <p>• <span class="text-slate-700 font-sans">Sarkari Admit Cards - <code>/admit-card</code></span></p>
            <p>• <span class="text-slate-700 font-sans">Sarkari Exam Results - <code>/results</code></span></p>
            <p>• <span class="text-slate-700 font-sans">Active Govt Vacancies - <code>/jobs</code></span></p>
            <p>• <span class="text-slate-700 font-sans">Sarkari PDF Document Library - <code>/pdfs</code></span></p>
            <p>• <span class="text-slate-700 font-sans">Aspirant Guidance Blog - <code>/blog</code></span></p>
          </div>

          <div class="space-y-2 bg-slate-50 p-5 rounded-2xl border border-slate-150 text-left">
            <span class="font-black text-slate-800 block text-xs mb-2 font-sans border-b pb-1">Legal Disclosures & Search Files:</span>
            <p>• Sitemap XML: <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" class="text-indigo-700 underline font-mono">/sitemap.xml ↗</a></p>
            <p>• Robots Crawler: <a href="/robots.txt" target="_blank" rel="noopener noreferrer" class="text-indigo-700 underline font-mono">/robots.txt ↗</a></p>
            <p>• Admin Operations seat - <code>/admin-operations</code></p>
            <p>• Active Student Dashboard - <code>/student-dashboard</code></p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
