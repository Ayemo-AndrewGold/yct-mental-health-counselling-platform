'use client';

import { ReactNode, useState, useEffect } from "react";
import StudentHeader from "./StudentHeader";
import StudentSidebar from "./StudentSidebar";

export default function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Read initial state immediately to avoid flicker
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      if (saved) setSidebarCollapsed(JSON.parse(saved));
    }

    const handleSidebarToggle = (event: any) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') setIsDarkMode(true);
    }

    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ isDarkMode: boolean }>;
      setIsDarkMode(customEvent.detail.isDarkMode);
    };
    window.addEventListener('themeToggle', handleThemeChange);
    return () => window.removeEventListener('themeToggle', handleThemeChange);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>

      {/* Fixed sidebar — outside flow */}
      <StudentSidebar />

      {/* ✅ Everything else shifts right together */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ml-0
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Header sits inside the offset wrapper — moves with content */}
        <StudentHeader />

        {/* Main content */}
        <main className="flex-1">
          <div className="max-w-[1600px] mx-auto">
            <div className={`min-h-[calc(100vh-4rem)] transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-900/60' : 'bg-white/50'
            }`}>
              {children}
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}