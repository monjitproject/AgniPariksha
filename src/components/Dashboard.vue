<script setup lang="ts">
import { 
  Award, Shield, FileText, Star, Bookmark, Flame, Printer 
} from 'lucide-vue-next';
import { UserProfile } from '../types';
import { MOCK_LEADERBOARD } from '../data/mockData';

interface DashboardProps {
  profile: UserProfile;
}

const props = defineProps<DashboardProps>();

const emit = defineEmits<{
  (e: 'setCurrentTab', tab: string): void;
}>();

const getBadgeIcon = (badge: string) => {
  if (badge.includes("Param") || badge.includes("Maha")) return Star;
  return Shield;
};

const handleRetest = () => {
  emit('setCurrentTab', 'quizzes');
};

const printCertificate = () => {
  window.print();
};
</script>

<template>
  <div class="space-y-6 animate-fade-in" id="student-dashboard-viewport">
    
    <!-- 1. Core Welcome Header banner -->
    <div class="bg-gradient-to-tr from-slate-900 to-[#000080] p-6 sm:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden" id="student-primary-banner">
      <div class="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-[#FF9933]/15 via-transparent to-[#138808]/15 rounded-bl-full pointer-events-none" />
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="space-y-1">
          <span class="text-xs font-black tracking-widest text-[#FF9933] uppercase">Aspirant Profile Dashboard</span>
          <h1 class="text-xl sm:text-2xl font-black flex items-center">
            🇮🇳 Welcome, {{ profile.name }}!
          </h1>
          <p class="text-xs text-indigo-200 leading-snug font-sans">
            Currently studying for the Indian Armed Forces entrance tests. Your dedication today decides tomorrow's victory.
          </p>
        </div>

        <div class="bg-white/10 border border-white/20 p-3 rounded-xl shadow-inner font-mono text-center shrink-0" id="quick-points-tracker">
          <Flame class="h-5 w-5 text-[#FF9933] mx-auto animate-bounce" />
          <span class="block mt-1 text-sm font-black text-[#FF9933]">{{ profile.points }} Points</span>
          <span class="text-[9px] text-indigo-200">National Rank Equivalent</span>
        </div>
      </div>
    </div>

    <!-- 2. Statistical parameters summary metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6" id="dashboard-metric-cards">
      
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <div class="p-3 bg-[#000080]/10 text-[#000080] rounded-xl flex items-center justify-center">
          <Award class="h-6 w-6" id="metric-quizzes-badge" />
        </div>
        <div>
          <span class="text-[10px] text-gray-400 block font-mono font-black uppercase">Quizzes Completed</span>
          <h3 class="font-black text-lg text-gray-800">{{ profile.history.length }} Mock Tests</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <div class="p-3 bg-[#138808]/10 text-[#138808] rounded-xl flex items-center justify-center">
          <Bookmark class="h-6 w-6" id="metric-bookmarks-badge" />
        </div>
        <div>
          <span class="text-[10px] text-gray-400 block font-mono font-black uppercase">Saved GK Questions</span>
          <h3 class="font-black text-lg text-gray-800">{{ profile.bookmarkedQuestionIds.length }} Items</h3>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <div class="p-3 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
          <FileText class="h-6 w-6" id="metric-certs-badge" />
        </div>
        <div>
          <span class="text-[10px] text-gray-400 block font-mono font-black uppercase">Earned Certificates</span>
          <h3 class="font-black text-lg text-gray-800">{{ profile.certificates.length }} Issued</h3>
        </div>
      </div>

    </div>

    <!-- 3. Main Split details dashboard view -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start" id="dashboard-split-detail-grid">
      
      <!-- Left lists historical quizzes taken -->
      <div class="lg:col-span-2 space-y-6" id="dashboard-history-sector">
        
        <!-- History list -->
        <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
          <h3 class="font-black text-sm text-gray-900 border-b border-gray-100 pb-2.5 mb-4 uppercase tracking-wider">
            Recent Mock Exams Attempt Log
          </h3>

          <div class="space-y-3" id="attempts-scroller">
            <div 
              v-for="(h, hidx) in profile.history" 
              :key="hidx" 
              :id="`history-${hidx}`"
              class="bg-gray-50 hover:bg-gray-100 p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-colors"
            >
              <div class="space-y-1">
                <span class="text-[9px] font-mono text-[#000080] font-bold">DATE COMPLETED: {{ h.date }}</span>
                <h4 class="font-black text-xs text-gray-800">{{ h.quizTitle }}</h4>
                <p class="text-[10px] text-gray-500 font-mono">Completed in {{ h.timeTaken }}</p>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <div class="text-right">
                  <span class="text-[9px] text-gray-400 font-bold font-mono block">SCORE</span>
                  <span :class="['text-sm font-black', h.scorePercentage >= 75 ? 'text-green-600' : 'text-[#FF9933]']">
                    {{ h.scorePercentage }}%
                  </span>
                </div>

                <button
                  :id="`btn-dashboard-history-view`"
                  @click="handleRetest"
                  class="text-[10px] font-black bg-[#000080] text-white p-1.5 px-3 rounded-lg flex items-center uppercase cursor-pointer"
                >
                  <span>Retest</span>
                </button>
              </div>
            </div>

            <div v-if="profile.history.length === 0" class="text-center py-10 bg-gray-50 rounded-xl space-y-3" id="history-dashboard-null">
              <p class="text-xs text-gray-500 italic">No exams practiced yet.</p>
              <button
                id="btn-goto-practice"
                @click="handleRetest"
                class="bg-[#138808] text-white text-[10px] font-bold py-1.5 px-4 rounded-md uppercase cursor-pointer"
              >
                Take your first mock test
              </button>
            </div>
          </div>
        </div>

        <!-- Certificates history list -->
        <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100 space-y-4">
          <h3 class="font-black text-sm text-gray-900 border-b border-gray-100 pb-2.5 uppercase tracking-wider">
            Verified Merit Certificates Log
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4" id="dashboard-certs-grid">
            <div 
              v-for="cert in profile.certificates" 
              :key="cert.id" 
              :id="`dashboard-cert-card-${cert.id}`"
              class="bg-gradient-to-br from-indigo-50/40 to-white hover:from-indigo-50/70 p-4 border border-indigo-100 rounded-xl relative overflow-hidden"
            >
              <div class="absolute top-0 right-0 h-10 w-10 bg-[#FF9933]/15 rounded-full flex items-center justify-center cursor-pointer">
                <Award class="h-4.5 w-4.5 text-[#FF9933]" />
              </div>

              <div class="space-y-2 text-left">
                <span class="text-[8px] font-bold font-mono bg-[#000080] text-white px-1.5 py-0.2 rounded" style="padding: 2px 6px;">
                  ID: {{ cert.id }}
                </span>
                <h5 class="font-black text-xs text-slate-800 leading-tight border-b pb-1 border-gray-150 mt-1">{{ cert.quizTitle }}</h5>
                <p class="text-[10px] text-gray-500 font-sans">Issued matching: <strong class="text-gray-900 uppercase font-bold">{{ cert.userName }}</strong></p>
                <p class="text-[9px] text-[#138808] font-bold font-mono">Date: {{ cert.date }} | Score: {{ cert.scorePercentage }}%</p>
              </div>

              <button
                :id="`btn-dashboard-print-cert-${cert.id}`"
                @click="printCertificate"
                class="w-full bg-gray-900 hover:bg-black text-white text-[9px] font-black uppercase py-1.5 rounded mt-4 tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Printer class="h-3 w-3" />
                <span>Print Certificate</span>
              </button>
            </div>

            <div v-if="profile.certificates.length === 0" class="col-span-1 sm:col-span-2 text-center py-6 bg-gray-50 rounded-xl" id="certs-dashboard-null">
              <p class="text-xs text-gray-500 italic">No formal certificates issued yet. Complete a mock test to earn yours!</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Right sidebar leaderboard and achievements -->
      <div class="space-y-6 lg:col-span-1" id="dashboard-leaderboard-sector">
        
        <!-- Daily National Leaderboard segment -->
        <div class="bg-white p-5 rounded-2xl shadow-md border border-gray-100" id="best-champions-list bg-white">
          <h4 class="font-black text-xs text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 mb-4 flex items-center">
            <Star class="h-4.5 w-4.5 mr-1 text-yellow-500 fill-yellow-400" />
            National Agniveer Leaderboard
          </h4>

          <div class="space-y-3" id="leaderboard-ranking-scroller">
            <div 
              v-for="item in MOCK_LEADERBOARD" 
              :key="item.rank" 
              :id="`rank-row-${item.rank}`"
              class="flex justify-between items-center text-xs p-2 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center space-x-2 text-left">
                <span :class="[
                  'h-5 w-5 rounded-full flex items-center justify-center font-bold text-[10px] ring-1',
                  item.rank === 1 ? 'bg-yellow-500 text-white font-black' :
                  item.rank === 2 ? 'bg-slate-305 text-gray-700 bg-slate-100' :
                  'bg-white border-gray-200 text-gray-500'
                ]">
                  {{ item.rank }}
                </span>
                <div>
                  <p class="font-black text-gray-800 text-[11px] leading-tight">{{ item.name }}</p>
                  <span class="text-[8.5px] text-gray-400 font-serif lowercase leading-none">{{ item.badge }}</span>
                </div>
              </div>

              <div class="text-right shrink-0">
                <span class="font-black text-[#000080] font-mono">{{ item.score }}</span>
                <span class="text-[8px] text-gray-400 block font-mono">Pts</span>
              </div>
            </div>
          </div>

          <p class="text-[9px] text-slate-400 text-center mt-4">Rankings refresh weekly based on verified mock scorecard speeds.</p>
        </div>

      </div>

    </div>

  </div>
</template>
