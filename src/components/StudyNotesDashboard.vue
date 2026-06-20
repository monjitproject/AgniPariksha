<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  BookOpen, Search, ChevronDown, ChevronUp, CheckCircle, 
  HelpCircle, Star, Zap, Award, ThumbsUp, Sparkles, 
  Target, Info, RefreshCw
} from 'lucide-vue-next';
import canvasConfetti from 'canvas-confetti';

// Structure declarations for categorized notes
interface RecallQuestion {
  question: string;
  hindiQuestion?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface StudyTopic {
  id: string;
  title: string;
  hindiTitle?: string;
  subtitle: string;
  quickFacts: string[];
  content: string;
  recalledText?: string;
  recallQuestion?: RecallQuestion;
}

interface NoteCategory {
  id: string;
  icon: any;
  title: string;
  hindiTitle: string;
  description: string;
  badge: string;
  topics: StudyTopic[];
}

// Full premium content written natively for Armed Forces Exams
const categoriesData = ref<NoteCategory[]>([
  {
    id: "cat-defense",
    icon: Award,
    title: "Armed Forces & Military History",
    hindiTitle: "सशस्त्र बल और सैन्य इतिहास",
    description: "Detailed analysis of regiments, ranks, historical battles, gallantry decorations, and commands.",
    badge: "Most Important",
    topics: [
      {
        id: "def-t1",
        title: "Regiments and localized war cries of the Indian Army",
        hindiTitle: "भारतीय सेना के रेजिमेंट और उनके युद्ध-घोष",
        subtitle: "A syllabus core for Agniveer & NDA written exams detailing military traditions.",
        quickFacts: [
          "Assam Rifles is the oldest paramilitary force, established in 1835.",
          "The Supreme Commander of the Indian Armed Forces is the President of India.",
          "Indian Army has 7 tactical commands based in major operational zones."
        ],
        content: `The Indian Army operates with historical regiments carrying distinct traditions, honors, and localized war cries reflecting their pride:

1. **Gorkha Rifles**: Battle Cry is "Jai Mahakali, Ayo Gorkhali!" (Victory to Goddess Kali, the Gorkhas are here!). Famous for using the 'Khukuri' knife.
2. **Rajputana Rifles**: Battle Cry is "Raja Ramchandra Ki Jai!" (Victory to King Ramchandra). It is the oldest rifle regiment of the Indian Army.
3. **Sikh Regiment**: Battle Cry is "Jo Bole So Nihal, Sat Sri Akal!" (Blessed is the person who says God is the Ultimate Truth). One of the most decorated regiments.
4. **Madras Regiment**: Battle Cry is "Veer Madrasi, Adi Kollu, Adi Kollu!" (Brave Madrasi, Strike and Kill!). The oldest infantry regiment of India.
5. **Garhwal Rifles**: Battle Cry is "Badri Vishal Lal Ki Jai!" (Victory to Lord Badri Nath). Known for their unmatched determination in high altitude zones.`,
        recallQuestion: {
          question: "Which of the following is the oldest infantry regiment of the Indian Army?",
          hindiQuestion: "निम्नलिखित में से भारतीय सेना की सबसे पुरानी इन्फैंट्री रेजिमेंट कौन सी है?",
          options: [
            "Gorkha Rifles / गोरखा राइफल्स",
            "Sikh Regiment / सिख रेजिमेंट",
            "Madras Regiment / मद्रास रेजिमेंट",
            "Garhwal Rifles / गढ़वाल राइफल्स"
          ],
          correctAnswer: 2,
          explanation: "The Madras Regiment is the oldest infantry regiment of India, dating its history back to the Madras levies of the 1750s."
        }
      },
      {
        id: "def-t2",
        title: "Military Gallantry Awards & Orders of Precedence",
        hindiTitle: "सैन्य वीरता पुरस्कार और उनकी प्राथमिकता",
        subtitle: "Key decorations rewarded for bravery on and off the battlefield.",
        quickFacts: [
          "Param Vir Chakra is the highest wartime gallantry award.",
          "Ashoka Chakra is the highest peacetime decoration.",
          "These medals are decorated by the President on Republic Day."
        ],
        content: `India’s gallantry awards are classified into two key phases based on the active state of war:

Wartime Medal hierarchy (for active valor on battlefield):
1. **Param Vir Chakra (PVC)** - Highest gallantry decoration (e.g., Captain Vikram Batra, Major Somnath Sharma).
2. **Maha Vir Chakra (MVC)** - Second highest wartime decoration.
3. **Vir Chakra (VR)** - Third highest wartime award.

Peacetime Medal hierarchy (for valor on counter-insurgency or rescue missions away from direct border battlefields):
1. **Ashoka Chakra** - Peacetime equivalent of the PVC.
2. **Kirti Chakra** - Peacetime equivalent of the MVC.
3. **Shaurya Chakra** - Peacetime equivalent of the Vir Chakra.`,
        recallQuestion: {
          question: "Which is the highest peacetime military gallantry decoration in India?",
          hindiQuestion: "भारत में शांति काल का सर्वोच्च सैन्य वीरता पदक कौन सा है?",
          options: [
            "Param Vir Chakra / परमवीर चक्र",
            "Ashoka Chakra / अशोक चक्र",
            "Kirti Chakra / कीर्ति चक्र",
            "Sena Medal / सेना मेडल"
          ],
          correctAnswer: 1,
          explanation: "Ashoka Chakra is the highest peacetime gallantry award, designated for extraordinary valor and sacrifice away from the direct battlefield."
        }
      }
    ]
  },
  {
    id: "cat-polity",
    icon: BookOpen,
    title: "Indian Polity & Constitution Essentials",
    hindiTitle: "भारतीय राजव्यवस्था और संविधान",
    description: "Syllabus revision sheets covering Fundamental Rights, Directive Principles, and important Articles of the Constitution.",
    badge: "Core GS",
    topics: [
      {
        id: "pol-t1",
        title: "Fundamental Duties of Indian Citizens (Part IV-A)",
        hindiTitle: "भारतीय नागरिकों के मौलिक कर्तव्य (भाग IV-A)",
        subtitle: "Crucial revisions concerning Article 51A and historical amendments.",
        quickFacts: [
          "Adopted via 42nd Amendment in 1976 on recommendation of Swaran Singh Committee.",
          "Originally there were 10 duties; the 11th duty was added by 86th Amendment in 2002.",
          "These are non-justiciable in nature but serve as moral code guidelines."
        ],
        content: `Fundamental Duties were incorporated in the Indian Constitution under Article 51A by the 42nd Amendment Act in 1976. Major summary of duties:

1. To abide by the Constitution and respect its ideals, institutions, the National Flag, and National Anthem.
2. To cherish and follow the noble ideals that inspired the national struggle for independence.
3. To uphold and protect the sovereignty, unity, and integrity of India.
4. To defend the nation and render national service when called upon.
5. To promote harmony and common brotherhood; renounce practices derogatory to the dignity of women.
6. To value and preserve the rich heritage of the composite culture.
7. To protect natural environment and possess compassion for living creatures.
8. To develop scientific temper, humanism, and spirit of inquiry and reform.`,
        recallQuestion: {
          question: "By which constitutional amendment were the Fundamental Duties introduced?",
          hindiQuestion: "किस संविधान संशोधन द्वारा मौलिक कर्तव्यों को शामिल किया गया था?",
          options: [
            "44th Amendment / 44वां संशोधन",
            "42nd Amendment / 42वां संशोधन",
            "86th Amendment / 86वां संशोधन",
            "52nd Amendment / 52वां संशोधन"
          ],
          correctAnswer: 1,
          explanation: "The 42nd Amendment Act in 1976 introduced 10 Fundamental Duties based on recommendations of the Swaran Singh Committee."
        }
      },
      {
        id: "pol-t2",
        title: "Emergency Provisions & Critical Executive Orders",
        hindiTitle: "आपातकालीन प्रावधान और महत्वपूर्ण कार्यकारी आदेश",
        subtitle: "Reviewing Part XVIII of the Constitution, Articles 352, 356, and 360.",
        quickFacts: [
          "Emergency provisions are inspired from Weimar Constitution of Germany.",
          "National Emergency has been declared 3 times in India.",
          "Financial Emergency (Article 360) has never been declared in India."
        ],
        content: `The Constitution of India provides emergency mandates to defend national sovereignty, unity, and economic stability:

There are 3 major categories of Emergency:
1. **National Emergency (Article 352)**: Declared on reasons of war, external aggression, or armed rebellion.
2. **State Emergency / President's Rule (Article 356)**: Imposed when a state's machinery fails to act according to constitutional provisions.
3. **Financial Emergency (Article 360)**: Declared when the economic credit or stability of India is under threat.`,
        recallQuestion: {
          question: "Which Article of the Constitution addresses State Emergency (President's Rule)?",
          hindiQuestion: "संविधान का कौन सा अनुच्छेद राज्य आपातकाल (राष्ट्रपति शासन) से संबंधित है?",
          options: [
            "Article 352 / अनुच्छेद 352",
            "Article 356 / अनुच्छेद 356",
            "Article 360 / अनुच्छेद 360",
            "Article 368 / अनुच्छेद 368"
          ],
          correctAnswer: 1,
          explanation: "Article 356 deals with the imposition of President's Rule in Indian states on failure of constitutional machinery."
        }
      }
    ]
  },
  {
    id: "cat-tech",
    icon: Zap,
    title: "Defense Technology & Acquisitions",
    hindiTitle: "रक्षा प्रौद्योगिकी और स्वदेशीकरण",
    description: "Self-Reliance (Aatmanirbhar Bharat) highlights in Missile development, Combat Aircraft, and Naval Stealth frigates.",
    badge: "Trending GS",
    topics: [
      {
        id: "tech-t1",
        title: "Indigenous Acquisitions under the Aatmanirbhar Bharat Drive",
        hindiTitle: "आत्मनिर्भर भारत अभियान के तहत स्वदेशी सैन्य खरीद",
        subtitle: "Comprehensive updates on Tejas, Arjun, and Project 17A.",
        quickFacts: [
          "Tejas is an indigenous Light Combat Aircraft (LCA) engineered by HAL.",
          "Arjun MK-1A tank features active explosive reactive ERA armor.",
          "Project 17A is a series of stealth guided-missile navy warships."
        ],
        content: `India is making major strides in the 'Aatmanirbhar Bharat' (Self-Reliant India) drive within military forces. Key updates:

- **Tejas Mark-1A Fighter Jet**: Indigenous combat fighter planes built by HAL, equipped with Active Electronically Scanned Array (AESA) radar and advanced electronic warfare suites.
- **Arjun Mk-1A Main Battle Tank**: Upgraded with 72 new features, including a computerized fire control system and superior Explosive Reactive Armor (ERA).
- **Project 17A Frigates**: Superb stealth guided-missile warships (such as INS Dunagiri, INS Himgiri) designed completely using native resources and shipyards (MDL & GRSE).`,
        recallQuestion: {
          question: "Who engineered India’s indigenous Light Combat Aircraft 'Tejas'?",
          hindiQuestion: "भारत के स्वदेशी हल्के लड़ाकू विमान 'तेजस' का निर्माण किसने किया?",
          options: [
            "DRDO / डीआरडीओ",
            "Hindustan Aeronautics Limited (HAL) / एचएएल",
            "Bharat Electronics Limited (BEL) / बीईएल",
            "Indian Space Research Organisation (ISRO) / इसरो"
          ],
          correctAnswer: 1,
          explanation: "Tejas LCA is designed by Ada and constructed predominantly by Hindustan Aeronautics Limited (HAL)."
        }
      }
    ]
  },
  {
    id: "cat-science",
    icon: Target,
    title: "General Science & Physics Essentials",
    hindiTitle: "सामान्य विज्ञान और भौतिकी",
    description: "High-frequency general science core materials for Agniveer General Duty (GD) and Technical exams.",
    badge: "High Yield",
    topics: [
      {
        id: "sci-t1",
        title: "Wave propagation and Speed of Sound across Media",
        hindiTitle: "तरंग संचरण और विभिन्न माध्यमों में ध्वनि की गति",
        subtitle: "Concepts of frequency, elasticity, and density for mechanical waves.",
        quickFacts: [
          "Sound waves are longitudinal mechanical waves requiring a medium to travel.",
          "Sound cannot travel through a vacuum because there are no particles.",
          "Light is an electromagnetic transverse wave and can travel in vacuum."
        ],
        content: `Sound is a mechanical wave that propagates by compressing and rarefying particles in a material medium. Important metrics:

- **Speed Progression**: Sound travels fastest in Solids, moderately fast in Liquids, and slowest in Gases (Solids > Liquids > Gases).
- **Material Elasticity**: High elasticity of solids allows particles to recover from compression instantly, transmitting vibrations faster.
- **No Propagation in Vacuum**: Since a vacuum contains no physical particles to compress, sound speed in a vacuum is exactly 0 m/s.`,
        recallQuestion: {
          question: "In which of the following media does sound travel at the highest speed?",
          hindiQuestion: "निम्नलिखित में से किस माध्यम में ध्वनि सर्वाधिक तीव्र गति से यात्रा करती है?",
          options: [
            "Vacuum / निर्वात",
            "Air / वायु",
            "Water / पानी",
            "Steel (Solid) / स्टील (ठोस)"
          ],
          correctAnswer: 3,
          explanation: "Sound travels fastest in dense solids like steel because of high intermolecular elastic values."
        }
      }
    ]
  }
]);

// Search & Filtering States
const searchQuery = ref("");
const expandedCategory = ref<string | null>("cat-defense"); // Accordion state for category (level 1)
const expandedTopic = ref<string | null>("def-t1"); // Accordion state for topics (level 2)

// User interaction progress tracker (stored in localStorage)
const reviewedTopics = ref<string[]>([]);
const userAnswers = ref<Record<string, number>>({}); // tracks selected option for active topic questions

const loadProgress = () => {
  try {
    const saved = localStorage.getItem('agni_reviewed_topics_v1');
    if (saved) {
      reviewedTopics.value = JSON.parse(saved);
    }
    const savedAns = localStorage.getItem('agni_topic_answers_v1');
    if (savedAns) {
      userAnswers.value = JSON.parse(savedAns);
    }
  } catch (err) {
    console.error("Failed to load local storage status:", err);
  }
};

const toggleTopicReviewed = (topicId: string) => {
  if (reviewedTopics.value.includes(topicId)) {
    reviewedTopics.value = reviewedTopics.value.filter(id => id !== topicId);
  } else {
    reviewedTopics.value.push(topicId);
    // Micro-celebration trigger when marking as reviewed!
    canvasConfetti({
      particleCount: 20,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#138808', '#FF9933', '#000080']
    });
  }
  try {
    localStorage.setItem('agni_reviewed_topics_v1', JSON.stringify(reviewedTopics.value));
  } catch (err) {
    console.error(err);
  }
};

const handleOptionSelect = (topicId: string, optIdx: number, correctAnswer: number) => {
  if (userAnswers.value[topicId] !== undefined) return; // already answered
  
  userAnswers.value = {
    ...userAnswers.value,
    [topicId]: optIdx
  };
  
  try {
    localStorage.setItem('agni_topic_answers_v1', JSON.stringify(userAnswers.value));
  } catch (err) {
    console.error(err);
  }

  if (optIdx === correctAnswer) {
    canvasConfetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#000080', '#138808', '#FF9933']
    });
  }
};

const handleResetProgress = () => {
  reviewedTopics.value = [];
  userAnswers.value = {};
  try {
    localStorage.removeItem('agni_reviewed_topics_v1');
    localStorage.removeItem('agni_topic_answers_v1');
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  loadProgress();
});

// Category and topic accordion triggers
const toggleCategory = (catId: string) => {
  if (expandedCategory.value === catId) {
    expandedCategory.value = null;
  } else {
    expandedCategory.value = catId;
    // Auto-expand the first topic in the category to make it extremely responsive
    const cat = categoriesData.value.find(c => c.id === catId);
    if (cat && cat.topics.length > 0) {
      expandedTopic.value = cat.topics[0].id;
    }
  }
};

const toggleTopic = (topicId: string) => {
  if (expandedTopic.value === topicId) {
    expandedTopic.value = null;
  } else {
    expandedTopic.value = topicId;
  }
};

// Computed statistics helper
const totals = computed(() => {
  let count = 0;
  categoriesData.value.forEach(c => {
    count += c.topics.length;
  });
  return count;
});

const progressPercent = computed(() => {
  if (totals.value === 0) return 0;
  return Math.round((reviewedTopics.value.length / totals.value) * 100);
});

// Advanced Filter list of categories & topics matched via search
const filteredCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return categoriesData.value;

  return categoriesData.value.map(cat => {
    // Check if category name matches or any of its topic elements match
    const matchesCat = cat.title.toLowerCase().includes(query) || cat.hindiTitle.toLowerCase().includes(query);
    const matchedTopics = cat.topics.filter(topic => {
      return (
        topic.title.toLowerCase().includes(query) ||
        (topic.hindiTitle && topic.hindiTitle.toLowerCase().includes(query)) ||
        topic.content.toLowerCase().includes(query) ||
        topic.subtitle.toLowerCase().includes(query) ||
        topic.quickFacts.some(f => f.toLowerCase().includes(query))
      );
    });

    if (matchesCat || matchedTopics.length > 0) {
      // Return category with only the matched topics or all topics if category itself matched
      return {
        ...cat,
        topics: matchesCat ? cat.topics : matchedTopics
      };
    }
    return null;
  }).filter(Boolean) as NoteCategory[];
});
</script>

<template>
  <div class="space-y-6" id="stdnd-root">
    
    <!-- Hero Banner Board -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-150 relative overflow-hidden" id="stdnd-hero">
      <div class="absolute inset-x-0 top-0 h-[4px] flex z-10">
        <div class="w-[33%] bg-[#FF9933]" />
        <div class="w-[34%] bg-slate-100" />
        <div class="w-[33%] bg-[#138808]" />
      </div>
      <div class="absolute right-0 top-0 w-36 h-36 bg-gradient-to-bl from-slate-100 to-transparent rounded-bl-full pointer-events-none" />

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="stdnd-hero-body">
        <div class="space-y-2 text-left max-w-3xl">
          <span class="inline-flex items-center space-x-1.5 bg-indigo-50 text-indigo-800 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-200 uppercase tracking-widest">
            <Sparkles class="h-3 w-3 animate-pulse text-indigo-600" />
            <span>Interactive Syllabus Study Notes</span>
          </span>
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Defense Forces High-Yield Study Academy
          </h1>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Streamline your general awareness revisions with structured accordion guides. Quickly review regimental legacies, polity articles, defense acquisitions, and general science questions with built-in instant validation widgets.
          </p>
        </div>

        <!-- Local Sync Stat visualizer -->
        <div class="w-full md:w-64 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0 text-left space-y-2" id="stdnd-progress-panel">
          <div class="flex justify-between items-center text-xs font-bold text-slate-505 font-mono">
            <span>Reviewed Syllabus</span>
            <span class="text-emerald-700 font-extrabold">{{ reviewedTopics.length }} / {{ totals }} Units</span>
          </div>
          
          <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300/30">
            <div 
              class="h-full bg-gradient-to-r from-[#FF9933] to-[#138808] rounded-full transition-all duration-300"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
          
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-bold text-slate-400 uppercase font-mono">Goal: {{ progressPercent }}% Done</span>
            <button 
              @click="handleResetProgress"
              v-if="reviewedTopics.length > 0"
              class="text-[9px] hover:text-red-700 font-extrabold font-mono flex items-center space-x-0.5 uppercase tracking-wider text-slate-500 cursor-pointer transition-colors"
              title="Reset progress to start studying anew"
            >
              <RefreshCw class="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Tool and Segment selector -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-left" id="stdnd-search-bar">
      <!-- Search input -->
      <div class="relative flex-1 w-full">
        <input 
          type="text" 
          id="stdnd-search-input"
          v-model="searchQuery"
          placeholder="Search study guides, regiments, missiles, articles, or science notes..."
          class="w-full py-2.5 pl-10 pr-4 text-xs font-bold border border-slate-250 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#000080]/80 focus:bg-white text-slate-800 transition-all font-sans"
        />
        <Search class="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
      </div>

      <!-- Reset Search trigger -->
      <button
        v-if="searchQuery"
        @click="searchQuery = ''"
        class="text-xs font-black text-slate-500 hover:text-slate-800 cursor-pointer font-sans px-3 py-2 bg-slate-100 rounded-xl"
      >
        Clear Filter
      </button>

      <div class="hidden sm:flex items-center space-x-1.5 shrink-0 text-slate-500 text-xs font-mono select-none font-bold">
        <Info class="h-4 w-4 text-[#000080]" />
        <span>Click accordions below to expand core topics</span>
      </div>
    </div>

    <!-- Empty search query placeholder -->
    <div v-if="filteredCategories.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-150 shadow-sm space-y-4" id="stdnd-empty-placeholder">
      <div class="p-3 bg-slate-50 ring-4 ring-slate-100 w-fit rounded-full mx-auto">
        <BookOpen class="h-8 w-8 text-slate-400" />
      </div>
      <div class="space-y-1">
        <h3 class="font-extrabold text-slate-800">No match found</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          We couldn't locate any study templates matching "{{ searchQuery }}". Try searching for "Regiments", "Duties", "Tejas", or "Sound".
        </p>
      </div>
      <button 
        @click="searchQuery = ''"
        class="bg-[#000080] hover:bg-[#000060] text-white text-xs font-bold px-4 py-2 rounded-xl"
      >
        View All Study Notes
      </button>
    </div>

    <!-- Accordion lists -->
    <div v-else class="space-y-4" id="stdnd-accordion-container">
      
      <!-- Category Level Accordion (Level 1) -->
      <div 
        v-for="cat in filteredCategories" 
        :key="cat.id" 
        :id="`stdnd-cat-block-${cat.id}`"
        class="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-200"
        :class="[expandedCategory === cat.id ? 'shadow-md border-[#000080]/30 ring-1 ring-[#000080]/10' : 'shadow-sm hover:border-slate-350 hover:shadow']"
      >
        <!-- Category Accordion Header -->
        <button
          @click="toggleCategory(cat.id)"
          class="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus:bg-slate-50/50"
        >
          <div class="flex items-start space-x-3.5">
            <!-- Icon Wrapper -->
            <div class="p-3 rounded-2xl shrink-0 transition-colors" :class="[expandedCategory === cat.id ? 'bg-[#000080] text-white' : 'bg-slate-100 text-slate-700']">
              <component :is="cat.icon" class="h-5 w-5" />
            </div>

            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-base sm:text-lg font-black text-slate-905">
                  {{ cat.title }}
                </h3>
                <span class="text-xs text-slate-400 font-mono font-black py-0.5 px-2 bg-slate-100 rounded-md">
                   {{ cat.hindiTitle }}
                </span>
                <span 
                  v-if="cat.badge"
                  class="text-[9px] uppercase font-mono font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60"
                >
                  {{ cat.badge }}
                </span>
              </div>
              <p class="text-xs text-slate-650 max-w-2xl leading-relaxed font-medium">
                {{ cat.description }}
              </p>
            </div>
          </div>

          <!-- Caret icon indicator -->
          <div class="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all shrink-0">
            <ChevronDown v-if="expandedCategory !== cat.id" class="h-5 w-5" />
            <ChevronUp v-else class="h-5 w-5 text-[#000080]" />
          </div>
        </button>

        <!-- Category Expanded Content -->
        <div 
          v-if="expandedCategory === cat.id" 
          class="border-t border-slate-100 bg-slate-50/50 p-4 sm:p-6 space-y-4 animate-fade-in text-left"
          id="stdnd-topics-accordion-list"
        >
          <!-- Topic Level Accordions inside specific Category (Level 2) -->
          <div 
            v-for="topic in cat.topics" 
            :key="topic.id"
            :id="`stdnd-topic-block-${topic.id}`"
            class="bg-white rounded-2xl border transition-all overflow-hidden"
            :class="[
              expandedTopic === topic.id 
                ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' 
                : 'border-slate-150 shadow-sm hover:border-slate-300'
            ]"
          >
            <!-- Topic Accordion Trigger button -->
            <button
              @click="toggleTopic(topic.id)"
              class="w-full text-left p-4 flex items-center justify-between gap-3 focus:outline-none transition-colors"
              :class="[expandedTopic === topic.id ? 'bg-indigo-50/15' : 'hover:bg-slate-50/40']"
            >
              <div class="flex items-center space-x-3 truncate">
                <!-- Checked status checkmark marker -->
                <div 
                  @click.stop="toggleTopicReviewed(topic.id)"
                  class="h-5 w-5 rounded-full flex items-center justify-center border cursor-pointer shrink-0 transition-all text-white font-mono"
                  :class="[reviewedTopics.includes(topic.id) ? 'bg-[#138808] border-[#138808]' : 'border-slate-300 hover:border-slate-500 bg-white']"
                  title="Click to checkmark this unit as completed"
                >
                  <span v-if="reviewedTopics.includes(topic.id)" class="text-[10px] font-black">✓</span>
                </div>

                <div class="space-y-0.5 truncate">
                  <h4 class="text-[13px] sm:text-sm font-black text-slate-900 flex items-center gap-1.5 truncate">
                    <span>{{ topic.title }}</span>
                  </h4>
                  <p class="text-[11px] text-slate-500 truncate max-w-xl">
                    {{ topic.subtitle }}
                  </p>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <span 
                  v-if="reviewedTopics.includes(topic.id)"
                  class="text-[8px] sm:text-[9px] uppercase font-mono font-black text-[#138808] bg-[#138808]/10 px-2 py-0.5 rounded border border-[#138808]/20"
                >
                  Completed
                </span>
                <span class="text-[11px] text-blue-800 font-bold hover:underline shrink-0">
                  {{ expandedTopic === topic.id ? 'Collapse' : 'Expand note' }}
                </span>
              </div>
            </button>

            <!-- Topic content area -->
            <div 
              v-if="expandedTopic === topic.id" 
              class="p-5 sm:p-6 border-t border-slate-100 bg-white space-y-6 text-left animate-fade-in"
              id="stdnd-topic-active-view"
            >
              <!-- Bilingual titles alternate -->
              <div v-if="topic.hindiTitle" class="bg-indigo-50/40 p-3 rounded-xl border border-indigo-100 flex items-start space-x-1.5">
                <span class="font-extrabold text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded font-mono shrink-0 select-none uppercase">हिन्दी विवरण</span>
                <h5 class="text-xs sm:text-[13px] font-black leading-snug text-slate-800 select-none">
                  {{ topic.hindiTitle }}
                </h5>
              </div>

              <!-- Quick recall facts summary card -->
              <div class="space-y-2">
                <h6 class="text-[10.5px] uppercase font-black text-slate-500 tracking-wider flex items-center">
                  <Star class="h-3.5 w-3.5 mr-1 text-[#FF9933] fill-[#FF9933]" />
                  Revision Flash-Facts / प्रमुख तथ्य
                </h6>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    v-for="(fact, fIdx) in topic.quickFacts" 
                    :key="fIdx"
                    class="bg-slate-50 p-3 rounded-xl border border-slate-150 flex items-start space-x-1.5"
                  >
                    <span class="font-bold text-[#FF9933] font-mono shrink-0 select-none">•</span>
                    <p class="text-[11px] text-slate-700 font-medium leading-normal">{{ fact }}</p>
                  </div>
                </div>
              </div>

              <!-- Main Rich content syllabus markdown notebook -->
              <div class="bg-slate-50 rounded-2xl border border-slate-200 p-5 font-sans relative overflow-hidden">
                <div class="absolute top-0 right-0 py-0.5 px-3 bg-slate-200 text-slate-600 text-[8.5px] font-bold uppercase tracking-wider font-mono rounded-bl-lg select-none">
                  Verified Core Content
                </div>

                <div class="text-[12.5px] sm:text-[13.5px] leading-relaxed text-slate-800 whitespace-pre-line text-left">
                  {{ topic.content }}
                </div>
              </div>

              <!-- Interactive active memory test (Recall question block) -->
              <div 
                v-if="topic.recallQuestion" 
                class="bg-[#000080]/5 rounded-2xl border border-[#000080]/15 p-5 space-y-4"
                id="stdnd-recall-quiz-section"
              >
                <div class="flex items-center space-x-1.5 border-b border-[#000080]/10 pb-2">
                  <HelpCircle class="h-4 w-4 text-[#000080]" />
                  <span class="text-[11px] uppercase font-black text-[#000080] tracking-wider">
                    Quick Active Recall Practice Check / त्वरित अभ्यास जांच
                  </span>
                </div>

                <!-- Questions in Bilingual formats -->
                <div class="space-y-1 text-left">
                  <p class="text-xs sm:text-[13px] font-extrabold text-slate-900 leading-normal">
                    {{ topic.recallQuestion.question }}
                  </p>
                  <p v-if="topic.recallQuestion.hindiQuestion" class="text-xs text-slate-600 font-bold leading-normal italic">
                    {{ topic.recallQuestion.hindiQuestion }}
                  </p>
                </div>

                <!-- Multiple choice option listings -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="stdnd-recall-options">
                  <button
                    v-for="(opt, oIdx) in topic.recallQuestion.options"
                    :key="oIdx"
                    :disabled="userAnswers[topic.id] !== undefined"
                    @click="handleOptionSelect(topic.id, oIdx, topic.recallQuestion.correctAnswer)"
                    class="w-full text-left py-2.5 px-4 rounded-xl border transition-all text-xs flex justify-between items-center cursor-pointer font-sans"
                    :class="[
                      userAnswers[topic.id] !== undefined
                        ? (oIdx === topic.recallQuestion.correctAnswer
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-black font-semibold'
                            : (userAnswers[topic.id] === oIdx
                                ? 'bg-red-50 border-red-500 text-red-950 font-black'
                                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'))
                        : 'bg-white border-slate-250 hover:bg-slate-50 text-slate-705 font-bold hover:border-slate-400'
                    ]"
                  >
                    <span>{{ opt }}</span>
                    
                    <span v-if="userAnswers[topic.id] !== undefined" class="shrink-0 select-none">
                      <span v-if="oIdx === topic.recallQuestion.correctAnswer" class="text-[#138808] font-black text-sm">✓</span>
                      <span v-else-if="userAnswers[topic.id] === oIdx" class="text-red-650 font-black text-sm">✗</span>
                    </span>
                  </button>
                </div>

                <!-- Detailed Explanation Display drawer -->
                <div 
                  v-if="userAnswers[topic.id] !== undefined"
                  class="bg-amber-50/50 border border-amber-250 p-4 rounded-xl text-left space-y-1.5 animate-fade-in"
                >
                  <span class="text-[9.5px] uppercase font-black text-amber-900 font-mono tracking-wider block">
                    Bilingual Answer Explanation Summary:
                  </span>
                  <p class="text-[11.5px] leading-relaxed text-slate-700 font-medium">
                    {{ topic.recallQuestion.explanation }}
                  </p>
                </div>
              </div>

              <!-- Topic Complete & Checkbox control button -->
              <div class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100 select-none">
                <span class="text-[10.5px] text-slate-400 font-mono font-bold">
                  Topic Code Reference Section: {{ topic.id.toUpperCase() }}
                </span>

                <button 
                  @click="toggleTopicReviewed(topic.id)"
                  class="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle class="h-4 w-4" :class="[reviewedTopics.includes(topic.id) ? 'text-[#138808] fill-emerald-100' : 'text-slate-400']" />
                  <span>{{ reviewedTopics.includes(topic.id) ? 'Mark as Unread' : 'Mark Topic as Completed' }}</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Syllabus Learning Tips Advice Footer note -->
    <div class="bg-gradient-to-tr from-[#000080] to-[#1a1744] text-white p-6 rounded-3xl text-left shadow-lg border border-indigo-950 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden" id="stdnd-footer-banner">
      <div class="absolute -right-12 -bottom-12 opacity-5 text-9xl font-black font-sans pointer-events-none">国防</div>
      <div class="p-3 bg-white/10 rounded-2xl shrink-0">
        <Award class="h-8 w-8 text-amber-400" />
      </div>
      <div class="space-y-1">
        <h4 class="text-xs sm:text-sm uppercase font-black text-amber-400 tracking-wider">
          Aspirant Strategy Guide / परीक्षा उत्तीर्ण करने की रणनीति
        </h4>
        <p class="text-xs leading-relaxed text-indigo-100 max-w-4xl font-sans">
          To successfully clear AgniPariksha general studies levels, we recommend spending 15 minutes reviewing active categorizations in our Study Notes dashboard and completing the instant memory recall checkmarks daily. Re-attempt any incorrect answers immediately to strengthen neural connections.
        </p>
      </div>
    </div>

  </div>
</template>
