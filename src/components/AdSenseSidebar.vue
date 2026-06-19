<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, CheckCircle, Landmark } from 'lucide-vue-next';

const adCount = ref(1);

const checklistItems = [
  { text: "Privacy, Disclaimer, DMCA policy pages active", completed: true },
  { text: "Dynamic Robots.txt & XML Sitemap deployed", completed: true },
  { text: "No copyright music, images, or assets used", completed: true },
  { text: "Valuable unique content (Indian Defence Mock tests)", completed: true },
  { text: "High mobile responsiveness & touch target padding", completed: true },
  { text: "Clear cookie consent declaration implemented", completed: true }
];
</script>

<template>
  <div class="space-y-6" id="adsense-optimisation-sidebar">
    <!-- 1. AdSense Premium Banner Mock Unit -->
    <div class="bg-white p-4 rounded-xl shadow-md border border-gray-200" id="ad-unit-square">
      <div class="flex justify-between items-center mb-2">
        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Sponsored Ad</span>
        <span class="text-[8px] bg-amber-50 text-amber-700 px-1 py-0.5 rounded font-bold border border-amber-200">CPC Optimized</span>
      </div>
      
      <!-- Ad Body -->
      <div class="bg-amber-50/50 p-4 border border-dashed border-amber-200 rounded-lg text-center cursor-pointer hover:bg-amber-50 transition-all duration-150">
        <Landmark class="h-8 w-8 mx-auto text-amber-600 mb-2" />
        <h5 class="text-xs font-bold text-gray-800">UPSC / Agniveer Academy Mock Drills</h5>
        <p class="text-[10px] text-gray-600 mt-1 leading-relaxed">
          Get instant admission in high altitude tactics tutorials. Standard discounts expire soon!
        </p>
        <span class="inline-block mt-3 px-3 py-1 bg-[#138808] text-white text-[9px] font-bold uppercase rounded-full">
          Enroll Today ↗
        </span>
      </div>
      <p class="text-[8px] text-gray-400 text-center mt-2 italic font-mono">Ad slot ID: ap_sidebar_top_square</p>
    </div>

    <!-- 2. AdSense Approval Assistant Checklist -->
    <div class="bg-gradient-to-br from-indigo-900 to-[#000080] p-5 rounded-xl shadow-lg text-white" id="adsense-compliance-panel">
      <div class="flex items-center space-x-2 mb-3">
        <Sparkles class="h-5 w-5 text-[#FF9933] animate-pulse" />
        <h4 class="font-extrabold text-sm uppercase tracking-wider">AdSense Ready Kit</h4>
      </div>
      <p class="text-[11px] text-indigo-200 leading-relaxed mb-4">
        AgniPariksha.com has been designed from the ground up to achieve instant approval from Google AdSense inspectors:
      </p>

      <ul class="space-y-2 text-xs" id="adsense-rules-checklist">
        <li v-for="(item, idx) in checklistItems" :key="idx" class="flex items-start space-x-2 bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
          <CheckCircle class="h-4 w-4 text-[#138808] shrink-0 fill-white" />
          <span class="text-[11px] leading-tight text-indigo-100">{{ item.text }}</span>
        </li>
      </ul>

      <!-- Instructions for programmatic connection -->
      <div class="mt-4 pt-3 border-t border-indigo-700/60 text-[10px] text-indigo-200 font-mono">
        <span class="text-[#FF9933] font-bold">Quick Integration tip:</span> Just paste your unique <code class="bg-black/30 px-1 rounded text-white">data-ad-client</code> script tag inside the main index.html file to go live completely.
      </div>
    </div>

    <!-- 3. Horizontal Ribbon Ad Unit Simulator -->
    <div class="bg-white p-3 rounded-xl shadow-md border border-gray-200 text-center" id="ad-unit-ribbon">
      <span class="text-[8px] text-gray-400 uppercase tracking-widest block mb-1">Interactive Banner ad</span>
      <div class="py-3 bg-gray-50 border border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-2">
        <span class="text-[9px] font-black text-[#000080]">Best Indian Army Boots & Agniveer Gear</span>
        <p class="text-[8px] text-gray-500 mt-0.5">Heavy-duty combat boots with 30% discount code: AGNI30</p>
        <button class="bg-[#FF9933] text-white text-[8px] font-black px-2 py-0.5 rounded mt-1.5 uppercase tracking-wider scale-95 hover:bg-[#dd8822] transition-colors">
          Shop ↗
        </button>
      </div>
      <p class="text-[8px] text-gray-400 mt-1 italic font-mono">Ad slot ID: ap_sidebar_bottom_banner</p>
    </div>
  </div>
</template>
