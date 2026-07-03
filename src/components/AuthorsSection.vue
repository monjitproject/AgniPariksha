<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { AUTHORS, getAuthorByIdOrName, Author } from '../data/authorsData';
import { MOCK_BLOGS } from '../data/mockData';
import { 
  User, Award, Clock, ArrowRight, ShieldCheck, FileText, 
  ChevronRight, Calendar, UserCheck, BookOpen, Briefcase, Sparkles
} from 'lucide-vue-next';

const props = defineProps<{
  activeAuthorId?: string | null;
}>();

const emit = defineEmits<{
  (e: 'selectAuthor', authorId: string | null): void;
  (e: 'navigate', tab: string, subId?: string | null): void;
}>();

const selectedAuthorId = ref<string | null>(props.activeAuthorId || null);

// Sample articles directly compiled for JobArticleTemplate.vue
const staticJobArticles = [
  {
    id: 'ssc-gd-2026',
    title: 'SSC GD Constable 2026 Recruitment Notification: Apply Online for 45,284 Vacancies, Syllabus & Exam Date',
    excerpt: 'The Staff Selection Commission (SSC) has released the authoritative and final recruitment directive for General Duty (GD) Constable vacancies.',
    category: 'SSC',
    authorId: 'rs-rathore',
    date: '2026-07-02',
    readTime: '12 min read'
  },
  {
    id: 'agniveer-army-2026',
    title: 'Army Agniveer Rally Recruitment 2026: Online Registration, Physical Efficiency Tests, Syllabus Vetting',
    excerpt: 'Indian Army headquarters has unleashed the official Rally Enrollment Matrix under the Agnipath schema for General Duty (GD) aspirants.',
    category: 'Agniveer',
    authorId: 'jaswant-singh',
    date: '2026-06-28',
    readTime: '11 min read'
  }
];

// Helper to get initials
const getInitials = (name: string) => {
  return name
    .replace(/(Retd\.)/gi, '')
    .replace(/(Shaurya Chakra Awardee)/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

// Select author profile
const selectAuthor = (authorId: string) => {
  selectedAuthorId.value = authorId;
  emit('selectAuthor', authorId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Clear profile and go back to listings
const clearSelection = () => {
  selectedAuthorId.value = null;
  emit('selectAuthor', null);
};

// Get articles for active author
const authorArticles = computed(() => {
  if (!selectedAuthorId.value) return [];
  const authorId = selectedAuthorId.value;
  
  // 1. Filter jobs
  const jobs = staticJobArticles.filter(item => item.authorId === authorId);
  
  // 2. Filter blogs from MOCK_BLOGS
  const blogs = MOCK_BLOGS.map(blog => {
    const parsedAuthor = getAuthorByIdOrName(blog.author);
    return {
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      authorId: parsedAuthor.id,
      date: blog.date,
      readTime: blog.readTime,
      type: 'blog'
    };
  }).filter(blog => blog.authorId === authorId);

  return [
    ...jobs.map(j => ({ ...j, type: 'job' })),
    ...blogs
  ];
});

const activeAuthor = computed(() => {
  if (!selectedAuthorId.value) return null;
  return AUTHORS.find(a => a.id === selectedAuthorId.value) || null;
});

const handleArticleClick = (item: any) => {
  if (item.type === 'job') {
    emit('navigate', 'jobs', item.id);
  } else {
    emit('navigate', 'blog', item.id);
  }
};
</script>

<template>
  <div class="space-y-6 text-left" id="authors-section-container">
    
    <!-- Top Micro Banner -->
    <div class="bg-gradient-to-r from-slate-900 to-[#000080] text-white p-6 sm:p-8 rounded-3xl border border-blue-900/40 shadow-lg relative overflow-hidden" id="authors-hero">
      <div class="absolute -right-10 -bottom-10 opacity-10">
        <UserCheck class="w-60 h-60 text-white" />
      </div>
      <div class="relative space-y-2 max-w-3xl">
        <span class="inline-flex items-center space-x-1.5 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider font-mono">
          <Award class="h-3.5 w-3.5" />
          <span>Vetted Board of Contributors</span>
        </span>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center">
          <ShieldCheck class="h-8 w-8 text-amber-400 mr-2.5" />
          Meet AgniPariksha's Expert Editorial Panel
        </h2>
        <p class="text-xs text-indigo-100 leading-relaxed font-sans">
          To ensure 100% compliance with high-tier content guidelines, every recruitment notice, syllabus breakdown, and strategy guide is compiled, fact-checked, and approved by veteran officers and senior career researchers.
        </p>
      </div>
    </div>

    <!-- LIST VIEW (No active selection) -->
    <div v-if="!activeAuthor" class="space-y-6" id="authors-listing-grid">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div 
          v-for="author in AUTHORS" 
          :key="author.id"
          :id="`author-card-${author.id}`"
          class="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
        >
          <div class="space-y-4">
            <!-- Header: Avatar + Info -->
            <div class="flex items-start space-x-4">
              <div :class="[author.avatarColor, 'w-12 h-12 rounded-xl flex items-center justify-center font-black font-mono text-base shadow-xs shrink-0']">
                {{ getInitials(author.name) }}
              </div>
              <div class="space-y-0.5">
                <div class="flex flex-wrap items-center gap-1.5">
                  <h3 class="text-sm font-black text-slate-900 hover:text-[#000080] transition-colors cursor-pointer" @click="selectAuthor(author.id)">
                    {{ author.name }}
                  </h3>
                  <span v-if="author.reviewedByEditorial" class="bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5 shrink-0">
                    <ShieldCheck class="h-2.5 w-2.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <p class="text-xs text-slate-500 font-medium leading-tight">{{ author.role }}</p>
                <div class="flex items-center text-[10px] text-amber-600 font-mono font-bold mt-1">
                  <Award class="h-3 w-3 mr-1" />
                  <span>{{ author.experience }}</span>
                </div>
              </div>
            </div>

            <!-- Bio snippet -->
            <p class="text-xs text-slate-650 leading-relaxed">
              {{ author.bio }}
            </p>

            <!-- Credentials -->
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span 
                v-for="(cred, idx) in author.credentials" 
                :key="idx" 
                class="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/50"
              >
                {{ cred }}
              </span>
            </div>
          </div>

          <!-- Bottom Action -->
          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-[10px] text-slate-400 font-mono">Contributor since {{ author.joinedDate }}</span>
            <button 
              @click="selectAuthor(author.id)"
              class="inline-flex items-center space-x-1 text-xs font-black text-[#000080] hover:text-[#000060] transition-colors cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <span>View Profile & Publications</span>
              <ChevronRight class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>

      <!-- Vetting Standards Note -->
      <div class="bg-emerald-50/50 border border-emerald-200 p-5 rounded-2xl space-y-2 flex items-start space-x-3.5" id="vetting-disclosure">
        <ShieldCheck class="h-6 w-6 text-emerald-800 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <h4 class="text-xs font-black text-emerald-900 uppercase tracking-wide">AgniPariksha Editorial Vetting Guarantee</h4>
          <p class="text-xs text-slate-650 leading-relaxed font-sans">
            Every job posting and recruitment syllabus undergoes a rigid <strong>three-tier factual vetting protocol</strong> by our editorial board. We trace original notification documents back to their authorized gazette publications to guarantee accuracy and ensure maximum compliance with official standards.
          </p>
        </div>
      </div>
    </div>

    <!-- DETAILED PROFILE VIEW -->
    <div v-else class="space-y-6" id="author-detailed-profile">
      
      <!-- Go Back Header -->
      <div class="flex items-center justify-between">
        <button 
          @click="clearSelection" 
          class="inline-flex items-center space-x-1.5 text-xs font-black text-slate-600 hover:text-slate-900 transition-colors cursor-pointer bg-slate-100 hover:bg-slate-200/80 px-3.5 py-1.5 rounded-lg"
        >
          <span class="rotate-180 inline-block">➔</span>
          <span>Back to Authors Directory</span>
        </button>
        <span class="text-xs text-slate-400 font-mono">Profile ID: {{ activeAuthor?.id }}</span>
      </div>

      <!-- Author Card Hero -->
      <div class="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6" id="author-hero-panel">
        <div class="flex flex-col md:flex-row items-start gap-5">
          <!-- Big Avatar -->
          <div :class="[activeAuthor?.avatarColor, 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black font-mono text-2xl sm:text-3xl shadow-sm shrink-0']">
            {{ getInitials(activeAuthor?.name || '') }}
          </div>

          <div class="space-y-2 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black text-slate-900">
                {{ activeAuthor?.name }}
              </h1>
              <span class="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck class="h-3 w-3" />
                <span>Reviewed by Editorial Team</span>
              </span>
            </div>
            
            <p class="text-xs sm:text-sm font-bold text-[#000080] font-mono uppercase tracking-wider">
              {{ activeAuthor?.role }}
            </p>

            <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs font-mono text-slate-500 pt-1">
              <span class="flex items-center gap-1">
                <Award class="h-4 w-4 text-amber-500" /> 
                <strong class="text-slate-700">Experience:</strong> {{ activeAuthor?.experience }}
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Calendar class="h-4 w-4 text-blue-500" />
                <strong class="text-slate-700">Joined:</strong> {{ activeAuthor?.joinedDate }}
              </span>
            </div>
          </div>
        </div>

        <!-- Detailed Bio -->
        <div class="bg-slate-50/75 p-5 rounded-2xl border border-slate-100 text-slate-700 space-y-2 leading-relaxed">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">About the Author</h3>
          <p class="text-xs sm:text-sm font-medium">
            {{ activeAuthor?.bio }}
          </p>
        </div>

        <!-- Credentials Grid -->
        <div class="space-y-2">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">Verified Credentials</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(cred, idx) in activeAuthor?.credentials" 
              :key="idx"
              class="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-250/60 px-3 py-1 rounded-xl flex items-center gap-1.5"
            >
              <Sparkles class="h-3.5 w-3.5 text-amber-500" />
              <span>{{ cred }}</span>
            </span>
          </div>
        </div>

      </div>

      <!-- Authored Articles Section -->
      <div class="space-y-4" id="authored-articles-container">
        <h2 class="text-lg font-black text-slate-900 flex items-center">
          <FileText class="h-5 w-5 text-[#000080] mr-2" />
          Published Articles & Vetted Guidelines by {{ activeAuthor?.name.split(' ')[2] || activeAuthor?.name }}
        </h2>

        <!-- Articles Grid -->
        <div v-if="authorArticles.length > 0" class="grid grid-cols-1 gap-4">
          <div 
            v-for="article in authorArticles" 
            :key="article.id"
            :id="`authored-item-${article.id}`"
            class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-350 transition-all shadow-xs flex flex-col justify-between"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between text-[9px] font-mono uppercase font-black">
                <span :class="[article.type === 'job' ? 'text-[#FF9933] bg-orange-50 px-2 py-0.5 rounded border border-orange-100' : 'text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100']">
                  {{ article.type === 'job' ? 'Recruitment Notice' : 'GK / Strategy Blog' }}
                </span>
                <span class="text-slate-400">Published: {{ article.date }}</span>
              </div>

              <h3 
                @click="handleArticleClick(article)"
                class="text-sm sm:text-base font-black text-slate-900 hover:text-[#000080] cursor-pointer transition-colors leading-snug"
              >
                {{ article.title }}
              </h3>

              <p class="text-xs text-slate-500 leading-relaxed font-sans">
                {{ article.excerpt }}
              </p>
            </div>

            <!-- Footer: Meta -->
            <div class="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs font-mono">
              <span class="text-slate-400">{{ article.readTime }}</span>
              
              <button 
                @click="handleArticleClick(article)"
                class="inline-flex items-center gap-1 font-black text-[#000080] hover:underline cursor-pointer"
              >
                <span>Read Full Article</span>
                <ArrowRight class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
          <BookOpen class="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <p class="text-xs text-slate-400 italic">No publications indexed currently. More guidelines coming soon.</p>
        </div>
      </div>

    </div>

  </div>
</template>
