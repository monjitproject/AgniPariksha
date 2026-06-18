import React, { useState } from "react";
import { 
  Menu, X, Shield, Award, BookOpen, 
  Briefcase, FileText, LayoutDashboard, Globe, MessageSquareDiff, Bell
} from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  notificationCount: number;
  setNotificationDrawerOpen: (open: boolean) => void;
}

export default function Header({
  currentTab,
  setCurrentTab,
  isAuthenticated,
  onLoginClick,
  onLogoutClick,
  notificationCount,
  setNotificationDrawerOpen
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mapped menu items corresponding to screenshot:
  // Home, Quizzes, Study Material, Current Affairs, Latest Jobs, PDF Library, Mock Tests, Blog
  const menuItems = [
    { id: "home", label: "Home", icon: Shield },
    { id: "quizzes", label: "Quizzes", icon: Award },
    { id: "study", label: "Study Material", icon: BookOpen },
    { id: "current", label: "Current Affairs", icon: BookOpen }, // maps to Study or Blog
    { id: "jobs", label: "Latest Jobs", icon: Briefcase },
    { id: "pdfs", label: "PDF Library", icon: FileText },
    { id: "mock-tests", label: "Mock Tests", icon: Shield }, // maps to Quizzes
    { id: "blog", label: "Blog", icon: Globe },
  ];

  const handleNav = (tabId: string) => {
    if (tabId === "current") {
      setCurrentTab("current");
    } else if (tabId === "mock-tests") {
      setCurrentTab("quizzes");
    } else {
      setCurrentTab(tabId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm" id="main-header">
      {/* Top micro flag bar: 3 distinct color bands as seen in screenshot */}
      <div className="w-full flex h-[4px] absolute top-0 left-0 right-0 z-10" id="top-flag-bar">
        <div className="w-[35%] h-full bg-[#FF9933]" />
        <div className="w-[30%] h-full bg-transparent" />
        <div className="w-[35%] h-full bg-[#138808]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[4px]">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo - Match screenshot */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNav("home")} id="brand-logo-container">
            <div className="bg-[#000080] text-white font-black text-sm w-9 h-9 rounded-full flex items-center justify-center font-sans tracking-wide shrink-0 select-none">
              IN
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                Agni<span className="text-[#FF9933]">Pariksha</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation - Clean text buttons, light orange active pill background */}
          <nav className="hidden lg:flex items-center space-x-1" id="desktop-navbar">
            {menuItems.map((item) => {
              // Custom active checking for mapped virtual routes
              const isActive = 
                (item.id === currentTab) ||
                (item.id === "current" && currentTab === "study_not_used") || 
                (item.id === "mock-tests" && currentTab === "quizzes_not_used");

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-[#FF9933]/15 text-[#aa5500]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* End Action Buttons - Clean Green Start Quiz Button as prominent action */}
          <div className="hidden lg:flex items-center space-x-3" id="header-actions">
            {/* Bell Notification Trigger */}
            <button 
              id="bell-alert-btn"
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-all rounded-full hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-[#000080]" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-tab-dashboard"
                  onClick={() => handleNav("dashboard")}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                    currentTab === "dashboard"
                      ? "bg-[#138808]/15 text-[#138855]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  id="btn-logout"
                  onClick={onLogoutClick}
                  className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-2 rounded-xl border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                id="btn-login"
                onClick={onLoginClick}
                className="text-gray-500 hover:text-slate-900 text-xs font-bold px-3 py-2 rounded-xl transition-all"
              >
                Sign In
              </button>
            )}

            {/* Prominent "Start Quiz" green button exactly as shown in the screenshot */}
            <button
              id="btn-header-start-quiz"
              onClick={() => handleNav("quizzes")}
              className="bg-[#138808] hover:bg-[#117706] text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ml-1"
            >
              Start Quiz
            </button>
          </div>

          {/* Mobile Right Icons (Bell + Burger) */}
          <div className="flex items-center lg:hidden space-x-3" id="mobile-control-bar">
            {/* Bell */}
            <button 
              id="bell-alert-btn-mobile"
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-1.5 text-gray-600 transition-all rounded-full hover:bg-gray-100"
            >
              <Bell className="h-5 w-5 text-[#000080]" />
              {notificationCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8.5px] font-bold text-white ring-1 ring-white">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button
              id="mobile-menu-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 py-3 px-4 shadow-inner" id="mobile-navigation-drawer">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-left text-sm font-bold transition-all ${
                    currentTab === item.id
                      ? "bg-[#000080]/10 text-[#000080]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 text-[#000080]" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Extra options in Mobile */}
            <div className="pt-3 border-t border-gray-100 mt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    id="mobile-nav-dashboard"
                    onClick={() => handleNav("dashboard")}
                    className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-left text-sm font-bold bg-[#138808]/10 text-[#138808]"
                  >
                    <LayoutDashboard className="h-4.5 w-4.5" />
                    <span>My Dashboard</span>
                  </button>
                  <button
                    id="mobile-logout"
                    onClick={() => {
                      onLogoutClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center bg-red-50 text-red-600 font-bold py-2 rounded-md border border-red-200 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  id="mobile-login"
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center bg-[#000080] text-white font-bold py-2 rounded-md text-sm shadow animate-pulse"
                >
                  Student Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
