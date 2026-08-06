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
import CyberBackground from './components/CyberBackground';
import StatsCounter from './components/StatsCounter';
import Testimonials from './components/Testimonials';
import ContactSection from './components/ContactSection';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  useEffect(() => {
    // Wake up backend (cold start wake-up ping for free tiers like Render)
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(backendUrl).catch((err) => console.log("Cold start ping initiated."));
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
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <Loader onComplete={handleLoaderComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-cyber-bg text-slate-100 flex flex-col selection:bg-cyber-accent1/25 selection:text-cyber-accent1 overflow-x-hidden relative">
        {/* Cyberpunk Dynamic Background */}
        <CyberBackground />

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

          {/* Stats Counter Section */}
          <StatsCounter />

          {/* Dynamic Skills Grid Section */}
          <Skills />

          {/* Projects Grid Section */}
          <Projects />

          {/* Professional Experience Section */}
          <Experience />

          {/* Education & Achievements Section */}
          <Education />

          {/* Testimonials Review Section */}
          <Testimonials />

          {/* Contact Section */}
          <ContactSection />
        </main>

        {/* Chat Assistant Widget */}
        <ChatbotWidget />

        {/* Zalo Floating Button - Aligned perfectly with AI Chatbox (right-6, w-14 h-14) */}
        <a 
          href="https://zalo.me/0842070552"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_0_15px_rgba(37,99,235,0.6)] hover:scale-110 hover:shadow-[0_0_25px_rgba(37,99,235,0.8)] transition-all duration-300"
          aria-label="Liên hệ Zalo"
        >
          <span className="font-bold text-base md:text-lg font-jakarta">Zalo</span>
        </a>

        {/* Page Footer */}
        <Footer />
      </div>
    </>
  );
}

export default App;
