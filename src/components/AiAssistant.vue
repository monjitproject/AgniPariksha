<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Send, Sparkles, HelpCircle } from 'lucide-vue-next';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

const messages = ref<ChatMessage[]>([
  {
    role: 'bot',
    text: "Jai Hind! I am **Agni AI**, your personalized Armed Forces study companion. Ask me any general knowledge (GK) question, syllabus doubt, or strategic question for Agniveer, Navy, NDA, CDS, or SSC GD exams. Let's march towards selection!"
  }
]);

const inputVal = ref("");
const isLoading = ref(false);
const scrollRef = ref<HTMLDivElement | null>(null);

const preseededQueries = [
  { text: "Navy Father history", label: "Father of Indian Navy?" },
  { text: "Fundamental Duties Article 51A", label: "Fundamental Duties Summary" },
  { text: "Agniveer Selection steps", label: "Agniveer selection routine?" },
  { text: "Armed Forces ranks hierarchy", label: "Military commissions hierarchy?" }
];

const scrollToBottom = async () => {
  await nextTick();
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
  }
};

watch(() => messages.value.length, () => {
  scrollToBottom();
});

watch(isLoading, () => {
  scrollToBottom();
});

const handleSend = async (messageText: string) => {
  if (!messageText.trim() || isLoading.value) return;

  messages.value.push({ role: 'user', text: messageText });
  inputVal.value = "";
  isLoading.value = true;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: messageText,
        history: messages.value.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.text
        }))
      })
    });

    if (!response.ok) {
      throw new Error("HTTP connection error to Agni API");
    }

    const data = await response.json();
    messages.value.push({ role: 'bot', text: data.reply });

  } catch (err: any) {
    console.error("AI Assistant network failed:", err);
    messages.value.push({
      role: 'bot',
      text: `I'm currently running in offline backup mode. We couldn't connect to our live server, but here is some essential advice: \n\n• **For GK Boards**: Consistently solve our curated mock tests.\n• **For Static History/Polity**: Focus on the Indian Constitution's preamble, directive principles, and primary military campaigns of 1965, 1971, and 1999 Kargil. \n\n*Tip: Connect your live GEMINI_API_KEY inside the Secrets tab to activate custom conversational search!*`
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-[520px]" id="ai-assistant-console">
    
    <!-- Console blue header banner -->
    <div class="bg-[#000080] text-white p-4 flex justify-between items-center shrink-0">
      <div class="flex items-center space-x-2">
        <div class="p-1.5 bg-white/10 rounded-full animate-pulse">
          <Sparkles class="h-5 w-5 text-[#FF9933]" />
        </div>
        <div>
          <h4 class="font-extrabold text-sm uppercase tracking-wider">Agni AI Assistant</h4>
          <span class="text-[10px] text-indigo-200 block">Personalized Armed Forces Study Partner</span>
        </div>
      </div>

      <span class="text-[9px] font-mono bg-[#138808] text-white px-2 py-0.5 rounded uppercase font-bold tracking-widest leading-none">
        Live Grounding Enabled
      </span>
    </div>

    <!-- Messages Board Scroller -->
    <div 
      ref="scrollRef"
      class="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50" 
      id="chat-messages-scroller"
    >
      <div
        v-for="(m, idx) in messages"
        :key="idx"
        :class="['flex', m.role === 'user' ? 'justify-end' : 'justify-start animate-fade-in']"
      >
        <div
          :class="[
            'max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm',
            m.role === 'user'
              ? 'bg-[#000080] text-white rounded-tr-none font-sans font-semibold'
              : 'bg-white text-gray-800 border border-gray-150 rounded-tl-none font-sans whitespace-pre-wrap'
          ]"
        >
          <div>{{ m.text }}</div>
        </div>
      </div>

      <div v-if="isLoading" class="flex justify-start items-center space-x-2" id="chat-loading-animation">
        <div class="bg-white border rounded-xl rounded-tl-none p-3 shadow-sm text-xs text-gray-400 flex items-center space-x-1.5 font-mono italic">
          <span class="h-2 w-2 rounded-full bg-[#FF9933] animate-bounce" />
          <span class="h-2 w-2 rounded-full bg-slate-300 animate-bounce [animation-delay:0.2s]" />
          <span class="h-2 w-2 rounded-full bg-[#138808] animate-bounce [animation-delay:0.4s]" />
          <span>Agni AI is thinking...</span>
        </div>
      </div>
    </div>

    <!-- Recommended dynamic queries pills row -->
    <div class="p-3 border-t border-gray-100 flex flex-nowrap items-center space-x-2 overflow-x-auto shrink-0 bg-white" id="pills-query-selectors">
      <span class="text-[9px] text-gray-400 uppercase font-mono tracking-wider shrink-0 flex items-center">
        <HelpCircle class="h-3.5 w-3.5 mr-0.5 text-[#000080]" />
        Pills:
      </span>
      
      <button
        v-for="(pill, idx) in preseededQueries"
        :key="idx"
        @click="handleSend(pill.text)"
        class="shrink-0 text-[10px] font-bold bg-gray-100 text-gray-700 hover:bg-[#000080]/5 hover:text-[#000080] border border-gray-200 rounded-full px-3 py-1.5 transition-colors cursor-pointer"
      >
        {{ pill.label }}
      </button>
    </div>

    <!-- Input console form widget -->
    <div class="p-3 border-t border-gray-100 bg-gray-50 flex items-center space-x-2 shrink-0" id="assistant-form-entry">
      <input
        type="text"
        id="ai-console-input-text"
        v-model="inputVal"
        @keydown.enter="handleSend(inputVal)"
        placeholder="Ask Agni AI (e.g. UPSC polity articles, NDA math strategy)..."
        class="flex-1 text-xs font-bold p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#000080] bg-white text-gray-800"
      />

      <button
        id="btn-send-chat"
        @click="handleSend(inputVal)"
        class="bg-[#138808] hover:bg-[#117706] text-white p-3 rounded-xl shadow-md transition-colors flex items-center justify-center shrink-0"
      >
        <Send class="h-4.5 w-4.5" />
      </button>
    </div>

  </div>
</template>
