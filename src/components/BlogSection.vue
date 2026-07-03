<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { 
  User, Clock, ArrowRight, ArrowLeft, PenTool, Flame, Newspaper, 
  ShieldCheck, Award, Search, Share2, Printer, BookOpen, Sparkles, 
  Check, CheckCircle, RefreshCw, X, FileText, ChevronRight, HelpCircle
} from 'lucide-vue-next';
import { BlogPost } from '../types';
import { MOCK_BLOGS } from '../data/mockData';
import { getAuthorByIdOrName } from '../data/authorsData';
import { MAIC_BLOGS, MAIC_CATEGORIES, MaicBlogPost } from '../data/maicBlogsData';
import { injectSeoInternalLinks } from '../utils/seo';

interface BlogSectionProps {
  activeBlogId?: string | null;
}

const props = defineProps<BlogSectionProps>();

const emit = defineEmits<{
  (e: 'selectBlog', blogId: string | null): void;
  (e: 'navigate', tab: string, subId?: string | null): void;
}>();

// Unified list of blogs: MAIC Premium guides + General Mock Blogs
const blogs = ref<(BlogPost | MaicBlogPost)[]>([]);
const activeBlog = ref<MaicBlogPost | BlogPost | null>(null);
const activeCategory = ref("All");
const searchQuery = ref("");
const showShareNotification = ref(false);

const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Load blogs and register categories
onMounted(() => {
  let localPublished: BlogPost[] = [];
  try {
    const saved = localStorage.getItem("agnipariksha_blogs");
    if (saved) {
      localPublished = JSON.parse(saved);
    }
  } catch (e) {
    console.error(e);
  }

  const contentUrl = `/api/get-automated-content?_t=${Date.now()}`;
  fetch(contentUrl, {
    headers: {
      'Accept': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      const automatedBlogs = data && data.blogs ? data.blogs : [];
      // Combine MAIC Premium blogs as primary high-value content, then add rest
      blogs.value = [...MAIC_BLOGS, ...localPublished, ...automatedBlogs, ...MOCK_BLOGS];
    })
    .catch((err) => {
      console.error("Error loading server-based blogs:", err);
      blogs.value = [...MAIC_BLOGS, ...localPublished, ...MOCK_BLOGS];
    });
});

// Category list specifically prioritized around the 12 requested high-value themes
const categories = computed(() => {
  return ["All", ...MAIC_CATEGORIES];
});

// Filters blog array based on search text and active category selection
const filteredBlogs = computed(() => {
  let list = blogs.value;

  if (activeCategory.value !== "All") {
    list = list.filter(b => b.category.toLowerCase() === activeCategory.value.toLowerCase());
  }

  if (searchQuery.value.trim() !== "") {
    const query = searchQuery.value.toLowerCase().trim();
    list = list.filter(b => 
      b.title.toLowerCase().includes(query) || 
      b.excerpt.toLowerCase().includes(query) || 
      b.category.toLowerCase().includes(query)
    );
  }

  return list;
});

// Watch activeBlogId prop from app routing to load correct post
watch(() => [props.activeBlogId, blogs.value.length], () => {
  if (props.activeBlogId && blogs.value.length > 0) {
    const match = blogs.value.find(b => b.id === props.activeBlogId || toSlug(b.title) === props.activeBlogId);
    if (match && (!activeBlog.value || activeBlog.value.id !== match.id)) {
      activeBlog.value = match;
      resetQuiz();
    }
  } else if (!props.activeBlogId && activeBlog.value) {
    activeBlog.value = null;
  }
}, { immediate: true });

const selectBlog = (blog: BlogPost | MaicBlogPost) => {
  activeBlog.value = blog;
  emit('selectBlog', toSlug(blog.title));
  resetQuiz();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const goBack = () => {
  activeBlog.value = null;
  emit('selectBlog', null);
  resetQuiz();
};

const activeBlogAuthor = computed(() => {
  if (!activeBlog.value) return null;
  return getAuthorByIdOrName(activeBlog.value.author);
});

const getInitials = (name: string) => {
  if (!name) return "";
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

// Check if currently viewed blog is a MAIC Premium detailed post
const isMaicPremiumBlog = computed((): boolean => {
  if (!activeBlog.value) return false;
  return MAIC_BLOGS.some(b => b.id === activeBlog.value?.id);
});

const currentMaicBlog = computed((): MaicBlogPost | null => {
  if (!isMaicPremiumBlog.value || !activeBlog.value) return null;
  return activeBlog.value as MaicBlogPost;
});

// Custom Markdown parser that styles headings, tables, blockquotes and injects element IDs
const parseMarkdownToHtml = (markdown: string) => {
  if (!markdown) return "";
  let html = markdown;

  // Escape HTML tags to prevent XSS while allowing styled structural components
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-slate-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>');

  // Headers with IDs for Table of Contents anchor scroll references
  html = html.replace(/^# (.*?)$/gm, (_, title) => {
    const cleanId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h1 id="${cleanId}" class="text-xl sm:text-2xl font-black text-[#000080] border-b border-slate-200 pb-2 mb-4 mt-6 scroll-mt-24">${title}</h1>`;
  });
  html = html.replace(/^## (.*?)$/gm, (_, title) => {
    const cleanId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h2 id="${cleanId}" class="text-base sm:text-lg font-extrabold text-slate-900 mt-6 mb-3 flex items-center gap-1.5 border-l-4 border-l-[#FF9933] pl-2 scroll-mt-24">${title}</h2>`;
  });
  html = html.replace(/^### (.*?)$/gm, (_, title) => {
    const cleanId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h3 id="${cleanId}" class="text-xs sm:text-sm font-bold text-slate-800 mt-4 mb-2 scroll-mt-24">${title}</h3>`;
  });

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="border-slate-100 my-6" />');

  // Custom high-yield highlight container blockquotes starting with >
  html = html.replace(/^&gt; (.*?)$/gm, '<div class="bg-blue-50/70 border-l-4 border-l-[#000080] p-3.5 rounded-r-xl text-xs font-semibold text-slate-800 my-4 leading-relaxed shadow-3xs">$1</div>');

  // Tables Parser (Regex parsing of markdown formatted tables)
  const lines = html.split('\n');
  let inTable = false;
  let tableRows: string[] = [];
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      inTable = true;
      const cells = trimmed.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (trimmed.includes('---')) {
        return '';
      }

      const isHeader = tableRows.length === 0;
      tableRows.push(line);
      
      if (isHeader) {
        return `<thead class="bg-slate-50 text-[10.5px] font-mono text-[#000080] uppercase tracking-wider font-extrabold"><tr>${cells.map(c => `<th class="px-3.5 py-2.5 text-left border-b border-slate-200 font-black">${c}</th>`).join('')}</tr></thead><tbody>`;
      } else {
        return `<tr class="hover:bg-slate-50/50 transition-colors border-b border-slate-100 text-xs text-slate-700 font-medium">${cells.map(c => `<td class="px-3.5 py-2 border-r border-slate-100 last:border-none">${c}</td>`).join('')}</tr>`;
      }
    } else {
      if (inTable) {
        inTable = false;
        tableRows = [];
        return '</tbody></table></div>\n' + line;
      }
      return line;
    }
  });

  html = processedLines.filter(l => l !== '').join('\n');
  if (inTable) {
    html += '</tbody></table></div>';
  }

  // Wrap tables inside overflow wrappers
  html = html.replace(/(<thead class="bg-slate-5)/g, '<div class="overflow-x-auto my-5 border border-slate-200 rounded-xl shadow-3xs"><table class="min-w-full divide-y divide-slate-200 bg-white">$1');

  // Process Lists (Bullet point and numbered points)
  html = html.replace(/^\* (.*?)$/gm, '<li class="ml-4 list-disc pl-1.5 py-0.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">$1</li>');
  html = html.replace(/^(\d+)\. (.*?)$/gm, '<li class="ml-4 list-decimal pl-1.5 py-0.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">$2</li>');

  return html;
};

// Extracted headings to build interactive Table of Contents
const tableOfContents = computed(() => {
  if (!activeBlog.value) return [];
  const lines = activeBlog.value.content.split('\n');
  const headings: { text: string; id: string }[] = [];
  lines.forEach(line => {
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      headings.push({ text, id });
    }
  });
  return headings;
});

const scrollToHeading = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Interactive practice quizzes state
const selectedAnswers = ref<Record<number, number>>({});
const submittedAnswers = ref<Record<number, boolean>>({});

const selectOption = (qIdx: number, optIdx: number) => {
  if (submittedAnswers.value[qIdx]) return;
  selectedAnswers.value[qIdx] = optIdx;
};

const submitAnswer = (qIdx: number) => {
  if (selectedAnswers.value[qIdx] === undefined) return;
  submittedAnswers.value[qIdx] = true;
};

const resetQuiz = () => {
  selectedAnswers.value = {};
  submittedAnswers.value = {};
};

// Navigates using internal linking sugerences
const handleInternalLinkClick = (link: { tab: string; subId: string }) => {
  if (link.tab === 'blog') {
    const match = MAIC_BLOGS.find(b => b.id === link.subId);
    if (match) {
      selectBlog(match as any);
    } else {
      emit('navigate', 'blog', link.subId);
    }
  } else {
    emit('navigate', link.tab, link.subId);
  }
};

const copyBlogLink = () => {
  const url = `${window.location.origin}/#blog/${toSlug(activeBlog.value?.title || '')}`;
  navigator.clipboard.writeText(url).then(() => {
    showShareNotification.value = true;
    setTimeout(() => {
      showShareNotification.value = false;
    }, 3000);
  });
};

const triggerPrint = () => {
  window.print();
};

const handleArticleClick = (e: MouseEvent) => {
  const target = (e.target as HTMLElement).closest('.internal-seo-link') as HTMLElement | null;
  if (target) {
    e.preventDefault();
    const tab = target.getAttribute('data-tab') || 'home';
    const policyId = target.getAttribute('data-policy');
    emit('navigate', tab, policyId || null);
  }
};
</script>

<template>
  <div class="space-y-6" id="maic-blog-section-viewport">
    
    <!-- Blog list landing view -->
    <div v-if="!activeBlog" class="space-y-6" id="blog-index-container">
      
      <!-- Premium MAICINDIA.COM Portal Header -->
      <div class="bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 rounded-3xl shadow-lg border-b-4 border-b-[#FF9933] text-white relative overflow-hidden" id="maic-portal-header">
        <div class="absolute top-0 right-0 w-32 h-32 bg-[#138808]/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        <div class="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16"></div>
        
        <div class="relative space-y-4 max-w-4xl">
          <div class="flex flex-wrap items-center gap-2">
            <span class="bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/30 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles class="h-3 w-3" />
              <span>Official Academic Resource</span>
            </span>
            <span class="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9.5px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
              MAICINDIA.COM
            </span>
          </div>

          <h1 class="text-xl sm:text-3xl font-black tracking-tight leading-tight">
            MAIC Career Guidance & Vetting Academy
          </h1>
          <p class="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Gain a comprehensive competitive advantage. Access highly detailed, 1500–2500 word study blueprints, logical reasoning guides, Vedic math calculation secrets, and syllabus guidelines vetted strictly by retired captains and decorated national examiners.
          </p>

          <!-- Real-Time Search Bar -->
          <div class="pt-2 flex flex-col sm:flex-row gap-2 max-w-2xl" id="blog-search-bar-box">
            <div class="relative flex-1">
              <Search class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                v-model="searchQuery"
                placeholder="Search across 1,500+ word study manuals, math tricks, and notes..."
                class="w-full bg-slate-950/70 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-450 focus:outline-hidden focus:border-[#FF9933] font-sans font-medium"
              />
              <button 
                v-if="searchQuery" 
                @click="searchQuery = ''"
                class="absolute right-3 top-3.5 text-slate-400 hover:text-white"
              >
                <X class="h-3.5 w-3.5" />
              </button>
            </div>
            
            <div class="bg-slate-950/40 border border-slate-700/60 rounded-xl px-4 py-2.5 text-slate-450 text-[10px] font-mono flex items-center justify-center sm:justify-start gap-1.5 select-none">
              <Clock class="h-3.5 w-3.5 text-blue-400" />
              <span>Updated Today</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Navigation Matrix -->
      <div class="bg-white p-4 rounded-2xl shadow-xs border border-slate-100 space-y-2.5" id="categories-ribbon">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1">
            <BookOpen class="h-3.5 w-3.5 text-[#000080]" />
            <span>Select Syllabus Category ({{ categories.length - 1 }} modules)</span>
          </span>
          <span class="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-150">
            MAIC Verified
          </span>
        </div>

        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            :class="[
              'text-[11.5px] font-bold px-3 py-1.8 rounded-lg border transition-all cursor-pointer font-sans',
              activeCategory === cat
                ? 'bg-[#000080] text-white border-[#000080] shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Blogs Staggered Feed Listings -->
      <div v-if="filteredBlogs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6" id="blogs-grid">
        <div
          v-for="blog in filteredBlogs"
          :key="blog.id"
          :id="`blog-card-${blog.id}`"
          class="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          @click="selectBlog(blog)"
        >
          <div class="space-y-4">
            <div class="flex justify-between items-center text-[10px] font-mono">
              <span class="text-[#000080] uppercase bg-blue-50 px-2.5 py-0.8 rounded-md border border-blue-100 font-black">
                {{ blog.category }}
              </span>
              <span class="text-slate-400 font-semibold">{{ blog.date }}</span>
            </div>

            <h3 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#000080] transition-colors leading-snug">
              {{ blog.title }}
            </h3>

            <p class="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3 font-medium">
              {{ blog.excerpt }}
            </p>

            <!-- SEO keywords badges -->
            <div v-if="'seoKeywords' in blog && (blog as any).seoKeywords" class="flex flex-wrap gap-1 pt-1">
              <span 
                v-for="kw in (blog as any).seoKeywords.slice(0, 3)" 
                :key="kw"
                class="bg-slate-50 text-slate-450 text-[9px] font-mono px-2 py-0.5 rounded border border-slate-150"
              >
                #{{ kw }}
              </span>
            </div>
          </div>

          <!-- Card Specs footer -->
          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-mono text-slate-400">
            <div class="flex items-center gap-1.5 text-slate-500 font-semibold">
              <User class="h-3.5 w-3.5 text-[#000080]" />
              <span class="font-sans text-[11px] font-bold text-slate-700">{{ blog.author }}</span>
            </div>
            
            <span class="flex items-center text-[#138808] font-black uppercase tracking-wider gap-0.5 group-hover:translate-x-1 transition-transform">
              <span>Read Guide</span>
              <ChevronRight class="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>

      <!-- No items fall back -->
      <div v-else class="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-300 space-y-3" id="no-blogs-found-view">
        <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-450 border border-slate-200">
          <BookOpen class="h-6 w-6" />
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-black text-slate-900">No Vetted Study Manuals Found</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            We couldn't find any guides matching "{{ searchQuery }}" under the category "{{ activeCategory }}". Try searching for different keywords or clear the filters.
          </p>
        </div>
        <button 
          @click="searchQuery = ''; activeCategory = 'All'"
          class="bg-[#000080] hover:bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>

    </div>

    <!-- Blog detailed reader view -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6" id="blog-reader-viewport">
      
      <!-- MAIN READING PORTLET (3/4 width) -->
      <div class="lg:col-span-3 bg-white p-5 sm:p-8 rounded-2xl shadow-xs border border-slate-200 space-y-6" id="blog-reading-pane">
        
        <!-- Navigation bar -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-3" id="reader-top-bar">
          <button
            id="back-to-blogs-list"
            @click="goBack"
            class="flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-900 font-black cursor-pointer font-sans bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            <span>➔ Back to Study Manuals</span>
          </button>

          <div class="flex items-center gap-1.5">
            <button 
              @click="copyBlogLink"
              class="p-2 text-slate-500 hover:text-[#000080] hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Copy link to clipboard"
            >
              <Share2 class="h-4 w-4" />
            </button>
            <button 
              @click="triggerPrint"
              class="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="Print friendly layout"
            >
              <Printer class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Share notification pop -->
        <div 
          v-if="showShareNotification"
          class="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-lg border border-emerald-200 flex items-center justify-between"
          id="share-notification"
        >
          <span class="flex items-center gap-1.5">
            <CheckCircle class="h-4 w-4 text-emerald-600" />
            <span>Success: SEO Article link copied! Share with study groups to coordinate practice routines.</span>
          </span>
          <button @click="showShareNotification = false" class="text-emerald-800 hover:text-emerald-950">
            <X class="h-3.5 w-3.5" />
          </button>
        </div>

        <!-- Title and E-A-T Author Card -->
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-black uppercase text-[#FF9933] bg-[#FF9933]/10 px-2.5 py-1 rounded-md border border-[#FF9933]/20">
              Syllabus Unit: {{ activeBlog.category }}
            </span>
            <span v-if="isMaicPremiumBlog" class="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              1,500+ Words Vetted Key
            </span>
          </div>

          <h1 class="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {{ activeBlog.title }}
          </h1>

          <!-- Advanced E-A-T Vetting Author box -->
          <div v-if="activeBlogAuthor" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center" id="blog-author-intro-card">
            <div class="flex items-start gap-3">
              <div :class="[activeBlogAuthor.avatarColor, 'w-11 h-11 rounded-lg flex items-center justify-center font-black font-mono text-sm shrink-0 shadow-xs uppercase']">
                {{ getInitials(activeBlogAuthor.name) }}
              </div>
              <div class="space-y-1 text-left">
                <div class="flex flex-wrap items-center gap-1.5">
                  <button 
                    @click="emit('navigate', 'authors', activeBlogAuthor.id)" 
                    class="text-xs font-black text-slate-900 hover:text-[#000080] hover:underline bg-transparent border-none p-0 cursor-pointer text-left font-sans"
                  >
                    {{ activeBlogAuthor.name }}
                  </button>
                  <span class="bg-emerald-50 text-emerald-800 text-[8px] font-black uppercase px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-0.5">
                    <ShieldCheck class="h-2.5 w-2.5" />
                    <span>Editorial Board Reviewer</span>
                  </span>
                </div>
                <p class="text-[10.5px] text-slate-500 leading-normal max-w-xl font-sans font-medium">
                  {{ activeBlogAuthor.bio }}
                </p>
                <div class="text-[10px] font-mono text-slate-450 flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-0.5">
                  <span>{{ activeBlogAuthor.experience }}</span>
                </div>
              </div>
            </div>
            
            <button 
              @click="emit('navigate', 'authors', activeBlogAuthor.id)"
              class="text-xs font-bold text-[#000080] hover:text-[#000060] hover:underline bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-3xs font-sans shrink-0 cursor-pointer w-full sm:w-auto"
            >
              Publications ➔
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-[10.5px] font-mono text-slate-450 border-b border-slate-100 pb-3">
            <span class="flex items-center gap-1"><Clock class="h-3.5 w-3.5 text-blue-500" /> {{ activeBlog.readTime }}</span>
            <span>•</span>
            <span>Published: {{ activeBlog.date }}</span>
            <span>•</span>
            <span class="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-bold font-sans text-[10px]">MAIC Vetted Syllabus</span>
          </div>
        </div>

        <!-- Main Body Document (Compiled with custom markdown regex parser) -->
        <article 
          class="text-xs sm:text-sm font-sans leading-relaxed text-slate-800 whitespace-pre-wrap max-w-none prose prose-slate" 
          id="blog-document-content"
          @click="handleArticleClick"
          v-html="injectSeoInternalLinks(parseMarkdownToHtml(activeBlog.content), activeBlog.category)"
        >
        </article>

        <!-- Dynamic Practice Quiz section for E-A-T compliance and educational evaluation -->
        <div v-if="currentMaicBlog && currentMaicBlog.practiceQuestions.length > 0" class="border-t border-slate-200 pt-8 mt-8 space-y-6" id="quiz-practice-box">
          <div class="bg-gradient-to-r from-[#000080]/5 to-[#000080]/15 border-l-4 border-l-[#000080] p-4 rounded-r-xl">
            <div class="flex items-center gap-2 text-[#000080]">
              <HelpCircle class="h-5 w-5" />
              <h4 class="text-sm sm:text-base font-black">Interactive Practice Session: Verify Your Vetting</h4>
            </div>
            <p class="text-xs text-slate-600 mt-1">
              Verify your comprehension of the complex academic material in this manual. Select options and lock in your answers below.
            </p>
          </div>

          <div class="space-y-6">
            <div 
              v-for="(q, qIdx) in currentMaicBlog.practiceQuestions" 
              :key="qIdx"
              class="bg-white border border-slate-200 rounded-2xl p-5 space-y-4"
              :id="`practice-question-${qIdx}`"
            >
              <div class="flex items-start gap-2.5">
                <span class="bg-[#000080]/10 text-[#000080] w-6 h-6 rounded-full flex items-center justify-center font-black font-mono text-xs shrink-0 mt-0.5">
                  Q{{ qIdx + 1 }}
                </span>
                <p class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {{ q.question }}
                </p>
              </div>

              <!-- Options -->
              <div class="grid grid-cols-1 gap-2 pl-8">
                <button
                  v-for="(opt, optIdx) in q.options"
                  :key="optIdx"
                  @click="selectOption(qIdx, optIdx)"
                  :disabled="submittedAnswers[qIdx]"
                  :class="[
                    'text-left text-xs p-3 rounded-xl border transition-all flex items-center justify-between',
                    submittedAnswers[qIdx]
                      ? optIdx === q.correctIndex
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                        : selectedAnswers[qIdx] === optIdx
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      : selectedAnswers[qIdx] === optIdx
                        ? 'bg-[#000080]/5 border-[#000080] text-[#000080] font-semibold'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                  ]"
                >
                  <span>{{ opt }}</span>
                  <span v-if="submittedAnswers[qIdx] && optIdx === q.correctIndex" class="text-emerald-700">
                    <Check class="h-4 w-4" />
                  </span>
                </button>
              </div>

              <!-- Action and Explanation -->
              <div class="pl-8 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  v-if="!submittedAnswers[qIdx]"
                  @click="submitAnswer(qIdx)"
                  :disabled="selectedAnswers[qIdx] === undefined"
                  class="bg-[#000080] hover:bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Lock In Answer
                </button>
                
                <div v-else class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] leading-relaxed text-slate-600 font-sans w-full text-left">
                  <strong class="text-slate-900 block font-bold mb-0.5">Explanation:</strong>
                  {{ q.explanation }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2">
            <span class="text-[10px] font-mono text-slate-450">MAIC Vetting System v2.6</span>
            <button 
              @click="resetQuiz"
              class="text-xs text-[#000080] hover:underline font-bold flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <RefreshCw class="h-3.5 w-3.5" />
              <span>Retry Quiz Exercises</span>
            </button>
          </div>
        </div>

        <!-- Patriotic editorial seal -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center space-x-3 mt-8">
          <PenTool class="h-8 w-8 text-[#000080] shrink-0" />
          <div>
            <p class="font-black text-slate-900 text-xs">MAICINDIA.COM Career Council Guarantee:</p>
            <p class="text-[11px] text-slate-500 leading-snug mt-0.5">
              Syllabus directives and math tricks are compiled from verified Gazette directives. Mock solutions conform strictly to state-level negative marking indices to avoid training deviation error.
            </p>
          </div>
        </div>

      </div>

      <!-- SEO & READING SIDEBAR MODULE (1/4 width) -->
      <div class="space-y-6" id="blog-sidebar">
        
        <!-- Interactive Table of Contents -->
        <div v-if="tableOfContents.length > 0" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-3 sticky top-24" id="table-of-contents-box">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5 font-mono">
            <FileText class="h-4 w-4 text-[#FF9933]" />
            <span>Table of Contents</span>
          </h4>
          <nav class="space-y-1.5">
            <button
              v-for="heading in tableOfContents"
              :key="heading.id"
              @click="scrollToHeading(heading.id)"
              class="w-full text-left text-xs text-slate-600 hover:text-[#000080] hover:underline py-1 transition-all flex items-start gap-1 font-sans text-[11.5px] leading-snug cursor-pointer bg-transparent border-none p-0 font-medium"
            >
              <span class="text-[#FF9933] font-bold shrink-0">○</span>
              <span>{{ heading.text }}</span>
            </button>
          </nav>
        </div>

        <!-- Internal Linking Suggestions widget -->
        <div v-if="currentMaicBlog && currentMaicBlog.internalLinks.length > 0" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs space-y-3" id="seo-internal-links-box">
          <h4 class="text-xs font-black uppercase tracking-wider text-[#000080] border-b border-slate-100 pb-2 flex items-center gap-1.5 font-mono">
            <Sparkles class="h-4 w-4" />
            <span>Related Career Guides</span>
          </h4>
          <p class="text-[11px] text-slate-500 font-sans leading-relaxed">
            Expand your exam readiness with our interconnected guides published on MAICINDIA.COM:
          </p>
          <div class="space-y-2">
            <button
              v-for="(link, lIdx) in currentMaicBlog.internalLinks"
              :key="lIdx"
              @click="handleInternalLinkClick(link)"
              class="w-full text-left p-3 rounded-xl bg-slate-50 border border-slate-150 hover:bg-slate-100/70 hover:border-slate-350 transition-all flex items-start gap-2 group cursor-pointer text-xs"
            >
              <ChevronRight class="h-4 w-4 text-[#000080] shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
              <span class="font-bold text-slate-800 leading-snug group-hover:text-[#000080] font-sans">
                {{ link.text }}
              </span>
            </button>
          </div>
        </div>

        <!-- Quick Help Advice -->
        <div class="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-2" id="quick-synergy-advice">
          <h5 class="font-bold text-slate-900 text-xs flex items-center gap-1">
            <ShieldCheck class="h-4 w-4 text-[#000080]" />
            <span>Study Vetting Synergy</span>
          </h5>
          <p class="leading-relaxed font-sans text-slate-600 text-[11px]">
            Each module is optimized to cover 95% of state exam syllabus parameters. Check back every week as our editorial captains add custom reasoning worksheets and updated Current Affairs grids.
          </p>
        </div>
      </div>

    </div>

  </div>
</template>
