<script setup lang="ts">
import { ref } from 'vue';
import { 
  Menu, X, Shield, Award, BookOpen, 
  Briefcase, FileText, LayoutDashboard, Globe, Bell
} from 'lucide-vue-next';

interface HeaderProps {
  currentTab: string;
  isAuthenticated: boolean;
  notificationCount: number;
}

const props = defineProps<HeaderProps>();

const emit = defineEmits<{
  (e: 'setCurrentTab', tab: string): void;
  (e: 'loginClick'): void;
  (e: 'logoutClick'): void;
  (e: 'setNotificationDrawerOpen', value: boolean): void;
}>();

const mobileMenuOpen = ref(false);

const menuItems = [
  { id: 'home', label: 'Home', icon: Shield },
  { id: 'quizzes', label: 'Quizzes', icon: Award },
  { id: 'study', label: 'Study Material', icon: BookOpen },
  { id: 'current', label: 'Current Affairs', icon: BookOpen },
  { id: 'jobs', label: 'Latest Jobs', icon: Briefcase },
  { id: 'pdfs', label: 'PDF Library', icon: FileText },
  { id: 'mock-tests', label: 'Mock Tests', icon: Shield },
  { id: 'blog', label: 'Blog', icon: Globe },
];

const handleNav = (tabId: string) => {
  if (tabId === 'current') {
    emit('setCurrentTab', 'current');
  } else if (tabId === 'mock-tests') {
    emit('setCurrentTab', 'mock-tests');
  } else {
    emit('setCurrentTab', tabId);
  }
  mobileMenuOpen.value = false;
};
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm" id="main-header">
    <!-- Top micro flag bar: 3 distinct color bands -->
    <div class="w-full flex h-[4px] absolute top-0 left-0 right-0 z-10" id="top-flag-bar">
      <div class="w-[35%] h-full bg-[#FF9933]" />
      <div class="w-[30%] h-full bg-transparent" />
      <div class="w-[35%] h-full bg-[#138808]" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[4px]">
      <div class="flex justify-between items-center h-16">
        <!-- Brand Logo -->
        <div class="flex items-center space-x-2 cursor-pointer" @click="handleNav('home')" id="brand-logo-container">
          <div class="bg-[#000080] text-white font-black text-sm w-9 h-9 rounded-full flex items-center justify-center font-sans tracking-wide shrink-0 select-none">
            IN
          </div>
          <div>
            <span class="text-xl font-black text-slate-900 tracking-tight flex items-center">
              Agni<span class="text-[#FF9933]">Pariksha</span>
            </span>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-1" id="desktop-navbar">
          <button
            v-for="item in menuItems"
            :key="item.id"
            :id="`nav-tab-${item.id}`"
            @click="handleNav(item.id)"
            :class="[
              'px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer',
              (item.id === currentTab) || (item.id === 'current' && currentTab === 'study_not_used') || (item.id === 'mock-tests' && currentTab === 'quizzes_not_used')
                ? 'bg-[#FF9933]/15 text-[#aa5500]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <!-- End Action Buttons -->
        <div class="hidden lg:flex items-center space-x-3" id="header-actions">
          <!-- Bell Notification Trigger -->
          <button 
            id="bell-alert-btn"
            @click="emit('setNotificationDrawerOpen', true)"
            class="relative p-2 text-gray-600 hover:text-gray-900 transition-all rounded-full hover:bg-gray-100"
          >
            <Bell class="h-5 w-5 text-[#000080]" />
            <span v-if="notificationCount > 0" class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
              {{ notificationCount }}
            </span>
          </button>

          <div v-if="isAuthenticated" class="flex items-center space-x-2">
            <button
              id="nav-tab-dashboard"
              @click="handleNav('dashboard')"
              :class="[
                'flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-bold transition-all',
                currentTab === 'dashboard'
                  ? 'bg-[#138808]/15 text-[#138855]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <LayoutDashboard class="h-4 w-4" />
              <span>Dashboard</span>
            </button>
            <button
              id="btn-logout"
              @click="emit('logoutClick')"
              class="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-2 rounded-xl border border-red-200"
            >
              Sign Out
            </button>
          </div>
          <button
            v-else
            id="btn-login"
            @click="emit('loginClick')"
            class="text-gray-500 hover:text-slate-900 text-xs font-bold px-3 py-2 rounded-xl transition-all"
          >
            Sign In
          </button>

          <!-- Prominent Start Quiz green button -->
          <button
            id="btn-header-start-quiz"
            @click="handleNav('quizzes')"
            class="bg-[#138808] hover:bg-[#117706] text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ml-1"
          >
            Start Quiz
          </button>
        </div>

        <!-- Mobile Right Icons -->
        <div class="flex items-center lg:hidden space-x-3" id="mobile-control-bar">
          <!-- Bell -->
          <button 
            id="bell-alert-btn-mobile"
            @click="emit('setNotificationDrawerOpen', true)"
            class="relative p-1.5 text-gray-600 transition-all rounded-full hover:bg-gray-100"
          >
            <Bell class="h-5 w-5 text-[#000080]" />
            <span v-if="notificationCount > 0" class="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8.5px] font-bold text-white ring-1 ring-white">
              {{ notificationCount }}
            </span>
          </button>

          <!-- Menu Toggle -->
          <button
            id="mobile-menu-hamburger"
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            <X v-if="mobileMenuOpen" class="h-6 w-6" />
            <Menu v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer menu -->
    <div v-if="mobileMenuOpen" class="lg:hidden bg-white border-t border-gray-200 py-3 px-4 shadow-inner" id="mobile-navigation-drawer">
      <div class="space-y-1">
        <button
          v-for="item in menuItems"
          :key="item.id"
          :id="`mobile-nav-${item.id}`"
          @click="handleNav(item.id)"
          :class="[
            'w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-sm font-bold transition-all',
            currentTab === item.id
              ? 'bg-[#000080]/10 text-[#000080]'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <component :is="item.icon" class="h-4.5 w-4.5 text-[#000080]" />
          <span>{{ item.label }}</span>
        </button>

        <!-- Extra options in Mobile -->
        <div class="pt-3 border-t border-gray-100 mt-2 space-y-2">
          <template v-if="isAuthenticated">
            <button
              id="mobile-nav-dashboard"
              @click="handleNav('dashboard')"
              class="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-sm font-bold bg-[#138808]/10 text-[#138808]"
            >
              <LayoutDashboard class="h-4.5 w-4.5" />
              <span>My Dashboard</span>
            </button>
            <button
              id="mobile-logout"
              @click="() => { emit('logoutClick'); mobileMenuOpen = false; }"
              class="w-full text-center bg-red-50 text-red-600 font-bold py-2 rounded-md border border-red-200 text-sm"
            >
              Sign Out
            </button>
          </template>
          <template v-else>
            <button
              id="mobile-login"
              @click="() => { emit('loginClick'); mobileMenuOpen = false; }"
              class="w-full text-center bg-[#000080] text-white font-bold py-2 rounded-md text-sm shadow animate-pulse"
            >
              Student Login / Register
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>
