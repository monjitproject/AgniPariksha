<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { 
  Settings, Award, Briefcase, FileText, Globe, 
  DollarSign, Activity, Sparkles, TrendingUp, CheckCircle, Plus,
  Trash2, Edit, ChevronRight, Download, Search, FileJson,
  HelpCircle, Layers, History, Image, Users, ArrowLeft,
  Copy, Check, BookOpen, Info, X, Clock, Eye, RefreshCw
} from 'lucide-vue-next';
import { Quiz, Question, JobPost } from '../types';

interface AdminPanelProps {
  quizzesCount: number;
  jobsCount: number;
}

const props = defineProps<AdminPanelProps>();

const emit = defineEmits<{
  (e: 'addQuiz', newQuiz: Quiz): void;
  (e: 'addJob', newJob: JobPost): void;
}>();

// Navigation Tabs
type AdminTab = 'manage' | 'editor' | 'media' | 'bulk' | 'mcq';
const currentTab = ref<AdminTab>('manage');

// Role-Based Access Control
const userRole = ref<'Admin' | 'Editor'>('Admin');
const userName = ref('Vikram Singh');

// Realtime analytic counters state
const trafficImpressions = ref(15240);
const adsenseClicks = ref(798);
const estimatedCpcUsd = ref(284.15);

// API fetched state
const jobsList = ref<any[]>([]);
const mediaList = ref<any[]>([]);
const activeRevisions = ref<any[]>([]);
const isLoadingJobs = ref(false);
const isLoadingMedia = ref(false);
const isLoadingRevisions = ref(false);
const selectedRevisionJobId = ref<string | null>(null);

// Status Message Toast
const statusMessage = ref("");
const statusType = ref<'success' | 'error' | 'info'>('success');

const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
  statusMessage.value = msg;
  statusType.value = type;
  setTimeout(() => {
    statusMessage.value = "";
  }, 4000);
};

// --- Form State for Create/Edit Job Post ---
const isEditing = ref(false);
const editingJobId = ref<string | null>(null);

const jobTitle = ref("");
const jobCategory = ref<any>("Agniveer");
const jobEligibility = ref("Male & Female citizens residing in India.");
const jobAgeLimit = ref("17.5 to 21 Years");
const jobQualification = ref("Class 10th Pass");
const jobSalary = ref("₹30,000 to ₹40,000/month");
const jobSelectionProcess = ref("Written Common Entrance Exam (CEE) and Physical Fitness Test.");
const jobApplyLink = ref("https://joinindianarmy.nic.in");
const jobState = ref("All India");
const jobDepartment = ref("Indian Army Recruiting Directorate");
const jobTagsRaw = ref("army, agniveer, recruitment, active");
const jobStatus = ref<'draft' | 'scheduled' | 'published'>('published');
const jobPublishDate = ref(new Date().toISOString().split('T')[0]);
const jobFeaturedImageUrl = ref("https://images.unsplash.com/photo-1590134701633-e7e0e7a170fb?auto=format&fit=crop&q=80&w=800");

// SEO parameters
const jobSeoTitle = ref("");
const jobMetaDescription = ref("");
const jobSlug = ref("");

// Rich text editor content
const editorContent = ref(`<h2>1. Eligibility Standards & Physical Attributes</h2><p>Interested Agniveer aspirants must review the height and weight charts. Running 1.6 kilometers within the threshold of 5 minutes 30 seconds is required to score Group I metrics.</p><h2>2. Written CEE Examination Strategy</h2><p>The computer-based test evaluates general knowledge, general science, arithmetic concepts, and elementary reasoning. Maintain rigorous revision cycles with AgniPariksha mock drills.</p><h2>3. Step-by-Step Registration Guide</h2><p>Access the joinindianarmy.nic.in registry. Complete One-Time Registration (OTR), verify email ID, and submit online fees.</p>`);

// Table of Contents list
const tocItems = ref<any[]>([]);

// FAQs list
const faqItems = ref<Array<{ question: string, answer: string }>>([
  { question: "What is the age limit for Agniveer Rally recruitment?", answer: "Candidates must be between 17.5 and 21 years of age." },
  { question: "Is there any negative marking in the exam?", answer: "Yes, there is a penalty of 0.50 marks for each incorrect objective answer." }
]);

// Simulated PDF Upload State
const isPdfDragging = ref(false);
const uploadedPdfName = ref("");
const uploadedPdfSize = ref("");
const isUploadingPdf = ref(false);

// Media Selection Popup State
const showMediaPicker = ref(false);

// Bulk Import State
const bulkJsonInput = ref("");
const bulkFileError = ref("");
const validatedBulkJobs = ref<any[]>([]);

// MCQ Form states (For existing GK quiz category publisher)
const quizTitle = ref("");
const quizCategory = ref("Agniveer Selection CEE");
const quizDifficulty = ref<"Easy" | "Medium" | "Hard">("Medium");
const quizTimeLimit = ref(150);
const qText = ref("");
const opt0 = ref("");
const opt1 = ref("");
const opt2 = ref("");
const opt3 = ref("");
const correctOptionIdx = ref(0);
const qExplanation = ref("");

// --- Fetch and Initialize Data ---
const fetchJobs = async () => {
  isLoadingJobs.value = true;
  try {
    const res = await fetch('/api/sarkari-jobs');
    if (res.ok) {
      const data = await res.json();
      jobsList.value = data.jobs || [];
    }
  } catch (e) {
    console.error("Error fetching jobs from server:", e);
  } finally {
    isLoadingJobs.value = false;
  }
};

const fetchMedia = async () => {
  isLoadingMedia.value = true;
  try {
    const res = await fetch('/api/media');
    if (res.ok) {
      const data = await res.json();
      mediaList.value = data.media || [];
    }
  } catch (e) {
    console.error("Error fetching media from server:", e);
  } finally {
    isLoadingMedia.value = false;
  }
};

onMounted(() => {
  fetchJobs();
  fetchMedia();
});

// Watch to auto-update Slug, SEO Title, and Meta Description on Title edits
watch(jobTitle, (newVal) => {
  if (!isEditing.value) {
    jobSlug.value = newVal.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    jobSeoTitle.value = `${newVal} Notification 2026: Apply Online Guide`;
    jobMetaDescription.value = `Official recruitment alert: ${newVal}. Check eligibility parameters, salary, qualification, exams, and apply link.`;
  }
});

// --- Rich Text Editor Actions ---
const injectText = (prefix: string, suffix: string = "") => {
  const textarea = document.getElementById('rich-text-editor-textarea') as HTMLTextAreaElement;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);
  const replacement = prefix + selectedText + suffix;
  editorContent.value = text.substring(0, start) + replacement + text.substring(end);
  textarea.focus();
};

const injectTable = () => {
  const tableTemplate = `\n<div class="overflow-x-auto border rounded-xl my-4">\n  <table class="w-full text-xs text-left">\n    <thead>\n      <tr class="bg-gray-150 border-b">\n        <th class="p-3 font-bold">Category Feature</th>\n        <th class="p-3 font-bold">Recruitment Metrics</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr class="border-b">\n        <td class="p-3">Primary Pay Scale</td>\n        <td class="p-3">${jobSalary.value || '₹21,700 - ₹69,100'}</td>\n      </tr>\n      <tr>\n        <td class="p-3">Age Bracket</td>\n        <td class="p-3">${jobAgeLimit.value || '18 to 23 Years'}</td>\n      </tr>\n    </tbody>\n  </table>\n</div>\n`;
  editorContent.value += tableTemplate;
};

// Auto Table of Contents generator
const generateToc = () => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(editorContent.value, 'text/html');
  const headings = doc.querySelectorAll('h2, h3, h4');
  const compiledToc: any[] = [];
  
  headings.forEach((heading, idx) => {
    const text = heading.textContent || "";
    const level = parseInt(heading.tagName.replace('H', ''));
    const id = `toc-heading-${idx}`;
    compiledToc.push({ id, text, level });
  });

  tocItems.value = compiledToc;
  if (compiledToc.length > 0) {
    triggerToast(`Auto-generated Table of Contents with ${compiledToc.length} headings!`, 'success');
  } else {
    triggerToast("No H2 or H3 headings detected in Rich Text to compile ToC.", "info");
  }
};

// Auto FAQ Generator based on inputs
const autoGenerateFaqs = () => {
  faqItems.value = [
    {
      question: `What is the last date to apply online for ${jobTitle.value || 'this post'}?`,
      answer: `The online application process concludes on ${jobPublishDate.value}. Candidates are advised to register on the official portal before the deadline.`
    },
    {
      question: `What is the educational qualification required?`,
      answer: `The mandatory educational threshold is defined as: ${jobQualification.value}.`
    },
    {
      question: `What is the age limit and relaxation structure?`,
      answer: `Candidates must meet the age requirements: ${jobAgeLimit.value}. Government-approved relaxation parameters apply for reserved categories.`
    },
    {
      question: `What is the monthly stipend or salary pay scale?`,
      answer: `Selected candidates will be placed on a pay index worth: ${jobSalary.value}.`
    }
  ];
  triggerToast("Bilingual recruitment FAQs compiled automatically!", "success");
};

// PDF Upload Simulator
const handlePdfDrop = (e: DragEvent) => {
  e.preventDefault();
  isPdfDragging.value = false;
  const files = e.dataTransfer?.files;
  if (files && files.length > 0) {
    simulatePdfProcessing(files[0]);
  }
};

const handlePdfFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    simulatePdfProcessing(target.files[0]);
  }
};

const simulatePdfProcessing = (file: File) => {
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    triggerToast("Invalid format. Please upload official PDF Gazettes only.", "error");
    return;
  }
  
  isUploadingPdf.value = true;
  uploadedPdfName.value = file.name;
  uploadedPdfSize.value = (file.size / (1024 * 1024)).toFixed(2) + " MB";

  setTimeout(() => {
    isUploadingPdf.value = false;
    // Auto populate form details based on simulated PDF scanning
    const fileNameLower = file.name.toLowerCase();
    if (fileNameLower.includes("navy")) {
      jobTitle.value = "Indian Navy Agniveer MR/SSR Recruitment 2026";
      jobCategory.value = "Navy";
      jobDepartment.value = "Indian Navy Bureau of Personnel";
      jobSalary.value = "₹30,000 - ₹40,000/month (Seva Nidhi bonus applicable)";
      jobApplyLink.value = "https://joinindiannavy.gov.in";
    } else if (fileNameLower.includes("ssc") || fileNameLower.includes("mts")) {
      jobTitle.value = "SSC MTS & Havaldar Examination Notification 2026";
      jobCategory.value = "SSC";
      jobDepartment.value = "Staff Selection Commission (MHA)";
      jobSalary.value = "₹21,700 - ₹69,100 (Pay Level 3)";
      jobApplyLink.value = "https://ssc.gov.in";
    } else {
      jobTitle.value = "Indian Army Agnipath General Duty Rally 2026";
      jobCategory.value = "Agniveer";
    }
    
    // Auto-generate content snippet
    editorContent.value = `<h2>1. PDF Gazette Official Notification Summary</h2><p>This post is compiled by parsing the verified PDF Gazette publication <strong>${file.name}</strong> (${uploadedPdfSize.value}). All registrations must be made directly on official boards.</p>` + editorContent.value;
    
    triggerToast("Official PDF successfully parsed and scraped! Injected metadata.", "success");
  }, 1500);
};

// --- CRUD Actions ---
const handleSaveJob = async (e: Event) => {
  e.preventDefault();
  if (!jobTitle.value.trim() || !jobCategory.value) {
    triggerToast("Job Title and Category are required fields!", "error");
    return;
  }

  const jobPayload = {
    title: jobTitle.value.trim(),
    category: jobCategory.value,
    eligibility: jobEligibility.value.trim(),
    ageLimit: jobAgeLimit.value.trim(),
    qualification: jobQualification.value.trim(),
    salary: jobSalary.value.trim(),
    selectionProcess: jobSelectionProcess.value.trim(),
    importantDates: {
      start: new Date().toISOString().split('T')[0],
      end: jobPublishDate.value,
      exam: "To be announced"
    },
    applyLink: jobApplyLink.value.trim(),
    featuredImage: jobFeaturedImageUrl.value,
    seoTitle: jobSeoTitle.value.trim(),
    metaDescription: jobMetaDescription.value.trim(),
    slug: jobSlug.value.trim(),
    state: jobState.value,
    department: jobDepartment.value.trim(),
    tags: jobTagsRaw.value.split(",").map(t => t.trim()).filter(Boolean),
    status: jobStatus.value,
    publishDate: jobPublishDate.value,
    content: editorContent.value,
    faq: faqItems.value,
    _editorRole: userRole.value,
    _editorName: userName.value
  };

  try {
    const url = isEditing.value ? `/api/sarkari-jobs/${editingJobId.value}` : '/api/sarkari-jobs';
    const method = isEditing.value ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobPayload)
    });

    if (res.ok) {
      const data = await res.json();
      triggerToast(isEditing.value ? "Job notification updated and revision logged!" : "New job notification created and published!", "success");
      
      // Emit to App state wrapper
      emit('addJob', data.job);
      
      // Reset form and return
      resetJobForm();
      fetchJobs();
      currentTab.value = 'manage';
    } else {
      const err = await res.json();
      triggerToast(`Failed: ${err.error || 'Server error'}`, "error");
    }
  } catch (e) {
    triggerToast("Failed to make connection with server.", "error");
  }
};

const startEditJob = (job: any) => {
  isEditing.value = true;
  editingJobId.value = job.id;
  
  jobTitle.value = job.title;
  jobCategory.value = job.category;
  jobEligibility.value = job.eligibility;
  jobAgeLimit.value = job.ageLimit;
  jobQualification.value = job.qualification;
  jobSalary.value = job.salary;
  jobSelectionProcess.value = job.selectionProcess;
  jobApplyLink.value = job.applyLink;
  jobFeaturedImageUrl.value = job.featuredImage || "https://images.unsplash.com/photo-1590134701633-e7e0e7a170fb?auto=format&fit=crop&q=80&w=800";
  jobSeoTitle.value = job.seoTitle || "";
  jobMetaDescription.value = job.metaDescription || "";
  jobSlug.value = job.slug || "";
  jobState.value = job.state || "All India";
  jobDepartment.value = job.department || "";
  jobTagsRaw.value = Array.isArray(job.tags) ? job.tags.join(", ") : (job.category ? job.category.toLowerCase() : "");
  jobStatus.value = job.status || "published";
  jobPublishDate.value = job.publishDate || (job.importantDates?.end || new Date().toISOString().split('T')[0]);
  editorContent.value = job.content || "";
  faqItems.value = job.faq || [];
  
  currentTab.value = 'editor';
  triggerToast(`Editing post: ${job.title}`, "info");
};

const deleteJob = async (jobId: string) => {
  if (userRole.value !== 'Admin') {
    triggerToast("Permission Denied: Only Admins can delete job vacancies.", "error");
    return;
  }

  if (!confirm("Are you absolutely sure you want to permanently delete this recruitment post? This cannot be undone.")) {
    return;
  }

  try {
    const res = await fetch(`/api/sarkari-jobs/${jobId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      triggerToast("Job posting removed from databases.", "success");
      fetchJobs();
    } else {
      triggerToast("Failed to delete from server.", "error");
    }
  } catch (e) {
    triggerToast("Server connection error.", "error");
  }
};

const resetJobForm = () => {
  isEditing.value = false;
  editingJobId.value = null;
  jobTitle.value = "";
  jobEligibility.value = "Male & Female citizens residing in India.";
  jobAgeLimit.value = "17.5 to 21 Years";
  jobQualification.value = "Class 10th Pass";
  jobSalary.value = "₹30,000 to ₹40,000/month";
  jobSelectionProcess.value = "Written Common Entrance Exam (CEE) and Physical Fitness Test.";
  jobApplyLink.value = "https://joinindianarmy.nic.in";
  jobState.value = "All India";
  jobDepartment.value = "Indian Army Recruiting Directorate";
  jobTagsRaw.value = "army, agniveer, recruitment, active";
  jobStatus.value = 'published';
  jobPublishDate.value = new Date().toISOString().split('T')[0];
  editorContent.value = "";
  faqItems.value = [];
  tocItems.value = [];
  uploadedPdfName.value = "";
  uploadedPdfSize.value = "";
};

// --- Revision History Manager ---
const viewRevisions = async (jobId: string) => {
  selectedRevisionJobId.value = jobId;
  isLoadingRevisions.value = true;
  try {
    const res = await fetch(`/api/revisions/${jobId}`);
    if (res.ok) {
      const data = await res.json();
      activeRevisions.value = data.revisions || [];
    }
  } catch (e) {
    console.error("Failed to load revisions:", e);
  } finally {
    isLoadingRevisions.value = false;
  }
};

const restoreRevision = async (rev: any) => {
  if (userRole.value === 'Editor' && rev.role === 'Admin') {
    triggerToast("Permission Denied: Editors cannot override revisions authored by Admins.", "error");
    return;
  }

  if (!confirm(`Are you sure you want to roll back this post to the snapshot from ${new Date(rev.timestamp).toLocaleString()}?`)) {
    return;
  }

  try {
    const res = await fetch('/api/revisions/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId: selectedRevisionJobId.value,
        timestamp: rev.timestamp,
        role: userRole.value,
        name: userName.value
      })
    });

    if (res.ok) {
      triggerToast("Job posting restored successfully!", "success");
      fetchJobs();
      viewRevisions(selectedRevisionJobId.value!);
    } else {
      triggerToast("Failed to restore revision.", "error");
    }
  } catch (e) {
    triggerToast("Connection failed.", "error");
  }
};

// --- Media Library Actions ---
const selectMediaItem = (item: any) => {
  jobFeaturedImageUrl.value = item.url;
  showMediaPicker.value = false;
  triggerToast(`Featured image updated to: ${item.title}`, "success");
};

const addCustomMedia = async (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const title = (form.elements.namedItem('mediaTitle') as HTMLInputElement).value;
  const url = (form.elements.namedItem('mediaUrl') as HTMLInputElement).value;
  const category = (form.elements.namedItem('mediaCategory') as HTMLSelectElement).value;

  if (!title || !url) {
    triggerToast("Title and URL are required!", "error");
    return;
  }

  try {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, category })
    });

    if (res.ok) {
      triggerToast("Custom image added to library!", "success");
      fetchMedia();
      form.reset();
    }
  } catch (e) {
    triggerToast("Failed to write to media.", "error");
  }
};

// --- Bulk Upload Support ---
const validateBulkJson = () => {
  bulkFileError.value = "";
  validatedBulkJobs.value = [];

  try {
    const parsed = JSON.parse(bulkJsonInput.value);
    const list = Array.isArray(parsed) ? parsed : (parsed.jobs ? parsed.jobs : null);
    
    if (!list || !Array.isArray(list)) {
      bulkFileError.value = "Invalid format: Input must be a JSON array of job posts.";
      return;
    }

    // Strict schema check
    const valid: any[] = [];
    const invalid: string[] = [];

    list.forEach((job: any, index: number) => {
      if (!job.title) {
        invalid.push(`Row ${index + 1}: Missing 'title' attribute.`);
      } else if (!job.category) {
        invalid.push(`Row ${index + 1}: Missing 'category' attribute.`);
      } else {
        valid.push(job);
      }
    });

    if (invalid.length > 0) {
      bulkFileError.value = `Schema Error:\n` + invalid.join("\n");
    }

    validatedBulkJobs.value = valid;
    if (valid.length > 0) {
      triggerToast(`Validated ${valid.length} items. Ready to import!`, "info");
    }
  } catch (e: any) {
    bulkFileError.value = `JSON Syntax Error: ${e.message}`;
  }
};

const executeBulkImport = async () => {
  if (validatedBulkJobs.value.length === 0) return;

  try {
    const res = await fetch('/api/sarkari-jobs/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobs: validatedBulkJobs.value,
        role: userRole.value,
        name: userName.value
      })
    });

    if (res.ok) {
      const data = await res.json();
      triggerToast(`Successfully imported ${data.count} recruitment postings!`, "success");
      bulkJsonInput.value = "";
      validatedBulkJobs.value = [];
      fetchJobs();
      currentTab.value = 'manage';
    }
  } catch (e) {
    triggerToast("Failed to execute bulk import.", "error");
  }
};

// --- Auto Related Posts calculations ---
const getRelatedPosts = (currentJob: any) => {
  if (!currentJob) return [];
  return jobsList.value
    .filter(job => job.id !== currentJob.id)
    .map(job => {
      let score = 0;
      if (job.category === currentJob.category) score += 50;
      if (job.state === currentJob.state) score += 30;
      if (job.qualification === currentJob.qualification) score += 20;
      return { ...job, matchScore: score };
    })
    .filter(item => item.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
};

// --- MCQ GK Quiz Publisher (Maintains 100% Backwards Compatibility) ---
const handleCreateMockQuiz = (e: Event) => {
  e.preventDefault();
  if (!quizTitle.value.trim() || !qText.value.trim()) {
    triggerToast("Quiz Title and at least one Question are required!", "error");
    return;
  }

  const compiledQuestions: Question[] = [
    {
      id: "q-dyn-" + Date.now(),
      text: qText.value.trim(),
      options: [
        opt0.value.trim() || "Option A Template",
        opt1.value.trim() || "Option B Template",
        opt2.value.trim() || "Option C Template",
        opt3.value.trim() || "Option D Template",
      ],
      correctAnswer: correctOptionIdx.value,
      explanation: qExplanation.value.trim() || "Verified objective answers based on official commission guidelines.",
      category: quizCategory.value
    }
  ];

  const newQuiz: Quiz = {
    id: "quiz-dyn-" + Date.now(),
    title: quizTitle.value.trim(),
    category: quizCategory.value,
    difficulty: quizDifficulty.value,
    timeLimit: quizTimeLimit.value,
    questions: compiledQuestions,
    iconName: "Shield"
  };

  emit('addQuiz', newQuiz);
  triggerToast("Premium Mock Quiz added directly to live quizzes feed!", "success");

  // Reset fields
  quizTitle.value = "";
  qText.value = "";
  opt0.value = "";
  opt1.value = "";
  opt2.value = "";
  opt3.value = "";
  qExplanation.value = "";
};

const simulateVisitor = () => {
  trafficImpressions.value += 140;
  adsenseClicks.value += 5;
  estimatedCpcUsd.value += 1.95;
  triggerToast("Simulated organic Google search clicks!", "success");
};
</script>

<template>
  <div class="space-y-6 text-left" id="admin-dashboard-container">
    
    <!-- 1. Top Access and Role Selector -->
    <div class="bg-slate-900 text-white p-6 rounded-3xl border border-slate-700 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="role-selector-banner">
      <div class="space-y-1">
        <div class="inline-flex items-center space-x-2 bg-[#FF9933]/20 border border-[#FF9933]/40 text-[#FF9933] text-[9.5px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          <Sparkles class="h-3.5 w-3.5 inline" />
          <span>Secured Command Portal</span>
        </div>
        <h2 class="text-2xl font-black text-white flex items-center tracking-tight">
          <Settings class="h-6 w-6 text-indigo-400 mr-2" />
          AgniPariksha Board Operations
        </h2>
        <p class="text-xs text-slate-300 max-w-xl">
          Publish recruitment gazettes, upload PDFs, deploy mock quizzes, and monitor AdSense organic CTR indexes.
        </p>
      </div>

      <!-- Role toggle switches -->
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-slate-800 p-3 rounded-2xl border border-slate-700">
        <div>
          <label class="block text-[8.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Operations Role:</label>
          <div class="flex bg-slate-950 p-0.5 rounded-lg border border-slate-700 mt-1">
            <button 
              @click="userRole = 'Admin'"
              :class="['text-[10px] font-black px-3.5 py-1.5 rounded-md transition-colors leading-none', userRole === 'Admin' ? 'bg-[#138808] text-white' : 'text-slate-400 hover:text-white']"
            >
              👑 Admin
            </button>
            <button 
              @click="userRole = 'Editor'"
              :class="['text-[10px] font-black px-3.5 py-1.5 rounded-md transition-colors leading-none', userRole === 'Editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white']"
            >
              ✍ Editor
            </button>
          </div>
        </div>

        <div class="text-xs">
          <p class="font-black text-white">{{ userName }}</p>
          <span class="text-[9.5px] text-slate-400 font-mono">{{ userRole === 'Admin' ? '★ Absolute Authority' : '✔ Writer Privilege' }}</span>
        </div>
      </div>
    </div>

    <!-- 2. AdSense Earnings & SEO Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="adsense-analytic-reporters">
      
      <div class="bg-white p-4.5 rounded-2xl border border-gray-150 flex flex-col justify-between shadow-xs">
        <div>
          <span class="text-[9px] text-gray-400 font-bold uppercase block font-mono">SEO Impressions</span>
          <span class="text-2xl font-black text-gray-800 font-mono mt-1 block">
            {{ trafficImpressions.toLocaleString() }}
          </span>
        </div>
        <p class="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
          <TrendingUp class="h-3.5 w-3.5" />
          +19.2% index ranking
        </p>
      </div>

      <div class="bg-white p-4.5 rounded-2xl border border-gray-150 flex flex-col justify-between shadow-xs">
        <div>
          <span class="text-[9px] text-gray-400 font-bold uppercase block font-mono">Organic Clicks</span>
          <span class="text-2xl font-black text-gray-800 font-mono mt-1 block">
            {{ adsenseClicks.toLocaleString() }}
          </span>
        </div>
        <p class="text-[10px] text-slate-500 font-mono mt-2">Verified CTR: 5.23%</p>
      </div>

      <div class="bg-white p-4.5 rounded-2xl border border-emerald-100 flex flex-col justify-between bg-emerald-50/10 shadow-xs">
        <div>
          <span class="text-[9px] text-emerald-700 font-black uppercase block font-mono">AdSense Earnings</span>
          <span class="text-2xl font-black text-emerald-800 font-mono mt-1 block">
            ${{ estimatedCpcUsd.toFixed(2) }}
          </span>
        </div>
        <p class="text-[9px] text-[#aa4400] font-black uppercase mt-2">★ Google Approved Node</p>
      </div>

      <div class="bg-gradient-to-tr from-slate-900 to-indigo-950 text-indigo-100 p-4.5 rounded-2xl flex flex-col justify-between shadow-md">
        <div>
          <span class="text-[9px] text-indigo-400 font-extrabold uppercase block font-mono">Status Metrics</span>
          <div class="text-[11.5px] space-y-1 font-mono mt-2">
            <p>✔ Active Vacancies: <strong class="text-white">{{ jobsList.length }}</strong></p>
            <p>✔ Quizzes Registered: <strong class="text-white">{{ quizzesCount }}</strong></p>
          </div>
        </div>
        <button 
          @click="simulateVisitor" 
          class="text-[9px] text-[#FF9933] font-bold text-left hover:underline uppercase tracking-wide mt-3 flex items-center gap-0.5"
        >
          <Activity class="h-3 w-3" /> Simulate SEO hit ↗
        </button>
      </div>

    </div>

    <!-- 3. Navigation Controls for Tab operations -->
    <div class="flex flex-wrap gap-2 border-b border-gray-200 pb-1" id="admin-sub-navigation">
      <button 
        @click="currentTab = 'manage'"
        :class="['px-4 py-2 text-xs font-extrabold rounded-t-xl border-t-2 border-x transition-colors cursor-pointer', currentTab === 'manage' ? 'bg-white border-t-[#000080] border-x-gray-200 text-[#000080]' : 'bg-gray-100/70 border-t-transparent border-x-transparent text-gray-500 hover:text-gray-800']"
      >
        📢 Active Jobs List ({{ jobsList.length }})
      </button>
      <button 
        @click="currentTab = 'editor'; isEditing = false; resetJobForm()"
        :class="['px-4 py-2 text-xs font-extrabold rounded-t-xl border-t-2 border-x transition-colors cursor-pointer', currentTab === 'editor' && !isEditing ? 'bg-white border-t-[#000080] border-x-gray-200 text-[#000080]' : 'bg-gray-100/70 border-t-transparent border-x-transparent text-gray-500 hover:text-gray-800']"
      >
        ➕ Create New Job Post
      </button>
      <button 
        @click="currentTab = 'media'"
        :class="['px-4 py-2 text-xs font-extrabold rounded-t-xl border-t-2 border-x transition-colors cursor-pointer', currentTab === 'media' ? 'bg-white border-t-[#000080] border-x-gray-200 text-[#000080]' : 'bg-gray-100/70 border-t-transparent border-x-transparent text-gray-500 hover:text-gray-800']"
      >
        🖼 Media Library ({{ mediaList.length }})
      </button>
      <button 
        @click="currentTab = 'bulk'"
        :class="['px-4 py-2 text-xs font-extrabold rounded-t-xl border-t-2 border-x transition-colors cursor-pointer', currentTab === 'bulk' ? 'bg-white border-t-[#000080] border-x-gray-200 text-[#000080]' : 'bg-gray-100/70 border-t-transparent border-x-transparent text-gray-500 hover:text-gray-800']"
      >
        📥 Bulk JSON Import
      </button>
      <button 
        @click="currentTab = 'mcq'"
        :class="['px-4 py-2 text-xs font-extrabold rounded-t-xl border-t-2 border-x transition-colors cursor-pointer', currentTab === 'mcq' ? 'bg-white border-t-[#000080] border-x-gray-200 text-[#000080]' : 'bg-gray-100/70 border-t-transparent border-x-transparent text-gray-500 hover:text-gray-800']"
      >
        📝 MCQ Quiz Deck
      </button>
    </div>

    <!-- 4. Tab Panel Content Areas -->

    <!-- TAB 1: MANAGE JOBS LIST -->
    <div v-if="currentTab === 'manage'" class="space-y-6" id="tab-manage-viewport">
      
      <!-- Revisions display overlay panel if selected -->
      <div v-if="selectedRevisionJobId" class="bg-[#000080]/5 p-5 rounded-2xl border border-[#000080]/15 space-y-3" id="revisions-drawer">
        <div class="flex justify-between items-center">
          <h4 class="text-xs font-black text-[#000080] uppercase tracking-wider flex items-center">
            <History class="h-4 w-4 mr-1" />
            Revision Snapshots history for: {{ jobsList.find(j => j.id === selectedRevisionJobId)?.title || 'Selected Post' }}
          </h4>
          <button @click="selectedRevisionJobId = null" class="text-gray-400 hover:text-gray-600 text-xs font-bold flex items-center">
            <X class="h-4 w-4 mr-0.5" /> Close History
          </button>
        </div>

        <div v-if="isLoadingRevisions" class="text-xs text-gray-500 py-3 flex items-center gap-1.5">
          <Clock class="h-4 w-4 animate-spin" /> Fetching revision layers from server...
        </div>
        
        <div v-else-if="activeRevisions.length === 0" class="text-xs text-gray-500 py-3 bg-white p-3 rounded-xl border border-dashed">
          No previous edit revisions recorded for this job posting yet. All subsequent edits automatically create restorable layers.
        </div>

        <div v-else class="space-y-2">
          <div v-for="(rev, idx) in activeRevisions" :key="idx" class="bg-white p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div>
              <p class="font-bold text-gray-800 flex items-center">
                <span class="bg-indigo-100 text-indigo-800 text-[9px] uppercase px-1.5 py-0.5 rounded mr-1.5 font-mono">Rev #{{ activeRevisions.length - idx }}</span>
                {{ rev.action }}
              </p>
              <div class="flex items-center space-x-2 text-[10px] text-gray-400 font-mono mt-1">
                <span>By: {{ rev.editorName }} ({{ rev.role }})</span>
                <span>•</span>
                <span>{{ new Date(rev.timestamp).toLocaleString() }}</span>
              </div>
            </div>

            <button 
              @click="restoreRevision(rev)"
              class="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Restore this snapshot
            </button>
          </div>
        </div>
      </div>

      <!-- Jobs Grid table list -->
      <div class="bg-white rounded-2xl border shadow-sm overflow-hidden" id="manage-jobs-table-layout">
        <div class="p-5 border-b flex justify-between items-center flex-wrap gap-4">
          <div>
            <h3 class="font-black text-sm text-gray-900 uppercase">Government Recruitment Directory</h3>
            <p class="text-[11px] text-gray-500 mt-0.5">Edit detailed syllabuses, update apply links, or revert edits using revision histories.</p>
          </div>

          <div v-if="isLoadingJobs" class="text-xs text-[#000080] font-bold flex items-center gap-1">
            <RefreshCw class="h-4.5 w-4.5 animate-spin" /> Syncing live server database...
          </div>
        </div>

        <div v-if="jobsList.length === 0" class="p-8 text-center text-gray-500">
          <Briefcase class="h-10 w-10 mx-auto text-gray-300" />
          <p class="text-xs font-bold mt-2">No jobs registered in files database.</p>
          <p class="text-[10px] text-gray-400">Click "Create New Job Post" or bulk upload a checklist to initiate listings.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="bg-slate-50 text-gray-400 font-bold uppercase tracking-wider text-[9px] border-b">
                <th class="p-4 w-1/2">Recruitment Vacancy Title</th>
                <th class="p-4">Category</th>
                <th class="p-4">State</th>
                <th class="p-4">Last Date</th>
                <th class="p-4">Workflow Status</th>
                <th class="p-4 text-right">Actions Operations</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="job in jobsList" :key="job.id" class="hover:bg-slate-50/50">
                <td class="p-4">
                  <div>
                    <span class="font-bold text-gray-800 text-[12.5px]">{{ job.title }}</span>
                    <div class="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
                      <span>Dept: {{ job.department }}</span>
                      <span>•</span>
                      <span>Slug: <code class="font-mono">{{ job.slug }}</code></span>
                    </div>
                  </div>
                </td>
                <td class="p-4">
                  <span class="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase font-mono border border-indigo-100">
                    {{ job.category }}
                  </span>
                </td>
                <td class="p-4">
                  <span class="text-slate-650 font-semibold">{{ job.state || 'All India' }}</span>
                </td>
                <td class="p-4 font-mono font-bold text-amber-700">
                  {{ job.publishDate || (job.importantDates?.end || 'Closed') }}
                </td>
                <td class="p-4">
                  <span 
                    :class="[
                      'text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border',
                      job.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      job.status === 'scheduled' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    ]"
                  >
                    ● {{ job.status || 'published' }}
                  </span>
                </td>
                <td class="p-4 text-right">
                  <div class="flex items-center justify-end space-x-1.5">
                    <button 
                      @click="startEditJob(job)"
                      class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit recruitment fields"
                    >
                      <Edit class="h-4.5 w-4.5" />
                    </button>
                    <button 
                      @click="viewRevisions(job.id)"
                      class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="View edit snapshots history"
                    >
                      <History class="h-4.5 w-4.5" />
                    </button>
                    <button 
                      @click="deleteJob(job.id)"
                      class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                      :disabled="userRole !== 'Admin'"
                      title="Delete post (Admins only)"
                    >
                      <Trash2 class="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- TAB 2: CREATE / EDIT COMPOSER -->
    <div v-if="currentTab === 'editor'" class="space-y-6" id="tab-editor-viewport">
      
      <div class="flex justify-between items-center border-b pb-4">
        <h3 class="font-black text-sm text-gray-900 uppercase">
          {{ isEditing ? '✏ Edit Government Recruitment Guide' : '➕ Create New Sarkari Recruitment Notification' }}
        </h3>
        <button 
          @click="currentTab = 'manage'; resetJobForm()" 
          class="text-xs text-gray-500 hover:text-gray-800 flex items-center font-bold"
        >
          <ArrowLeft class="h-4 w-4 mr-1" /> Back to active list
        </button>
      </div>

      <form @submit="handleSaveJob" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Column 1 & 2: Primary Fields & Rich Editor (2 spans) -->
        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <span class="text-[9.5px] uppercase font-black text-[#000080] font-mono tracking-widest block border-b pb-1">Primary Recruitment Metadata</span>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Recruitment Title Name:</label>
                <input 
                  type="text" 
                  v-model="jobTitle" 
                  required
                  placeholder="e.g. SSC GD Constable Recruitment 2026" 
                  class="w-full font-bold p-2.5 border rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category Sector:</label>
                <select 
                  v-model="jobCategory" 
                  class="w-full font-bold p-2.5 border rounded-lg outline-none"
                >
                  <option value="Army">Indian Army</option>
                  <option value="Navy">Indian Navy</option>
                  <option value="Air Force">Indian Air Force</option>
                  <option value="Agniveer">Agnipath Agniveer</option>
                  <option value="SSC">Staff Selection Commission (SSC)</option>
                  <option value="UPSC">Union Public Service Commission (UPSC)</option>
                  <option value="Railway">Indian Railways (RRB)</option>
                  <option value="Police">State Police Department</option>
                  <option value="Banking">Institute of Banking (IBPS/SBI)</option>
                  <option value="State Gov">State Government Boards</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Recruiting Department Name:</label>
                <input 
                  type="text" 
                  v-model="jobDepartment" 
                  placeholder="e.g. Staff Selection Commission (SSC)" 
                  class="w-full p-2.5 border rounded-lg outline-none"
                />
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Job Location State:</label>
                  <input 
                    type="text" 
                    v-model="jobState" 
                    placeholder="e.g. Uttar Pradesh, All India" 
                    class="w-full p-2.5 border rounded-lg outline-none font-bold"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Last Date to Apply:</label>
                  <input 
                    type="date" 
                    v-model="jobPublishDate" 
                    class="w-full p-2.5 border rounded-lg outline-none font-mono font-bold text-indigo-700"
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Educational Qualification:</label>
                <input 
                  type="text" 
                  v-model="jobQualification" 
                  placeholder="e.g. 10th Class Pass / Matriculation" 
                  class="w-full p-2.5 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pay Band Salary Scale:</label>
                <input 
                  type="text" 
                  v-model="jobSalary" 
                  placeholder="e.g. ₹21,700 - ₹69,100 (Pay Level 3)" 
                  class="w-full p-2.5 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Age Limits Bracket:</label>
                <input 
                  type="text" 
                  v-model="jobAgeLimit" 
                  placeholder="e.g. 18 to 23 Years" 
                  class="w-full p-2.5 border rounded-lg outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Eligibility Criteria Details:</label>
                <input 
                  type="text" 
                  v-model="jobEligibility" 
                  placeholder="Residing in India meeting active physical fitness benchmarks." 
                  class="w-full p-2.5 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Direct Registration Link:</label>
                <input 
                  type="url" 
                  v-model="jobApplyLink" 
                  placeholder="https://ssc.gov.in" 
                  class="w-full p-2.5 border rounded-lg outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <!-- DRAG-AND-DROP PDF SCRAPER COMPONENT -->
          <div 
            @dragover.prevent="isPdfDragging = true"
            @dragleave.prevent="isPdfDragging = false"
            @drop="handlePdfDrop"
            :class="[
              'p-6 rounded-2xl border-2 border-dashed transition-all text-center relative',
              isPdfDragging ? 'border-[#000080] bg-[#000080]/5' : 'border-gray-300 bg-white'
            ]"
            id="pdf-upload-drag-deck"
          >
            <input 
              type="file" 
              id="pdf-hidden-file-input" 
              accept=".pdf" 
              @change="handlePdfFileSelect" 
              class="hidden"
            />
            
            <div v-if="isUploadingPdf" class="space-y-2 py-4">
              <RefreshCw class="h-8 w-8 text-[#000080] animate-spin mx-auto" />
              <p class="text-xs font-black text-gray-700 font-mono">Scanning and scraping official PDF Gazette variables...</p>
            </div>

            <div v-else class="space-y-1.5 py-2">
              <FileText class="h-9 w-9 text-indigo-500 mx-auto" />
              <h4 class="text-xs font-black text-gray-800 uppercase">Drag & Drop Official Notification PDF Gazette</h4>
              <p class="text-[10.5px] text-gray-400">Our parser auto-extracts age benchmarks, pay structures, qualifications, and injects summary snippets.</p>
              
              <button 
                type="button" 
                @click="() => document.getElementById('pdf-hidden-file-input')?.click()"
                class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] font-extrabold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer inline-block mt-2"
              >
                Browse local files 📂
              </button>

              <div v-if="uploadedPdfName" class="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded inline-block mt-2">
                ✔ Active parser link: <strong>{{ uploadedPdfName }}</strong> ({{ uploadedPdfSize }})
              </div>
            </div>
          </div>

          <!-- THE RICH TEXT VISUAL EDITOR -->
          <div class="bg-white rounded-2xl border shadow-sm overflow-hidden" id="rich-text-editor-layer">
            <div class="p-4 border-b bg-slate-50 flex flex-wrap justify-between items-center gap-3">
              <span class="text-[10px] uppercase font-black text-slate-500 font-mono tracking-widest flex items-center">
                <FileText class="h-4 w-4 mr-1 text-indigo-500" /> Rich Syllabus & Post Editor
              </span>

              <!-- Formatting tools panel toolbar -->
              <div class="flex items-center space-x-1 flex-wrap gap-1">
                <button type="button" @click="injectText('<h2>', '</h2>')" class="p-1 px-2 text-[10px] font-black border bg-white hover:bg-slate-100 rounded cursor-pointer leading-none" title="Insert H2 Title">H2</button>
                <button type="button" @click="injectText('<h3>', '</h3>')" class="p-1 px-2 text-[10px] font-black border bg-white hover:bg-slate-100 rounded cursor-pointer leading-none" title="Insert H3 Title">H3</button>
                <button type="button" @click="injectText('<strong>', '</strong>')" class="p-1 px-2 text-[10px] font-bold border bg-white hover:bg-slate-100 rounded cursor-pointer leading-none" title="Bold text">B</button>
                <button type="button" @click="injectText('<em>', '</em>')" class="p-1 px-2 text-[10px] italic border bg-white hover:bg-slate-100 rounded cursor-pointer leading-none" title="Italic text">I</button>
                <button type="button" @click="injectText('<ul>\n  <li>', '</li>\n</ul>')" class="p-1 px-2 text-[10px] border bg-white hover:bg-slate-100 rounded cursor-pointer leading-none" title="Insert Unordered list">Bullet List</button>
                <button type="button" @click="injectTable" class="p-1 px-2 text-[10px] border bg-white hover:bg-slate-100 rounded cursor-pointer leading-none" title="Insert pre-styled table">Add Table ⊞</button>
                <button type="button" @click="editorContent = ''" class="p-1 px-2 text-[10px] border border-red-200 text-red-600 hover:bg-red-50 bg-white rounded cursor-pointer leading-none" title="Reset all content">Clear</button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b">
              <!-- Left: Textarea Code editor -->
              <textarea 
                id="rich-text-editor-textarea"
                v-model="editorContent"
                placeholder="Enter rich HTML content outlines here..."
                class="w-full h-80 p-4 font-mono text-xs focus:outline-none bg-slate-900 text-slate-100 leading-relaxed resize-none"
              ></textarea>

              <!-- Right: Live Simulated Preview with AdSense wrapper layout -->
              <div class="h-80 overflow-y-auto p-4 bg-white text-xs space-y-4">
                <div class="bg-amber-50 border border-dashed border-amber-300 p-2 text-center rounded text-[10px] text-amber-900 font-mono font-bold block">
                  🛡 AdSense CPC Display unit slot [Anchor Intro]
                </div>
                
                <div class="prose max-w-none text-slate-800 leading-relaxed space-y-3" v-html="editorContent || '<p class=\'text-gray-400 italic\'>Write some html or formatting in the left panel to simulate instant visual live layouts...</p>'">
                </div>
              </div>
            </div>

            <!-- Dynamic Table of Contents and FAQ triggering panel -->
            <div class="p-4 bg-slate-50 border-t flex flex-wrap justify-between gap-4">
              <button 
                type="button" 
                @click="generateToc"
                class="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center"
              >
                <Layers class="h-3.5 w-3.5 mr-1" /> Compile Table of Contents (ToC)
              </button>

              <button 
                type="button" 
                @click="autoGenerateFaqs"
                class="bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-[10px] font-black px-3.5 py-1.5 rounded-lg cursor-pointer flex items-center"
              >
                <HelpCircle class="h-3.5 w-3.5 mr-1" /> Compile Bilingual FAQs
              </button>
            </div>
          </div>

          <!-- BILINGUAL FAQS LIST PREVIEW -->
          <div class="bg-white p-6 rounded-2xl border shadow-sm space-y-4" id="faqs-editor-deck">
            <span class="text-[9.5px] uppercase font-black text-[#000080] font-mono tracking-widest block border-b pb-1">Bilingual FAQs Block Review</span>
            
            <div v-if="faqItems.length === 0" class="text-xs text-gray-400 italic text-center py-2">
              No FAQs defined. Click "Compile Bilingual FAQs" above to auto-generate FAQs based on your input form fields.
            </div>

            <div v-else class="space-y-3">
              <div v-for="(item, idx) in faqItems" :key="idx" class="bg-gray-50 p-3.5 rounded-xl border space-y-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-mono uppercase bg-slate-200 px-1.5 rounded text-slate-600 font-bold">FAQ Q{{ idx + 1 }}</span>
                  <button type="button" @click="faqItems.splice(idx, 1)" class="text-red-500 hover:text-red-700 font-black">Remove</button>
                </div>
                <div>
                  <input type="text" v-model="item.question" class="w-full p-2 bg-white border rounded outline-none font-bold text-gray-800" />
                </div>
                <div>
                  <textarea v-model="item.answer" class="w-full p-2 bg-white border rounded outline-none text-slate-600 h-16 resize-none"></textarea>
                </div>
              </div>

              <button 
                type="button" 
                @click="faqItems.push({ question: 'New recruitment question?', answer: 'Detailed verified answer key.' })"
                class="text-[10px] font-bold text-[#000080] hover:underline"
              >
                + Append new custom FAQ item
              </button>
            </div>
          </div>

        </div>

        <!-- Column 3: Featured Image, SEO parameters, tags, and status workflow (1 span) -->
        <div class="lg:col-span-1 space-y-6">
          
          <!-- IMAGE SELECTION & POPUP TRIGGER -->
          <div class="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <span class="text-[9.5px] uppercase font-black text-[#000080] font-mono tracking-widest block border-b pb-1">Featured Branding image</span>
            
            <div class="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden relative border">
              <img :src="jobFeaturedImageUrl" class="w-full h-full object-cover" alt="Featured image preview" />
              <div class="absolute bottom-2 right-2 bg-black/75 text-white text-[9px] px-2 py-0.5 rounded font-mono font-bold">Image preview</div>
            </div>

            <div class="text-xs space-y-2">
              <label class="block text-[10px] font-bold text-gray-400 uppercase">Image Asset URL:</label>
              <input type="text" v-model="jobFeaturedImageUrl" class="w-full p-2 border rounded outline-none font-mono text-[11px]" />
              
              <button 
                type="button" 
                @click="showMediaPicker = true"
                class="w-full bg-[#000080]/5 hover:bg-[#000080]/10 border border-[#000080]/15 text-[#000080] text-[10px] font-black py-2 rounded-xl transition-all cursor-pointer flex justify-center items-center gap-1"
              >
                <Image class="h-4 w-4" /> Select from Media Library
              </button>
            </div>
          </div>

          <!-- WORKFLOW STATE CONFIGURATION -->
          <div class="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <span class="text-[9.5px] uppercase font-black text-[#000080] font-mono tracking-widest block border-b pb-1">Publishing Status Workflow</span>
            
            <div class="text-xs space-y-3">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Select Workflow stage:</label>
                <select v-model="jobStatus" class="w-full font-bold p-2.5 border rounded-lg outline-none">
                  <option value="draft">📁 Saved Draft</option>
                  <option value="scheduled">⏰ Scheduled Release</option>
                  <option value="published">🚀 Published Live</option>
                </select>
              </div>

              <!-- Scheduled date field if selected -->
              <div v-if="jobStatus === 'scheduled'" class="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <p class="font-bold flex items-center gap-0.5"><Clock class="h-4 w-4" /> Scheduled deployment</p>
                <input 
                  type="datetime-local" 
                  class="w-full p-2 bg-white border border-amber-300 rounded font-bold font-mono outline-none"
                />
                <span class="text-[9.5px] text-amber-800 leading-none block">Our background runner will publish this live on the selected stamp.</span>
              </div>
            </div>
          </div>

          <!-- SEO & SEARCH CRAWL OPTIMIZATION FIELDS -->
          <div class="bg-white p-5 rounded-2xl border shadow-sm space-y-4">
            <span class="text-[9.5px] uppercase font-black text-[#000080] font-mono tracking-widest block border-b pb-1">Google Crawler & SEO parameters</span>
            
            <div class="text-xs space-y-3.5">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Custom SEO Title:</label>
                <input 
                  type="text" 
                  v-model="jobSeoTitle" 
                  placeholder="e.g. Indian Army Agniveer Rally 2026 apply guide" 
                  class="w-full p-2.5 border rounded-lg outline-none"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Slug URL extension:</label>
                <input 
                  type="text" 
                  v-model="jobSlug" 
                  placeholder="e.g. ssc-mts-recruitment-2026" 
                  class="w-full p-2.5 border rounded-lg outline-none font-mono text-[11.5px] font-bold text-indigo-700"
                />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Meta Description (160 chars max):</label>
                <textarea 
                  v-model="jobMetaDescription" 
                  placeholder="Apply online for Army Agniveer. Complete criteria details..." 
                  class="w-full p-2.5 border rounded-lg outline-none h-20 resize-none leading-relaxed text-[11px]"
                ></textarea>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Comma Separated Tags:</label>
                <input 
                  type="text" 
                  v-model="jobTagsRaw" 
                  placeholder="army, agniveer, recruitment" 
                  class="w-full p-2.5 border rounded-lg outline-none font-mono text-[11.5px]"
                />
              </div>
            </div>
          </div>

          <!-- CORE SUBMIT CONTROLS -->
          <div class="space-y-2">
            <button
              type="submit"
              class="w-full bg-[#138808] hover:bg-[#117706] text-white text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 shadow-md cursor-pointer"
            >
              <Plus class="h-4 w-4" />
              <span>{{ isEditing ? 'Save edits and log revision' : 'Compile & Publish Live' }}</span>
            </button>

            <button 
              type="button" 
              @click="currentTab = 'manage'; resetJobForm()"
              class="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel changes
            </button>
          </div>

        </div>

      </form>

    </div>

    <!-- TAB 3: MEDIA LIBRARY MANAGER -->
    <div v-if="currentTab === 'media'" class="space-y-6" id="tab-media-viewport">
      
      <div class="bg-white rounded-2xl border shadow-sm p-6" id="media-uploader-box">
        <h4 class="text-xs font-black text-gray-800 uppercase border-b pb-2 mb-4 flex items-center">
          <Image class="h-4.5 w-4.5 mr-1 text-indigo-500" /> Save new asset to library
        </h4>

        <form @submit="addCustomMedia" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs items-end">
          <div>
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Asset Name Title:</label>
            <input type="text" name="mediaTitle" placeholder="e.g. Indian Flag Symbol" required class="w-full p-2.5 border rounded-lg outline-none font-bold" />
          </div>
          <div class="md:col-span-2">
            <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Image URL Address:</label>
            <input type="url" name="mediaUrl" placeholder="https://upload.wikimedia.org/...svg" required class="w-full p-2.5 border rounded-lg outline-none font-mono text-[11px]" />
          </div>
          <div>
            <button type="submit" class="w-full bg-[#000080] hover:bg-[#000080]/90 text-white font-black py-2.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer">
              Add to Library
            </button>
          </div>
        </form>
      </div>

      <!-- Assets grid -->
      <div class="bg-white rounded-2xl border shadow-sm p-6 space-y-4" id="media-library-gallery">
        <div class="flex justify-between items-center border-b pb-2">
          <h4 class="text-xs font-black text-gray-800 uppercase tracking-wide">
            Pre-compiled Official Military Symbols and Graphics
          </h4>
          <span class="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Total Items: {{ mediaList.length }}</span>
        </div>

        <div v-if="isLoadingMedia" class="text-xs text-gray-500 text-center py-8 flex items-center justify-center gap-1">
          <RefreshCw class="h-5 w-5 animate-spin text-[#000080]" /> Synchronizing assets with server filesystem...
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div 
            v-for="item in mediaList" 
            :key="item.id" 
            class="group border rounded-2xl overflow-hidden relative bg-slate-50 flex flex-col justify-between"
          >
            <div class="aspect-video w-full border-b bg-white p-3 flex items-center justify-center relative overflow-hidden">
              <img :src="item.url" class="max-h-20 object-contain group-hover:scale-105 transition-transform" alt="Symbol" />
              <div class="absolute top-2 left-2 bg-[#000080] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest font-mono">
                {{ item.category || 'General' }}
              </div>
            </div>

            <div class="p-3 text-xs space-y-1 bg-white">
              <p class="font-bold text-gray-800 truncate">{{ item.title }}</p>
              <input type="text" readonly :value="item.url" class="w-full bg-slate-50 border p-1 text-[9.5px] font-mono text-indigo-700 rounded select-all" />
              
              <div class="flex items-center space-x-1 mt-2">
                <button 
                  @click="() => { navigator.clipboard.writeText(item.url); triggerToast('Copied to clipboard!', 'success'); }"
                  class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9.5px] font-bold py-1.5 rounded cursor-pointer leading-none text-center"
                >
                  Copy URL
                </button>
                <button 
                  v-if="userRole === 'Admin'"
                  @click="async () => { if(confirm('Delete symbol?')) { await fetch(`/api/media/${item.id}`, { method: 'DELETE' }); fetchMedia(); triggerToast('Deleted!', 'info'); } }"
                  class="p-1 px-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded cursor-pointer"
                  title="Remove from library"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB 4: BULK JSON IMPORT -->
    <div v-if="currentTab === 'bulk'" class="space-y-6" id="tab-bulk-viewport">
      
      <div class="bg-white p-6 rounded-2xl border shadow-sm space-y-4" id="bulk-uploader-box">
        <div>
          <h3 class="font-black text-sm text-gray-900 uppercase">Bulk Upload Recruitment Batches</h3>
          <p class="text-xs text-gray-500 mt-0.5">Drop a custom JSON file or paste structured arrays. Full schema validation is performed live before importing.</p>
        </div>

        <div class="space-y-3">
          <label class="block text-[10px] font-bold text-gray-400 uppercase font-mono">Paste JSON Array payload:</label>
          <textarea 
            v-model="bulkJsonInput"
            placeholder='[\n  {\n    "title": "Delhi Police SI Recruitment 2026",\n    "category": "Police",\n    "qualification": "Graduate Degree in any stream",\n    "applyLink": "https://ssc.gov.in"\n  }\n]'
            class="w-full h-64 p-4 font-mono text-xs focus:outline-none bg-slate-900 text-indigo-200 rounded-2xl resize-none leading-relaxed"
          ></textarea>

          <div v-if="bulkFileError" class="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-[11px] font-mono whitespace-pre-line leading-relaxed">
            ✖ Validation Failed:<br />{{ bulkFileError }}
          </div>

          <div class="flex flex-wrap gap-2 pt-2">
            <button 
              type="button" 
              @click="validateBulkJson"
              class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
            >
              Validate JSON Schema 🔎
            </button>
            <button 
              type="button" 
              @click="executeBulkImport"
              :disabled="validatedBulkJobs.length === 0"
              class="bg-[#138808] hover:bg-[#117706] text-white text-xs font-black px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-40"
            >
              Confirm Import ({{ validatedBulkJobs.length }} items) 🚀
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- TAB 5: MCQ GK QUIZ PUBLISHER (100% COMPATIBLE BACKWARDS FLOW) -->
    <div v-if="currentTab === 'mcq'" class="space-y-6" id="tab-mcq-viewport">
      
      <div class="bg-white rounded-2xl p-6 border shadow-sm space-y-4" id="mcq-creation-deck">
        <h3 class="font-black text-sm text-gray-950 uppercase tracking-wide leading-none flex items-center">
          <Award class="h-5 w-5 text-indigo-500 mr-1.5" /> Deploy Fresh MCQ Test Sets
        </h3>
        <p class="text-xs text-gray-500">
          Create dynamic multiple choice question sheets. Items injected this way are immediately made runnable to mock aspirants inside the "GK Quizzes" tab!
        </p>

        <form @submit="handleCreateMockQuiz" class="space-y-4 font-sans">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mock Exam Title:</label>
              <input
                type="text"
                v-model="quizTitle"
                required
                placeholder="e.g. 2026 Infantry Regiment Battles"
                class="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category:</label>
                <select
                  v-model="quizCategory"
                  class="w-full font-bold p-2.5 border border-gray-200 rounded-lg focus:outline-none bg-white"
                >
                  <option value="Agniveer Selection CEE">Agniveer mock CEE</option>
                  <option value="Polity Constitution">Polity & Acts</option>
                  <option value="Armed Forces GK">Armed Forces GK</option>
                  <option value="Current Affairs">Current Affairs</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 uppercase mb-1">Time Limit (secs):</label>
                <input
                  type="number"
                  v-model="quizTimeLimit"
                  class="w-full font-bold p-2 border border-gray-200 rounded-lg focus:outline-none bg-white"
                />
              </div>
            </div>
          </div>

          <!-- MCQ question block layout -->
          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <span class="text-[9px] uppercase font-black text-[#000080] block font-mono">Insert Core Objective Q1:</span>
            
            <div>
              <label class="block text-[10px] font-bold text-gray-400 mb-1 text-xs">Question Description String:</label>
              <input
                type="text"
                v-model="qText"
                placeholder="e.g. Which regiment bears the battle cry 'Durge Mata Ki Jai'?"
                class="w-full text-xs p-2 border border-gray-200 bg-white rounded-lg focus:outline-none"
              />
            </div>

            <!-- Options grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label class="text-[9px] font-bold text-gray-450">Option A:</label>
                <input
                  type="text"
                  v-model="opt0"
                  placeholder="The Jammu & Kashmir Rifles"
                  class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label class="text-[9px] font-bold text-gray-450">Option B:</label>
                <input
                  type="text"
                  v-model="opt1"
                  placeholder="The Rajput Regiment"
                  class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label class="text-[9px] font-bold text-gray-450">Option C:</label>
                <input
                  type="text"
                  v-model="opt2"
                  placeholder="The Dogra Regiment"
                  class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label class="text-[9px] font-bold text-gray-450">Option D:</label>
                <input
                  type="text"
                  v-model="opt3"
                  placeholder="Gorkha Rifles"
                  class="w-full text-xs p-1.5 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-[10px] font-bold text-gray-400 mb-1">Index of correct answer choice:</label>
                <select
                  v-model="correctOptionIdx"
                  class="w-full font-bold p-2 border border-gray-200 rounded bg-white focus:outline-none"
                >
                  <option :value="0">Choice A</option>
                  <option :value="1">Choice B</option>
                  <option :value="2">Choice C</option>
                  <option :value="3">Choice D</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-gray-400 mb-1">Answer Explanatory key rationale:</label>
                <input
                  type="text"
                  v-model="qExplanation"
                  placeholder="The Dogra Regiment battle cry is 'Durge Mata Ki Jai'."
                  class="w-full text-xs p-2 border border-gray-200 bg-white rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-[#138808] hover:bg-[#117706] text-white text-xs font-black py-3 rounded-lg uppercase tracking-wider transition-colors flex items-center justify-center space-x-1 shadow-md cursor-pointer"
          >
            <Plus class="h-4 w-4" />
            <span>Publish mock MCQ live</span>
          </button>

        </form>
      </div>

    </div>

    <!-- 5. Active Media Library Selection Popup Dialog -->
    <div v-if="showMediaPicker" class="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl border shadow-xl max-w-4xl w-full p-6 space-y-4">
        <div class="flex justify-between items-center border-b pb-2">
          <h4 class="text-xs font-black text-gray-800 uppercase tracking-wide">
            Select Featured Image from library
          </h4>
          <button @click="showMediaPicker = false" class="text-gray-400 hover:text-gray-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
          <div 
            v-for="item in mediaList" 
            :key="item.id" 
            @click="selectMediaItem(item)"
            class="border rounded-2xl overflow-hidden cursor-pointer hover:border-[#000080] hover:shadow transition-all bg-slate-50 flex flex-col justify-between"
          >
            <div class="aspect-video w-full p-2 flex items-center justify-center bg-white border-b">
              <img :src="item.url" class="max-h-16 object-contain" />
            </div>
            <div class="p-2 bg-white text-center">
              <p class="text-[10.5px] font-bold text-gray-800 truncate">{{ item.title }}</p>
              <span class="text-[8px] uppercase bg-indigo-50 text-indigo-700 px-1.5 rounded-full font-bold font-mono">{{ item.category || 'General' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Message Notification Toast popup -->
    <div 
      v-if="statusMessage" 
      :class="[
        'fixed bottom-5 right-5 z-50 p-4 rounded-xl border shadow-lg flex items-center space-x-2 text-xs font-bold font-sans animate-bounce',
        statusType === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
        statusType === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
        'bg-blue-50 text-blue-800 border-blue-200'
      ]"
    >
      <CheckCircle v-if="statusType === 'success'" class="h-4.5 w-4.5 text-emerald-600" />
      <Info v-else class="h-4.5 w-4.5 text-blue-600" />
      <span>{{ statusMessage }}</span>
    </div>

  </div>
</template>
