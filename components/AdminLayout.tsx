'use client';

import { ReactNode, useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebarCollapsed');
      if (saved) setSidebarCollapsed(JSON.parse(saved));
    }
    const handleSidebar = (e: any) => setSidebarCollapsed(e.detail.isCollapsed);
    window.addEventListener('sidebarToggle', handleSidebar);
    return () => window.removeEventListener('sidebarToggle', handleSidebar);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') setIsDarkMode(true);
    }
    const handleTheme = (e: Event) => {
      const ev = e as CustomEvent<{ isDarkMode: boolean }>;
      setIsDarkMode(ev.detail.isDarkMode);
    };
    window.addEventListener('themeToggle', handleTheme);
    return () => window.removeEventListener('themeToggle', handleTheme);
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: isDarkMode
          ? 'linear-gradient(160deg, #0d1a0f 0%, #001a0e 50%, #0d1a0f 100%)'
          : 'linear-gradient(160deg, #f8f9fa 0%, #f1f3f2 60%, #f8f9fa 100%)',
      }}
    >
      <AdminSidebar />

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ml-0
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}
      >
        <AdminHeader />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto">
            <div
              className="min-h-[calc(100vh-4.25rem)] transition-colors duration-300"
              style={{
                background: isDarkMode
                  ? 'rgba(0,20,10,0.50)'
                  : 'rgba(255,255,255,0.55)',
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
