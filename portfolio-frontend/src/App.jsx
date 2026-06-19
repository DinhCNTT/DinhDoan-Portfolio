import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Footer from './components/Footer';
import ChatbotWidget from './components/ChatbotWidget';
import AdminDashboard from './components/AdminDashboard';
import Loader from './components/Loader';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(() => {
    // Only load if not previously seen in this session
    return !sessionStorage.getItem('intro_seen');
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Control page scroll when loading
  useEffect(() => {
    if (isLoading && currentPath !== '/admin') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading, currentPath]);

  const isAdmin = currentPath === '/admin';

  if (isAdmin) {
    return <AdminDashboard />;
  }

  const handleLoaderComplete = () => {
    sessionStorage.setItem('intro_seen', 'true');
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col selection:bg-cyber-accent1/25 selection:text-cyber-accent1 select-none overflow-x-hidden relative">
        {/* Visual cyber glow decoration */}
        <div className="fixed top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-accent1/35 to-transparent z-40 pointer-events-none" />

        {/* Floating global scanlines (futuristic aesthetic) */}
        <div className="fixed inset-0 pointer-events-none z-30 opacity-[0.03] scanlines" />

        {/* Navigation Bar */}
        <Navbar />

        {/* Sections Layout */}
        <main className="flex-1">
          {/* Hero Banner Section */}
          <Hero />

          {/* Dynamic Skills Grid Section */}
          <Skills />

          {/* Projects Grid Section */}
          <Projects />

          {/* Professional Experience Section */}
          <Experience />

          {/* Education & Achievements Section */}
          <Education />
        </main>

        {/* Chat Assistant Widget */}
        <ChatbotWidget />

        {/* Page Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
