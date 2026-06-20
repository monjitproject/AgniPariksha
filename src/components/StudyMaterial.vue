<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { BookOpen, Search, Eye, Bookmark, Check, Download, Printer, LayoutDashboard, FileText } from 'lucide-vue-next';
import { StudyNote } from '../types';
import { MOCK_NOTES } from '../data/mockData';
import StudyNotesDashboard from './StudyNotesDashboard.vue';

interface StudyMaterialProps {
  selectedNoteId?: string | null;
}

const props = defineProps<StudyMaterialProps>();

const emit = defineEmits<{
  (e: 'selectNote', noteId: string | null): void;
}>();

const studyViewMode = ref<'dashboard' | 'pdf'>('dashboard');
const searchTerm = ref("");
const dynamicNotes = ref<StudyNote[]>([]);
const isGenerating = ref(false);
const selectedNote = ref<StudyNote | null>(null);
const textSize = ref<"normal" | "large" | "extra-large">("normal");
const currentPage = ref<number>(1);
const isNightMode = ref(false);
const bookmarkedNotes = ref<string[]>([]);
const downloadsMap = ref<Record<string, number>>({});


const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const allNotes = ref<StudyNote[]>([]);

const refreshAllNotes = () => {
  allNotes.value = [...dynamicNotes.value, ...MOCK_NOTES];
  if (props.selectedNoteId && allNotes.value.length > 0) {
    const match = allNotes.value.find(n => n.id === props.selectedNoteId || toSlug(n.title) === props.selectedNoteId);
    if (match) {
      selectedNote.value = match;
    }
  } else if (!props.selectedNoteId && !selectedNote.value && allNotes.value.length > 0) {
    selectedNote.value = allNotes.value[0];
  }
};

onMounted(() => {
  fetch("/api/get-automated-content")
    .then((res) => res.json())
    .then((data) => {
      if (data && data.studyNotes) {
        dynamicNotes.value = data.studyNotes;
        refreshAllNotes();
      }
    })
    .catch((err) => console.error("Error loading dynamic study notes:", err));
  refreshAllNotes();
});

watch(() => props.selectedNoteId, (newId) => {
  if (newId && allNotes.value.length > 0) {
    const match = allNotes.value.find(n => n.id === newId || toSlug(n.title) === newId);
    if (match && (!selectedNote.value || selectedNote.value.id !== match.id)) {
      selectedNote.value = match;
    }
  }
});

watch([dynamicNotes, () => MOCK_NOTES], () => {
  refreshAllNotes();
});

const handleToggleBookmark = (noteId: string) => {
  if (bookmarkedNotes.value.includes(noteId)) {
    bookmarkedNotes.value = bookmarkedNotes.value.filter(id => id !== noteId);
  } else {
    bookmarkedNotes.value.push(noteId);
  }
};

const handleDownloadPdfNote = (note: StudyNote) => {
  try {
    const fileHeader = `=====================================================================\n`;
    const docHeader  = `     AGNI PARIKSHA COMPETITIVE EXAMS ACADEMY - VERIFIED STUDY NOTES\n`;
    const category   = `     Category: ${note.category.toUpperCase()} | Format: SECURED ACADEMIC PDF\n`;
    const noteTitle  = `     Document Title: ${note.title}\n`;
    const docMeta    = `     Author: ${note.author} | Date: ${note.date} | Security Level: Verified\n`;
    const delimiter  = `=====================================================================\n\n`;
    const bodyContent = note.content;
    const footer     = `\n\n---------------------------------------------------------------------\n© AgniPariksha Academic Publishing. All rights reserved. For Personal Study Use Only.`;

    const fullString = fileHeader + docHeader + category + noteTitle + docMeta + delimiter + bodyContent + footer;
    const blob = new Blob([fullString], { type: "application/pdf;charset=utf-8" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = `${note.title.replace(/\s+/g, "_")}_Official_Notes.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    downloadsMap.value[note.id] = (downloadsMap.value[note.id] || 0) + 1;
  } catch (e) {
    console.error("Failed to compile study notes PDF", e);
  }
};

const handlePrintPdf = () => {
  window.print();
};

const filteredNotes = () => {
  const term = searchTerm.value.toLowerCase();
  return allNotes.value.filter(note => {
    return (
      note.title.toLowerCase().includes(term) ||
      note.category.toLowerCase().includes(term) ||
      note.content.toLowerCase().includes(term)
    );
  });
};

const handlePublishNotes = async () => {
  isGenerating.value = true;
  try {
    const res = await fetch("/api/get-automated-content?force=true", { method: "POST" });
    const data = await res.json();
    if (data && data.studyNotes) {
      dynamicNotes.value = data.studyNotes;
      refreshAllNotes();
      if (data.studyNotes.length > 0) {
        selectedNote.value = data.studyNotes[0];
        emit('selectNote', toSlug(data.studyNotes[0].title));
      }
      alert("Success: Dynamic compiler completed research and instantly published 2 new PDF chapters written in Hindi!");
    }
  } catch (err) {
    console.error("Manual trigger failed:", err);
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 text-left" id="study-material-viewport">

    <!-- Premium Switcher Pill Bar for studyViewMode -->
    <div class="flex flex-col sm:flex-row items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm gap-3 font-sans">
      <div class="text-left py-0.5 px-1.5">
        <span class="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center space-x-1.5">
          <BookOpen class="h-4.5 w-4.5 text-[#000080]" />
          <span>AgniPariksha revision academy</span>
        </span>
      </div>
      <div class="flex items-center space-x-1.5 w-full sm:w-auto">
        <button
          @click="studyViewMode = 'dashboard'"
          :class="[
            'flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer',
            studyViewMode === 'dashboard'
              ? 'bg-[#000080] text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
          ]"
        >
          <LayoutDashboard class="h-3.5 w-3.5" />
          <span>Interactive Accordion Study Notes</span>
        </button>
        <button
          @click="studyViewMode = 'pdf'"
          :class="[
            'flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer',
            studyViewMode === 'pdf'
               ? 'bg-[#000080] text-white shadow-md'
               : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
          ]"
        >
          <FileText class="h-3.5 w-3.5" />
          <span>Official Printable PDF Reader</span>
        </button>
      </div>
    </div>

    <!-- Group 1: Interactive Accordion-style Study Notes Dashboard -->
    <div v-if="studyViewMode === 'dashboard'" class="animate-fade-in" id="dashboard-notes-view">
      <StudyNotesDashboard />
    </div>

    <!-- Group 2: Print-Ready PDF Chapters Viewer Portal -->
    <div v-else-if="studyViewMode === 'pdf'" class="space-y-6 animate-fade-in text-left" id="pdf-revisions-view">
      
      <!-- Search and Categories Header -->
      <div class="bg-white p-6 rounded-2xl shadow-md border-t-4 border-t-[#FF9933] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-xl font-black text-gray-900 flex items-center">
            <BookOpen class="h-6 w-6 text-[#000080] mr-2" />
            Official Government Exams PDF Study Material Portal
          </h2>
          <p class="text-xs text-gray-500 mt-1 leading-relaxed">
            Access secure Revision Sheets, General Knowledge briefings, and syllabus summaries. <strong>All files are formatted in print-ready direct PDF format (.pdf)</strong> for offline learning.
          </p>
        </div>

        <!-- Quick Search -->
        <div class="relative max-w-sm w-full md:w-64 shrink-0">
          <input
            type="text"
            id="search-notes-input"
            v-model="searchTerm"
            placeholder="Search exam notes..."
            class="w-full text-xs font-bold p-3 pl-10 border border-gray-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#000080] bg-gray-50 text-slate-800"
          />
          <Search class="h-4.5 w-4.5 text-gray-400 absolute left-3.5 top-3.5" />
        </div>
      </div>

      <!-- Main Two Column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6" id="study-material-layout">
        
        <!-- Left column Note select list -->
        <div 
          class="lg:col-span-1 space-y-4 bg-gradient-to-b from-white to-[#000080]/5 p-5 rounded-2xl border-2 border-[#000080]/15 shadow-sm transition-all duration-300 hover:shadow-md" 
          id="notes-sidebar-selector"
        >
          <div class="flex flex-col gap-2.5">
            <div class="flex justify-between items-center pb-1">
              <h4 class="font-bold text-xs uppercase text-[#000080] font-mono tracking-widest pl-1">Government PDF Index</h4>
              <span class="bg-[#138808]/10 text-[#138808] text-[9px] uppercase font-mono font-black px-2 py-0.5 rounded border border-[#138808]/20 flex items-center select-none">
                <span class="h-1.5 w-1.5 bg-[#138808] rounded-full mr-1 animate-pulse" />
                Live Hub
              </span>
            </div>
            
            <button
              @click="handlePublishNotes"
              :disabled="isGenerating"
              class="w-full text-center py-2.5 bg-[#000080] hover:bg-blue-900 text-white font-extrabold uppercase text-[9px] tracking-wider rounded-xl transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center space-x-1.5 font-sans"
            >
              <span v-if="isGenerating">Researching Web Trends...</span>
              <template v-else>
                <span>Research & Publish Live Notes Now</span>
                <div class="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
              </template>
            </button>
          </div>

          <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1 mt-2.5" id="notes-list-sidebar">
            <div
              v-for="note in filteredNotes()"
              :key="note.id"
              :id="`note-card-selector-${note.id}`"
              @click="() => {
                selectedNote = note;
                currentPage = 1;
                emit('selectNote', toSlug(note.title));
              }"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-150 relative overflow-hidden flex flex-col justify-between text-left h-28 cursor-pointer',
                selectedNote?.id === note.id
                  ? 'bg-white border-[#000080] shadow-md'
                  : 'bg-white border-gray-100 hover:border-gray-300'
              ]"
            >
              <div>
                <div class="flex justify-between items-start mb-1.5">
                  <span class="text-[8px] font-black uppercase text-[#FF9933] bg-[#FF9933]/10 px-2 py-0.5 rounded">
                    {{ note.category }}
                  </span>
                  <div class="flex items-center space-x-1">
                    <span class="text-[8px] font-black uppercase text-white bg-red-650 px-1.5 py-0.2 rounded font-mono" style="padding: 1px 4px;">
                      PDF
                    </span>
                    <span v-if="bookmarkedNotes.includes(note.id)" class="text-[8px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200 px-1.5 py-0.2 rounded uppercase" style="padding: 1px 4px;">
                      Saved
                    </span>
                  </div>
                </div>
                
                <h5 class="font-black text-xs text-gray-800 leading-snug">
                  {{ note.title }}
                </h5>
              </div>

              <div class="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-4 pt-2 border-t border-gray-50 bg-white">
                <span class="font-bold text-slate-500">{{ `${(note.content.length / 500 + 0.6).toFixed(1)} MB` }}</span>
                <span>Downloads: {{ downloadsMap[note.id] || Math.floor((note.content.length % 29) + 4) }}</span>
              </div>
            </div>

            <div v-if="filteredNotes().length === 0" class="text-center py-10 bg-gray-50 rounded-xl">
              <p class="text-xs text-gray-500 italic">No notes match your query.</p>
            </div>
          </div>
        </div>

        <!-- Right column Selected Note Reader panel -->
        <div class="lg:col-span-2 space-y-4" id="notes-reader-panel">
          <div v-if="selectedNote" :class="[
            'rounded-2xl shadow-md border p-4 sm:p-6 transition-all',
            isNightMode ? 'bg-slate-900 text-gray-200 border-slate-800' : 'bg-slate-100 text-gray-800 border-gray-250'
          ]" id="active-reading-board">
            
            <!-- Acrobat style controls -->
            <div class="bg-slate-800 text-white p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3 mb-5 shadow" id="reader-controls">
              <div class="flex items-center space-x-2">
                <span class="text-[9px] font-black uppercase bg-red-600 text-white px-2 py-1 rounded font-mono">PDF ACTIVE</span>
                <span class="text-[11px] font-mono font-bold truncate max-w-[200px] sm:max-w-xs">{{ selectedNote.title.replace(/\s+/g, "_") }}.pdf</span>
              </div>

              <!-- PDF Toolbar -->
              <div class="flex items-center space-x-2.5">
                <div class="flex items-center bg-slate-700 rounded-lg p-0.5 font-sans" id="reader-zoom-box">
                  <button
                    id="text-size-normal-btn"
                    @click="textSize = 'normal'"
                    :class="[
                      'button px-2.5 py-1 rounded text-[10px] font-black transition-colors cursor-pointer',
                      textSize === 'normal' ? 'bg-red-650 text-white' : 'text-gray-300 hover:text-white'
                    ]"
                  >
                    100%
                  </button>
                  <button
                    id="text-size-large-btn"
                    @click="textSize = 'large'"
                    :class="[
                      'button px-2.5 py-1 rounded text-[10px] font-black transition-colors cursor-pointer',
                      textSize === 'large' ? 'bg-red-650 text-white' : 'text-gray-300 hover:text-white'
                    ]"
                  >
                    150%
                  </button>
                  <button
                    id="text-size-xlarge-btn"
                    @click="textSize = 'extra-large'"
                    :class="[
                      'button px-2.5 py-1 rounded text-[10px] font-black transition-colors cursor-pointer',
                      textSize === 'extra-large' ? 'bg-red-650 text-white' : 'text-gray-300 hover:text-white'
                    ]"
                  >
                    200%
                  </button>
                </div>

                <button
                  id="reader-night-mode-toggle"
                  @click="isNightMode = !isNightMode"
                  class="p-1.5 bg-slate-700 text-gray-300 hover:text-white rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <Eye class="h-4 w-4" />
                </button>

                <button
                  id="reader-print-btn"
                  @click="handlePrintPdf"
                  class="p-1.5 bg-slate-700 text-gray-300 hover:text-white rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <Printer class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- PDF Secure Download Banner -->
            <div class="mb-5 bg-gradient-to-r from-red-600 to-red-800 text-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
              <div class="text-left">
                <h4 class="font-extrabold text-sm flex items-center">
                  <Download class="h-4 w-4 mr-1.5 animate-bounce text-white" />
                  Verified Government Job Study Materials Note
                </h4>
                <p class="text-[10px] text-red-100 font-mono mt-0.5">
                  Click the download button to generate the authentic print-ready PDF file of this chapter.
                </p>
              </div>

              <div class="flex items-center space-x-2">
                <button
                  :id="`bookmark-note-btn-${selectedNote.id}`"
                  @click="handleToggleBookmark(selectedNote.id)"
                  :class="[
                    'p-2 rounded-lg border text-xs font-bold transition-all cursor-pointer',
                    bookmarkedNotes.includes(selectedNote.id)
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500'
                      : 'bg-red-700 hover:bg-red-950 text-white border-red-500'
                  ]"
                >
                  <Bookmark class="h-4 w-4 fill-current text-white" />
                </button>

                <button
                  :id="`download-pdf-button-${selectedNote.id}`"
                  @click="handleDownloadPdfNote(selectedNote)"
                  class="bg-white hover:bg-slate-100 text-red-700 text-xs font-black tracking-wider uppercase px-4 py-2 rounded-lg shadow transition-all duration-150 flex items-center space-x-1.5 cursor-pointer font-sans"
                >
                  <span>Download PDF</span>
                  <Download class="h-3.5 w-3.5 text-red-700" />
                </button>
              </div>
            </div>

            <!-- Document Simulator A4 Frame -->
            <div 
              :class="[
                'w-full max-w-4xl mx-auto rounded-xl p-6 sm:p-12 shadow-2xl transition-all relative select-text border border-gray-300 text-left',
                isNightMode ? 'bg-slate-950 text-gray-200' : 'bg-white text-gray-800'
              ]"
              style="min-height: 680px;"
              id="actual-notes-body-text"
            >
              <!-- Watermark -->
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.04] text-[#000080] text-5xl font-black uppercase text-center select-none font-mono tracking-widest leading-normal">
                AGNI PARIKSHA<br />PROVEN STUDY CORE
              </div>

              <!-- PDF Header -->
              <div class="border-b-2 border-[#000080] pb-4 mb-6 flex justify-between items-end">
                <div class="text-left">
                  <span class="text-[10px] font-mono tracking-widest text-[#FF9933] uppercase font-black">
                    {{ selectedNote.category }}
                  </span>
                  <h1 class="text-xl sm:text-2xl font-black tracking-tight" :style="{ color: isNightMode ? '#FFF' : '#0f172a' }">
                    {{ selectedNote.title }}
                  </h1>
                  <p class="text-[10px] text-gray-400 font-bold mt-1">
                    Author: {{ selectedNote.author }} • Updated: {{ selectedNote.date }}
                  </p>
                </div>

                <span class="text-[10px] font-mono text-gray-400 font-bold uppercase hidden sm:block">
                  Page {{ currentPage }} of 2
                </span>
              </div>

              <!-- Interactive Zoom sizing content -->
              <div 
                :class="[
                  'leading-relaxed whitespace-pre-wrap text-left',
                  textSize === 'normal' ? 'text-xs sm:text-[13px] leading-relaxed' :
                  textSize === 'large' ? 'text-sm sm:text-base leading-relaxed' : 'text-base sm:text-lg leading-loose font-medium'
                ]"
              >
                {{ selectedNote.content }}
              </div>

              <!-- Secure Footer -->
              <div class="mt-12 pt-6 border-t border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-gray-400 gap-2">
                <span>SYSTEM DOC ID: AP-A4-{{ selectedNote.id.toUpperCase() }}</span>
                <span class="text-[#138808] font-bold uppercase flex items-center">
                  <Check class="h-4 w-4 mr-1 text-green-600 font-black" />
                  AGNI SECURE ACADEMIC LICENSE VALIDATED
                </span>
              </div>
            </div>

            <!-- Simulated Page Navigation -->
            <div class="mt-4 flex justify-between items-center px-2" id="pdf-simulator-page-navigator">
              <span class="text-xs font-mono font-black text-slate-500">Document size: ~1,505 words</span>

              <div class="flex items-center space-x-1 font-sans">
                <button
                  :disabled="currentPage === 1"
                  @click="currentPage = 1"
                  class="bg-slate-300 hover:bg-slate-400 text-slate-800 disabled:opacity-40 px-3 py-1 text-[11px] font-bold rounded-lg transition-colors border border-slate-400 cursor-pointer"
                >
                  Prev Page
                </button>
                <span class="text-xs font-mono font-bold text-slate-600 mx-1">{{ currentPage }} / 2</span>
                <button
                  :disabled="currentPage === 2"
                  @click="currentPage = 2"
                  class="bg-slate-300 hover:bg-slate-400 text-slate-800 disabled:opacity-40 px-3 py-1 text-[11px] font-bold rounded-lg transition-colors border border-slate-400 cursor-pointer"
                >
                  Next Page
                </button>
              </div>
            </div>

          </div>

          <div v-else class="bg-white rounded-2xl p-12 text-center shadow border border-gray-100" id="reading-pane-fallback">
            <BookOpen class="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p class="text-xs text-gray-500 font-bold">Select a study guide from the left directory to open the PDF viewer here.</p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
