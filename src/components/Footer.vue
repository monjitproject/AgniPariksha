<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next';

interface FooterProps {
  setSelectedPolicy?: (policyId: string) => void;
}

const props = defineProps<FooterProps>();

const emit = defineEmits<{
  (e: 'setCurrentTab', tab: string): void;
  (e: 'setSelectedPolicy', policyId: string): void;
}>();

const handlePolicyClick = (policyId: string) => {
  if (props.setSelectedPolicy) {
    emit('setSelectedPolicy', policyId);
  }
  emit('setCurrentTab', 'policies');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const footerLinksGroup1 = [
  { id: 'about', name: 'About Us' },
  { id: 'contact', name: 'Contact Us' },
  { id: 'faq', name: 'FAQ / Help' },
  { id: 'careers', name: 'Careers' },
];

const footerLinksGroup2 = [
  { id: 'privacy', name: 'Privacy Policy' },
  { id: 'terms', name: 'Terms & Conditions' },
  { id: 'cookies', name: 'Cookie Policy' },
  { id: 'disclaimer', name: 'Disclaimer' },
  { id: 'dmca', name: 'DMCA Policy' },
];

const footerLinksGroup3 = [
  { id: 'editorial', name: 'Editorial Policy' },
  { id: 'factcheck', name: 'Fact Check Policy' },
  { id: 'correction', name: 'Correction Policy' },
  { id: 'refund', name: 'Refund Policy' },
  { id: 'sitemap-doc', name: 'HTML Sitemap' },
];
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 border-t-8 border-[#FF9933] pt-12 pb-8" id="main-footer">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Logo / Moto Info -->
        <div class="space-y-4" id="footer-branding-column">
          <div class="flex items-center space-x-2">
            <span class="text-white text-xl font-black tracking-wider flex items-center">
              AGNI<span class="text-[#FF9933]">PARIKSHA</span>
            </span>
          </div>
          <p class="text-[16px] text-gray-400 leading-relaxed font-sans">
            AgniPariksha.com is India's premier, fully integrated free GK quiz, simulated mock exams, and state job notification board. Designed systematically for Armed Forces, Agniveer, NDA, CDS, airmen, sailors and general civil candidates.
          </p>
          <div class="flex space-x-3 text-[15px]" id="footer-accreditation">
            <span class="bg-[#FF9933]/15 text-[#FF9933] px-3 py-1 rounded-xl font-bold border border-[#FF9933]/30">🇮🇳 Pride of India</span>
            <span class="bg-[#138808]/15 text-[#138808] px-3 py-1 rounded-xl font-bold border border-[#138808]/30">✔ AdSense Compliant</span>
          </div>
        </div>

        <!-- Quick Links -->
        <div id="footer-support-column">
          <h4 class="text-white font-bold text-[18px] uppercase tracking-wider mb-4 border-l-2 border-[#FF9933] pl-2">Preparation Portal</h4>
          <ul class="space-y-3 text-[16px] font-sans footer-text">
            <li v-for="link in footerLinksGroup1" :key="link.id">
              <button
                @click="handlePolicyClick(link.id)"
                class="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                {{ link.name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Legal Compliance Block 1 -->
        <div id="footer-regulatory-column">
          <h4 class="text-white font-bold text-[18px] uppercase tracking-wider mb-4 border-l-2 border-white pl-2">Legal Disclosures</h4>
          <ul class="space-y-3 text-[16px] font-sans footer-text">
            <li v-for="link in footerLinksGroup2" :key="link.id">
              <button
                @click="handlePolicyClick(link.id)"
                class="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                {{ link.name }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Legal Compliance Block 2 -->
        <div id="footer-editorial-column">
          <h4 class="text-white font-bold text-[18px] uppercase tracking-wider mb-4 border-l-2 border-[#138808] pl-2">Trust & Sitemap</h4>
          <ul class="space-y-3 text-[16px] font-sans footer-text">
            <li v-for="link in footerLinksGroup3" :key="link.id">
              <button
                @click="handlePolicyClick(link.id)"
                class="text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer text-left"
              >
                {{ link.name }}
              </button>
            </li>
            <li>
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-[#FF9933] hover:underline font-bold text-[16px]"
              >
                XML Sitemap File ↗
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Copyright -->
      <div class="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 pt-4" id="footer-bottom-band">
        <p>© 2026 AgniPariksha.com. All Rights Reserved. Not affiliated with any official government recruitment agency. For educational preparation purposes only.</p>
        <div class="flex space-x-3 mt-4 md:mt-0" id="editorial-disclaimer-indicator">
          <span class="flex items-center text-[10px]"><Sparkles class="h-3.5 w-3.5 mr-1 text-yellow-500" /> Aatmanirbhar Bharat Initiative</span>
        </div>
      </div>
    </div>
  </footer>
</template>
