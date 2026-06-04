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
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: isDarkMode
          // ── DARK: deep green (matches the header overlay) ──
          ? 'linear-gradient(160deg, #001a0e 0%, #002814 50%, #001a0e 100%)'
          // ── LIGHT: clean white → very light gray ──
          : 'linear-gradient(160deg, #ffffff 0%, #f3f4f6 60%, #ffffff 100%)',
      }}
    >

      {/* Fixed sidebar — outside flow */}
      <StudentSidebar />

      {/* Everything else shifts right together */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ml-0
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        {/* Header sits inside the offset wrapper — moves with content */}
        <StudentHeader />

        {/* Main content */}
        <main className="flex-1 pt-0">
          <div className="max-w-[1600px] mx-auto">
            <div
              className="min-h-[calc(100vh-4.25rem)] transition-colors duration-300"
              style={{
                background: isDarkMode
                  ? 'rgba(0,30,15,0.55)'   // subtle dark-green tint over the gradient
                  : 'rgba(255,255,255,0.6)', // slight white wash on light
              }}
            >
              {children}
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}